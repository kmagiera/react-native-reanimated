import { createAnimatedPropAdapter } from './core';

export const SVGAdapter = createAnimatedPropAdapter((props) => {
  'worklet';
  const keys = Object.keys(props);
  // transform
  if (keys.includes('transform')) {
    if (Array.isArray(props.transform)) {
      // case of array with 6 values => https://github.com/react-native-svg/react-native-svg/blob/develop/src/elements/Shape.tsx#L200
      if (props.transform.length !== 6) {
        throw new Error(
          `invalid transform length of ${props.transform.length}, should be 6`
        );
      }
      const transform = props.transform;
      const x = props.x ?? 0;
      const y = props.y ?? 0;
      props.transform = [
        { translateX: transform[0] * x + transform[2] * y + transform[4] },
        { translateX: transform[1] * x + transform[3] * y + transform[5] },
      ];
    } else if (typeof props.transform === 'string') {
      // case of string 'translate(translateX translateY)'
      // todo: handle other cases of transform string like here https://github.com/react-native-svg/react-native-svg/blob/develop/src/lib/extract/extractTransform.ts#L184
      const arr = props.transform
        .replace('translate(', '')
        .replace(')', '')
        .split(' ');
      props.transform = [{ translateX: arr[0] }, { translateX: arr[1] }];
    }
  }
  // todo: other props
});

export const TextInputAdapter = createAnimatedPropAdapter(
  (props) => {
    'worklet';
    const keys = Object.keys(props);
    // convert text to value like RN does here: https://github.com/facebook/react-native/blob/master/Libraries/Components/TextInput/TextInput.js#L878
    if (keys.includes('value')) {
      props.text = props.value;
      delete props.value;
    }
  },
  ['text']
);
