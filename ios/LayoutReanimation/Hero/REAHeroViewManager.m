#import "REAHeroViewManager.h"
#import "REAHeroView.h"
#import <React/RCTViewManager.h>

@implementation REAHeroViewManager

RCT_EXPORT_MODULE(REAHeroView)

- (UIView *)view
{
    return [REAHeroView new];
}

RCT_CUSTOM_VIEW_PROPERTY(heroId, NSString*, REAHeroView)
{
  view.heroId = [RCTConvert NSString:json];
}

@end
