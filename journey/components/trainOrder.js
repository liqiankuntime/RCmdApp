/**
 * Created by yonyou on 16/7/6.
 */
import React from 'react';
import {NativeModules} from 'react-native';//ios/android原生混编react native
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
let YYRNBridgeModule = NativeModules.YYRNBridgeModule;
import moment from 'moment';
import {Dimensions} from "react-native";
export default class TrainOrder extends React.Component {

    render() {
        const {data} = this.props;
        //const {style} = this.props;
        return (

            <View style={styles.container}>
                <TouchableOpacity onPress={this._toToOrderDetail.bind(this,data)} activeOpacity={1}>
                    <View style={styles.ticketBox}>
                        <View style={styles.ticket}>
                            <View style={styles.ticketIntro}>
                                {data.toCity?
                                    <View style={{height:44,marginTop:10}}>
                                        <View style={{flexDirection:'row',}}>
                                            <View style={{flexDirection:'row',flex:6}}>
                                                <Text style={{color:'#666'}}>{data.toCity}</Text>
                                                <Text style={{color:'#666'}}>{this._personJourneyDays()}</Text>
                                            </View>
                                            <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end'}}>
                                                <Text style={{textAlign:'right'}}>{data.name}</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',marginTop:5}}>
                                            <Text style={{color:'#666',flex:8}}>{data.reason}</Text>
                                            {data.detailId?
                                                <TouchableOpacity style={{paddingTop:2,paddingBottom:2,paddingLeft:2,flex:2}} onPress={this._turnToShen.bind(this,data)}>
                                                    <Text style={{color:'#449ff7',fontSize:12,textAlign:'right'}}>申请单</Text>
                                                </TouchableOpacity>:
                                                <View></View>
                                            }
                                        </View>
                                    </View>:
                                    <View></View>
                                }
                            <View style={[styles.flexRow,styles.marT]}>
                                    <Text style={styles.textColor}>{this._departDate()}</Text>
                                    <Text style={[styles.textLitteColor,styles.textPL]}>{this._pripub()}</Text>
                                    <Text style={styles.textColor}>{data.companion}人</Text>
                            </View>
                            <View style={{flexDirection: 'row',flex:1}}>
                                <View style={{flex:3}}>
                                    <Text style={styles.timeTextBigMoreFont}>{data.departTime}</Text>
                                    <Text style={styles.textBigFont}>{data.departStation}</Text>
                                </View>
                                <View style={{flex:6}}>
                                    <View style={{paddingTop:8}}>
                                        <Text style={{color:'#666',textAlign:'center',fontSize:12}}>
                                            {data.trainNo}
                                            <Text>  {data.seatNo}</Text>
                                            <Text>  {data.seatname}</Text>
                                        </Text>

                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                        <View style={styles.littleLine}></View>
                                    </View>
                                    <View style={styles.line}>
                                    </View>
                                    <Text style={{color:'#666',textAlign:'center',fontSize:12}}>{this._useTime()}</Text>

                                </View>
                                <View style={{flex:3}}>
                                    <Text style={[styles.timeTextBigMoreFont,styles.textRight]}>
                                        {data.arriveTime}
                                        <Text style={{color:'#ffb400',fontSize:12}}>{this._difTime()}</Text>
                                    </Text>
                                    <Text style={[styles.textBigFont,styles.textRight]}>{data.arriveStation}</Text>

                                </View>
                            </View>
                            </View>
                        </View>
                        <Image
                            style={{position:'absolute',top:0,left:(Dimensions.get('window').width-30)*0.5,marginLeft:-15}}
                            source={require('../img/travelTrainIcon.png')}
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
    //历时
    _useTime(){
        let departDate = this.props.data.departDate;
        let deparTime = this.props.data.departTime;
        let arriveDate = this.props.data.arriveDate;
        let arriveTime = this.props.data.arriveTime;
        let departD = moment(departDate+' '+deparTime);
        let arriveD = moment(arriveDate+' '+arriveTime);
        let useT = arriveD-departD;
        let useH = Math.floor((useT%(24*3600*1000))/(3600*1000));
        let useM = Math.floor((useT%(24*3600*1000))%(3600*1000)/(60*1000));
        return useH+'时'+useM+'分';
    }
    //间隔日
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
    //出发日期
    _departDate(){
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
            creater:data.createrId
        }
        return YYRNBridgeModule.openDetailVCWithID(opt);
    }
    _personJourneyDays(){
        //console.log(this.props.data);
        let sdDay = parseInt(this.props.data.startDate.substring(8,10));
        let edDay = parseInt(this.props.data.endDate.substring(8,10));
        return sdDay+'日—'+edDay+'日';

    }
    _turnToShen(data){
        return YYRNBridgeModule.openMissionWithID(data.applicationId);
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
    whiteText:{
        color:'white',
        fontSize:12
    },
    rowType:{
        flexDirection: 'row',
    },
    ticketIntro:{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
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
    ticketType:{
        paddingLeft:10,
        //position:'absolute',
        //top:-10,
        marginTop:-15,
    },
    marT:{
        //marginTop:10
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
    ticketBox:{
        borderLeftWidth:1,
        borderColor:'#e5e5e5',
        borderStyle:'solid',
        marginLeft:5,
        paddingLeft:5,
        paddingBottom:35,
        //paddingTop:5
        paddingTop:15,
    },
    ticket:{
        backgroundColor:'white',
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
    textRight:{
        textAlign:'right'
    },
    textBigFont:{
        fontSize:13,
        color:'#333',
        paddingTop:5
    },
    textBigMoreFont:{
        fontSize:16,
        color:'#666',
        paddingTop:5
    },
    timeTextBigMoreFont:{
        fontSize:18,
        color:'#666',
        paddingTop:5
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
        //paddingTop:2,//ios device
        //paddingBottom:2,//ios device
        //marginTop:3,
        marginRight:3,
        //width:10,
        //height:10
    },

})
