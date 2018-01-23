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
import moment from 'moment';
import {Dimensions} from "react-native";
let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

export default class PlaneOrder extends React.Component {
    render() {
        const {data} = this.props;
        const {flightDynamic} = this.props;
        let onlineFlight=false;
        let today= moment().format('YYYY-MM-DD');
        let tomorrow=moment().add(1,'d').format('YYYY-MM-DD');
        if(data.departDate==today || data.departDate==tomorrow){
            onlineFlight=true;
        }
        return (

            <View style={styles.container}>

                <TouchableOpacity onPress={this._toToOrderDetail.bind(this,data)} activeOpacity={1}>
                <View style={styles.ticketBox}>
                    <View style={styles.ticket}>
                        <View style={styles.ticketIntro}>
                            <View style={{paddingLeft:10,paddingRight:10,}}>
                            {data.toCity?
                                <View style={{height:44,marginTop:10}}>
                                    <View style={{flexDirection:'row',}}>
                                        <View style={{flexDirection:'row',flex:6}}>
                                            <Text style={{color:'#666'}}>{data.toCity}</Text>
                                            <Text>{this._personJourneyDays()}</Text>
                                        </View>
                                        <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end'}}>
                                            <Text style={{textAlign:'right'}}>{data.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:5}}>
                                        <Text style={{color:'#666',flex:8}}>{data.reason}</Text>
                                        {data.detailId?
                                            <TouchableOpacity style={{paddingTop:2,paddingBottom:2,paddingLeft:2,flex:2}} onPress={this._turnToShen.bind(this,data)}>
                                                <Text style={{color:'#449ff7',fontSize:12,textAlign:'right'}}>联查申请单</Text>
                                            </TouchableOpacity>:
                                            <View></View>
                                        }
                                    </View>

                                </View>:
                                <View></View>
                            }

                            <View style={[styles.flexRow,styles.marT]}>
                                <View style={{flex:2,flexDirection:'row'}}>
                                    <Text style={styles.textColor}>{this._departDatemd()}</Text>
                                    <Text style={[styles.textLitteColor,styles.textPL]}>{this._pripub()}</Text>
                                    <Text style={styles.textColor}>{data.companion}人</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row',flex:1}}>
                                <View style={{flex:3}}>
                                        <Text style={styles.timeTextBigMoreFont}>{data.departTime}</Text>
                                        <Text style={styles.textBigMoreFont}>{data.departCity}</Text>
                                    <View>
                                        <Text style={[styles.textBigFont,styles.airPortText]}>
                                            {data.departStation}
                                            {data.departTerminalName}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flex:6}}>
                                    <View style={{paddingTop:6}}>
                                        <Text style={{color:'#666',textAlign:'center',fontSize:12}}>
                                            {data.airlineName}
                                            <Text style={{color:'#666'}}> {data.flightNo}</Text>
                                        </Text>

                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                        <View style={styles.littleLine}></View>
                                    </View>
                                    <View style={styles.line}>

                                    </View>
                                    <Text style={{color:'#666',textAlign:'center',fontSize:12}}>{this._useTime()}</Text>

                                </View>
                                <View style={{flex:3,flexWrap: 'nowrap',flexDirection: 'column'}}>
                                    <Text style={[styles.textRight,styles.timeTextBigMoreFont]}>
                                        {data.arriveTime}
                                        <Text style={{color:'#ffb400',fontSize:12}}>{this._difTime()}</Text>
                                    </Text>
                                    <Text style={[styles.textRight,styles.textBigMoreFont]}>{data.arriveCity}</Text>
                                    <View>
                                        <Text style={[styles.textRight,styles.textBigFont,styles.airPortText]}>
                                            {data.arriveStation}
                                            {data.arriveTerminalName}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            </View>
                            <View style={styles.flightBottom}>
                                {flightDynamic?
                                    <TouchableOpacity onPress={this._trunFlightDynamic.bind(this,data)} style={{flex:2,}}>
                                        <View style={{height:22,marginTop:5}}>
                                            <Text style={styles.txtBottom}>航班动态</Text>
                                        </View>
                                    </TouchableOpacity>:
                                    <View></View>

                                }
                                {onlineFlight &&
                                <TouchableOpacity onPress={this._onlineFlight.bind(this)} style={{flex:2}}>
                                    <View style={styles.onlineFlight}>
                                        <Text style={styles.txtBottom}>在线值机</Text>
                                    </View>
                                </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </View>

                        <Image
                            style={{position:'absolute',top:0,left:(Dimensions.get('window').width-30)*0.5,marginLeft:-15}}
                            source={require('../img/travelPlaneIcon.png')}
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
    _useTime(){
        let departDate = this.props.data.departDate;
        let deparTime = this.props.data.departTime;
        let arriveDate = this.props.data.arriveDate;
        let arriveTime = this.props.data.arriveTime;
        let departD = moment(departDate+' '+deparTime);
        let arriveD = moment(arriveDate+' '+arriveTime);
        let useT = arriveD-departD;
        let useH = Math.floor((useT%(24*3600*1000))/(3600*1000))+Math.floor(useT/(24*3600*1000))*24;
        let useM = Math.floor((useT%(24*3600*1000))%(3600*1000)/(60*1000));

        return useH+'时'+useM+'分';
        //return useTime(this.props.data.departDate,this.props.data.departTime,this.props.data.arriveDate,this.props.data.arriveTime);
    }
    _difTime(){
        let departDate = this.props.data.departDate;
        let deparTime = this.props.data.departTime;
        let arriveDate = this.props.data.arriveDate;
        let arriveTime = this.props.data.arriveTime;
        let departD = moment(departDate+' '+deparTime);
        let arriveD = moment(arriveDate+' '+arriveTime);
        let useT = arriveD-departD;
        let useDays = Math.floor((useT/(24*3600*1000)));
        if(useDays>0){
            return '+'+useDays;
        }else{
            return '';
        }
        //return '+'+useDays;

    }
    //出发月日
    _departDatemd(){
        let departDate = this.props.data.departDate;
        let dMonth = parseInt(departDate.substring(5,7));
        let dDay = parseInt(departDate.substring(8,10));
        return dMonth+'月'+dDay+'日'
    }
    _toToOrderDetail(data){
        if(typeof YYRNBridgeModule.baiduLogEvent=='function'){
            YYRNBridgeModule.baiduLogEvent('order_frtravman','点击行程中事项跳转到订单详情');//百度统计App事件
        }
        let opt = {
            orderId:data.orderId,
            orderType:data.type,
            orderDepartDate:data.departDate,
            creater:data.createrId
        }
        return YYRNBridgeModule.openDetailVCWithID(opt);
    }
    _personJourneyDays(){
        let sdDay = parseInt(this.props.data.startDate.substring(8,10));
        let edDay = parseInt(this.props.data.endDate.substring(8,10));
        return sdDay+'日—'+edDay+'日';

    }
    _trunFlightDynamic(data){
        let opts={
            arr:data.arriveAirportCode,
            flyno:data.flightNo,
            dep:data.departAirportCode,
            flydate:data.departDate
        }
        return YYRNBridgeModule.toFlightState(opts);
    }
    _turnToShen(data){
        return YYRNBridgeModule.openMissionWithID(data.applicationId);
    }
    //值机
    _onlineFlight(){
        let openUrl='http://zhiji.rsscc.com/h5checkin/?src=yongyou';
        return YYRNBridgeModule.openOnlineFlight(openUrl);
    }
    
    
}


const styles = StyleSheet.create({
    textStyle:{
        color:'black'
    },

    container:{
        backgroundColor:'#f3f3f3',
    },
    ticket:{
        overflow:'visible',
    },
    marT:{
        //marginTop:10
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
    rowType:{
        flexDirection: 'row',
    },
    ticketIntro:{
        paddingTop:10,
        backgroundColor:'#fff',
        paddingBottom:5,
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
    textRight:{
        textAlign:'right'
    },
    textBigFont:{
        fontSize:13,
        color:'#666',
        paddingTop:5
    },
    ticketType:{
        paddingLeft:10,
        //position:'absolute',
        //top:-20,
        marginTop:-15,
        alignItems:'center',

    },
    line:{
        borderStyle:'solid',
        borderBottomWidth:1,
        borderColor:'#e5e5e5',
        marginTop:3,
        marginBottom:3
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
        paddingLeft:10,
        paddingBottom:35,
        paddingTop:15,

    },
    textBigMoreFont:{
        fontSize:15,
        color:'#666',
        paddingTop:5
    },
    timeTextBigMoreFont:{
        fontSize:18,
        color:'#666',
        paddingTop:5
    },
    airPortText:{
        fontSize:12,
        color:'#333'
    },
    littleLine:{
        marginBottom:0,
        width:5,
        borderBottomWidth:1,
        borderColor:'#e5e5e5',
        borderStyle:'solid',
        transform:[{rotate: '25deg'}],
        marginBottom:-3
    },
    shenIcon:{
        backgroundColor:'#FFB400',
        borderRadius:10,
        paddingLeft:2,
        paddingRight:2,
        marginRight:3,
    },
    flightBottom:{
        flexDirection:'row',
        borderTopWidth:1,
        borderStyle:'solid',
        borderTopColor:'#e5e5e5',
        marginTop:10
    },
    onlineFlight:{
        height:22,
        marginTop:5,
        borderLeftWidth:1,
        borderStyle:'solid',
        borderLeftColor:'#e5e5e5'
    },
    txtBottom:{
        textAlign:'center',
        color:'#333',
        fontSize:12,
        lineHeight:18
    }

})
