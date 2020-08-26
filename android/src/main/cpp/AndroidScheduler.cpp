#include "AndroidScheduler.h"
#include <memory>
#include <string>
#include <fbjni/fbjni.h>
#include <jsi/jsi.h>
#include <android/log.h>

namespace reanimated {

using namespace facebook;
using namespace react;

class SchedulerWrapper: public Scheduler {
private:
   jni::global_ref<AndroidScheduler::javaobject> scheduler_;

public:

   SchedulerWrapper(jni::global_ref<AndroidScheduler::javaobject> scheduler):
    scheduler_(scheduler) {}

   void scheduleOnUI(std::function<void()> job) override {
     Scheduler::scheduleOnUI(job);
     scheduler_->cthis()->scheduleOnUI();
   }

   void scheduleOnJS(std::function<void()> job) override {
     scheduler_->cthis()->jsCallInvoker_->invokeAsync(std::move(job));
     //Scheduler::scheduleOnJS(job);
     //scheduler_->cthis()->scheduleOnJS();
   }

   ~SchedulerWrapper() {};

};

AndroidScheduler::AndroidScheduler(
  jni::alias_ref<AndroidScheduler::javaobject> jThis
):
  javaPart_(jni::make_global(jThis)),
  scheduler_(new SchedulerWrapper(jni::make_global(jThis)))
  {}

jni::local_ref<AndroidScheduler::jhybriddata> AndroidScheduler::initHybrid(
  jni::alias_ref<jhybridobject> jThis
) {
  return makeCxxInstance(jThis);
}

void AndroidScheduler::triggerUI() {
  scheduler_->triggerUI();
}

void AndroidScheduler::triggerJS() {
  scheduler_->triggerJS();
}

void AndroidScheduler::scheduleOnUI() {
  static auto method = javaPart_->getClass()->getMethod<void()>("scheduleOnUI");
  method(javaPart_.get());
}

void AndroidScheduler::scheduleOnJS() {
  static auto method = javaPart_->getClass()->getMethod<void()>("scheduleOnJS");
  method(javaPart_.get());
}

void AndroidScheduler::setJSCallInvoker(std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker) {
  jsCallInvoker_ = jsCallInvoker;
}

void AndroidScheduler::registerNatives() {
  registerHybrid({
    makeNativeMethod("initHybrid", AndroidScheduler::initHybrid),
    makeNativeMethod("triggerUI", AndroidScheduler::triggerUI),
    makeNativeMethod("triggerJS", AndroidScheduler::triggerJS),
  });
}

}