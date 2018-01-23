/*
 Created by Liqiankun 16/9/5
 * */

'use strict'

import React, {Component, PropTypes}  from 'react';
import {
	Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

class TraficLabel_Send extends React.Component {

    static propTypes = {
        circleStyle: View.propTypes.style,
    };
    
    constructor(props) {
        super(props);
    }
   
    render() {
    	
        const {circleStyle} = this.props;
        
        return (
            <View style={[styles.container, circleStyle]}>
            	{
	            	this.props.tabType === 'char' ? 
	                <Text style={{color:'#ffb400',fontSize:12}}>{this.props.tab}</Text> :
	                <Image source={this.props.tab} style={{height:36,width:36}}></Image>
	                
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 100,
        width: 36,
        height: 36,
        alignItems: 'center',//控制字的水平布局
        justifyContent: 'center',//控制字的垂直方向
        marginRight:20,
    },
})

export default TraficLabel_Send;


