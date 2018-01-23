/**
 * Created by shane on 17/4/17.
 */
import React from 'react'
import {
	View,
	ScrollView,
	Text,
	Image,
	Modal,
	Alert,
	Linking,
	PropTypes,
	TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from '../hotel/common/Icon';
import {getOrder, cancelOrder, resetData} from './actions/orderActions'
import NavBar from './navigation'
import Adress from './main/OrderAddressItem'
import Status from './orderCom/Status'
import Records from './orderCom/Records'
import Preview from './Preview'

const colors = {
	themeColor: 'rgb(217, 51, 58)',
	lightGray: '#f3f3f3',
	lightOrange: '#faad94',
	orange: 'rgb(237,113,64)',
	backNavi: '#ed7140',
	backBody: '#f3f3f3',
	line: '#e5e5e5',
	textLight: '#999999',
	text: '#333333',
};

class Order extends React.Component {

	static  PropTypes = {
		//orderId: PropTypes.number
	};

	static defaultProps = {

	};

	componentWillMount(){
		if (this.props.orderNo != undefined){
			this.props.dispatch(getOrder(this.props.orderNo));
		}
		else {

		}
	}

	makeCall(mobile){
		Alert.alert(
			null,
			mobile,
			[
				{text:'取消'},
				{text:'呼叫', onPress:()=>{
					let tel = 'tel:' + mobile;
					Linking.canOpenURL(tel).then(supperted => {
						if (supperted) {
							Linking.openURL(tel)
						}
					})
				}}
			]
		);
	}

	cancelButtonEvent(orderNo){
		this.props.dispatch(cancelOrder(orderNo));
	}

	sureButtonEvent(orderNo){
		this.props.navigator.push({
			name: 'preview',
			component: Preview,
			passProps: {
				orderNo: orderNo,
			}
		})
	}

	render(){

		if (this.props.loadingView){
			return (
				<Text>loading...</Text>
			)
		}
		else if (this.props.data){
			const refData = this.props.data;
			const {orderNoSupplier, supplierName, supplierPhone} = refData;
			const sendAddress = {
				userName: refData.refAddressUserName,
				mobile: refData.refAddressMobile,
				province: refData.refAddressProvince,
				city: refData.refAddressCity,
				area: refData.refAddressArea,
				street: refData.refAddressStreet,
				address: refData.refAddressAddress,
				//address: `${refData.refAddressProvince} ${refData.refAddressCity}${refData.refAddressArea}${refData.refAddressStreet}${refData.refAddressAddress}`
			};
			const receiveAddress = {
				userName: refData.refAddressUserNameTo,
				mobile: refData.refAddressMobileTo,
				province: refData.refAddressProvinceTo,
				city: refData.refAddressCityTo,
				area: refData.refAddressAreaTo,
				street: refData.refAddressStreetTo,
				address: refData.refAddressAddressTo,
				//address: `${refData.refAddressProvinceTo} ${refData.refAddressCityTo}${refData.refAddressAreaTo}${refData.refAddressStreetTo}${refData.refAddressAddressTo}`
			};
			const statusData = {status, extendValues, expressNames, payMethod} = refData;
			const recordsData = refData.callbackRecords;

			return (
				<View style={{flex:1}}>
					<NavBar title={'订单详情'} navigator={this.props.navigator}/>
					<ScrollView
						style={{flex:1,backgroundColor: 'white',}}
						showsVerticalScrollIndicator={false}
						keyboardDismissMode = "on-drag"
					>
						<View style={{flex:1, flexDirection:'row', alignItems:'center', height:50, backgroundColor:'white'}}>
							<Text style={{flex:1, marginLeft:15}}>{`运单号  ${orderNoSupplier}`}</Text>
							<TouchableOpacity onPress={()=>this.makeCall(supplierPhone)}>
								<Icon style={{marginRight:10,width:20,height:20}} name="ic_call"></Icon>
							</TouchableOpacity>
							<Text style={{marginRight:15,}}>{supplierName}</Text>
						</View>
						<View style={{flex:1, height:10, backgroundColor:colors.lightGray}}></View>
						<Adress children={{code:'send', showArrow:false, disabled:false, value:sendAddress}}/>
						<Adress children={{code:'receive', showArrow:false, disabled:false, value:receiveAddress}}/>
						<View style={{flex:1, height:10, backgroundColor:colors.lightGray}}></View>
						<Status data={statusData}/>
						<View style={{flex:1, height:10, backgroundColor:colors.lightGray}}></View>
						<Records data={recordsData}/>
					</ScrollView>
					{refData.status!='已取消'?
						<View style={{flexDirection:'row',alignItems:'center', justifyContent:'flex-end', height:50, backgroundColor:'white'}}>
							{refData.status=='待揽收'?
								<TouchableOpacity
									style={{width:100, height:50,justifyContent:'center',alignItems:'center',backgroundColor:colors.backBody}}
									onPress={()=>this.cancelButtonEvent(refData.orderNo)}>
									<Text style={{color:colors.text}}>取消订单</Text>
								</TouchableOpacity>:null
							}
							<TouchableOpacity
								style={{width:100, height:50,justifyContent:'center',alignItems:'center',backgroundColor:colors.orange}}
								onPress={()=>this.sureButtonEvent(refData.orderNo)}>
								<Text style={{color:'white'}}>生成面单</Text>
							</TouchableOpacity>
						</View>:null
					}
					<Modal
						transparent={true}
					    visible={this.props.loadingModal}
					>
						<Text>loading...</Text>
					</Modal>
				</View>
			)
		}
		else
			return (
				<Text style={{backgroundColor:'red'}}>未获取到数据</Text>
			)
	}
}

function mapStateToProps(state) {

	return {
		...state.order
	}
}

export default connect(mapStateToProps)(Order)