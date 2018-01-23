/**
 * Created by shane on 17/4/19.
 */
import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import Icon from '../../hotel/common/Icon';
import Item from '../main/OrderItem'

export default class Status extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			show:false
		};
	}

	static defaultProps = {
		data:{
			status:'',
			supplierName:'',
			expressTypeName:'',
			expressNames:'',
			payMethod:'',
			monthPay:''
		}
	};

	moreButtonEvent(){
		this.setState({
			show: !this.state.show,
		})
	}

	render() {

		const status = this.props.data.status;
		const resName = this.props.data.expressNames;
		const payMode = this.props.data.payMethod==1?'寄方付':'收方付';
		const monthPay = this.props.data.payAccount;
		const show = this.state.show;
		let extendValues = this.props.data.extendValues;
		if (extendValues == null || extendValues == undefined){
			extendValues = [];
		}
		if (typeof extendValues == 'string' && extendValues.constructor == String){
			extendValues = JSON.parse(this.props.data.extendValues)
		}
		if (typeof extendValues == 'object' && extendValues.constructor == Object){
			extendValues = [];
		}
		return (
			<View>
				<View style={{flex:1, flexDirection:'row', alignItems:'center', height:50, backgroundColor:'white'}}>
					<Text style={{marginLeft:15, color:'#ed7140'}}>{status}</Text>
					<TouchableOpacity
						style={{flex:1, flexDirection:'row', justifyContent:'flex-end',alignItems:'center'}}
					    onPress={()=>this.moreButtonEvent()}
					>
						<Text>{show?'收起':'查看更多'}</Text>
						<Icon style={{marginRight:15, width:20, height:10, transform:show?[{rotate:'270deg'}]:[{rotate:'90deg'}]}} name="ic_hotel_address"></Icon>
					</TouchableOpacity>
				</View>
				{this.state.show ?
					<View>
						{extendValues.map((extend,index)=>{
							return(
								<Item key={index} children={{name:'增值服务', value:`保价费-${extend.value}元`, disabled:false, showArrow:false}}/>
							)
						})}
						<Item children={{name:'物品名称', value:resName, disabled:false, showArrow:false}}/>
						<Item children={{name:'付款方式', value:payMode, disabled:false, showArrow:false}}/>
						<Item children={{name:'月结账', value:monthPay, disabled:false, showArrow:false}}/>
					</View>:null
				}
			</View>
		)
	}
}