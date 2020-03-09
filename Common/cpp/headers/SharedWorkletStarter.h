//
// Created by Szymon Kapala on 2020-03-05.
//

#ifndef REANIMATEDEXAMPLE_SHAREDWORKLETSTARTER_H
#define REANIMATEDEXAMPLE_SHAREDWORKLETSTARTER_H

#include "SharedValue.h"
#include <vector>

class SharedWorkletStarter : public SharedValue {
  public:
  int workletId, id;
  std::vector<int> args;
  std::shared_ptr<const std::function<void()>> unregisterListener;
    
  SharedWorkletStarter(int svId, int workletId, std::vector<int> args);
  jsi::Value asValue(jsi::Runtime &rt) const override;
  jsi::Value asParameter(jsi::Runtime &rt) override;
  void setNewValue(std::shared_ptr<SharedValue> sv) override;
  void willUnregister() override;
  void setUnregisterListener(const std::function<void()> & fun);
  
  ~SharedWorkletStarter();
};

#endif //REANIMATEDEXAMPLE_SHAREDWORKLETSTARTER_H
