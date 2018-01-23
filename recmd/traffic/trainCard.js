/**
 * Created by chenty on 16/9/5.
 */

import React, {Component} from 'react';
import {StyleSheet, View,Image, Text, TouchableOpacity, TouchableHighlight, NativeModules} from 'react-native';
import DayDiff from '../common/DayDiff';
import UseTime from '../common/UseTime';
import TrainItem from './trainItem';
import {baiduLogEvent} from '../../native/';
let NativeModule = NativeModules.NativeModule;

class TrainCard extends Component {
    constructor(props) {
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }
    _track(event,type){
        if (baiduLogEvent){
            baiduLogEvent(event,type);
        }
    }
    _onSubmit() {
        let trainOrderParam={};
        let theTicket = this.props.ticket;
        let passengers = this.props.passengers;
        let visitors = this.props.visitors;
        let orderId = this.props.orderId;
        let status = this.props.status;

        if (this.props.canSubmit) {
            this._track('ntelrec_traintic_book','火车票预订');
            if(NativeModule.orderTrainTicketEvent){
                //跳转火车票提交订单界面
                trainOrderParam={
                    from_time:theTicket.from.time,
                    from_station:theTicket.from.station,
                    train_date:theTicket.from.Date,
                    train_number:theTicket.train_number,
                    use_time:theTicket.use_time,
                    to_time:theTicket.to.time,
                    to_station:theTicket.to.station,
                    seat_name:theTicket.seat_name,
                    seat_price:theTicket.seat_price,
                    pubpritype:theTicket.pubpritype,
                    passengers:passengers,
                    visitors:visitors,
                    recommenToTrain:true,
                    day_diff:theTicket.day_diff,
                    train_no:theTicket.train_no,
                    type_code:theTicket.type_code,
                    orderId:orderId,
                    status:status,
                }
                NativeModule.orderTrainTicketEvent(trainOrderParam,(error,result)=>{
                    if(result){
                        if(typeof result =='object'){
                            this.props.ticket.companion = result.companion;
                            this.props.callback(this.props.ticket, result.status, result.orderId, result.statusText);
                        }else if(typeof result =='string'){
                            let theresult = JSON.parse(result);
                            this.props.ticket.companion = theresult.companion;
                            this.props.callback(this.props.ticket, theresult.status, theresult.orderId, theresult.statusText);
                        }

                    }
                });
            }

        }

    }

    _renderButtons(){
        return (
            <TouchableOpacity
                style={[styles.item, styles.item_height]} onPress={this.props.onMore}>
                <Text style={{
                    flex: 4,
                    fontSize: 14,
                    textAlign: 'left'
                }}> </Text>
                <Text style={{
                    flex: 2,
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#666666',
                }}><Image source={require('../img/launch.png')} style={{width:13,height:13}}></Image></Text>
                <Text style={{
                    flex: 4,
                    fontSize: 14,
                    textAlign: 'right'
                }}>

                </Text>

            </TouchableOpacity>
        )
    }

    render() {
        let {ticket} = this.props;
        return (
            <View  style={styles.container}>
                <TrainItem ticket={ticket} Button={this._renderButtons.bind(this)}/>
                <View style={styles.bottom_container}>
                    <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                        <Text style={{color: '#ed7140', fontSize: 16}}>
                            ¥{ticket.seat_price*ticket.companion || 1234.56}
                        </Text>

                    </View>

                    <TouchableHighlight style={[styles.appointment_touch,{backgroundColor:this.props.canSubmit ? '#ed7140' : '#f3f3f3'}]}
                                        underlayColor='#ed7140'
                                        onPress={this._onSubmit}>
                        <Text style={[styles.appointment_button,{color:this.props.canSubmit ? 'white' : '#666'}]}>
                            {this.props.orderId ? this.props.statusText : '提交订单'}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginLeft:10,
    },
    item: {
        backgroundColor: 'white',

        flexDirection: 'row',

        //justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,

    },
    item_height: {
        height: 30,
    },
    appointment_button: {
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    appointment_touch: {
        backgroundColor: '#ed7140',
        width: 100,
        height: 27,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    bottom_container: {
        backgroundColor: 'white',
        height: 44,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
    },

});

export default TrainCard;