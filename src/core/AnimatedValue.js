import AnimatedNode from './AnimatedNode';
import { set } from '../base';
import { val } from '../utils';
import { evaluateOnce } from '../derived/evaluateOnce';
import interpolate from '../derived/interpolate';

function sanitizeValue(value) {
  return value === null || value === undefined ? value : Number(value);
}

export default class AnimatedValue extends AnimatedNode {
  constructor(value) {
    super({ type: 'value', value: sanitizeValue(value) });
    this._startingValue = this._value = value;
    this._animation = null;
  }

  __detach() {
    this.__detachAnimation(false);
    super.__detach();
  }

  __detachAnimation(isFinished) {
    if (this.animation) {
      this.animation.animationCallback &&
        this.animation.animationCallback({ finished: isFinished });
      this.animation.node.__removeChild(this);
    }
    this.animation = null;
  }

  __setAnimation(animation, hasFinishedPreviousAnimation = false) {
    animation && animation.node && animation.node.__addChild(this);
    this.__detachAnimation(hasFinishedPreviousAnimation);
    this.animation = animation;
  }

  __onEvaluate() {
    if (this.__inputNodes && this.__inputNodes.length) {
      this.__inputNodes.forEach(val);
    }
    return this._value + this._offset;
  }

  _updateValue(value) {
    this._value = value;
    this.__forceUpdateCache(value);
  }

  setValue(value) {
    this.__detachAnimation(false);
    evaluateOnce(set(this, value), this);
  }

  interpolate(config) {
    return interpolate(this, config);
  }
}
