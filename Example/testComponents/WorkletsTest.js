import React from 'react';
import Animated, { useSharedValue, useWorklet, useEventWorklet } from 'react-native-reanimated';
import { View, Text } from 'react-native';

const WorkletsTest = () => {

    const initial = 0

    const v = useSharedValue(initial)
    // 0 - parent, 1 - child waiting for start, 2 - child, 3 - child waiting for stop
    const turnState = useSharedValue(0)

    const childw = useWorklet(function(v, turnState) {
        'worklet'
        this.log(`[child] ${ v.value }`)
        if (v.value % 3 === 0) {
            turnState.set(3)
            return true
        }
        v.set(v.value + 1)
    }, [v, turnState])

    const parentw = useWorklet(function(v, turnState, child) {
        'worklet'
        this.log(`[parent] ${ v.value }`)
        if (turnState.value === 0) {
            v.set(v.value + 1)
            if (v.value % 5 === 0) {
                turnState.set(1)
            }
        } else if (turnState.value === 1) {
            this.log('--> starting')
            child.start()
            turnState.set(2)
        } else if(turnState.value === 3) {
            this.log('--> stopping')
            child.stop()
            turnState.set(0)
        }
        if (v.value > 20) {
            this.log('[parent] too much, exiting')
            return true
        }
    }, [v, turnState, childw])

    parentw()

    // check different ways of passing shared values to worklet
    const v2 = useSharedValue(456)

    ;(useWorklet(function() {
        'worklet';
        this.log('[worklet 1]');
        return true;
    }))();

    ;(useWorklet(function(v, vv) {
        'worklet'
        this.log('[worklet 2] ' + v.value + '/' + vv.value)
        return true
    }, [v, v2]))();

    ;(useWorklet(function(input) {
        'worklet'
        this.log('[worklet 3] ' + input.v.value + '/' + input.v2.value)
        return true
    }, {v, v2}))();

    // order should not matter, worklet 3 and 4 should produce the same output
    ;(useWorklet(function(input) {
        'worklet'
        this.log('[worklet 4] ' + input.v.value + '/' + input.v2.value)
        return true
    }, {v2, v}))();

    return (
        <View>
            <Text>
                Testing...
            </Text>
        </View>
    )
}

export default WorkletsTest