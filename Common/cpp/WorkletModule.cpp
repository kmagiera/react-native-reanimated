//
// Created by Szymon Kapala on 2020-02-13.
//

#include "WorkletModule.h"
#include "Logger.h"

WorkletModule::WorkletModule(std::shared_ptr<SharedValueRegistry> sharedValueRegistry,
                                   std::shared_ptr<ApplierRegistry> applierRegistry,
                                   std::shared_ptr<WorkletRegistry> workletRegistry,
                                   std::shared_ptr<jsi::Value> event) {
  this->sharedValueRegistry = sharedValueRegistry;
  this->applierRegistry = applierRegistry;
  this->workletRegistry = workletRegistry;
  this->event = event;
  this->workletId = -1;
}

jsi::Value WorkletModule::get(jsi::Runtime &rt, const jsi::PropNameID &name) {
  auto propName = name.utf8(rt);
  if (propName == "start") {
     auto callback = [this](
        jsi::Runtime &rt,
        const jsi::Value &thisValue,
        const jsi::Value *args,
        size_t count
        ) -> jsi::Value {

        int newApplierId = WorkletModule::applierId--;
        int sharedStarterId = args[0].getNumber();
       
       SharedWorkletStarter *sharedWorkletStarter =  (SharedWorkletStarter*)( sharedValueRegistry->getSharedValue(sharedStarterId).get());
       
        int workletId = sharedWorkletStarter->workletId;
        std::shared_ptr<Worklet> workletPtr = workletRegistry->getWorklet(workletId);

        std::vector<std::shared_ptr<SharedValue>> svs;
        std::string id = "id";
        for (int svId : sharedWorkletStarter->args) {
          std::shared_ptr<SharedValue> sv = sharedValueRegistry->getSharedValue(svId);
          svs.push_back(sv);
        }

        std::shared_ptr<Applier> applier(new Applier(newApplierId, workletPtr, svs));
        applierRegistry->registerApplierForRender(newApplierId, applier);
        
        sharedWorkletStarter->addUnregisterListener([=] () {
          applierRegistry->unregisterApplierFromRender(newApplierId);
        });

        return jsi::Value::undefined();
     };
    return jsi::Function::createFromHostFunction(rt, name, 1, callback);
  } else if (propName == "event") {
    return event->getObject(rt).getProperty(rt, "NativeMap");
    
  } else if (propName == "log") {
    auto callback = [](
        jsi::Runtime &rt,
        const jsi::Value &thisValue,
        const jsi::Value *args,
        size_t count
        ) -> jsi::Value {
      const jsi::Value *value = &args[0];
      if (value->isString()) {
        Logger::log(value->getString(rt).utf8(rt).c_str());
      } else if (value->isNumber()) {
        Logger::log(value->getNumber());
      } else {
        Logger::log("unsupported value type");
      }
      return jsi::Value::undefined();
    };
    return jsi::Function::createFromHostFunction(rt, name, 1, callback);
  } else if(propName == "notify") {
    auto callback = [this](
        jsi::Runtime &rt,
        const jsi::Value &thisValue,
        const jsi::Value *args,
        size_t count
        ) -> jsi::Value {

      if (this->workletRegistry->getWorklet(workletId)->listener != nullptr) {
        (*this->workletRegistry->getWorklet(workletId)->listener)();
      }

      return jsi::Value::undefined();
    };
    return jsi::Function::createFromHostFunction(rt, name, 0, callback);
  } else if(propName == "workletId") {
    return jsi::Value(workletId);
  } else if(propName == "applierId") {
    return jsi::Value(applierId);
  }

  return jsi::Value::undefined();
}

void WorkletModule::setWorkletId(int workletId) {
  this->workletId = workletId;
}

void WorkletModule::setApplierId(int applierId) {
  this->applierId = applierId;
}

int WorkletModule::applierId = INT_MAX;
