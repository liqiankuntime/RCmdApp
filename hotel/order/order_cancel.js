/**
 * Created by shane on 16/10/20.
 */
import React from 'react'
import {
    View,
    Text,
    Alert,
    Linking,
    TouchableOpacity,
} from 'react-native'

import Icon from '../common/Icon'
import {travelUrl, Api, Network, MessageBox } from '../../common/utils';
import constans from '../common/constants'
import HotelDetail from '../roomList/HotelDetail'
import {showOrderLoading,cancelOrder,updateOrderDetail} from '../actions';
import {callEvent,toHotelMap} from '../../native'

export default class Cancel extends React.Component{
    constructor(props){
        super(props)
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

    hotelMapEvent() {
        const {lat, lng, hotelName, hotelAddress} = this.props.data;
        if (toHotelMap)
            toHotelMap(Number(lat), Number(lng), hotelName, hotelAddress)
    }

    hotelCallEvent(){
        this.makeCall(this.props.data.hotelPhone)
    }

    hotelDetailEvent(){
        if (this.props.detail){
            this.toHotelDetail(this.props.detail)
        }
        else {
            this.props.dispatch(showOrderLoading(true, false));
            const {cityId, cityName, startDate, endDate, hotelId, roomTypeId, ratePlanId} = this.props.data;
            const param = JSON.stringify({cityId, cityName, startDate, endDate, hotelId, roomTypeId, ratePlanId});
            const url = travelUrl + Api.hotel.hotelDetail + '?param=' + param;
            return Network.get(url,
                response => {
                    this.props.dispatch(updateOrderDetail(response));
                    this.toHotelDetail(response);
                },
                error => {
                    this.toHotelDetail(this.props.data.ratePlan.hotel);
                })
                .then(() => {
                    this.props.dispatch(showOrderLoading(false, false));
                });
        }
    }

    toHotelDetail(detail) {
        this.props.navigator.push({
            name: 'HotelDetailContainer',
            component: HotelDetail,
            passProps: {
                detail: detail
            }
        })
    }

    render(){
        const hotelAddress = this.props.data.hotelAddress;
        const hotelTraffic = this.props.data.traffic;
        return(
            <View style={{flexDirection:'column',marginTop:8,backgroundColor:'white'}}>
                <TouchableOpacity style={{flexDirection:'row',marginLeft:10,marginRight:10,alignItems:'center'}} onPress={()=>this.hotelMapEvent()}>
                    <Icon style={{width:22,height:22}} name="ic_hotel_map"></Icon>
                    <View style={{flex:1,flexDirection:'column',marginLeft:5,marginTop:12}}>
                        <Text style={{fontSize:16,color:constans.colors.text}} numberOfLines={2}>{hotelAddress}</Text>
                        <Text style={{fontSize:12,color:constans.colors.textLight,marginTop:3}} numberOfLines={1}>{hotelTraffic}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',marginRight:0,}}>
                        <Icon style={{}} name="right_arrow"></Icon>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1,flexDirection:'row',height:40}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.hotelCallEvent()}>
                        <Text style={{color:constans.colors.backNavi,fontSize:12}}>酒店电话</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>this.hotelDetailEvent()}>
                        <Text style={{color:constans.colors.backNavi,fontSize:12}}>酒店详情</Text>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:constans.colors.line,height:1}}/>
            </View>
        )
    }
}

/**
 <View style={{flexDirection:'row',height:70,justifyContent:'center',alignItems:'center'}}>
 <View style={{flex:1}}>
 </View>
 <View style={{flex:1}}>
 <TouchableOpacity
 style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:5,marginRight:35,marginTop:14,marginBottom:14,backgroundColor:constans.colors.lightOrange,
                                borderRadius:5}}
 onPress= {()=>this.cancelEvent()}
 >
 <Text style={{color:'white',fontSize:16}}>取消订单</Text>
 </TouchableOpacity>
 </View>

 </View>
 */
