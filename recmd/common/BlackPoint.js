/**
 * Created by huangzhangshu on 16/9/1.
 */

'use strict'

import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

/**
 * 小黑点
 */
class BlackPoint extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={styles.point}/>
                <View style={styles.point}/>
                <View style={styles.point}/>
                <View style={styles.point}/>
                <View style={styles.point}/>
                <View style={styles.point}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    point: {
        backgroundColor: '#333333',
        width: 2,
        height: 2,
        borderRadius: 100,
        marginTop: 2
    },
})

export default BlackPoint