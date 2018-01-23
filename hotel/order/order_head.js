/**
 * Created by shane on 16/10/20.
 */
import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    Image,
    TextInput,
    Linking,
} from 'react-native'

import {getDate} from '../common/comm'
import Icon from '../common/Icon'
import {travelUrl, Api, Network, MessageBox } from '../../common/utils';
import constans from '../common/constants'
import {showOrderLoading,updateOrderDetail} from '../actions';
import RoomDetail from './RoomDetail'
import constants  from '../common/constants'
const windowWidth = constants.window.width

export default class Head extends React.Component {
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

    callEvent(){
       if (this.props.data.supplierCode==='hrs') {
           this.makeCall('4007201388');
       }
       else
           this.makeCall('4009333333');
    }

    roomDetailEvent(){
            if (this.props.detail){
                this.toRoomDetail(this.props.detail.rooms[0]);
            }
            else {
                this.props.dispatch(showOrderLoading(true, false));
                const {cityId, cityName, startDate, endDate, hotelId, roomTypeId, ratePlanId} = this.props.data;
                const param = JSON.stringify({cityId, cityName, startDate, endDate, hotelId, roomTypeId, ratePlanId});
                const url = travelUrl + Api.hotel.hotelDetail + '?param=' + param;
                return Network.get(url,
                    response => {
                        this.props.dispatch(updateOrderDetail(response));
                        this.toRoomDetail(response.rooms[0]);
                    },
                    error => {
                        this.toRoomDetail(this.props.data.ratePlan.hotel.rooms[0]);
                    })
                    .then(() => {
                        this.props.dispatch(showOrderLoading(false, false));
                    });
            }
    }

    toRoomDetail(roomInfo) {
        this.props.navigator.push({
            name: 'RoomDetailContainer',
            component: RoomDetail,
            passProps: {
                roomInfo: roomInfo,
            }
        })
    }

    getBreakfast(num){
        switch (num) {
            case 0:
                return '不含早餐';
                break;
            case 1:
                return '含单早';
                break;
            case 2:
                return '含双早';
                break;
            default:
                return '不含早餐';
                break;
        }

    }

    render() {
        const data = this.props.data;
        const ratePlan = data.ratePlan==undefined?{}:data.ratePlan;
        const name = data.hotelName;
        const startDate = getDate(data.startDate);
        const endDate = getDate(data.endDate);
        const dayCount = '共'+data.dayCount+'晚';
        const roomType = data.roomTypeName+'     '+this.getBreakfast(ratePlan.breakfast);
        const supplierName = '服务商-'+data.supplierName;
        const orderStatus = data.id>0?data.orderStatus:'';
        return(
            <View style={{backgroundColor:constans.colors.orange}}>
                <View style={style.zero}>
                    <View style={style.one}>
                        <Text style={{flex:1,fontSize:18,color:constans.colors.text}}>{name}</Text>
                    </View>
                    <View style={style.two}>
                        <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end'}}>
                            <Text style={{color:constans.colors.textLight,fontSize:12}}>入住</Text>
                            <Text style={{color:constans.colors.text,fontSize:16}}>{startDate}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end'}}>
                            <Text style={{color:constans.colors.textLight,fontSize:12}}>离店</Text>
                            <Text style={{color:constans.colors.text,fontSize:16}}>{endDate}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                            <Text style={{color:constans.colors.text,fontSize:16}}>
                                {dayCount}
                            </Text>
                        </View>
                    </View>
                    <View style={style.three}>
                        <View style={{maxWidth:windowWidth-90}}>
                            <Text style={{color:constans.colors.text,fontSize:14}} numberOfLines={1}>{roomType}</Text>
                        </View>
                        <Text style={{flex:1,textAlign:'right',fontSize:14,color:constans.colors.backNavi}}>{orderStatus}</Text>
                    </View>
                    <View style={style.four}>
                        <Text style={style.text}>{supplierName}</Text>
                        <TouchableOpacity onPress={()=>this.callEvent()}>
                            <Icon style={{marginLeft:5,width:24,height:24}} name="ic_call"></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{flex:1,marginLeft:30,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}
                            onPress={()=>this.roomDetailEvent()}
                        >
                            <Text style={{color:constans.colors.backNavi,fontSize:12}}>房型详情</Text>
                            <Icon style={{marginLeft:10,width:9,height:15}} name="ic_hotel_address"></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

}

const style = StyleSheet.create({
    zero:{
        flexDirection:'column',
        marginLeft:7,
        marginRight:7,
        backgroundColor:'white',
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },
    one:{
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
    },
    two:{
        marginTop:22,
        flexDirection:'row',
        marginLeft:15,
        marginRight:15,
    },
    three:{
        marginTop:5,
        flexDirection:'row',
        marginLeft:15,
        marginRight:15,
    },
    four:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        marginBottom:15
    },
    text:{
        color:constans.colors.text,
        fontSize:14
    },
    textLight:{
        color:constans.colors.textLight,
        fontSize:12
    }

})