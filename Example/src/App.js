import { createBrowserApp } from '@react-navigation/web';
import React, { useRef } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  YellowBox,
  TouchableHighlight,
  findNodeHandle,
} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Reanimated1 from '../reanimated1/App';

import AnimatedStyleUpdateExample from './AnimatedStyleUpdateExample';
import WobbleExample from './WobbleExample';
import DragAndSnapExample from './DragAndSnapExample';
import ScrollEventExample from './ScrollEventExample';
import ChatHeadsExample from './ChatHeadsExample';
import SwipeableListExample from './SwipeableListExample';
import ScrollableViewExample from './ScrollableViewExample';
import AnimatedTabBarExample from './AnimatedTabBarExample';
import LightboxExample from './LightboxExample';
import LiquidSwipe from './LiquidSwipe';

YellowBox.ignoreWarnings(['Calling `getNode()`']);

const SCREENS = {
  AnimatedStyleUpdate: {
    screen: AnimatedStyleUpdateExample,
    title: '🆕 Animated Style Update',
  },
  WobbleExample: {
    screen: WobbleExample,
    title: '🆕 Animation Modifiers (Wobble Effect)',
  },
  DragAndSnapExample: {
    screen: DragAndSnapExample,
    title: '🆕 Drag and Snap',
  },
  ScrollEventExample: {
    screen: ScrollEventExample,
    title: '🆕 Scroll Events',
  },
  ChatHeadsExample: {
    screen: ChatHeadsExample,
    title: '🆕 Chat Heads',
  },
  SwipeableListExample: {
    screen: SwipeableListExample,
    title: '🆕 (advanced) Swipeable List',
  },
  LightboxExample: {
    screen: LightboxExample,
    title: '🆕 (advanced) Lightbox',
  },
  ScrollableViewExample: {
    screen: ScrollableViewExample,
    title: '🆕 (advanced) ScrollView imitation',
  },
  AnimatedTabBarExample: {
    screen: AnimatedTabBarExample,
    title: '🆕 (advanced) Tab Bar Example',
  },
  LiquidSwipe: {
    screen: LiquidSwipe,
    title: '🆕 (iOS ONLY) Liquid Swipe Example',
  },
};

function MainScreen({ navigation }) {
  const data = Object.keys(SCREENS).map((key) => ({ key }));
  return (
    <FlatList
      style={styles.list}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={(props) => (
        <MainScreenItem
          {...props}
          screens={SCREENS}
          onPressItem={({ key }) => navigation.navigate(key)}
        />
      )}
      renderScrollComponent={(props) => <ScrollView {...props} />}
      ListFooterComponent={() => <LaunchReanimated1 navigation={navigation} />}
    />
  );
}

MainScreen.navigationOptions = {
  title: '🎬 Reanimated 2.x Examples',
};

export function ItemSeparator() {
  return <View style={styles.separator} />;
}

export function MainScreenItem({ item, onPressItem, screens }) {
  const { key } = item;
  return (
    <RectButton style={styles.button} onPress={() => onPressItem(item)}>
      <Text style={styles.buttonText}>{screens[key].title || key}</Text>
    </RectButton>
  );
}

function LaunchReanimated1({ navigation }) {
  return (
    <>
      <ItemSeparator />
      <RectButton
        style={styles.button}
        onPress={() => navigation.navigate('Reanimated1')}>
        <Text style={styles.buttonText}>👵 Reanimated 1.x Examples</Text>
      </RectButton>
    </>
  );
}

const Reanimated2App = createStackNavigator(
  {
    Main: { screen: MainScreen },
    ...SCREENS,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
  }
);

const ExampleApp = createSwitchNavigator({
  Reanimated2App,
  Reanimated1,
});

export const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const createApp = Platform.select({
  web: (input) => createBrowserApp(input, { history: 'hash' }),
  default: (input) => createAppContainer(input),
});

//export default createApp(ExampleApp);

import Animated,{
  useSharedValue,
  useAnimatedStyle,
  runOnUI,
} from 'react-native-reanimated';

export default function screen() {
  const boxRef = useRef(null);
  const scrollView = useRef(null);

  function handleClick() {
    const handle = findNodeHandle(boxRef.current);
    console.log("ok");
    runOnUI(
      () => {
        'worklet';
        console.log(_measure(handle));
      }
    )();
  }

  function handleClick2() {
    const handle = findNodeHandle(scrollView.current);
    runOnUI(
      () => {
        'worklet';
        _scrollTo(handle, 10, 0, true);
      }
    )();
  }


  return (
    <View>
      <TouchableHighlight style={stylez.box} ref={boxRef} onPress={handleClick} >
        <Text>okok</Text>
      </TouchableHighlight>
      <View style={stylez.wrapper }>
        <ScrollView style={stylez.scrollView} ref={scrollView} >
          <Text style={stylez.element}>aa</Text>
          <Text style={stylez.element}>bb</Text>
          <Text style={stylez.element}>cc</Text>
          <Text style={stylez.element}>dd</Text>
        </ScrollView>
      </View>
      <TouchableHighlight onPress={handleClick2} >
        <Text>moveToThe nextOne</Text>
      </TouchableHighlight>
    </View>
  );
}

const stylez = StyleSheet.create({
  box: {
    margin: 100,
    width:100,
    height:200,
    backgroundColor:"black",
  },
  scrollView: {
    borderColor: "black",
  },
  element: {
    backgroundColor: "red",
  },
  wrapper: {
    height: 20,
  }
});
