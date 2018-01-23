/*
 created by liqiankun on 16/9/3
 * */

import React from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
    PixelRatio
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {evaluate_taxi_price, updateTaxi} from '../actions';
import BlackPoint from '../common/BlackPoint';
import HollowCircle from '../common/HollowCircle';
import TaxiOrder from '../TaxiOrder';
import AddressButton from '../common/AddressButton';
import PoiSearchModule from '../native/PoiSearchModule';
import NativeModule from '../native/NativeModule';
import {
    getCityEvent,selectPlaceEvent
} from '../../native'
import {getCityList} from '../common/ApiRequest'

class Taxi extends React.Component {
    constructor(props) {
        super(props);
        this._onDelete = this._onDelete.bind(this)
        this._onClickButton = this._onClickButton.bind(this);
        this.props.setDeleteFunc(this._onDelete);
        this._updateTaxi = bindActionCreators(
            taxi => updateTaxi(this.props.tripId, this.props.id, taxi),
            this.props.dispatch);
    }

    _onDelete() {
        // callback from cotainer
        return 0 == this.props.status ? true : false;
    }

    _onClickButton() {
        if (this.props.canSubmit) {
            const props = this.props;
            const {navigator} = props;
            //call detail page
            navigator.push({
                ...props,
                updateTaxi: this._updateTaxi.bind(this),
                name: 'TaxiOrder',
                component: TaxiOrder
            });
        }
    }


    _toEndPlace(response) {
        // this._setLoadingVisible(false)
        this.cars = response
        let object = {
            cityId: this.props.to ? this.props.to.cityId : null,
            cityName: this.props.to ? this.props.to.city : null,
            lat: this.props.to ? this.props.to.latitude : null,
            lng: this.props.to ? this.props.to.longitude : null,
            location: this.props.to ? this.props.to.address : null,
            cars: response,
            searchAddress: true,
            carType: 'to',
        }
        if (selectPlaceEvent) {
            selectPlaceEvent(object, (err, result)=> {
                const to = {
                    address: result.location,
                    latitude: result.lat,
                    longitude: result.lng,
                    cityId: result.cityId,
                    city: result.cityName,
                };
                this._updateTaxi({to});
                this._estimate();
            })
        }
    }

    _toStartPlace(response) {
        // this._setLoadingVisible(false)
        this.cars = response
        let object = {
            cityId: this.props.from ? this.props.from.cityId : null,
            cityName: this.props.from ? this.props.from.city : null,
            lat: this.props.from ? this.props.from.latitude : null,
            lng: this.props.from ? this.props.from.longitude : null,
            location: this.props.from ? this.props.from.address : null,
            cars: response,
            searchAddress: true,
            carType: 'from',
        }
        if (selectPlaceEvent) {
            selectPlaceEvent(object, (err, result)=> {
                const from = {
                    address: result.location,
                    latitude: result.lat,
                    longitude: result.lng,
                    cityId: result.cityId,
                    city: result.cityName,
                };
                this._updateTaxi({from});
                this._estimate();
            })
        }
    }

    /**
     * 选择地点
     * @param type
     * @private
     */
    _poiSearch = type => {
        const search = Platform.OS === 'ios' ? NativeModule : PoiSearchModule;
        if (type == 'to') {

            if (this.cars) {
                this._toEndPlace(this.cars)
            } else {
                let param = {
                    type: 'end',
                    serviceId: (this.props.pickUpResult && this.props.pickUpResult.serviceId ) ? this.props.pickUpResult.serviceId : 14,
                }
                getCityList(param, (response) => {
                    this._toEndPlace(response)
                }, (error) => {
                    this._toEndPlace([])
                })
            }

            // search.search(this.props.to.city, this.props.to.address, result => {
            //     const to = {
            //         address: result.key,
            //         latitude: result.latitude,
            //         longitude: result.longitude,
            //     };
            //     this._updateTaxi({to});
            //     this._estimate();
            // });
        } else if (type == 'from') {

            if (this.cars) {
                this._toStartPlace(this.cars)
            } else {
                let param = {
                    type: 'start',
                    serviceId: (this.props.pickUpResult && this.props.pickUpResult.serviceId ) ? this.props.pickUpResult.serviceId : 14,
                }
                getCityList(param, (response) => {
                    this._toStartPlace(response)
                }, (error) => {
                    this._toStartPlace([])
                })

            }

            // search.search(this.props.from.city, this.props.from.address, result => {
            //     const from = {
            //         address: result.key,
            //         latitude: result.latitude,
            //         longitude: result.longitude,
            //     };
            //     this._updateTaxi({from});
            //     this._estimate();
            // });
        }
    }

    /**
     * 选择机场
     * @param type
     * @private
     */
    _airPlane = type => {
        const {cityId} = this.props.from;
        const param = {cityId};
        const search = Platform.OS === 'ios' ? NativeModule : PoiSearchModule;
        if (type == 'to') {
            search.searchAirplane(cityId, param, result => {
                const to = {
                    address: result.name,
                    city: result.city,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    code: result.code,
                    terminalCode: result.terminalCode,
                };
                this._updateTaxi({to});
                this._estimate();
            });
        } else if (type == 'from') {
            search.searchAirplane(cityId, param, result => {
                const from = {
                    address: result.name,
                    city: result.city,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    code: result.code,
                    terminalCode: result.terminalCode,
                };
                this._updateTaxi({from});
                this._estimate();
            });
        }
    }

    _estimate() {
        if (this.props.from.longitude && this.props.to.longitude) {
            this.props.dispatch(evaluate_taxi_price(this.props.tripId, this.props.id));
        }
    }


    _onClickFromAddress() {
        if (!this.props.enabled) {
            return () => {};
        }
        switch (this.props.type) {
            case 1:
                return this._poiSearch.bind(this, 'from');
            case 3:
                return this._airPlane.bind(this, 'from');
            default:
                return () => {};
        }
    }

    _onClickToAddress() {
        if (!this.props.enabled) {
            return () => {};
        }
        switch (this.props.type) {
            case 1:
                if (this.props.pickUpResult
                    && this.props.pickUpResult.serviceId
                    && this.props.pickUpResult.serviceId == 13) {
                    return this._poiSearch.bind(this, 'to');
                }
                return this._airPlane.bind(this, 'to');
            case 3:
                return this._poiSearch.bind(this, 'to');
            default:
                return () => {};
        }
    }
        
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.item, styles.item_top, styles.item_height, styles.item_paddingTop,{marginTop:0,borderTopLeftRadius:5,}]}>
                    <View style={{width:12,height:12,borderWidth:1,borderColor:'#ffb400',borderRadius:100}}></View>
                   <AddressButton
                       address={this.props.from.address ? this.props.from.address : '请选择上车地点'}
                       onClick={this._onClickFromAddress()}>
                   </AddressButton>
                </View>

                <View style={[styles.PL_mix]}>

                    <BlackPoint/>

                    <View style={[styles.line, styles.line_center]}/>

                </View>

                <View style={[styles.item, styles.item_height, styles.item_paddingTop]}>

                    <View style={{width:12,height:12,borderWidth:1,borderColor:'#4da4f7',borderRadius:100}}></View>

                    <AddressButton
                        address={this.props.to.address ? this.props.to.address : '请选择下车地点'}
                        onClick={this._onClickToAddress()}>
                    </AddressButton>
                </View>
                <View style={styles.bottom_container}>
                    <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                        <Text style={{color: '#ed7140', fontSize: 16}}>¥{this.props.pickUpResult.price}</Text>
                        <Text style={{color: '#666666', fontSize: 11}}>预计</Text>
                    </View>

                    <TouchableHighlight style={[styles.appointment_touch,{backgroundColor:this.props.canSubmit ? '#ed7140' : '#f3f3f3'}]}
                                        onPress={this._onClickButton}>
                        <Text style={[styles.appointment_button,{color:this.props.canSubmit ? 'white' : '#e0e0e0'}]}>
                            {this.props.orderId ? this.props.statusText : '提交并预约'}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>

        );
    }
}

export default connect()(Taxi);

const styles=StyleSheet.create({
    container: {
        flexDirection:'column',
        flex:1,
        borderLeftWidth:1,
        borderColor:'#c6c6c6',
        paddingTop:22,
        paddingBottom:40,
    },
    traficlabel_container:{
        backgroundColor:'#f3f3f3',
        height:30,
        flex:10,
        flexDirection:'row',
        alignItems:'flex-end',
    },
    traficlabel_container_left:{
        flex:9,
        alignSelf:'flex-end',
        paddingBottom:-12,
    },
    traficlabel_container_right:{
        flex:1,

    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginLeft:10,
		paddingLeft:15,
    },

    itemText: {
        fontSize: 15,
        margin: 2
    },

    item_height: {
        height: 50,
    },

    item_top: {
        marginTop: 20,
    },

    item_left: {
        marginLeft: 18,
    },

    item_paddingTop: {
        paddingTop: 0,
    },

    item_text_normal: {
        alignItems: 'center',
        textAlign: 'left',
        fontSize: 14,
        color: '#333333'
    },

    item_text_gary: {
        color: 'gray',
    },

    item_text_boardingtime: {
        color: '#feebe6',
    },
    PL_mix:{
    	flexDirection: 'row', 
    	backgroundColor: 'white', 
    	paddingLeft: 20, 
    	height: 20,
        marginLeft:10
    },
    line: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        height: 1/PixelRatio.get(),
        marginLeft: 18,
        marginRight: 18,
    },

    line_center: {
        alignSelf: 'center',
    },

    point: {
        backgroundColor: '#333333',
        width: 2,
        height: 2,
        borderRadius: 100,
        marginTop: 2,
        marginLeft:15
    },
    appointment_button: {
        fontSize: 13,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    appointment_touch: {
        
        width: 110,
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
        marginLeft:10,
        justifyContent: 'space-between',
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        marginTop:-1
    },
    address_text: {
        textAlign: 'left',
        fontSize: 14,
        color: '#333333',
        marginLeft: 18,
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 1,

    },
    address_button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    item_column: {
        flexDirection: 'column',
        marginLeft: 28
    },

    end_point: {
        backgroundColor: '#449ff7',
    },

    start_point: {
        backgroundColor: '#ffb400'
    }
});