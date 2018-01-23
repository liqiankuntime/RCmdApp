/**
 * Created by chenty on 2016/10/27.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    TouchableHighlight,
    Image

} from 'react-native';
import {connect} from 'react-redux';
import HotelItem from './HotelItem';
import {recommendTaxiByTraffic, submitHotelOrder, visibleMoreView} from '../actions';
import {navigate} from '../../native/';
class Hotel extends React.Component {

    _onSubmit() {
        if (this.props.canSubmit) {
            const {tripId, id, dispatch} = this.props;
            this._navigate(this.props, (json)=> {
                console.log(json);
                const hotelItem = {
                    startDate: json.startDate,
                    endDate: json.endDate
                };
                dispatch(submitHotelOrder(tripId, id, hotelItem, json.status, json.orderId, json.statusText));
            })

        }
    }

    _navigate(json, callback) {

        const {hotel, orderId: billId} = json;
        const initial = json.orderId ? 'HotelOrder' : 'RoomList';
        let param = {
            appName: 'HotelApp',
            initial,
            billId,
            ...hotel

        };

        if (navigate) {
            navigate(param, (error, result)=> {
                if (result) {
                    callback(result)
                }
            })
        }
    }

    _renderButton() {
        return (
            <TouchableOpacity onPress={this.onMore.bind(this)} style={{marginTop: 10}}>
                <Text style={{
                    flex: 2,
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#666666',
                }}>
                    <Image source={require('../img/launch.png')} style={{width: 13, height: 13}}></Image>
                </Text>
            </TouchableOpacity>
        )
    }

    onMore() {
        let {enabled, tripId, id, dispatch} = this.props;
        if (enabled) {
            dispatch(visibleMoreView(tripId, id, true));
        }
    };

    render() {
        let {hotel}=this.props;


        return (
            <View style={{marginTop: 20,borderLeftWidth:1,borderColor:'#c6c6c6',paddingLeft:10}}>
                <HotelItem hotel={hotel}/>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderBottomWidth:1,
                    borderColor:'#e5e5e5',
                    paddingBottom:10,
                }}>
                    {this._renderButton()}

                </View>
                <View style={styles.bottom_container}>
                    <View style={{flexDirection: 'row', alignSelf: 'center',alignItems:'flex-end'}}>

                            <Text style={styles.lowRate}>{`¥${hotel.lowRate}`}</Text>
                            <Text style={{fontSize:12,alignSelf:'flex-end',color:'#ed7140',marginBottom:1}}>起</Text>

                    </View>

                    <TouchableHighlight
                        style={[styles.appointment_touch, {backgroundColor: this.props.canSubmit ? '#ed7140' : '#f3f3f3'}]}
                        underlayColor='#ed7140'
                        onPress={this._onSubmit.bind(this)}>

                            <Text style={[styles.appointment_button, {color: this.props.canSubmit ? 'white' : '#666'}]}>
                                {this.props.orderId ? this.props.statusText : '预定'}
                            </Text>


                    </TouchableHighlight>
                </View>
            </View>

        )
    }

}

const styles = StyleSheet.create({


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
        height: 35,
        borderRadius: 6,
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
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    lowRate: {
        color: '#ed7140',
        fontSize: 16,
        textAlign:'right'
    },

});
export default connect()(Hotel);