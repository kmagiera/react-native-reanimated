import { createAnimatedSet as set } from '../core/AnimatedSet';
import interpolate from '../derived/interpolate';
import InternalAnimatedValue from './InternalAnimatedValue';
import { Platform } from 'react-native';
import { evaluateOnce } from '../derived/evaluateOnce';
import ReanimatedModule from '../ReanimatedModule';

// Animated value wrapped with extra methods for omit cycle of dependencies
export default class AnimatedValue extends InternalAnimatedValue {
  setValue(value) {
    this.__detachAnimation(this._animation);
    if (Platform.OS === 'web') {
      this._updateValue(value);
    } else {
      if (ReanimatedModule.setValue) {
        // FIXME Remove it after some time
        // For OTA-safety
        ReanimatedModule.setValue(this.__nodeID, value);
      } else {
        evaluateOnce(set(this, value), this);
      }
    }
  }
  
  toString() {
    return `AnimatedValue, id: ${super.__nodeID}`;
  }

  interpolate(config) {
    return interpolate(this, config);
  }
}
