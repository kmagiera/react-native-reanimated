import { Image, ScrollView, Text, View } from 'react-native';
import Easing from './Easing';
import AnimatedClock from './core/AnimatedClock';
import AnimatedValue from './core/AnimatedValue';
import AnimatedNode from './core/AnimatedNode';
import * as base from './base';
import * as derived from './derived';
import createAnimatedComponent from './createAnimatedComponent';
import decay from './animations/decay';
import timing from './animations/timing';
import sequence from './animations/sequence';
import spring from './animations/spring';
import TimingAnimation from './animations/TimingAnimation';
import SpringAnimation from './animations/SpringAnimation';
import DecayAnimation from './animations/DecayAnimation';
import { addWhitelistedNativeProps } from './ConfigHelper';
import backwardsCompatibleWrapper from './animations/backwardsCompatibleWrapper';
import { evaluateOnce } from './utils';

const Animated = {
  // components
  View: createAnimatedComponent(View),
  Text: createAnimatedComponent(Text),
  Image: createAnimatedComponent(Image),
  ScrollView: createAnimatedComponent(ScrollView),

  // classes
  Clock: AnimatedClock,
  Value: AnimatedValue,
  Node: AnimatedNode,

  // operations
  ...base,
  ...derived,

  // animations
  sequence,
  decay: backwardsCompatibleWrapper(decay, DecayAnimation),
  timing: backwardsCompatibleWrapper(timing, TimingAnimation),
  spring: backwardsCompatibleWrapper(spring, SpringAnimation),

  // configuration
  addWhitelistedNativeProps,
  evaluateOnce,
};

export default Animated;

export { Easing };
