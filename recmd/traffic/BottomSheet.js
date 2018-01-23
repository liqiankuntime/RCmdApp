/**
 * Created by huangzhangshu on 16/9/5.
 */

'use strict'

import React from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ListView,
    Image,
    Modal,
    Platform,
    NativeModules,
    InteractionManager
} from 'react-native';
import NavigationBarAndroid from '../native/NavigationBarAndroid';
import AirplaneItem from './airplaneItem';
import TrainItem from './trainItem';
import HotelItem from '../hotel/HotelItem';
import {baiduLogEvent} from '../../native/';
import {
    ITEM_TRAFFIC,
    ITEM_HOTEL
} from '../common/comm';

class BottomSheet extends React.Component {
    constructor(props) {
        super(props);
        var {height, width} = Dimensions.get('window')
        this._datasource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        const {tripId, id, selected} = this.props;
        switch (this.props.type) {
            case ITEM_HOTEL:
                this._callback = item => this.props.updateHotelItem(tripId, id, item);
                break;
            default:
                this._callback = item => this.props.updateTrafficItem(tripId, id, selected, item);
        }
        this.state = {
            top: new Animated.Value(height),
            opacity: new Animated.Value(0),
            bottom: 0,
            left: 0,
            right: 0,
            content_height: 500,
            bar_height: 0,
            device: {
                width: width,
                height: height,
            },
            current: ''
        }
        if (Platform.OS === 'android' && NavigationBarAndroid) {
            NavigationBarAndroid.getNavbarHeight((err, height) => {
                this.setState({
                    bar_height: height / 3,
                })
            })
        }
    }

    componentWillMount() {
        this.handle_ = InteractionManager.createInteractionHandle();
    }

    componentDidMount() {
        this._openAnimated();
    }

    componentWillUnmount() {
        InteractionManager.clearInteractionHandle(this.handle_);
    }

    _openAnimated = () => {
        var commonConfig = {
            duration: 500,
        }
        Animated.timing(
            this.state.top,
            {toValue: this.state.device.height - this.state.content_height, ...commonConfig}
        ).start();
        Animated.timing(
            this.state.opacity,
            {toValue: 0.5, ...commonConfig}
        ).start();
    }

    _closeAnimated = () => {
        var commonConfig = {
            duration: 500,
        }
        Animated.timing(
            this.state.top,
            {toValue: this.state.device.height, ...commonConfig}
        ).start();
        Animated.timing(
            this.state.opacity,
            {toValue: 0.1, ...commonConfig}
        ).start();

        setTimeout(() => this.props.visibleMoreView(
            this.props.tripId,
            this.props.id,
            false),
            50
        );
    }

    _popupBackground = () => {
        var background = {
            top: this.state.top,
            bottom: 0,
            left: 0,
            right: 0,
            height: this.state.content_height,
            width: this.state.device.width,
        };
        return {};
        return background;
    }

    _areaBackground = () => {
        var background = {
            opacity: this.state.opacity,
        }
        return background;
    }

    _getRowData() {
        let data = [];
        if (this.props.id) {
            const {morning, afternoon, evening, selected} = this.props;
            if (morning && morning[selected]) {
                data.push({
                    code: 'morning',
                    item: morning,
                    status: this.state.current == 'morning' ? true : false
                });
            }
            if (afternoon && afternoon[selected]) {
                data.push({
                    code: 'afternoon',
                    item: afternoon,
                    status: this.state.current == 'afternoon' ? true : false
                });
            }
            if (evening && evening[selected]) {
                data.push({
                    code: 'evening',
                    item: evening,
                    status: this.state.current == 'evening' ? true : false
                });
            }
        }
        return data;

    }

    _checkRow = (code) => {
        this.setState({
            current: code == this.state.current ? '' : code
        });
    }

    _renderTicket(item) {
        const {flight, train} = item;
        switch (this.props.selected) {
            case 'flight':
                return <AirplaneItem ticket={flight} />;
            case 'train':
                return <TrainItem ticket={train} />;
            default:
                return <View />;
        }
    }

    _renderHotel(item) {
        return <HotelItem hotel={item.hotel} />;
    }

    _renderRow(rowData,sectionId,rowId) {
        return (
            <View key={rowData.code} style={[styles.row_container]}>
                <TouchableOpacity onPress={() => this._checkRow(rowData.code)} style={{flex:1,flexDirection:'row'}}>
                    <View  style={{flex: 10,paddingTop:5}}>
                        {rowData.item.type == 4 ? this._renderHotel(rowData.item) : this._renderTicket(rowData.item)}
                    </View>
                    <View style={{alignSelf: 'center',flex:1,paddingTop:30}}>
                        <Image source={rowData.status ? require('../img/ic_multiple_selected.png') : require('../img/ic_multiple_select.png')}
                            style={{height: 25, width: 25}}>
                        </Image>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _moreFlightsEvent(json,callback){
        this._closeAnimated();
        let param = new Object();
        param.pubpri = json.pubpritype;
        param.toCity = json.cityTo;
        param.fromCity = json.cityFrom;
        param.departDate = json.departDate;
        param.from = json.flight.from;
        param.to = json.flight.to;
        param.companion = json.companion;
        param.passengers = json.passengers;

        NativeModules.NativeModule.flightListEvent(param,(error,result)=>{
            if (result){
                callback(result)
            }
        })
    }
    _navigate(json,callback){
        this._closeAnimated();
        let {hotel} = json;
        let budget = hotel.budget>0?hotel.budget:9999;

        let param ={
            appName:'HotelApp',
            initial:'HotelsList',

            search:{
                pubpritype :hotel.pubpritype,
                cityId:hotel.to.cityId,
                lat: hotel.to.lat,
                location:hotel.to.location,
                lng: hotel.to.lng,
                startDate:hotel.startDate,
                endDate:hotel.endDate,
                highRate:budget,

            }

        };

        NativeModules.NativeModule.navigate(param,(error,result)=>{
            if (result){
                let {startDate,endDate,hotel} = result;
                hotel.startDate = startDate;
                hotel.endDate = endDate;
                callback(hotel)
            }
        })
    }
    _track(event,type){
        if (baiduLogEvent){
            baiduLogEvent(event,type);
        }
    }
    _moreEvent(json,callback){
        this._closeAnimated();
        switch (this.props.selected) {
            case 'hotel':
                this._track('intelrec_hotel_more','酒店更多');
                this._navigate(json,callback);
                break;
            case 'flight':
                this._track('intelrec_airtic_more','机票更多');
                this._moreFlightsEvent(json,callback);
                break;
            case 'train':
                this._track('intelrec_traintic_more','火车更多');
                this._moreTrainsEvent(json,callback);
                break;
            default:
                this._track('intelrec_traintic_more','火车更多');
                this._moreTrainsEvent(json,callback);
                break;
        }


    }
    _moreTrainsEvent(json,callback){
        this._closeAnimated();
        let param = new Object();
        param.pubpritype = json.pubpritype;
        param.toCity = json.cityTo;
        param.fromCity = json.cityFrom;
        param.startDate = json.departDate;
        param.passengers = json.passengers;

        NativeModules.NativeModule.trainListEvent(param,(error,result)=>{
            if (Platform.OS === 'android'){
                result = JSON.parse(result);
            }
            if (result){
                let train ={
                    can_web_buy:result.can_web_buy,
                    control_day:result.control_day,
                    sale_time:result.sale_time,
                    from:{
                        'time': result.from_time,

                        'station': result.from_station,

                    },
                    to :{
                        'time': result.to_time,

                        'station': result.to_station,

                    },
                    from_station_type:result.from_station_type,
                    to_station_type:result.to_station_type,
                    seat_bookable:result.seat_bookable,
                    "seat_name":result.seat_name,
                    "train_number": result.train_number,
                    "seat_price": result.seat_price,
                    "from_date": result.from_date,
                    "use_time": result.use_time,
                    "train_no": result.train_no,
                    "type_code": result.type_code,
                    "day_diff":result.day_diff,

                };
                callback(train)
            }
        })


    }

    _onConfirm() {
        this._closeAnimated();
        const current = this.state.current;
        if (current && this.props[current]) {
            const item = this.props[current];
            if (item[this.props.selected]) {
                const selectedItem = item[this.props.selected];
                InteractionManager.runAfterInteractions(() =>this._callback(selectedItem));
            }
        }
    }

    _renderFooter() {
        return(
            <View style={{
                flexDirection: 'column',
                height: 37,

            }}>

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={()=>this._moreEvent(this.props,this._callback)}
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center' }}
                        >
                        <Text>更多行程</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#ea7242',
                            justifyContent: 'center',
                            alignItems: 'center'}}
                        onPress={() => this._onConfirm()}
                        >
                        <Text style={{color: 'white'}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        var popupBackground = this._popupBackground();
        var areaBackground = this._areaBackground();
        return (
            <View style={{flex: 1, flexDirection:'column',justifyContent:'flex-end',backgroundColor: 'transparent'}}>
                <TouchableWithoutFeedback onPress={this._closeAnimated} style={{zIndex: 1}}>
                    <Animated.View style={[styles.popover, areaBackground]}></Animated.View>
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.container]}
                >
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <ListView
                            style={{flex: 1,marginLeft: 15, marginRight: 15}}
                            dataSource={this._datasource.cloneWithRows(this._getRowData())}
                            renderRow={(rowData,sectionId,rowId) => this._renderRow(rowData,sectionId,rowId)}
                            renderSeparator={(sectionID, rowID) =>
                                (<View
                                    style={{
                                    width: this.state.device.width,
                                    height: 1,
                                    backgroundColor: '#e5e5e5',
                                    marginTop: 20,
                                    }}
                                    key={"sectionID_"+sectionID+"_rowID_"+rowID}
                                    />)}
                            enableEmptySections={true}
                            renderFooter={this._renderFooter.bind(this)}
                        />
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //position: 'absolute',
        backgroundColor: 'white',
        //zIndex: 2,
        flexDirection: 'column',

        justifyContent:'flex-end'
    },
    popover: {
        //zIndex: 2,
        backgroundColor: 'black',
        shadowColor: 'black',
        // shadowOffset: {width: 0, height: 2},
        // shadowRadius: 2,
        // shadowOpacity: 0.8,
        flex: 1,
    },


    row_container: {
        flex: 1,
        flexDirection: 'row',
        //paddingTop: 18,
    },
    item: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    item_center: {
        alignItems: 'center',
    },
    item_right: {
        alignItems: 'flex-end',
    }
})

module.exports = BottomSheet;