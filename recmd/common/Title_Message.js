/*created by Liqiankun 16/9/6*/

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Props,
    Image,
} from 'react-native';


class Title_Message extends React.Component{
	_chooseweatherpic(){
		switch(this.props.weatherpic){
			case "0":
				return (<Image source={require('../img/weather/W0.png')} style={{width:15,height:15}}/>);
			case "1":
				return (<Image source={require('../img/weather/W1.png')} style={{width:15,height:15}}/>);
			case "2":
				return (<Image source={require('../img/weather/W2.png')} style={{width:15,height:15}}/>);
			case "3":
				return (<Image source={require('../img/weather/W3.png')} style={{width:15,height:15}}/>);
			case "4":
				return (<Image source={require('../img/weather/W4.png')} style={{width:15,height:15}}/>);
			case "5":
				return (<Image source={require('../img/weather/W5.png')} style={{width:15,height:15}}/>);
			case "6":
				return (<Image source={require('../img/weather/W6.png')} style={{width:15,height:15}}/>);
			case "7":
				return (<Image source={require('../img/weather/W7.png')} style={{width:15,height:15}}/>);
			case "8":
				return (<Image source={require('../img/weather/W8.png')} style={{width:15,height:15}}/>);
			case "9":
				return (<Image source={require('../img/weather/W9.png')} style={{width:15,height:15}}/>);
			case "10":
				return (<Image source={require('../img/weather/W10.png')} style={{width:15,height:15}}/>);
			case "13":
				return (<Image source={require('../img/weather/W13.png')} style={{width:15,height:15}}/>);
			case "14":
				return (<Image source={require('../img/weather/W14.png')} style={{width:15,height:15}}/>);
			case "15":
				return (<Image source={require('../img/weather/W15.png')} style={{width:15,height:15}}/>);
			case "16":
				return (<Image source={require('../img/weather/W16.png')} style={{width:15,height:15}}/>);
			case "17":
				return (<Image source={require('../img/weather/W17.png')} style={{width:15,height:15}}/>);
			case "18":
				return (<Image source={require('../img/weather/W18.png')} style={{width:15,height:15}}/>);
			case "19":
				return (<Image source={require('../img/weather/W19.png')} style={{width:15,height:15}}/>);
			case "20":
				return (<Image source={require('../img/weather/W20.png')} style={{width:15,height:15}}/>);
			case "29":
				return (<Image source={require('../img/weather/W29.png')} style={{width:15,height:15}}/>);
			case "45":
				return (<Image source={require('../img/weather/W45.png')} style={{width:15,height:15}}/>);
			default:
				return (<View></View>)
		
		}
	}
	render(){
		return(
			<View style={[styles.container]}>
	        	<View style={styles.start_time_view}>
	        		<Text style={styles.text_color}>{this.props.start_time}</Text>
	        	</View>
	        	<View style={{flex:3}}>
	        		<Text style={[styles.text_color,{marginLeft:-35}]} numberOfLines={1}>{this.props.start_address}</Text>
	        	</View>
	        	<View style={[styles.temperature_view]}>
	        		<View style={{flex:1,alignItems:'flex-end'}}>
	        			{this._chooseweatherpic()}
	        		</View>
	        		<View style={{minWidth:35,alignItems:'center',justifyContent:'center'}}>
	        			<Text style={styles.text_color}>{this.props.weathercondition}</Text>
	        		</View>
	        		<View style={{width:60,flexDirection:'row',alignItems:'center'}}>
	        			<Text style={[styles.text_color,{fontSize:12}]}>{this.props.top_temperature}</Text>
	        			<Text style={[styles.text_color,{fontSize:12}]}>{this.props.low_temperature}</Text>
	        		</View>
	        		
	        	</View>
	        </View>
		);
		
	}
}


const styles=StyleSheet.create({
	container:{
		flex:10,
		flexDirection:'row',
		alignItems:'center',
		borderLeftWidth:1,
		borderColor:'#c6c6c6',
		paddingBottom:5
	},
	
	text_color:{
		color:'#6a6a6a',
		fontSize: 12
	},
	
	start_time_view:{
		paddingLeft:13,
		paddingRight:12,
		flex:2,
	},
	
	temperature_view:{
		flexDirection:'row',
		flex:5,
	}
});


export default Title_Message;