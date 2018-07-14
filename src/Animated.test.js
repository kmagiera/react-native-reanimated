import Animated, { Easing } from './Animated';
import ReanimatedModule from './ReanimatedModule';
import AnimatedNode from './core/AnimatedNode';

jest.mock('./ReanimatedEventEmitter');
jest.mock('./ReanimatedModule');

const { Value, timing, spring, decay } = Animated;
describe('Reanimated backward compatible API', () => {
  beforeEach(() => {
    let nodesCreated = 0;
    ReanimatedModule.createNode = () => nodesCreated++;
    ReanimatedModule.dropNode = () => nodesCreated--;
    ReanimatedModule.getNumberOfNodes = () => nodesCreated;
  });

  const checkIfAttachAndDetachNodesProperly = jest.fn(animation => {
    const transX = new Value(0);

    const initial = ReanimatedModule.getNumberOfNodes();
    const v = new AnimatedNode({ type: 'sampleView', value: 0 });
    transX.__addChild(v);
    const before = ReanimatedModule.getNumberOfNodes();
    const anim = animation.node(transX, animation.config);
    anim.start();
    const during = ReanimatedModule.getNumberOfNodes();
    anim.__value_testOnly.__setAnimation(null, true);
    const after = ReanimatedModule.getNumberOfNodes();
    transX.__removeChild(v);
    v.__detach();
    const final = ReanimatedModule.getNumberOfNodes();

    return (
      initial === final &&
      after === before &&
      during > after &&
      initial === 0 &&
      before === 2
    );
  });

  it('fails if timing does not attach nodes correctly', () => {
    expect(
      checkIfAttachAndDetachNodesProperly({
        node: timing,
        name: 'timing',
        config: {
          duration: 5000,
          toValue: 120,
          easing: Easing.inOut(Easing.ease),
        },
      })
    ).toBeTruthy();
  });

  it('fails if decay does not attach nodes correctly', () => {
    expect(
      checkIfAttachAndDetachNodesProperly({
        node: decay,
        name: 'decay',
        config: {
          deceleration: 0.997,
        },
      })
    ).toBeTruthy();
  });

  it('fails if spring does not attach nodes correctly', () => {
    expect(
      checkIfAttachAndDetachNodesProperly({
        node: spring,
        name: 'spring',
        config: {
          toValue: 0,
          damping: 7,
          mass: 1,
          stiffness: 121.6,
          overshootClamping: false,
          restSpeedThreshold: 0.001,
          restDisplacementThreshold: 0.001,
        },
      })
    ).toBeTruthy();
  });

  it('fails if animation related nodes are still attached after detaching of value', () => {
    const { timing, Value } = Animated;
    const transX = new Value(0);
    const config = {
      duration: 5000,
      toValue: -120,
      easing: Easing.inOut(Easing.ease),
    };

    const anim = timing(transX, config);
    const anim2 = timing(transX, config);
    const v = new AnimatedNode({ type: 'sampleView', value: 0 }, [transX]);

    transX.__addChild(v);
    anim.start();
    anim2.start();

    v.__detach();
    expect(ReanimatedModule.getNumberOfNodes()).toBe(0);
  });
});
