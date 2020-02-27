//
//  IOSScheduler.h
//  DoubleConversion
//
//  Created by Szymon Kapala on 27/02/2020.
//

#ifndef IOSScheduler_h
#define IOSScheduler_h

#include <stdio.h>
#include "Scheduler.h"

class IOSScheduler : public Scheduler {
  std::shared_ptr<JSCallInvoker> jsInvoker;
  public:
  IOSScheduler(std::shared_ptr<JSCallInvoker> jsInvoker);
  void scheduleOnUI(std::function<void()> job) override;
  void scheduleOnJS(std::function<void()> job) override;
  virtual ~IOSScheduler();
  
  void setUIManager(RCTUIManager *uiManager);
}

#endif /* IOSScheduler_h */
