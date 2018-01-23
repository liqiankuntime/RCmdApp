/**
 * Created by huosz on 16/10/17.
 */

import React from 'react'
import {
    View,
    Alert,
} from 'react-native'

import {connect} from 'react-redux'
import Order from './order'
import Header from './common/Header';
import {navigatorEvent,autoBookHotelOrder} from '../native';

class HotelOrder extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={{flex:1}}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={()=>this.naviEvent()}
                    title={this.props.billId>0?'酒店订单详情':'酒店订单填写'}
                />
                <Order {...this.props}/>
            </View>

        )
    }

    naviEvent (){
        //this.props.initial == "HotelsList" && this.props.order.data.id>0
        if (this.props.initialRoute == "RoomList" && this.props.order.data.id>0) {
            this.props.order.detail = undefined;
            this.props.order.data = undefined;
            if (autoBookHotelOrder) {
                let obj = {
                    orderId:this.props.order.data.id,
                    status:1,
                    statusText:this.props.order.data.orderStatus,
                    startDate:this.props.order.data.startDate,
                    endDate:this.props.order.data.endDate,
                };
                autoBookHotelOrder(obj)
            }
        }
        else if (this.props.initialRoute == "HotelOrder"){
            this.props.order.detail = undefined;
            this.props.order.data = undefined;
            if (navigatorEvent) {
                navigatorEvent();
            }
        }
        else if (this.props.initialRoute == "HotelsList"){

        }
        else{
            if (this.props.order.data.id==0){
                Alert.alert(
                    '提示',
                    '订单未完成,确定要离开吗?',
                    [
                        {text: '取消'},
                        {text:'确定', onPress: ()=>{this.naviPopEvent()}}
                    ]
                )
            }
            else
                this.naviPopEvent()
        }

    }

    naviPopEvent(){
        this.props.navigator.pop();
        this.props.order.detail = undefined;
        this.props.order.data = undefined;
    }
}


function mapStateToProps(state) {
    return {
        order: state.order,
    }
}

export default connect(mapStateToProps)(HotelOrder);