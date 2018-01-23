/*
 Created by Liqiankun 16/9/5
 * */

'use strict'

import React, {Component, PropTypes}  from 'react';
import {
	Text,
    View,
    Image,
    StyleSheet,
} from 'react-native';

class TraficLabel_Dele extends React.Component {

    static propTypes = {
        circleStyle: View.propTypes.style,
    };


    constructor(props) {
        super(props);
    }

    render() {
        const {circleStyle} = this.props;

        return (
            <View
                style={[styles.container, circleStyle]}>
               
               		<Image source={require('../../img/Delete@3x.png')} style={{width:20,height:20}}></Image>
               
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 100,
        width: 20,
        height: 20,
        alignItems: 'center',//控制叉号水平
        alignSelf: 'center',//控制叉号圈的水平
    },
})


export default TraficLabel_Dele;


