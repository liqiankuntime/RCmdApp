/**
 * Created by haosha on 16/9/1.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import {connect} from 'react-redux';
import Airplane from './airplaneCard';
import Train from './trainCard';
import {recommendTripsByTraffic, submitTrafficOrder, visibleMoreView} from '../actions';
import {baiduLogEvent} from '../../native/';

class Traffic extends Component {
    constructor(props) {
        super(props);
        this._onDelete = this._onDelete.bind(this);
        this.props.setDeleteFunc(this._onDelete);
        this._onSwitch = this._onSwitch.bind(this);
        this.props.setTabFunc(this._onSwitch);
        this._onMore = this._onMore.bind(this);
        this._callback = this._callback.bind(this);
    }

    _onDelete() {
        // callback from cotainer
        return 0 == this.props.status ? true : false;
    }

    _track(event,type){
        if (baiduLogEvent){
            baiduLogEvent(event,type);
        }
    }

    _onSwitch(oldCode, newCode) {
        if (this.props.enabled) {

            switch (newCode){
                case 'flight':
                    this._track('intelrec_airtic_switch','机票切换');
                    break;
                case 'train':
                    this._track('intelrec_traintic_switch','火车切换');
                    break;
            }
            return true;
        }
        return false;
    }

    _callback(item, status, orderId, statusText) {
        // call native order detail
        this.props.dispatch(
            submitTrafficOrder(
                this.props.tripId,
                this.props.id,
                this.props.selected,
                item,
                status,
                orderId,
                statusText
            )
        );
    }

    _onMore(){
        if (this.props.enabled) {


            const {tripId, id, selected} = this.props;
            switch (selected){
                case 'hotel':
                    this._track('intelrec_hotel_down','酒店下拉');
                    break;
                case 'flight':
                    this._track('intelrec_airtic_down','机票下拉');
                    break;
                case 'train':
                    this._track('intelrec_traintic_down','火车下拉');
            }
            this.props.dispatch(visibleMoreView(tripId, id, true));
        }
    }

    _renderTicket() {
        const {flight, train, passengers, visitors, orderId, status, statusText} = this.props;
        switch (this.props.selected) {
            case 'flight':
                return (<Airplane
                    ticket={flight}
                    orderId={orderId}
                    status={status}
                    statusText={statusText}
                    passengers={passengers}
                    visitors={visitors}
                    canSubmit={this.props.canSubmit}
                    callback={this._callback}
                    onMore={this._onMore}/>);
            case 'train':
                return (<Train
                    ticket={train}
                    orderId={orderId}
                    status={status}
                    statusText={statusText}
                    passengers={passengers}
                    visitors={visitors}
                    canSubmit={this.props.canSubmit}
                    callback={this._callback}
                    onMore={this._onMore} />);
            default:
                return (<View></View>);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderTicket()}
            </View>
        );
    }
}

export default connect()(Traffic);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderLeftWidth: 1,
        borderColor: '#c6c6c6',
        paddingTop:20,
        paddingBottom:40,
    },

});