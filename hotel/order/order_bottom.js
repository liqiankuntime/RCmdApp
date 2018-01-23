/**
 * Created by shane on 16/10/20.
 */
import React from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native'

import {getDate,checkPhoneNumber,checkEmail} from '../common/comm'
import {orderHotelPayEvent} from '../../native'
import {showOrderLoading,submitOrder,cancelOrder,confirmOrder,updateOrder} from '../actions';
import constants from '../common/constants'
import Icon from '../common/Icon'
import AmountDetail from './AmountDetail'

let mode = {};
export default class Bottom extends React.Component{
    constructor(props){
        super(props)
    }

    amountEvent() {
        if (this.props.data.orderType==undefined || this.props.data.orderType=='api') {
            this.props.navigator.push({
                name: 'AmountDetailContainer',
                component: AmountDetail,
                passProps: {
                    data: this.props.data,
                    peoples: this.props.data.roomNum,
                }
            })
        }
    }

    cancelButtonEvent(){
        Alert.alert(
            '提示',
            '确定要取消订单吗?',
            [
                {text:'取消'},
                {text:'确定', onPress:()=>{this.props.dispatch(cancelOrder(this.props.data.id))}}
            ]
        )
    }

    sureButtonEvent(){
        if (this.props.modalLoading){
            return;
        }
        switch (mode.type) {
            case "commit":
                let data = this.props.data;
                if (data.roomNum == 0) {
                    Alert.alert('提示','请选择房间数',[{text:'确定'}])
                }
                else if (data.timeLater==null){
                    Alert.alert('提示','请选择最晚到店时间',[{text:'确定'}])
                }
                else if (data.hotelOrderCustomer.length==0) {
                    Alert.alert('提示','请选择入住人',[{text:'确定'}])
                }
                else if (data.linkuserMobile==null || data.linkuserMobile.length==0) {
                    Alert.alert('提示','请填写联系人电话',[{text:'确定'}])
                }
                else if (!checkPhoneNumber(data.linkuserMobile)) {
                    Alert.alert('提示','请填写有效的电话号码',[{text:'确定'}])
                }
                else if (data.supplierCode==='hrs' && (data.linkuserEmail==null || data.linkuserEmail.length==0)) {
                    Alert.alert('提示','请填写联系人邮箱地址',[{text:'确定'}])
                }
                else if (data.supplierCode==='hrs' && !checkEmail(data.linkuserEmail)) {
                    Alert.alert('提示','请填写有效的邮箱地址',[{text:'确定'}])
                }
                else if (data.roomNum!=data.hotelOrderCustomer.length) {
                    Alert.alert('提示','房间数须与入住人数相同',[{text:'确定'}])
                }else if (data.isNeedInvoice && data.invoice == null) {
                    Alert.alert('提示','请填写发票信息',[{text:'确定'}])
                }else if (data.isNeedInvoice && data.invoice.Title == null) {
                    Alert.alert('提示','请填写发票抬头',[{text:'确定'}])
                }else if (data.isNeedInvoice && data.invoice.ItemName == null) {
                    Alert.alert('提示','请填写发票内容',[{text:'确定'}])
                }else if (data.isNeedInvoice && data.invoice.Recipient.Street == null) {
                    Alert.alert('提示','请填写发票详细地址',[{text:'确定'}])
                }
                else
                    this.props.dispatch(submitOrder(this.props.data));
                break;
            case "guarantee":

                if (orderHotelPayEvent) {
                    const {supplierCode,orderNo,guaranteeAmount,hotelName,dayCount,startDate,endDate} = this.props.data;
                    let data = {
                        supplierCode:supplierCode,
                        orderNo: orderNo,
                        sumPrice: guaranteeAmount,
                        hotelName: hotelName,
                        dayCount: dayCount,
                        startDate: getDate(startDate),
                        endDate: getDate(endDate)
                    }
                    orderHotelPayEvent(data,(status)=>{
                        if (status){
                            this.props.dispatch(updateOrder({
                                payStatus:'已支付'
                            }))
                        }
                    })
                }
                break;
                  case "pay":
                  if (orderHotelPayEvent) {
                      const {supplierCode,orderNo,sumPrice,hotelName,dayCount,startDate,endDate} = this.props.data;
                      let data = {
                          supplierCode:supplierCode,
                          orderNo: orderNo,
                          sumPrice: sumPrice,
                          hotelName: hotelName,
                          dayCount: dayCount,
                          startDate: getDate(startDate),
                          endDate: getDate(endDate)
                      }
                      orderHotelPayEvent(data,(status)=>{
                          if (status){
                              this.props.dispatch(updateOrder({
                                  payStatus:'已支付'
                              }))
                          }
                      })
                  }
                  break;
            default:
                ;
        }
    }

    resetMode(billId,payStatus,paymentType,orderStatus){
        if (billId <= 0) {
            mode.type = 'commit';
            mode.title = '提交';
        }
        else if (paymentType == 'SelfPay' && payStatus == '待支付' && orderStatus != '已取消'){
            mode.type = 'guarantee';
            mode.title = '去担保';
        }
        else if (paymentType == 'Prepay' && payStatus == '待支付' && orderStatus != '已取消'){
            mode.type = 'pay';
            mode.title = '去支付';
        }
        else {
            mode.type = 'sure';
            mode.title = '确定';
        }
    }

    render(){
        const data = this.props.data;
        const sumPrice = '￥'+data.sumPrice;
        const hasGuarantee = data.guaranteeAmount>0?true:false;
        const guarantee = '担保费'+' ￥'+ data.guaranteeAmount;
        this.resetMode(data.id,data.payStatus,data.paymentType,data.orderStatus);
        const hasCancel = (data.id!=0&&data.orderStatus!='已取消'&&this.props.editable==true) ? true:false;
        const hasSure = (mode.type=='sure'&&this.props.editable)||this.props.editable==false ? false:true;
        return(
            <View style={{flexDirection:'row',justifyContent:'flex-end',height:50,borderTopWidth:1,borderTopColor:constants.colors.backBody}}>
                <TouchableOpacity
                    style={{flex:1,flexDirection:'column'}}
                    onPress={()=>this.amountEvent()}>
                    <View style={{flex:1,marginTop:3,marginLeft:10,flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={{fontSize:17,color:constants.colors.text}}>{sumPrice}</Text>
                        <Icon style={{marginLeft:10,marginBottom:3,width:15,height:15}} name="ic_up"></Icon>
                    </View>
                    <View style={{flex:1,flexDirection:'row',marginLeft:15}}>
                        {hasGuarantee?<Text style={{fontSize:12,color:constants.colors.textLight}}>{guarantee}</Text>:null}
                    </View>
                </TouchableOpacity>
                {hasCancel?
                    <TouchableOpacity
                        style={{width:100,justifyContent:'center',alignItems:'center',backgroundColor:constants.colors.backBody}}
                        onPress={()=>this.cancelButtonEvent()}>
                        <Text style={{color:constants.colors.text}}>取消订单</Text>
                    </TouchableOpacity> : null
                }
                {hasSure?
                    <TouchableOpacity
                        style={{width:100,justifyContent:'center',alignItems:'center',backgroundColor:constants.colors.orange}}
                        onPress={()=>this.sureButtonEvent()}>
                        <Text style={{color:'white'}}>{mode.title}</Text>
                    </TouchableOpacity> : null
                }
            </View>
        )
    }
}
