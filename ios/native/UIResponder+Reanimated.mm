#import "UIResponder+Reanimated.h"
#import <React/RCTCxxBridgeDelegate.h>
#import <RNReanimated/NativeProxy.h>
#import <RNReanimated/REAModule.h>
#import <React/JSCExecutorFactory.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTCxxBridgeDelegate.h>
#import "REATurboSwitch.h"

@implementation UIResponder (Reanimated)
- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  if (REATurboReanimatedEnabled()) {
     _bridge_reanimated = bridge;
    __weak __typeof(self) weakSelf = self;
    return std::make_unique<facebook::react::JSCExecutorFactory>([weakSelf, bridge](facebook::jsi::Runtime &runtime) {
      if (!bridge) {
        return;
      }
      __typeof(self) strongSelf = weakSelf;
      if (strongSelf) {
        auto reanimatedModule = reanimated::createReanimatedModule(bridge.jsCallInvoker);
        runtime.global().setProperty(runtime,
                                     jsi::PropNameID::forAscii(runtime, "__reanimatedModuleProxy"),
                                     jsi::Object::createFromHostObject(runtime, reanimatedModule)
        );
      }
    });
  } else {
    return std::make_unique<facebook::react::JSCExecutorFactory>(nullptr);
  }
}

@end
