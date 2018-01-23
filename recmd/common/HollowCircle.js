/**
 * Created by huangzhangshu on 16/9/1.
 */

'use strict'

import React, {Component, PropTypes}  from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

class HollowCircle extends React.Component {

    static propTypes = {
        circleStyle: View.propTypes.style,
        hollowStyle: View.propTypes.style,
    };


    constructor(props) {
        super(props);
    }

    render() {
        const {circleStyle, hollowStyle} = this.props;

        return (
            <View
                style={[styles.container, circleStyle]}>
                <View style={[styles.hollow, hollowStyle]}></View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#449ff7',
        borderRadius: 100,
        width: 12,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    hollow: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 100,
        alignSelf: 'center'
    }
})

export default HollowCircle;