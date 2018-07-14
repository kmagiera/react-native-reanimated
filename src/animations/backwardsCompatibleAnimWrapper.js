import {
  always,
  block,
  call,
  clockRunning,
  cond,
  set,
  startClock,
  stopClock,
} from '../base';
import { delay } from '../derived';
import { default as Clock } from '../core/AnimatedClock';
import { default as Value } from '../core/AnimatedValue';
import { evaluateOnce } from '../derived/evaluateOnce';

function backwardsCompatibleInvoke(node, AnimationClass, value, config) {
  let returnMethod;
  const newValue = new Value(0);
  const newClock = new Clock();
  const currentState = AnimationClass.getDefaultState();
  currentState.position = newValue;
  let alwaysNode;
  let isStarted = false;
  let isDone = false;
  let wasStopped = false;
  return {
    start: currentReturnMethod => {
      if (isStarted) {
        returnMethod && returnMethod({ finished: false });
        return;
      }
      if (isDone) {
        console.warn('Animation has been finished before');
        // inconsistent with React Native
        return;
      }
      isStarted = true;
      alwaysNode = always(
        set(
          value,
          block([
            cond(currentState.finished, set(currentState.finished, 0)),
            cond(clockRunning(newClock), 0, [
              set(newValue, value),
              startClock(newClock),
            ]),
            backwardsCompatibleAnimWrapper(node, AnimationClass)(
              newClock,
              currentState,
              config
            ),
            cond(currentState.finished, [
              call([], () => {
                isStarted = false;
                isDone = true;
                value.__setAnimation(null, !wasStopped);
                if (!wasStopped) {
                  wasStopped = false;
                }
              }),
              stopClock(newClock),
            ]),
            currentState.position,
          ])
        )
      );
      returnMethod = currentReturnMethod;
      alwaysNode.__addChild(value);
      value.__setAnimation({
        node: alwaysNode,
        returnMethod: arg => {
          returnMethod && returnMethod(arg);
        },
      });
    },
    stop: () => {
      if (isDone) {
        console.warn('Animation has been finished before');
        return;
      }
      if (!isStarted) {
        console.warn("Animation hasn't been started");
        return;
      }
      wasStopped = true;
      evaluateOnce(set(currentState.finished, 1), currentState.finished);
    },
    __value_testOnly: value,
  };
}

export default function backwardsCompatibleAnimWrapper(node, AnimationClass) {
  return (clock, state, config) => {
    if (config !== undefined) {
      let resultNode = node(clock, state, config);
      if (config.delay) {
        resultNode = delay(
          clock,
          { finished: new Value(0) },
          { time: config.delay, node: resultNode }
        );
      }
      return resultNode;
    }
    return backwardsCompatibleInvoke(node, AnimationClass, clock, state);
  };
}
