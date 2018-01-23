/**
 * Created by chenty on 16/9/5.
 */
import React, {Component} from 'react';
import
{
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    NativeModules,
    TouchableHighlight
} from 'react-native';
import AirplaneItem from './airplaneItem';
import {submitTrafficOrder} from '../actions';
import {baiduLogEvent} from '../../native/';

class AirplaneCard extends Component {
    constructor(props) {
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }

    _renderButton(){
        return (
            <TouchableOpacity onPress={this.props.onMore} style={{marginTop:10}}>
                <Text style={{
                    flex: 2,
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#666666',
                    }}><Image source={require('../img/launch.png')} style={{width:16,height:16}}></Image></Text>
            </TouchableOpacity>
        )
    }
    _track(event,type){
        if (baiduLogEvent){
            baiduLogEvent(event,type);
        }
    }
    _onSubmit() {
        if (this.props.canSubmit) {
            this._track('intelrec_airtic_book','机票预订');
            const ticket = this.props.ticket;
            let param = {...ticket};
            param.passengers = this.props.passengers;
            param.visitors = this.props.visitors;
            if (NativeModules.NativeModule.orderFlightTicketEvent){
                NativeModules.NativeModule.orderFlightTicketEvent(this.props.orderId,this.props.status,param,(error,result)=>{
                    if (result){
                        const origin = this.props.ticket;
                        const ticket = {...origin, companion: result.companion};
                        this.props.callback(ticket, result.status, result.orderNo, result.statusText);
                    }
                })
            }
        }
    }

    render() {
        let {ticket} = this.props;
        return (
            <View style={styles.container}>
               <AirplaneItem ticket={ticket} Button={this._renderButton.bind(this)}/>
                <View style={styles.bottom_container}>
                    <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                        <Text style={{color: '#ed7140', fontSize: 16}}>
                            ¥{ticket.RealPrice*ticket.companion || 1234}
                        </Text>
                    </View>
                    <TouchableHighlight style={[styles.appointment_touch,{backgroundColor:this.props.canSubmit ? '#ed7140' : '#f3f3f3'}]}
                                        underlayColor='#ed7140'
                                        onPress={this._onSubmit}
                        >
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
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
		marginLeft:10,
		borderRadius:5,
		shadowColor:'#e1e1e1',
    },
    item: {
        backgroundColor: 'white',

        flexDirection: 'row',

        //justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,

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
        borderRadius:5,
    },

});


export default AirplaneCard;