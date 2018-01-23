/*created by Liqiankun 16/9/7*/

import React, {Component, PropTypes}  from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {getDate, getDayOfWeek} from './comm';

export default class Data_Label extends React.Component{
	constructor(props) {
		super(props);
		//
	}

	static defaultProps = {
		date:'2016-08-16',
	};

	render(){
		return (
			<View style={styles.container}>
            	<Text style={styles.content}>
					{getDate(this.props.date) + '' + getDayOfWeek(this.props.date)}
				</Text>
            </View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		width:105,
		height:20,
		marginTop:18,
		marginBottom:12,
		marginLeft:-5,
		borderRadius:3,
		backgroundColor:'#ffb400',
		justifyContent:'center',
		alignItems:'center',
	},
	content:{
		color:'white',
		fontSize:12
	}
});
