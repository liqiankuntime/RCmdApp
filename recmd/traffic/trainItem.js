/**
 * Created by chenty on 16/9/5.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import DayDiff from '../common/DayDiff';
import UseTime from '../common/UseTime';
import {getDate} from '../common/comm';

class TrainItem extends Component {
    constructor(props) {
        super(props);

    }

    _renderButtons() {
        return (
            <View></View>
        )
    }
    _isHighLight(ticket){
        return ticket.Date < ticket.travelDate;
    }
    render() {
        let {ticket, Button} = this.props;
        if (Button == undefined) {
            Button = this._renderButtons.bind(this);
        }
        return (
            <View style={styles.container}>
                <View
                    style={[styles.item, {borderRadius:5,paddingTop:15}]}>
                    <View style={{marginRight:3}}>
                        <Text style={{fontSize:12,color:this._isHighLight(ticket)?'red':'#999'}}>
                            {getDate(ticket.from.Date)}
                        </Text>
                    </View>
                    <View>
                        <Text style={{fontSize:12,color:'#999',marginLeft:0}}>
                            {(ticket.pubpritype == 'pub' ? '因公' : '因私') + ticket.companion}人
                        </Text>
                    </View>
                    <Text style={{flex: 3, textAlign: 'right',color:'#666'}}>¥{ticket.seat_price}元/人</Text>
                </View>
                <View
                    style={[styles.item, styles.item_height]}>
                    <Text style={{flex: 3, fontSize: 18,marginLeft:-4}}> {ticket.from.time}</Text>
                    <Text style={{
                        flex: 5,
                        color: '#999',
                        textAlign: 'center',
                        fontSize:12
                    }}> {ticket.train_number}座位{ticket.seat_name}</Text>
                    <Text style={{flex: 3, fontSize: 18, textAlign: 'right',marginLeft:-4}}>{ticket.to.time}</Text>
                    <DayDiff days={ticket.day_diff}></DayDiff>
                </View>

                <View
                    style={[styles.item, {height: 8}]}>
                    <View style={{flex: 3}}></View>
                    <View style={[styles.line, styles.line_center]}/>
                    <View style={styles.littleLine}></View>
                    <View style={{flex: 3}}></View>
                </View>
                <View
                    style={[styles.item, {height: 20}]}>
                    <Text style={{flex: 3, fontSize: 16,marginLeft:-4}}> {ticket.from.station}</Text>

                    <UseTime minutes={ticket.use_time}/>
                    <Text style={{flex: 3, fontSize: 16,textAlign: 'right',marginLeft:-4}}>{ticket.to.station}</Text>

                </View>
                <Button/>


            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        borderRadius:5,
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

    line: {
        flex: 3,
        backgroundColor: '#e5e5e5',
        height: 1,
        marginLeft: 18,
        marginRight: 18,
    },

    line_center: {
        alignSelf: 'center',
    },

    appointment_button: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    appointment_touch: {
        backgroundColor: '#ed7140',
        width: 69,
        height: 30,
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
    },
    littleLine:{
        width:5,
        borderBottomWidth:1,
        borderColor:'#e5e5e5',
        borderStyle:'solid',
        transform:[{rotate: '30deg'}],
        marginBottom:3,
        marginLeft:-23
    },

});

export default TrainItem;