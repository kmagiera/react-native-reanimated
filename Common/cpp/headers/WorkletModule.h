//
// Created by Szymon Kapala on 2020-02-13.
//

#ifndef REANIMATEDEXAMPLE_WORKLETMODULE_H
#define REANIMATEDEXAMPLE_WORKLETMODULE_H

#include <memory>
#include <jsi/jsi.h>
#include "WorkletRegistry.h"
#include "SharedValueRegistry.h"
#include "SharedValue.h"
#include "SharedDouble.h"
#include "WorkletModule.h"
#include "ApplierRegistry.h"
#include <vector>

using namespace facebook;

class WorkletModule : public jsi::HostObject {
  std::shared_ptr<SharedValueRegistry> sharedValueRegistry;
  std::shared_ptr<ApplierRegistry> applierRegistry;
  std::shared_ptr<WorkletRegistry> workletRegistry;
  std::shared_ptr<jsi::Value> event;
  static int applierId;
  public:
    WorkletModule(std::shared_ptr<SharedValueRegistry> sharedValueRegistry,
                    std::shared_ptr<ApplierRegistry> applierRegistry,
                    std::shared_ptr<WorkletRegistry> workletRegistry,
                    std::shared_ptr<jsi::Value> event);
    jsi::Value get(jsi::Runtime &rt, const jsi::PropNameID &name) override;
};

#endif //REANIMATEDEXAMPLE_WORKLETMODULE_H
