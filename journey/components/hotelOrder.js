/**
 * Created by yonyou on 16/7/6.
 */
import React from 'react';
import {NativeModules} from 'react-native';//ios原生混编react native
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import Communications from 'react-native-communications';
import {Dimensions} from "react-native";

let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

export default class HotelOrder extends React.Component {
    render() {
        const {data} = this.props;
        //const {style} = this.props;
        //data.order_hotel_phone='0107898765';
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._toToOrderDetail.bind(this,data)} activeOpacity={1}>
                <View style={styles.ticketBox}>
                    <View style={styles.ticket}>
                        <View style={styles.ticketIntro}>
                            <View style={[styles.flexRow,styles.marT]}>
                                <Text style={styles.textLitteColor}>
                                    <Text>{this._departDatemd()}</Text>
                                    <Text>至</Text>
                                    <Text>{this._checkOutDatemd()}</Text>
                                </Text>
                                <Text style={[styles.textColor,styles.textPL]}>{this._pripub()}</Text>
                                <Text style={styles.textColor}>{data.companion}人</Text>
                            </View>

                            <View style={{paddingTop:5,flexDirection: 'row',flexWrap:'wrap'}}>
                                {Platform.OS=='ios'?
                                <View style={{flex: 1}}>
                                    <Text style={styles.textBigFont} numberOfLines={2}>
                                        {data.order_hotel_name}
                                        {data.order_hotel_phone || data.order_hotel_phone==''?
                                            <TouchableOpacity onPress={() => Communications.phonecall(data.order_hotel_phone, true)}
                                                              style={{height:15,width:15,paddingTop:3,marginLeft:10}}>
                                                <Image
                                                    source={require('../img/Phone.png')}
                                                    style={{width:15,height:15}}

                                                />
                                            </TouchableOpacity>:
                                            <View></View>
                                        }
                                    </Text>
                                </View>:
                                    <View style={{flex: 1,flexDirection:'row'}}>
                                        <Text style={[styles.textBigFont]} numberOfLines={2}>
                                            {this._interceptTitleLength()}
                                        </Text>
                                        <View>
                                            {data.order_hotel_phone || data.order_hotel_phone==''?
                                                <TouchableOpacity onPress={() => Communications.phonecall(data.order_hotel_phone, true)}
                                                                  style={{height:15,width:15,paddingTop:0,marginLeft:10}}>
                                                    <Image
                                                        source={require('../img/Phone.png')}
                                                        style={{width:15,height:15}}

                                                    />
                                                </TouchableOpacity>:
                                                <View></View>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={{paddingTop:5,flexWrap:'wrap'}}>
                                {Platform.OS == 'ios' ?
                                    <View>
                                        <Text style={styles.textMiddleFont}>
                                            {data.address}
                                            <TouchableOpacity onPress={this._hotelMap.bind(this,data)}
                                                              style={{height:15,width:15,paddingTop:3,marginLeft:5}}>
                                                <Image
                                                    source={require('../img/map.png')}
                                                    style={{width:15,height:15}}
                                                />
                                            </TouchableOpacity>
                                        </Text>
                                    </View> :
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[styles.textMiddleFont]}>
                                            {this._interceptTextLength()}
                                        </Text>
                                        <View>
                                            <TouchableOpacity onPress={this._hotelMap.bind(this,data)}
                                                              style={{height:15,width:15,paddingTop:0,marginLeft:5}}>
                                                <Image
                                                    source={require('../img/map.png')}
                                                    style={{width:15,height:15}}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>

                            <View style={{paddingTop:5}}>
                                <Text style={styles.textMiddleFont}>
                                    {data.order_room_name}  最晚{data.order_time_later}入住
                                </Text>
                            </View>
                        </View>

                    </View>
                    <Image
                        style={{position:'absolute',top:0,left:(Dimensions.get('window').width-30)*0.5,marginLeft:-18}}
                        source={require('../img/travelHotelIcon.png')}
                    />
                </View>
                    </TouchableOpacity>
            </View>
        )
    }

    _pripub(){
        if(this.props.pubPriType == 'pub'){
            return '因公';
        }else{
            return '因私';
        }
    }
    //入住时间(月日)
    _departDatemd(){
        let departDate = this.props.data.order_checkin_date;
        let dMonth = parseInt(departDate.substring(5,7));
        let dDay = parseInt(departDate.substring(8,10));
        return dMonth+'月'+dDay+'日'
    }
    //退房时间(月日)
    _checkOutDatemd(){
        let checkOutDate = this.props.data.order_checkout_date;
        let dMonth = parseInt(checkOutDate.substring(5,7));
        let dDay = parseInt(checkOutDate.substring(8,10));
        return dMonth+'月'+dDay+'日'
    }
    _toToOrderDetail(data){
        if(typeof YYRNBridgeModule.baiduLogEvent=='function'){
            YYRNBridgeModule.baiduLogEvent('order_frtravman','点击行程中事项跳转到订单详情');//百度统计App事件
        }

        let opt = {
            orderId:parseInt(data.id),
            orderType:data.type,
            creater:data.createrId
        }
        return YYRNBridgeModule.openDetailVCWithID(opt);
    }
    _hotelMap(data){
        let hotelId = data.order_hotel_id;
        let hetelAddress = "http://m.elong.com/hotel/"+hotelId+"/map/";
        return YYRNBridgeModule.openLocationVCWithUrl(hetelAddress);
    }
    _interceptTextLength(){
        let result='';
        if(this.props.data.address.length>18){
            result = this.props.data.address.substring(0,19)+'...';
        }else{
            result=this.props.data.address;
        }
        return result;
    }
    _interceptTitleLength(){
        let result='';
        if(this.props.data.order_hotel_name.length>12){
            result = this.props.data.order_hotel_name.substring(0,13)+'...';
        }else{
            result=this.props.data.order_hotel_name;
        }
        return result;
    }
}

const styles = StyleSheet.create({
    textStyle:{
        color:'black'
    },
    container:{
        backgroundColor:'#f3f3f3',
        //paddingRight:10
    },
    rowType:{
        flexDirection: 'row',
    },
    ticketIntro:{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:14,
        backgroundColor:'#fff',
        paddingBottom:10,
        borderBottomWidth:1,
        borderColor:'#e5e5e5',
        borderStyle:'solid',
        borderLeftWidth:1,
        borderLeftColor:'#E1E1E1',
        borderStyle:'solid',
        borderRightWidth:1,
        borderRightColor:'#E1E1E1',
        borderStyle:'solid',
        borderRadius: 3,
    },
    marT:{
        //marginTop:10
    },
    ticketType:{
        paddingLeft:10,
        //position:'absolute',
        //top:-10,
        marginTop:-15,

    },
    date:{
        height:18,
        backgroundColor:'#ffb400',
        borderRadius: 3,
        paddingTop:1,
        paddingLeft:10,
        paddingRight:10,


    },
    whiteText:{
        color:'white',
        fontSize:12
    },
    ticketBox:{
        borderLeftWidth:1,
        borderColor:'#e5e5e5',
        borderStyle:'solid',
        marginLeft:5,
        paddingLeft:5,
        paddingBottom:35,
        paddingTop:18
    },
    ticket:{
        //backgroundColor:'white',
        //borderRadius: 3,
        //marginTop:5,
        //paddingRight:10,
        //paddingLeft:10,
        //paddingBottom:5,
        //position:'relative'
        overflow:'visible',
        // shadowColor:'#E1E1E1',
        // shadowOffset:{height:0,width:0},
        // shadowOpacity:1,
        // shadowRadius:5,
        // borderBottomWidth:1,
        // borderColor:'#BDBDBD',
        // borderStyle:'solid',
        // borderLeftWidth:1,
        // borderLeftColor:'#E1E1E1',
        // borderStyle:'solid',
        // borderRightWidth:1,
        // borderRightColor:'#E1E1E1',
        // borderStyle:'solid',
        // paddingBottom:10

    },
    flexRow:{
        flexDirection:'row',
    },
    textColor:{
        color:'#999',
        fontSize:11
    },
    textLitteColor:{
        color:'#999',
        fontSize:10
    },
    textPL:{
        paddingLeft:5,
        paddingTop:1
    },
    textLitteColor:{
        color:'#999',
        fontSize:10
    },
    textPL:{
        paddingLeft:5,
        paddingTop:1
    },
    textBigFont:{
        fontSize:17,
        color:'#666',
    },
    textMiddleFont:{
        fontSize:13,
        color:'#333',
        //lineHeight:24,
    },
    flex1:{
        flex:1
    }

})
