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
    TouchableOpacity
} from 'react-native';
import Communications from 'react-native-communications';
import getdepartDate from '../common/getDepartDate';
import {Dimensions} from "react-native";

let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

export default class HotelOrder extends React.Component {
    render() {
        const {data} = this.props;
        //const {style} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._toToOrderDetail.bind(this,data)}>
                <View style={styles.ticketBox}>
                    <View style={styles.ticket}>
                        <View style={styles.ticketIntro}>
                            <View style={{flexDirection: 'row',marginTop:10,paddingBottom:2}}>
                                <Text style={{flex:1,color:'#666'}}>{data.toCity}</Text>
                                <Text style={{flex:1,textAlign:'right',color:'#666'}}>{data.staffName}</Text>
                            </View>
                        </View>

                    </View>
                    <Image
                        style={{position:'absolute',top:0,left:(Dimensions.get('window').width-30)*0.5,marginLeft:-15}}
                        source={require('../img/travelHotelIcon.png')}
                    />
                </View>
                    </TouchableOpacity>
            </View>
        )
    }
    _showDate(){
        return getdepartDate(this.props.data.departDate);
    }
    _pripub(){
        if(this.props.data.pubpritype == 'pri'){
            return '因私';
        }else if(this.props.data.pubpritype == 'pub'){
            return '因公';
        }
    }
    //入住时间(月日)
    _departDatemd(){
        let departDate = this.props.data.departDate;
        let dMonth = parseInt(departDate.substring(5,7));
        let dDay = parseInt(departDate.substring(8,10));
        return dMonth+'月'+dDay+'日'
    }
    //退房时间(月日)
    _checkOutDatemd(){
        let checkOutDate = this.props.data.checkOutDate;
        let dMonth = parseInt(checkOutDate.substring(5,7));
        let dDay = parseInt(checkOutDate.substring(8,10));
        return dMonth+'月'+dDay+'日'
    }
    _toToOrderDetail(data){
        if(typeof YYRNBridgeModule.baiduLogEvent=='function'){
            YYRNBridgeModule.baiduLogEvent('order_frtravman','点击行程中事项跳转到订单详情');//百度统计App事件
        }
        let opt = {
            orderId:parseInt(data.orderDetailId),
            orderType:data.type,
            creater:data.createrId
        }
        return YYRNBridgeModule.openDetailVCWithID(opt);
    }
    _hotelMap(data){
        let hotelId = data.hotelId;
        let hetelAddress = "http://m.elong.com/hotel/"+hotelId+"/map/";
        return YYRNBridgeModule.openLocationVCWithUrl(hetelAddress);
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
        backgroundColor:'#fff',
        paddingBottom:10,
        borderBottomWidth:1,
        borderColor:'#BDBDBD',
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
        marginTop:-10
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
        paddingBottom:25,
        paddingTop:15
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
        // borderStyle:'solid'

    },
    flexRow:{
        flexDirection:'row',
    },
    textColor:{
        color:'#999',
        fontSize:12
    },
    textBigFont:{
        fontSize:17,
        color:'#666',
    },
    textMiddleFont:{
        fontSize:13,
        color:'#666',
        //lineHeight:24,
    },
})
