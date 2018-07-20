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
    this.__detachAnimation(this.animation);
    super.__detach();
  }

  __detachAnimation() {
    if (this.animation) {
      this.animation.animationCallback();
      this.animation.getNode().__removeChild(this);
    }
    this.animation = null;
  }

  __setAnimation(animation) {
    this.__detachAnimation(this.animation);
    animation && animation.getNode() && animation.getNode().__addChild(this);
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
    this.__detachAnimation(this.animation);
    evaluateOnce(set(this, value), this);
  }

  interpolate(config) {
    return interpolate(this, config);
  }
}
