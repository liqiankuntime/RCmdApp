/**
 * Created by shane on 17/4/20.
 */
import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

export default class Records extends React.Component {

	static defaultProps = {

	};

	renderRow(isTop, rowData){
		const array = rowData.time.split(' ');
		const date = array[0];
		const time = array[1];
		return (
			<View key={rowData.time} style={{flex:1, flexDirection:'row', height:60, }}>
				<View style={{flexDirection:'column', justifyContent:'center', width:90, height:60,}}>
					<Text style={{color:'#999999', fontSize:15}}>{date}</Text>
					<Text style={{color:'#333333'}}>{time}</Text>
				</View>
				<View style={{flexDirection:'column', alignItems:'center', width:20, height:60}}>
					<View style={{flex:1, width:1, backgroundColor:isTop?'white':'#e5e5e5', }}></View>
					<Image style={{width:20, height:20}} resizeMode={'contain'} source={require('../images/ic_bule_circle.png')}></Image>
					<View style={{flex:1, width:1, backgroundColor:'#e5e5e5', }}></View>
				</View>
				<View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center', height:60,}}>
					<Text style={{flex:1, paddingLeft:10, marginRight:10}} numberOfLines={0}>{`${rowData.address} ${rowData.remark}`}</Text>
				</View>
			</View>
		)
	}

	render(){
		let records = this.props.data;
		if (records == null || records == undefined){
			records = [];
		}
		if (typeof records == 'string' && records.constructor == String){
			records = JSON.parse(this.props.data)
		}
		if (records.length==0){
			return null;
		}
		else {
			return (
				<View style={{flexDirection: 'column', paddingLeft: 15, paddingRight: 15, backgroundColor: 'white'}}>
					<Text style={{paddingTop: 10, paddingBottom: 10}}>物流跟踪</Text>
					<View style={{flex: 1, height: 1, backgroundColor: '#e5e5e5'}}></View>
					{records.map((rowData, index) =>this.renderRow(index == 0, rowData))}
				</View>
			)
		}
	}
}