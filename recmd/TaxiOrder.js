/**
 * Created by huangzhangshu on 16/8/29.
 * 用车界面 涉及到快车、专车、接送机
 * ps 代码因为写的早，没用redux 后期可以考虑重构代码
 */

import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Linking,
    Alert,
    Dimensions,
    Keyboard,
    AsyncStorage,
} from 'react-native';
import Constants from './taxiOrder/constant';
import CarItem from './taxiOrder/CarItem';
import HollowCircle from './common/HollowCircle';
import AddressButton from './common/AddressButton';
import {
    postEstimate,
    createOrder,
    getOrderdetail,
    bd2gcj,
    cancelOrder,
    orderPayment,
    getCityList,
    getNearbycars,
    getAddtionalRule,
    getRange,
    linkage,
    getDepartmentById,
    getProjectById,
    getDisburseById,
} from './common/ApiRequest';
import NativeModule from './native/NativeModule';
import DatePicker from './common/picker/index';
import PoiSearchModule from './native/PoiSearchModule';
import Loading from './common/Loading';
import {mergeFromAndTo} from './common/comm';
import {
    selectPlaceEvent, selectCityEvent, openContactInformation,
    toDriverMap, getFileByType, getUserinfo, baiduLogEvent
} from '../native'
import {alertShow} from '../common/Alert';
import images from '../hotel/images';
import TimeSwitch from './common/TimeSwitch';
import {travelUrl, Network, Api} from '../common/utils';

var currentDate = new Date()
let hour = currentDate.getHours() < 10 ? ('0' + currentDate.getHours()) : currentDate.getHours()
let minutes = currentDate.getMinutes() < 10 ? ('0' + currentDate.getMinutes()) : currentDate.getMinutes()
let month = (1 + currentDate.getMonth()) < 10 ? ('0' + (1 + currentDate.getMonth())) : (1 + currentDate.getMonth())
let day = (currentDate.getDate()) < 10 ? ('0' + (currentDate.getDate())) : ( currentDate.getDate())

var dateInformation = {
    time: hour + ':' + minutes,
    date: (currentDate.getFullYear()) + '-' + month + '-' + day,
    minDate: (currentDate.getFullYear()) + '-' + (currentDate.getMonth()) + '-' + (currentDate.getDate()),
}

let initDateInformation = () => {
    currentDate = new Date()
    hour = currentDate.getHours() < 10 ? ('0' + currentDate.getHours()) : currentDate.getHours()
    minutes = currentDate.getMinutes() < 10 ? ('0' + currentDate.getMinutes()) : currentDate.getMinutes()
    month = (1 + currentDate.getMonth()) < 10 ? ('0' + (1 + currentDate.getMonth())) : (1 + currentDate.getMonth())
    day = (currentDate.getDate()) < 10 ? ('0' + (currentDate.getDate())) : ( currentDate.getDate())
    dateInformation = {
        time: hour + ':' + minutes,
        date: (currentDate.getFullYear()) + '-' + month + '-' + day,
        minDate: (currentDate.getFullYear()) + '-' + (currentDate.getMonth()) + '-' + (currentDate.getDate()),
    }
}

var weekday = [
    '周一', '周二', '周三', '周四', '周五', '周六', '周日'
]
//52
const JIANYANYUAN_ID = 52
const JIANYANYUAN_ERROR = '您选择的部门、项目及报销类型不符合您公司要求，请重新修改'
const JIANYANYUAN_NAME = '北京市建筑设计研究院有限公司'

const DIDI = 'didi'; //滴滴
const SHENZHOU = 'shenzhou'; //神州
const ALL = 'all';//全部

// service id  7接机 8 送机 13预约用车(专车) 14立即用车(快车)

export default class TaxiOrder extends Component {

    constructor(props) {
        super(props);
        let items = {};
        for (let prop in props) {
            if (!props.hasOwnProperty(prop))
                continue;
            if (typeof(props[prop]) == 'function')
                continue;
            items[prop] = props[prop];
        }
        var {navigator, ...item} = items;
        item = item ? item : new Object()
        item.pickUpResult = item.pickUpResult ? item.pickUpResult : new Object()
        item.from = item.from ? item.from : new Object()
        item.to = item.to ? item.to : new Object()
        let editNo = item.pickUpResult.flightNo ? false : true
        let editFlightDate = item.pickUpResult.flightDate ? false : true
        let editCity = (this.props.to && this.props.to.cityId) ? false : true
        this.map = {
            slat: null,
            slng: null,
            elat: null,
            elng: null,
        }
        this.state = {
            item,
            passengerName: (props.pickUpResult && props.pickUpResult.passengerName) ? props.pickUpResult.passengerName : '',
            passengerMobile: (props.pickUpResult && props.pickUpResult.passengerName) ? props.pickUpResult.passengerMobile : '',
            car_style: {
                sedan_color: 'white',
                commercial_7seats_color: 'white',
                limousine_color: 'white',
                sedan_text_color: '#333333',
                commercial_7seats_text_color: '#333333',
                limousine_text_color: '#333333',
            },

            contactsId: null,
            estimate: (props.pickUpResult && props.pickUpResult.carGroups) ? props.pickUpResult.carGroups : [],
            isCarInit: true,
            total: (props.pickUpResult && props.pickUpResult.price) ? props.pickUpResult.price : 0,
            picker: null,
            carItem: null,
            carGroupId: (props.pickUpResult && props.pickUpResult.carGroupId) ? props.pickUpResult.carGroupId : null,
            carGroupType: (props.pickUpResult && props.pickUpResult.carGroupType ) ? props.pickUpResult.carGroupType : null,
            date: ((!props.orderId || props.orderId === 0) ? (props.pickUpResult && props.pickUpResult.serviceId) ? props.pickUpResult.serviceId : 14 : null) === 14 ? null : null,
            time: ((!props.orderId || props.orderId === 0) ? (props.pickUpResult && props.pickUpResult.serviceId) ? props.pickUpResult.serviceId : 14 : null) === 14 ? null : null,
            loadingVisible: true,
            orderId: props.orderId ? props.orderId : 0,
            supplierPhone: '10101111',
            showStatus: '企业支付',
            status: 0,
            isCancelable: true,
            isSubmitable: true,
            isCanPay: true,
            delayTime: 30,
            serviceId: (!props.orderId || props.orderId === 0) ? (props.pickUpResult && props.pickUpResult.serviceId) ? props.pickUpResult.serviceId : 14 : null,
            carSelect: 0,
            startTime: '',
            payStatus: '',
            initDate: true,
            cars: null,
            editNo: editNo,
            editFlightDate: editFlightDate,
            editCity: editCity,
            isTotalPrice: false,
            department: {},
            project: {},
            expenseType: {},
            departmentManager: {},
            projectManager: {},
            companyName: null,
            carNumber: null,
            carWaitTime: null,
            isShowCarSection: true,
            supplier: null,
            estimates: {},
            suppliers: [],//供应商
            bChange: false,
            isShowMap: false,
            fetchSupplierOk: true,
        }
        this.props.setBackCallback(this._backCallback.bind(this))
        this._getEstimate = this._getEstimate.bind(this)
        this._selectEstimate = this._selectEstimate.bind(this)
        this._createOrder = this._createOrder.bind(this)
        this._getContacts = this._getContacts.bind(this)
        this._getUserinfo = this._getUserinfo.bind(this)
        this._onDateChange = this._onDateChange.bind(this)
        this._poiSearch = this._poiSearch.bind(this)
        this._airPlane = this._airPlane.bind(this)
        this._renderAppointmentCar = this._renderAppointmentCar.bind(this)
        this._setLoadingVisible = this._setLoadingVisible.bind(this)
        this.refreshData = this.refreshData.bind(this)
        this._cancelOrder = this._cancelOrder.bind(this)
        this._goToPhone = this._goToPhone.bind(this)
        this._parseMonthAndDay = this._parseMonthAndDay.bind(this)
        this._selectDeplytime = this._selectDeplytime.bind(this)
        this._renderHeader = this._renderHeader.bind(this)
        this._renderAirplane = this._renderAirplane.bind(this)
        this._renderCar = this._renderCar.bind(this)
        this._toStartPlace = this._toStartPlace.bind(this)
        this._toEndPlace = this._toEndPlace.bind(this)
        this._getNearbycars = this._getNearbycars.bind(this)
        this._getAddtionalRule = this._getAddtionalRule.bind(this)
        this._getFileByType = this._getFileByType.bind(this)
        this._getFile = this._getFile.bind(this);
        this._checkDate = this._checkDate.bind(this);
        this.onCarSelect = this.onCarSelect.bind(this);
        this.getEstimates = this.getEstimates.bind(this);
        this._getContainSupplier = this._getContainSupplier.bind(this);
        this._clearEstimate = this._clearEstimate.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._goToMap = this._goToMap.bind(this);
        this.fetchSuppliers = this.fetchSuppliers.bind(this);
    }

    componentDidMount() {
        const that = this;
        const {orderId} = this.state;
        const {_setShowNav, closeLast} = this.props;
        if (closeLast) {
            _setShowNav(true);
        } else {
            if ((_setShowNav && (orderId === null || orderId === 0))) {
                _setShowNav(false);
            }
        }
        this.refreshData();

        this.interval_suppliers = setInterval(
            () => {
                if (this.state.fetchSupplierOk)
                    this.fetchSuppliers();
            }, 100
        );

        if (orderId && orderId !== 0) {
            const seconds = 10 * 1000;
            this.interval = setInterval(
                () => {
                    this.refreshData();
                }, seconds
            );
        }
    }

    fetchSuppliers() {
        const that = this;
        if (this.state.orderId !== 0) return;
        if (this.state.suppliers.length !== 0) return;
        this.state.fetchSupplierOk = false;
        const travel = travelUrl.endsWith('/') ? travelUrl.substring(0, travelUrl.length - 1) : travelUrl;
        Network.get(travel + Api.recmd.suppliers, (success) => {
            if (that.state.serviceId === 14 && !that._getContainSupplier(DIDI, success) && that._getContainSupplier(SHENZHOU, success) && that.state.orderId === 0) {
                that.setState({
                    serviceId: 13,
                })
            }
            that.setState({
                suppliers: success,
            });
            this.state.fetchSupplierOk = true;
        }, (error) => {
            this.state.fetchSupplierOk = true;
            console.log('请求服务商错误:' + error);
        });
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    _keyboardDidShow = () => {
    }

    _keyboardDidHide = () => {
        var {bChange} = this.state;
        if (bChange) {
            this.state.bChange = false;
            this._getEstimate();
        }

    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.interval_suppliers) {
            clearInterval(this.interval_suppliers);
        }
        if (this.props._setShowNav && (this.state.orderId === null || this.state.orderId === 0)) {
            const {navigator} = this.props
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                this.props._setShowNav(true)
            }
        }
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    refreshData = () => {
        if (!this.state.item.orderId) this.state.item.orderId = 0;
        if (this.state.item.orderId && this.state.item.orderId !== 0) {
            this._setLeftTitle('订单详情')
            var params = {
                orderId: this.state.item.orderId
            }
            getOrderdetail(params, response => {
                    this._setLoadingVisible(false);
                    let item = {from: {}, to: {}, pickUpResult: {}};
                    const {
                        departLng, departLat, departAddress,
                        arriveLng, arriveLat, arriveAddress,
                        carGroupId, carGroupType, carGroups,
                        passengerMobile, passengerName, serviceId,
                        id, orderNo, showStatus, status, serviceType,
                        supplierName, payStatus, flightNo, flightDate,
                        flightDepartDate, flightDelayTime, vehicleModel,
                        virtualPhonePsg, driverName, vehicleNo, totalPrice,
                        departmentName, projectName, expenseTypeName, supplierCode,
                        didiCarType, carColor, isShowMap,
                    } = response;
                    this.state.status = status;
                    this.state.vehicleNo = vehicleNo;
                    this.state.vehicleModel = vehicleModel;
                    this.state.virtualPhonePsg = virtualPhonePsg;
                    this.state.driverName = driverName;
                    this.state.delayTime = flightDelayTime;
                    this.state.payStatus = response.payStatus;
                    this.state.serviceId = response.serviceId;
                    this.state.editNo = false;
                    this.state.editCity = false;
                    this.state.editFlightDate = false;
                    this.state.initDate = false;
                    this.state.department.name = departmentName;
                    this.state.project.name = projectName;
                    this.state.expenseType.name = expenseTypeName;
                    this.state.supplierPhone = supplierName === '滴滴' ? '4000000777' : '10101111';
                    this.state.supplier = supplierCode;
                    this.state.type = didiCarType;
                    this.state.carColor = carColor;
                    this.state.isShowMap = isShowMap;
                    item.supplierName = supplierName;
                    item.serviceType = serviceType;
                    item.showStatus = showStatus;
                    item.status = status;
                    item.orderNo = orderNo;
                    item.id = this.state.item.id ? this.state.item.id : id;
                    item.carGroupType = carGroupType;
                    item.to.longitude = arriveLng;
                    item.to.latitude = arriveLat;
                    item.to.address = arriveAddress;
                    const date = (response.appointTime && response.appointTime !== '') ? response.appointTime.split(' ') : response.createTime.split(' ');
                    const time = date ? date[1].split(':') : null;
                    item.from.time = time ? time[0] + ':' + time[1] : null;
                    item.from.longitude = departLng;
                    item.from.latitude = departLat;
                    item.from.address = departAddress;
                    const pickUpResult = this.state.item.pickUpResult;
                    item.pickUpResult = {
                        ...pickUpResult,
                        carGroupId,
                        carGroupType,
                        carGroups,
                        passengerMobile,
                        passengerName,
                        serviceId,
                        flightNo,
                        flightDate,
                        flightDepartDate,
                        flightDelayTime,
                    };
                    item = mergeFromAndTo(this.state.item, item);
                    if (response.status === 3 || response.status > 6) {
                        this.state.isCancelable = false
                    } else {
                        this.state.isCancelable = true
                    }
                    this.state.isSubmitable = false
                    if (this.state.payStatus === '待支付') {
                        this.state.isCanPay = true
                    } else {
                        this.state.isCanPay = false
                    }
                    if (response.status === 9) {
                        this.state.total = totalPrice
                        this.state.isTotalPrice = true
                    }
                    var split = date;
                    this.setState({
                        date: split ? split[0] : null,
                        time: split ? split[1] : null,
                        passengerMobile: response.passengerMobile,
                        passengerName: response.passengerName,
                        total: response.status === 9 ? totalPrice : response.estimate,
                        item,
                    })
                    // this._setLeftTitle('订单详情')
                    this._setRightTitle(this.state.item.showStatus)
                    getUserinfo((result) => {
                        this.setState({
                            companyName: result.companyName
                        })
                    })
                },
                error => {
                    this._setLoadingVisible(false);
                });
        } else {
            this._setLoadingVisible(false)
            this._getUserinfo()
            getUserinfo((result) => {
                this.state.department.id = result.departmentId
                this.state.department.name = result.departmentName
                this.state.department.code = result.departmentCode
                this.state.departmentManager.id = result.departmentManager
                this.setState({
                    companyName: result.companyName
                })
            })
            if (this.state.serviceId && this.state.serviceId === 8 && this.state.item.from.Date && this.state.item.from.time) {
                this.state.date = this.state.item.from.Date ? this.state.item.from.Date : null;
                this.state.time = this.state.item.from.time ? this.state.item.from.time : null;
                var dateSplit = this.state.item.from.Date ? this.state.item.from.Date.split('-') : '';
                var timeSplit = this.state.item.from.time ? this.state.item.from.time.split(':') : '';
                var startTime = new Date()
                startTime.setFullYear(dateSplit[0])
                startTime.setMonth(dateSplit[1])
                startTime.setDate(dateSplit[2])
                startTime.setHours(Number(timeSplit[0]) + 2)
                startTime.setMinutes(timeSplit[1])

                this.state.startTime = startTime
            }
            if (this.state.item && this.state.item.pickUpResult && this.state.item.pickUpResult.carGroups) {
                if (this.state.estimate && this.state.carGroupId) {
                    for (var index = 0; index < this.state.estimate.length; index++) {
                        if (this.state.estimate[index].carGroupId === this.state.carGroupId || this.state.estimate[index].id === this.state.carGroupId) {
                            this.state.carSelect = index
                        }
                    }
                }
            } else if (this.state.item && this.state.item.from && this.state.item.from.longitude && this.state.item.from.longitude !== 0 && this.state.item.from.longitude && this.state.item.from.longitude !== 0 && this.state.orderId === 0) {
                this._getEstimate()
            }

            if (this.props.isCar && !this.props.serviceId) {
                this.setState({
                    serviceId: 7
                })
            } else if (this.props.serviceId) {
                this.setState({
                    serviceId: this.props.serviceId
                })
            }
            if (this.state.serviceId === 7 || this.state.serviceId === 8) {
                this.state.initDate = false;
            }
        }
    }

    _getContainSupplier(supplier = SHENZHOU, suppliers = this.state.suppliers) {
        if (!suppliers) suppliers = this.state.suppliers;
        if (!suppliers) suppliers = [];
        for (let item of suppliers) {
            if (item === supplier)
                return true;
        }
        return false;
    }

    /**
     * 回调函数
     * @private
     */
    _backCallback() {
        if (this.props.updateTaxi) {
            this.props.updateTaxi(this.state.item)
        }
    }

    _setRightTitle(title) {
        if (this.props.setRightTitle) {
            this.props.setRightTitle(title)
        }
    }

    _setLeftTitle(title) {
        if (this.props.setLeftTitle) {
            this.props.setLeftTitle(title)
        }
    }

    /**
     * 获取服务车型
     * @private
     */
    _getEstimate = (supplier = this.state.supplier, serviceId = this.state.serviceId) => {
        const {item, delayTime, editFlightDate, initDate, date, time, orderId} = this.state;
        const {from, to, pickUpResult} = item;
        if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) return;
        if (orderId !== 0)  return;
        if (serviceId === 7) {
            if (pickUpResult.flightNo === null || pickUpResult.flightNo === '' || pickUpResult.flightNo === undefined) return;
            let flightDate = (editFlightDate && serviceId === 7) ? (pickUpResult.flightDate) : (serviceId === 7 ? from.Date + ' ' + from.time : '');
            if (flightDate === null || flightDate === '' || flightDate === undefined) return;
            let airCode = from.ArriveCityAirportCode ? from.ArriveCityAirportCode : '';
            if (airCode === null || airCode === '' || airCode === undefined) return;
        }
        var departureTime = (date && time && !initDate) ? date + ' ' + time + ':59' : (serviceId === 8) ? date + ' ' + time + ':59' : null;
        if (departureTime) {
            var now = new Date()
            var dateSplit = date.split('-')
            var timeSplit = time.split(':')
            var timeDate = new Date(Number(dateSplit[0]), Number(dateSplit[1]) - 1, Number(dateSplit[2]), Number(timeSplit[0]), Number(timeSplit[1]), Number('59'))
            if (timeDate < now) {
                initDateInformation()
                departureTime = dateInformation.date + ' ' + dateInformation.time + ':59'
            }
        } else if (!initDate) {
            return;
        }
        var service;
        var type;
        if (serviceId === 14) {
            service = 301;
        } else if (serviceId === 13) {
            service = 201;
        }
        if (initDate) {
            type = 0;
        } else {
            type = 1;
        }

        const common = {
            slat: from.latitude,
            slng: from.longitude,
            elat: to.latitude,
            elng: to.longitude,
            flightNo: pickUpResult.flightNo,
            appointTime: departureTime,
            airCode: from.ArriveCityAirportCode ? from.ArriveCityAirportCode : '',
            flightDate: (editFlightDate && serviceId === 7) ? (pickUpResult.flightDate + ':59') : (serviceId === 7 ? from.Date + ' ' + from.time + ':59' : ''),
            flightDelayTime: serviceId === 7 ? delayTime : '',
        };
        const didi = {
            ...common,
            type,
            service,
            cityId: from.cityId,
            serviceId: service,
        };
        const shenzhou = {
            ...common,
            supplier,
            serviceId: serviceId === 13 ? initDate ? 14 : serviceId : serviceId,

        };
        var params;
        if (serviceId === 13) {
            params = {
                didi,
                shenzhou,
                supplier: ALL,
            }
        } else if (serviceId === 14) {
            params = {
                didi,
                supplier: DIDI,
            };
        } else {
            params = {
                shenzhou,
                supplier: SHENZHOU,
            };
        }
        if (params.supplier === DIDI) {
            if (!this._getContainSupplier(DIDI)) {
                return;
            }
        } else if (params.supplier === SHENZHOU) {
            if (!this._getContainSupplier(SHENZHOU)) {
                return;
            }
        }
        postEstimate(params, (response) => {
            if (typeof(response) === 'string') {
                this._clearEstimate();
                alertShow(String(response))
                return
            }
            var mSupplier;
            if (response && response[DIDI] && !response[SHENZHOU]) {
                mSupplier = DIDI;
                this.setState({supplier: DIDI});
            } else if (response && response[SHENZHOU] && !response[DIDI]) {
                mSupplier = SHENZHOU;
                this.setState({supplier: SHENZHOU});
            } else if (response) {
                var didiPrice = (response[DIDI] && response[DIDI].length > 0) ? response[DIDI][0].price : 0;
                var shenzhouPrice = (response[SHENZHOU] && response[SHENZHOU].length > 0) ? response[SHENZHOU][0].price : 0;
                if (shenzhouPrice >= didiPrice) {
                    mSupplier = DIDI;
                    this.setState({supplier: DIDI});
                } else {
                    mSupplier = SHENZHOU;
                    this.setState({supplier: SHENZHOU});
                }
            }
            var estimate;
            if (response && response[mSupplier] && response[mSupplier].length > 0) {
                this.state.total = response[mSupplier][0].price
                this.state.carGroupId = response[mSupplier][0].carGroupId
                this.state.carGroupType = response[mSupplier][0].name
                this.state.dynamic_md5 = response[mSupplier][0].dynamic_md5
                estimate = response[mSupplier];
            } else {
                this._clearEstimate();
                alertShow("没有获取到相关车型");
            }
            this.state.item.pickUpResult.price = this.state.total
            this.state.item.pickUpResult.carGroupId = this.state.carGroupId
            this.state.item.pickUpResult.carGroupType = this.state.carGroupType
            this.state.item.pickUpResult.dynamic_md5 = this.state.dynamic_md5
            this.state.item.pickUpResult.carGroups = response
            if (this.state.carItem) this.state.carItem._clearStatus()
            this.setState({
                estimate: estimate,
                estimates: response,
                isCarInit: true,
            });
        }, (error) => {
            this._clearEstimate();
            if (typeof(error) === 'string')
                alertShow(error)

        })
    }

    _getNearbycars = () => {
        let carParams = {
            slat: this.state.item.from.latitude,
            slng: this.state.item.from.longitude,
        }
        if (this.state.serviceId === 14 && this.state.initDate) {
            getNearbycars(carParams, (response) => {
                if (response && response.success && response.success.content) {
                    this.setState({
                        carNumber: response.success.content.number,
                        carWaitTime: response.success.content.shortestTimeOfArrival,
                        isShowCarSection: true,
                    })
                }
            }, (error) => {
                this.setState({
                    carNumber: null,
                    carWaitTime: null,
                })
            })
        }
    }

    /**
     * 选择车型
     * @param estimate
     * @private
     */
    _selectEstimate = (estimate, style) => {
        const {supplier} = this.state;
        var _selected;
        const carGroupType = estimate.name;
        var didi = this.getEstimates(DIDI, carGroupType) ? this.getEstimates(DIDI, carGroupType) : {};
        var shenzhou = this.getEstimates(SHENZHOU, carGroupType) ? this.getEstimates(SHENZHOU, carGroupType) : {};
        if (supplier === DIDI) {
            _selected = didi;
        } else if (supplier === SHENZHOU) {
            _selected = shenzhou;
        }
        this.setState({
            isCarInit: false,
            total: _selected.price,
            carGroupId: _selected.carGroupId ? _selected.carGroupId : _selected.id,
            carGroupType: _selected.name ? _selected.name : this.state.carGroupType,
            dynamic_md5: _selected.dynamic_md5 ? _selected.dynamic_md5 : this.state.dynamic_md5,
            car_style: style,
        })
        this.state.item.pickUpResult.price = _selected.price ? _selected.price : this.state.total
        this.state.item.pickUpResult.carGroupId = _selected.carGroupId ? _selected.carGroupId : _selected.id
        this.state.item.pickUpResult.carGroupType = _selected.name ? _selected.name : this.state.carGroupType
        this.state.item.pickUpResult.dynamic_md5 = _selected.dynamic_md5 ? _selected.dynamic_md5 : this.state.dynamic_md5
    }

    _payOrder = () => {
        this._setLoadingVisible(true);
        var params = {
            orderId: this.state.item.orderId,
        }
        orderPayment(params, (response) => {
            this._setLoadingVisible(false)
            alertShow('支付成功', () => {
                let {navigator} = this.props;
                if (navigator) {
                    let props = {
                        ...this.props,
                        orderId: this.state.orderId,
                        closeLast: true,
                    }
                    navigator.replace({
                        ...props,
                        name: 'TaxiOrder',
                        component: TaxiOrder,
                    });
                }
            })
        }, (error) => {
            this._setLoadingVisible(false)
            if (error && error.response && error.response.msg) {
                alertShow(error.response.msg)
            } else {
                alertShow('支付失败')
            }
        })
    }

    _track(event, type) {
        if (baiduLogEvent) {
            baiduLogEvent(event, type);
        }
    }


    _getAddtionalRule = () => {
        this._setLoadingVisible(true)
        let params = {
            deptcode: this.state.department.code,
            projectcode: this.state.project.code,
            businesscode: this.state.expenseType.code,
        }
        getAddtionalRule(params, (response) => {
            this._setLoadingVisible(false)
            if (response) {
                this._createOrder()
            } else {
                alertShow(JIANYANYUAN_ERROR)
            }
        }, (error) => {
            this._setLoadingVisible(false)
            alertShow(JIANYANYUAN_ERROR)
        })
    }

    /**
     * 生成订单
     * @private
     */
    _createOrder = () => {
        const that = this;
        var {passengerMobile, date, time, serviceId, initDate, supplier, item, contactsId} = this.state;
        if (!this.checkMobile(passengerMobile)) return;
        if (serviceId === 8 || serviceId === 7) initDate = false;
        this._setLoadingVisible(true);
        this._track('intelrec_car_book', '接送机预订');
        var time_new = (date && time && !initDate) ? date + ' ' + time + ':59' : null;
        if (time_new) {
            var now = new Date()
            var dateSplit = date.split('-')
            var timeSplit = time.split(':')
            var timeDate = new Date(Number(dateSplit[0]), Number(dateSplit[1]) - 1, Number(dateSplit[2]), Number(timeSplit[0]), Number(timeSplit[1]), Number('59'))
            if (timeDate < now) {
                initDateInformation()
                time_new = dateInformation.date + ' ' + dateInformation.time + ':59'
            }
        }
        var service;
        var type;
        if (serviceId === 14) {
            service = 301;
        } else if (serviceId === 13) {
            service = 201;
        }
        if (initDate) {
            type = 0;
        } else {
            type = 1;
        }
        const common = {
            appointTime: (serviceId === 14 && initDate) ? null : time_new,
            flightNo: item.pickUpResult.flightNo,
            cityId: this.state.item.from.cityId,
            departLat: this.state.item.from.latitude,
            departLng: this.state.item.from.longitude,
            arriveLat: this.state.item.to.latitude,
            arriveLng: this.state.item.to.longitude,
            departPlaceName: this.state.item.from.address,
            departAddress: this.state.item.from.address,
            arrivePlaceName: this.state.item.to.address,
            arriveAddress: this.state.item.to.address,
            passengerMobile: this.state.passengerMobile,
            passengerName: this.state.passengerName,
            carGroupId: this.state.carGroupId,
            dynamic_md5: this.state.dynamic_md5,
            carGroupType: this.state.carGroupType,
            estimate: this.state.total,
            flightDelayTime: this.state.serviceId === 7 ? this.state.delayTime : 0,
            flightDate: (this.state.serviceId === 7 && this.state.editFlightDate) ? (this.state.item.pickUpResult.flightDate) : (this.state.item.from.Date && this.state.item.from.time) ? this.state.item.from.Date + ' ' + this.state.item.from.time + ':59' : null,
            airCode: this.state.item.from.ArriveCityAirportCode,
            flightDepartDate: this.state.item.pickUpResult ? this.state.item.pickUpResult.flightDate : null,
            department: this.state.companyName === JIANYANYUAN_NAME ? this.state.department : null,
            project: this.state.project,
            expenseType: this.state.expenseType,
            departmentManager: this.state.departmentManager,
            projectManager: this.state.projectManager,
            passengerCountryCode: 86,
            pubPriType: 'pub',
            passengerStaffId: contactsId,
        };
        const didi = {
            ...common,
            supplier,
            type,
            service,
            serviceId: service,
        };
        const shenzhou = {
            ...common,
            supplier,
            serviceId: serviceId === 13 ? initDate ? 14 : serviceId : serviceId,
        };
        var params = supplier === DIDI ? didi : shenzhou;
        createOrder(params, (response) => {
            this._setLoadingVisible(false)
            this.state.item.orderId = response.id
            this.state.item.status = 1
            this.state.item.pickUpResult.carGroupId = this.state.carGroupId
            this.state.item.pickUpResult.dynamic_md5 = this.state.dynamic_md5
            this.state.item.pickUpResult.carGroupType = this.state.carGroupType
            this.state.item.pickUpResult.price = this.state.total
            const {
                departLng, departLat, departAddress,
                arriveLng, arriveLat, arriveAddress,
                carGroupId, carGroupType, carGroups,
                passengerMobile, passengerName, serviceId,
                id, orderNo, showStatus, status,
            } = response;
            const pickUpResult = this.state.item.pickUpResult;
            this.state.item.pickUpResult = {
                ...pickUpResult,
                carGroupId,
                carGroupType,
                carGroups,
                passengerMobile,
                passengerName,
                serviceId
            };
            this.state.item.statusText = showStatus
            AsyncStorage.setItem('hasCreatedOrder', 'yes', (error) => {
            })
            alertShow('订单生成成功', () => {
                this._backCallback()
                let {navigator} = this.props;
                if (navigator) {
                    let props = {
                        ...this.props,
                        orderId: response.id,
                        closeLast: true,
                    }
                    navigator.replace({
                        ...props,
                        name: 'TaxiOrder',
                        component: TaxiOrder
                    });
                }
            })
        }, (error) => {
            this._setLoadingVisible(false)
            if (error.response && error.response.orderId) {
                alertShow(error.response.errmsg, () => {
                    this._backCallback()
                    let {navigator} = this.props;
                    let props = {
                        ...this.props,
                        orderId: error.response.orderId,
                        closeLast: true,
                    }
                    navigator.replace({
                        ...props,
                        name: 'TaxiOrder',
                        component: TaxiOrder
                    });
                })
            }
            else if (error.response && error.response.errorCode === 4201) {
                openContactInformation(this.state.passengerMobile, (error, result) => {
                    NativeModule.authorize(result, () => {
                        // this._createOrder()
                        AsyncStorage.setItem('hasCreatedOrder', 'yes', (_error) => {
                        })
                    })
                });
            } else if (error.response && error.response.msg) {
                alertShow(error.response.msg)
            }
        })
    }

    _cancelOrder = () => {
        const {orderId} = this.state;
        if (this.state.item.status && this.state.item.status !== 2 && this.state.item.status !== 1) {
            alertShow('取消订单可能会产生额外费用', () => {
                this._setLoadingVisible(true)
                var param = {
                    orderId,
                }
                cancelOrder(param, (response) => {
                    this._setLoadingVisible(false);
                    alertShow(response.success, () => {
                        this.state.item.orderId = 0
                        this.state.item.status = 0
                        this._backCallback();
                        this._setRightTitle('');
                        let {navigator} = this.props;
                        if (navigator) {
                            let props = {
                                ...this.props,
                                orderId,
                                closeLast: true,
                            }
                            navigator.replace({
                                ...props,
                                name: 'TaxiOrder',
                                component: TaxiOrder,
                            });
                        }
                    });
                }, (error) => {
                    if (error && error.response) {
                        alertShow(error.response);
                    } else {
                        alertShow("取消订单失败");
                    }
                    this._setLoadingVisible(false)
                })
            }, () => {
            })
        } else {
            this._setLoadingVisible(true)
            var param = {
                orderId,
            }
            cancelOrder(param, (response) => {
                this._setLoadingVisible(false)
                this.state.item.orderId = 0
                this.state.item.status = 1
                if (response)
                    alertShow(response.success, () => {
                        this._backCallback();
                        let {navigator} = this.props;
                        if (navigator) {
                            let props = {
                                ...this.props,
                                orderId,
                                closeLast: true,
                            }
                            navigator.replace({
                                ...props,
                                name: 'TaxiOrder',
                                component: TaxiOrder,
                            });
                        }
                    })
            }, (error) => {
                this._setLoadingVisible(false)
                if (error.response && error.response.errorCode === 4201) {
                    alertShow(error.response.msg, () => {
                        openContactInformation(this.state.passengerMobile, (error, result) => {
                            NativeModule.authorize(result, () => {
                                // this._cancelOrder()
                                AsyncStorage.setItem('hasCreatedOrder', 'yes', (_error) => {
                                })
                            })
                        })

                    })
                } else if (error.response) {
                    if (error && error.response) {
                        alertShow(error.response);
                    } else {
                        alertShow("取消订单失败");
                    }
                }
            })
        }
    };

    /**
     * 从常用联系人中获取数据
     * @private
     */
    _getContacts = () => {
        let contactId = 0
        NativeModule.contactsSingle(contactId, (error, data) => {
            const phone = data.phone === undefined || data.phone === null ? '' : data.phone;
            this.setState({
                passengerName: data.name,
                passengerMobile: phone,
                contactsId: data.contactStaffId,
            });
            this.state.item.pickUpResult.passengerName = data.name;
            this.state.item.pickUpResult.passengerMobile = phone;
        });
    }

    /**
     * 根据类型获取不同档案
     * @param type
     * @private
     */
    _getFileByType = (type, objectId) => {
        let params = {};
        let title;
        if (type === 'department') {
            title = 'expenseItemDepartment';
        } else if (type === 'project') {
            title = 'projectItem';
        } else if (type === 'expenseType') {
            title = 'disburseClass';
        }
        params.title = title;
        params.condition = {
            expenseItemDepartment: this.state.department,
            expenseItem: this.state.project.id ? this.state.project : null,
            disburseClass: this.state.expenseType.id ? this.state.expenseType : null,
        };
        params.isBody = false;
        getRange(params, (conditions) => {
            this._getFile(type, objectId, conditions);
        }, (err) => {
            this._getFile(type, objectId, []);
        });
        return;
    }

    _getFile(type, objectId, conditions) {
        var that = this;
        getFileByType(type, objectId, conditions, (result) => {
            if (result && !result.clear) {
                if (type === 'department') {
                    this.state.department.name = result.name
                    this.state.department.id = result.id
                    this.state.department.code = result.code
                    this.state.departmentManager.id = result.departmentManager === 0 ? null : result.departmentManager
                } else if (type === 'project') {
                    this.state.project.id = result.id
                    this.state.project.name = result.name
                    this.state.project.code = result.code
                    this.state.projectManager.id = result.projectManager === 0 ? null : result.projectManager
                } else if (type === 'expenseType') {
                    this.state.expenseType.id = result.id
                    this.state.expenseType.name = result.name
                    this.state.expenseType.code = result.code
                }
                this.setState({
                    department: this.state.department,
                    project: this.state.project,
                    expenseType: this.state.expenseType,
                })
                let params = {
                    condition: {
                        expenseItemDepartment: this.state.department,
                        expenseItem: this.state.project.id ? this.state.project : null,
                        disburseClass: this.state.expenseType.id ? this.state.expenseType : null,
                    },
                };
                linkage(params, (result) => {
                    if (result) {
                        if (result.expenseItemDepartment && result.expenseItemDepartment.pk) {
                            getDepartmentById(result.expenseItemDepartment.pk, (departmentResult) => {
                                if (departmentResult.data && departmentResult.data.length > 0) {
                                    that.setState({
                                        department: departmentResult.data[0],
                                    })
                                }
                            }, (err) => {
                                console.log('获取部门失败：' + err);

                            })
                        }
                        if (result.expenseItem && result.expenseItem.pk) {
                            getProjectById(result.expenseItem.pk, (projectResult) => {
                                if (projectResult.data && projectResult.data.length > 0) {
                                    that.setState({
                                        project: projectResult.data[0],
                                    })
                                }
                            }, (err) => {
                                console.log('获取项目失败:' + err);
                            })
                        }
                        if (result.disburseClass && result.disburseClass.pk) {
                            getDisburseById(result.disburseClass.pk, (disburseResult) => {
                                if (disburseResult && disburseResult.length > 0) {
                                    that.setState({
                                        expenseType: disburseResult[0],
                                    })
                                }
                            }, (err) => {
                                console.log('获取报销类型失败:' + err);
                            })
                        }

                    }
                }, (err) => {
                })
            } else {
                if (type === 'department') {
                    this.state.department = {};
                    this.state.departmentManager = {};
                } else if (type === 'project') {
                    this.state.project = {};
                    this.state.projectManager = {};
                } else if (type === 'expenseType') {
                    this.state.expenseType = {}
                }
                that.setState({
                    department: this.state.department,
                    project: this.state.project,
                    expenseType: this.state.expenseType,
                })
            }
        })
    }

    /**
     * 获取当前登录用户信息
     * @private
     */
    _getUserinfo = () => {
        if (NativeModule && this.state.passengerName === '')
            NativeModule.getUserinfo((user) => {
                this.setState({
                    passengerName: user.name,
                    passengerMobile: user.phone === undefined || user.phone === null ? '' : user.phone,
                    contactsId: user.staffId,
                })
            })
    }

    /**
     * 选择时间
     * @param date
     * @private
     */
    _onDateChange = (response) => {
        var split = response.split(' ');
        if (!split[1]) split.push('00:00');
        var parseDate = split[0].split('-');
        var parseTime = split[1].split(':');
        var nextDate = new Date();
        nextDate.setFullYear(parseDate[0]);
        nextDate.setMonth(parseDate[1]);
        nextDate.setDate(parseDate[2]);
        nextDate.setHours(parseTime[0]);
        nextDate.setMinutes(parseTime[1]);
        this.setState({
            initDate: false,
            date: split[0],
            time: split[1],
        });
        const time = split[1].split(':');
        this.state.item.from.time = time[0] + ':' + time[1];
        this.state.date = split[0];
        this.state.time = split[1];
        if (this.state.item.from.longitude && this.state.item.from.longitude) {
            this._getEstimate()
        }
        if (this.state.startTime && ((this.state.startTime.getTime() - nextDate.getTime()) < 3600000)) {
            Alert.alert('提示', '送机/送站时间至少提前1个小时比较合适哟');
        }
    }

    _checkDate = () => {
        if (!this.state.date || !this.state.time) {
            return false;
        }
        return true;
    }

    /**
     * 解析时间
     * @returns {string}
     * @private
     */
    _parseDate = () => {
        if (this.state.serviceId === 14 && this.state.initDate) return '现在';
        if (!this.state.date || !this.state.time) {
            initDateInformation()
            this.state.date = dateInformation.date;
            this.state.time = dateInformation.time;
        }
        var date = this.state.date.split("-")
        var time = this.state.time.split(':')
        var cal = new Date(date[0], date[1] - 1, date[2]);
        return date[1] + '月' + date[2] + '日  ' + time[0] + ':' + time[1] + '  ' + weekday[(cal.getDay() == 0) ? 6 : cal.getDay() - 1]
    }

    _parseDateByProps = (props) => {
        var split = props.split(' ')
        var date = split[0].split("-")
        var cal = new Date(date[0], date[1] - 1, date[2]);
        return date[1] + '月' + date[2] + '日 ' + weekday[(cal.getDay() == 0) ? 6 : cal.getDay() - 1]
    }

    /**
     * 解析年月
     * @returns {string}
     * @private
     */
    _parseMonthAndDay = () => {
        if (!this.state.item.from.Date) return '';
        var date = this.state.item.from.Date.split("-")
        var cal = new Date()
        cal.setFullYear(date[0])
        cal.setMonth(date[1] - 1)
        cal.setDate(date[2])
        return date[1] + '月' + date[2] + '日'
    }

    _toStartPlace(response) {
        this._setLoadingVisible(false)
        this.state.cars = response
        let object = {
            cityId: this.state.item.to ? this.state.item.to.cityId : null,
            cityName: this.state.item.to ? this.state.item.to.city : null,
            lat: this.map.elat ? this.map.elat : this.state.item.to ? this.state.item.to.latitude : null,
            lng: this.map.elng ? this.map.elng : this.state.item.to ? this.state.item.to.longitude : null,
            location: this.state.item.to ? this.state.item.to.address : null,
            cars: response,
            searchAddress: true,
            carType: 'to',
        }
        if (selectPlaceEvent) {
            selectPlaceEvent(object, (err, result) => {
                this.state.item.to.address = result.location
                this.map.elat = result.lat
                this.map.elng = result.lng
                this.setState({
                    item: this.state.item
                })
                bd2gcj(result.lat, result.lng, (value) => {
                    this.state.item.to.address = result.location
                    this.state.item.to.latitude = value.Lat
                    this.state.item.to.longitude = value.Lng
                    this.state.item.to.cityId = result.cityId
                    this.state.item.to.city = result.cityName
                    this.setState({
                        item: this.state.item
                    })
                    if (this.state.item.from.longitude && this.state.item.from.longitude !== 0) {
                        this._getEstimate()
                    } else if (this.state.serviceId === 7) {
                        this._getEstimate()
                    }
                })

            })
        }
    }

    _toEndPlace(response) {
        this._setLoadingVisible(false)
        this.state.cars = response
        let object = {
            cityId: this.state.item.from ? this.state.item.from.cityId : null,
            cityName: this.state.item.from ? this.state.item.from.city : null,
            lat: this.map.slat ? this.map.slat : this.state.item.from ? this.state.item.from.latitude : null,
            lng: this.map.slng ? this.map.slng : this.state.item.from ? this.state.item.from.longitude : null,
            location: this.state.item.from ? this.state.item.from.address : null,
            cars: response,
            searchAddress: true,
            carType: 'from',
        }
        if (selectPlaceEvent) {
            selectPlaceEvent(object, (err, result) => {
                this.state.item.from.address = result.location
                this.map.slat = result.lat
                this.map.slng = result.lng
                this.setState({
                    item: this.state.item
                })
                bd2gcj(result.lat, result.lng, (value) => {
                    this.state.item.from.address = result.location
                    this.state.item.from.latitude = value.Lat
                    this.state.item.from.longitude = value.Lng
                    this.state.item.from.cityId = result.cityId
                    this.state.item.from.city = result.cityName
                    this.setState({
                        item: this.state.item
                    })
                    if (this.state.item.to.longitude && this.state.item.to.longitude !== 0) {
                        this._getEstimate()
                    }
                })
            })
        }
    }

    /**
     * 选择地点
     * @param type
     * @private
     */
    _poiSearch = (type) => {
        const {supplier, serviceId} = this.state;
        this._setLoadingVisible(true)
        if (type === 1) {
            if (this.state.cars) {
                this._toStartPlace(this.state.cars)
            } else {
                var type = serviceId === 14 ? 'kuaiche' : 'zhuanche';
                type = (serviceId === 13 || serviceId === 7 || serviceId === 8) ? 'end' : type;
                let param = {
                    type,
                    serviceId: this.state.serviceId,
                    supplier,
                }
                getCityList(param, (response) => {
                    this._toStartPlace(response[supplier])
                }, (error) => {
                    this._toStartPlace([])
                })
            }
        } else if (type === 2) {
            if (this.state.cars) {
                this._toEndPlace(this.state.cars)
            } else {
                var type = serviceId === 14 ? 'kuaiche' : 'zhuanche';
                type = (serviceId === 13 || serviceId === 7 || serviceId === 8) ? 'start' : type;
                let param = {
                    type,
                    serviceId: this.state.serviceId,
                    supplier,
                }
                getCityList(param, (response) => {
                    this._toEndPlace(response[supplier])
                }, (error) => {
                    this._toEndPlace([])
                })

            }
        }

    }

    /**
     * 选择机场
     * @param type
     * @private
     */
    _airPlane = (type) => {
        let search
        if (PoiSearchModule) {
            search = PoiSearchModule
        }
        else {
            search = NativeModule
        }
        const {serviceId, supplier} = this.state;
        if (type === 1) {
            var type = serviceId === 8 ? 'dropoff' : 'pickup';
            let param = {
                type,
                serviceId: this.state.serviceId,
                supplier,
            }
            const cityId = (this.state.item.to && this.state.item.to.cityId) ? this.state.item.to.cityId : 95;
            search.searchAirplane(cityId, param, (result) => {
                this.state.item.to.address = result.name;
                this.state.item.to.latitude = result.latitude;
                this.state.item.to.longitude = result.longitude;
                this.state.item.to.code = result.code;
                this.state.item.to.terminalCode = result.terminalCode;
                this.state.item.to.ArriveCityAirportCode = result.code;
                this.state.item.from.city = result.cityName;
                this.state.item.from.cityId = result.cityId;
                this.state.item.to.city = result.cityName;
                this.state.item.to.cityId = result.cityId;
                this.setState({
                    item: this.state.item
                });
                if (this.state.item.from.longitude && this.state.item.from.longitude !== 0) {
                    this._getEstimate();
                } else if (this.state.serviceId === 7) {
                    this._getEstimate();
                }
            })
        } else if (type === 2) {
            var type = serviceId === 8 ? 'dropoff' : 'pickup';
            let param = {
                type,
                serviceId: this.state.serviceId,
                supplier,
            }
            const cityId = (this.state.item.from && this.state.item.from.cityId) ? this.state.item.from.cityId : 95;
            search.searchAirplane(cityId, param, (result) => {
                this.state.item.from.address = result.name;
                this.state.item.from.latitude = result.latitude;
                this.state.item.from.longitude = result.longitude;
                this.state.item.from.code = result.code;
                this.state.item.from.terminalCode = result.terminalCode;
                this.state.item.from.ArriveCityAirportCode = result.code
                this.state.item.from.city = result.cityName;
                this.state.item.from.cityId = result.cityId;
                this.state.item.to.city = result.cityName;
                this.state.item.to.cityId = result.cityId;
                this.setState({
                    item: this.state.item
                })
                if (this.state.item.to.longitude && this.state.item.to.longitude !== 0) {
                    this._getEstimate()
                }
            })
        }
    }

    /**
     * Loading 显示隐藏
     * @param visible
     * @private
     */
    _setLoadingVisible = (visible = false) => {
        this.setState({
            loadingVisible: visible
        })
    }

    /**
     * Loading 显示隐藏
     * @param visible
     * @private
     */
    _setLoadingVisible = (visible = false) => {
        this.setState({
            loadingVisible: visible
        })
    }

    _goToPhone = (number = this.state.supplierPhone) => {
        var tel = 'tel:' + number
        Linking.canOpenURL(tel).then(supperted => {
            if (supperted) {
                Linking.openURL(tel)
            }
        })
    };

    _goToMap() {
        const {orderId, driverName, vehicleNo, vehicleModel, carColor, item} = this.state;
        const {from} = item;
        var info = '';
        if (vehicleModel) info = info + vehicleModel + ' ';
        if (carColor) info = info + carColor;
        if (toDriverMap)
            toDriverMap(orderId, Number(from.latitude), Number(from.longitude), driverName, vehicleNo, info);
    };

    _selectDeplytime = () => {
        var items = ['10', '20', '30', '40', '50', '60', '70', '80', '90']
        NativeModule.selectDeplytime(String(this.state.delayTime), items, (error, time) => {
            this.setState({
                delayTime: time,
            })
        })
    }

    _clearEstimate() {
        this.setState({
            estimate: [],
            estimates: {},
            total: 0,
            carGroupId: null,
            carGroupType: null,
            dynamic_md5: null,
        });
    }

    _changeService = (serviceId) => {
        if (this.state.serviceId === serviceId) return
        let {navigator, isCar} = this.props
        let props = {
            serviceId: serviceId,
            isCar: isCar,
        }
        if (serviceId === 7 || serviceId === 8) {
            navigator.replace({
                ...props,
                name: 'TaxiOrder',
                component: TaxiOrder
            })
        } else if (serviceId === 14) {
            if (this.state.serviceId === 13) {
                if (this.state.initDate) {
                    this.state.date = null;
                    this.state.time = null;
                }
                this.setState({
                    serviceId: serviceId,
                })
                this._clearEstimate();
                this._getEstimate(DIDI, serviceId);
            } else {
                navigator.replace({
                    ...props,
                    name: 'TaxiOrder',
                    component: TaxiOrder
                })
            }
        } else if (serviceId === 13) {
            if (this.state.serviceId === 14) {
                this.setState({
                    serviceId: serviceId,
                    // date: this.state.date ? this.state.date : dateInformation.date,
                    // time: this.state.time ? this.state.time : dateInformation.time,
                })
                // initDateInformation()
                this._clearEstimate();
                this._getEstimate(DIDI, serviceId);
            } else {
                navigator.replace({
                    ...props,
                    name: 'TaxiOrder',
                    component: TaxiOrder
                })
            }
        }

    }

    checkMobile = (mobile) => {
        if (mobile.length === 0) {
            alertShow('请输入手机号')
            return false;
        } else if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile)) || mobile.length < 11) {
            alertShow('输入正确的手机号')
            return false;
        } else {
            return true
        }
    }

    onCarSelect(supplier) {
        const {carGroupType} = this.state;
        const estimate = this.getEstimates(supplier, carGroupType);
        this.setState({
            supplier,
            total: estimate.price,
            carGroupId: estimate.carGroupId,
            carGroupType: estimate.name,
            dynamic_md5: estimate.dynamic_md5,
        });
    }

    getEstimates(supplier, type) {
        const {estimates} = this.state;
        if (estimates[supplier]) {
            for (let item of estimates[supplier]) {
                if (item && item.name === type) {
                    return item;
                }
            }
        }
        return null;
    }

    _renderAirplane() {
        return (
            <View style={{flexDirection: 'column', backgroundColor: '#ed7140'}}>
                <View style={{flexDirection: 'row'}}>

                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={() => {
                            if (this.props.isCar) {
                                NativeModule.navigatorEvent()
                            } else {
                                this.setState({
                                    serviceId: 14,
                                })
                            }
                        }}>
                        <Image source={images['ic_back']}
                               style={{height: 20, width: 20, alignSelf: 'center', marginLeft: 20}}></Image>
                    </TouchableOpacity>

                    <View style={styles.navigator_container}>
                        <View
                            style={[styles.navigator_group, {alignItems: 'flex-end'}]}>
                            <TouchableOpacity style={styles.navigator_touch}
                                              onPress={this._changeService.bind(this, 7)}>
                                <Text style={this.state.serviceId === 7 ? {color: 'white', opacity: 1, fontSize: 18} : {
                                    color: 'white',
                                    opacity: 0.7,
                                    fontSize: 18,
                                }}>{Constants.AIRPORT_PICKUP}</Text>

                                {this.state.serviceId === 7 && <View style={styles.navigator_line}></View>}
                            </TouchableOpacity>
                        </View>
                        <View style={{width: 36, backgroundColor: 'transparent'}}></View>
                        <View
                            style={[styles.navigator_group, {alignItems: 'flex-start'}]}>
                            <TouchableOpacity style={styles.navigator_touch}
                                              onPress={this._changeService.bind(this, 8)}>
                                <Text style={this.state.serviceId === 8 ? {color: 'white', opacity: 1, fontSize: 18} : {
                                    color: 'white',
                                    opacity: 0.7,
                                    fontSize: 18,
                                }}>{Constants.AIRPORT_DROP_OFF}</Text>
                                {this.state.serviceId === 8 && <View style={styles.navigator_line}></View>}
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        )
    }


    _renderCar = () => {
        const szStyle = this._getContainSupplier(DIDI) ? {alignItems: 'flex-start'} : {alignItems: 'center'};
        return (
            <View style={{flexDirection: 'column', backgroundColor: '#ed7140'}}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={() => {
                            let {navigator} = this.props;
                            if (navigator) {
                                const routes = navigator.getCurrentRoutes();
                                if (routes.length > 1) {
                                    navigator.pop();
                                }
                                else {
                                    NativeModule.navigatorEvent()
                                }
                            }
                        }}>
                        <Image source={images['ic_back']}
                               style={{height: 20, width: 20, alignSelf: 'center', marginLeft: 20}}></Image>
                    </TouchableOpacity>

                    <View style={styles.navigator_container}>
                        {this._getContainSupplier(DIDI) && <View
                            style={[styles.navigator_group, {alignItems: 'flex-end'}]}>
                            <TouchableOpacity style={styles.navigator_touch}
                                              onPress={this._changeService.bind(this, 14)}>
                                <Text
                                    style={this.state.serviceId === 14 ? {color: 'white', opacity: 1, fontSize: 18} : {
                                        color: 'white',
                                        opacity: 0.7,
                                        fontSize: 18,
                                    }}>{Constants.FAST_RIDE}</Text>

                                {this.state.serviceId === 14 && <View style={styles.navigator_line}></View>}
                            </TouchableOpacity>
                        </View>}
                        {this._getContainSupplier(DIDI) &&
                        <View style={{width: 36, backgroundColor: 'transparent'}}></View>}
                        {this._getContainSupplier(SHENZHOU) && <View
                            style={[styles.navigator_group, szStyle]}>
                            <TouchableOpacity style={styles.navigator_touch}
                                              onPress={this._changeService.bind(this, 13)}>
                                <Text
                                    style={this.state.serviceId === 13 ? {color: 'white', opacity: 1, fontSize: 18} : {
                                        color: 'white',
                                        opacity: 0.7,
                                        fontSize: 18,
                                    }}>{Constants.TAILORED_TAXI_SERVICE}</Text>
                                {this.state.serviceId === 13 && <View style={styles.navigator_line}></View>}
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            </View>
        )
    }

    /**
     * 绘制头部
     * @returns {XML}
     * @private
     */
    _renderHeader = () => {
        let paddingFlag = (Platform.OS === 'ios' && (this.state.orderId === null || this.state.orderId === 0)) ? true : false
        if (!this.state.supplier) {
            if (this.state.serviceId === 14 || this.state.serviceId === 13) {
                this.state.supplier = DIDI;
            } else if (this.state.serviceId === 7 || this.state.serviceId === 8) {
                this.state.supplier = SHENZHOU;
            }
        }
        return (
            <View>
                {paddingFlag ? <View style={{height: 20, backgroundColor: '#ed7140'}}/> : null}
                {(this.state.serviceId === 7 || this.state.serviceId === 8) ? this._renderAirplane() : this._renderCar()}
            </View>
        )
    }

    /**
     * 绘制车辆信息
     * @returns {*}
     * @private
     */
    _renderSectionCarNumber = () => {
        if ((!this.state.carNumber && this.state.carNumber !== 0) || !this.state.isShowCarSection || this.state.serviceId !== 13 || !this.state.initDate) return null
        let time = parseInt(this.state.carWaitTime / 60) + 1
        let top = Platform.OS === 'ios' ? 62 : 42
        return (
            <View style={{
                backgroundColor: '#FFE6C2',
                flexDirection: 'row',
                height: 38,
                justifyContent: 'space-between',
                position: 'absolute',
                left: 0,
                top: top,
                width: Dimensions.get('window').width,
                alignItems: 'center'
            }}>
                {this.state.carNumber === 0 ?
                    <Text style={{fontSize: 13, color: '#333333', marginLeft: 10}}>您附近没有可预约的车辆</Text> :
                    <Text style={{fontSize: 13, color: '#333333', marginLeft: 10}}>您附近有<Text
                        style={{color: 'orange', fontSize: 13}}>{this.state.carNumber}</Text>
                        辆车，最快<Text style={{color: 'orange', fontSize: 13}}>{time}</Text>分钟到达哟！</Text>}
                <TouchableOpacity onPress={() => {
                    this.setState({
                        isShowCarSection: false
                    })
                }}>
                    <Image style={{width: 10, height: 10, marginRight: 10}}
                           source={require('../hotel/images/layer_delete.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 绘制附近车辆信息
     * @returns {*}
     * @private
     */
    _renderCarNumber = () => {
        if ((!this.state.carNumber && this.state.carNumber !== 0) || this.state.isShowCarSection || this.state.serviceId !== 13 || !this.state.initDate) return null
        let time = parseInt(this.state.carWaitTime / 60) + 1
        return (
            <View style={{marginTop: 12}}>
                <View style={styles.item}>
                    {this.state.carNumber === 0 ?
                        <Text style={{fontSize: 14, color: '#333333', marginLeft: 10}}>您附近没有可预约的车辆</Text> :
                        <Text style={{fontSize: 14, color: '#333333', marginLeft: 10}}>您附近有<Text
                            style={{color: 'orange', fontSize: 14}}>{this.state.carNumber}</Text>
                            辆车，最快<Text style={{color: 'orange', fontSize: 14}}>{time}</Text>分钟到达哟！</Text>}
                </View>
            </View>
        )
    }

    /**
     * 绘制建研院档案选择组件
     * @returns {*}
     * @private
     */
    _renderGroupInfo = () => {
        // let company = '测试公司--正式环境'
        if (!this.state.companyName || this.state.companyName !== JIANYANYUAN_NAME) return null
        return (
            <View style={{marginTop: 12}}>

                <View style={styles.item}>

                    <Text style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.department}</Text>
                    <TouchableOpacity
                        disabled={this.state.isSubmitable ? false : true}
                        style={[styles.item_column]}
                        hitSlop={{
                            top: 20,
                            bottom: 20,
                            right: Dimensions.get('window').width,
                            left: Dimensions.get('window').width
                        }}
                        onPress={this._getFileByType.bind(this, 'department', JIANYANYUAN_ID)}>
                        <Text style={styles.item_text_normal}>{this.state.department.name}</Text>

                    </TouchableOpacity>

                </View>

                <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                    <View style={[styles.line, styles.line_center]}/>

                </View>

                <View style={styles.item}>

                    <Text style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.expenseType}</Text>
                    <TouchableOpacity
                        disabled={this.state.isSubmitable ? false : true}
                        style={[styles.item_column]}
                        hitSlop={{
                            top: 20,
                            bottom: 20,
                            right: Dimensions.get('window').width,
                            left: Dimensions.get('window').width
                        }}
                        onPress={this._getFileByType.bind(this, 'expenseType', JIANYANYUAN_ID)}>
                        <Text style={styles.item_text_normal}>{this.state.expenseType.name}</Text>

                    </TouchableOpacity>

                </View>

                <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                    <View style={[styles.line, styles.line_center]}/>

                </View>

                <View style={styles.item}>

                    <Text style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.project}</Text>
                    <TouchableOpacity
                        disabled={this.state.isSubmitable ? false : true}
                        style={[styles.item_column]}
                        hitSlop={{
                            top: 20,
                            bottom: 20,
                            right: Dimensions.get('window').width,
                            left: Dimensions.get('window').width
                        }}
                        onPress={this._getFileByType.bind(this, 'project', JIANYANYUAN_ID)}>
                        <Text style={styles.item_text_normal}>{this.state.project.name}</Text>

                    </TouchableOpacity>

                </View>

            </View>
        )
    }

    /**
     * 公司支付
     * @returns {XML}
     * @private
     */
    _renderPay() {
        let isReadyCommit = true;
        const {passengerName, passengerMobile, item, carGroupId, serviceId, isCanPay, orderId, department, project, expenseType, companyName, isCancelable, payStatus, suppliers} = this.state;
        const {to, from, pickUpResult, status} = item;
        if (!passengerName) isReadyCommit = false;
        if (!passengerMobile) isReadyCommit = false;
        if (!to.latitude) isReadyCommit = false;
        if (!from.latitude) isReadyCommit = false;
        if (!carGroupId) isReadyCommit = false;
        if (serviceId === 7) {
            if (!pickUpResult.flightNo) isReadyCommit = false;
            if (!pickUpResult.flightDate === null) isReadyCommit = false;
        }
        if (suppliers.length === 0) isReadyCommit = false;
        if (isCanPay && orderId) {
            isReadyCommit = true;
        }
        if (companyName === JIANYANYUAN_NAME) {
            if (!department.name) isReadyCommit = false;
            if (!project.name) isReadyCommit = false;
            if (!expenseType.name) isReadyCommit = false;
        }
        return (
            <View style={[styles.bottom_container, {backgroundColor: 'transparent'}]}>
                {(status === 0 || orderId === 0) || (!isCancelable) ? null :
                    <TouchableOpacity
                        style={isCancelable ? styles.touchable_pay_cancel : styles.touchable_pay_cancel_disable}
                        onPress={this._cancelOrder.bind(this)}
                        disabled={isCancelable ? false : true}>
                        <Text style={styles.appointment_button}>取消订单</Text>
                    </TouchableOpacity>}
                {(payStatus === '' || payStatus === '待支付') ? <TouchableOpacity
                    disabled={(isReadyCommit && isCanPay) ? false : true}
                    style={(this.state.isCanPay && isReadyCommit) ? styles.touchable_pay : styles.touchable_pay_disable}
                    onPress={() => {
                        if (!isCanPay) return;
                        if (serviceId !== 7 && !from.longitude) {
                            alertShow('请选择有效的出发地址');
                            return;
                        } else if (!to.longitude) {
                            alertShow('请选择有效的目的地址');
                            return;
                        }
                        payStatus === '待支付' ? this._payOrder() : companyName === JIANYANYUAN_NAME ? this._getAddtionalRule() : this._createOrder();
                    }}>
                    <Text style={(this.state.isCanPay && isReadyCommit) ? styles.text_pay : styles.text_pay_disable}>企业支付</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }

    /**
     * 支付(旧)
     * @returns {XML}
     * @private
     */
    _renderPayOld() {
        let isReadyCommit = true
        if (this.state.passengerName === null || this.state.passengerName === '') isReadyCommit = false
        if (this.state.passengerMobile === null || this.state.passengerMobile === '') isReadyCommit = false
        if (this.state.item.to.latitude === null) isReadyCommit = false
        if (this.state.item.from.latitude === null) isReadyCommit = false
        if (this.state.carGroupId === null) isReadyCommit = false
        if (this.state.serviceId === 7) {
            if (this.state.item.pickUpResult.flightNo === null || this.state.item.pickUpResult.flightNo === '') isReadyCommit = false
            if (this.state.item.pickUpResult.flightDate === null || this.state.item.pickUpResult.flightDate === '') isReadyCommit = false
        }
        if (this.state.isCanPay && this.state.orderId && this.state.orderId !== 0) {
            isReadyCommit = true
        }
        if (this.state.companyName === JIANYANYUAN_NAME) {
            if (!this.state.department.name || this.state.department.name === '') isReadyCommit = false
            if (!this.state.project.name || this.state.project.name === '') isReadyCommit = false
            if (!this.state.expenseType.name || this.state.expenseType.name === '') isReadyCommit = false
        }
        return (
            <View style={styles.bottom_container}>
                <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                    <Text style={{color: '#ed7140', fontSize: 18}}>¥ {this.state.total}<Image
                        style={{width: 100, height: 15, marginLeft: 5}}
                        source={images['ic_shenzhou_logo']}></Image></Text>
                    {/*{(this.state.item.status === 9 && this.state.isTotalPrice) ? null :*/}
                    {/*<Text style={{color: '#666666', fontSize: 10}}>预估价,仅供参考,以实际费用为准</Text>}*/}
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                }}>
                    {(this.state.item.status === 0 || this.state.item.orderId === 0) || (!this.state.isCancelable) ? null :
                        <TouchableOpacity
                            style={this.state.isCancelable ? styles.appointment_touch_cancel : styles.appointment_touch_cancel_disable}
                            onPress={this._cancelOrder.bind(this)}
                            disabled={this.state.isCancelable ? false : true}>
                            <Text style={styles.appointment_button}>取消</Text>
                        </TouchableOpacity>}

                    {(this.state.payStatus === '' || this.state.payStatus === '待支付') ? <TouchableOpacity
                        disabled={(isReadyCommit && this.state.isCanPay) ? false : true}
                        style={(this.state.isCanPay && isReadyCommit) ? styles.appointment_touch : styles.appointment_touch_disable}
                        onPress={() => {
                            if (!this.state.isCanPay) return
                            if (this.state.serviceId !== 7 && !this.state.item.from.longitude || this.state.item.from.longitude === 0) {
                                alertShow('请选择有效的出发地址')
                                return;
                            } else if (!this.state.item.to.longitude || this.state.item.to.longitude === 0) {
                                alertShow('请选择有效的目的地址')
                                return;
                            }
                            this.state.payStatus === '待支付' ? this._payOrder() : this.state.companyName === JIANYANYUAN_NAME ? this._getAddtionalRule() : this._createOrder()
                        }}>
                        <Text
                            style={(this.state.isCanPay && isReadyCommit) ? styles.appointment_button : styles.appointment_button_disable}>企业支付</Text>
                    </TouchableOpacity> : null}

                </View>

            </View>
        )
    }

    /**
     * 绘制滴滴
     * @returns {XML}
     */
    renderDIDISupplier() {
        var {supplier, estimates, serviceId, carGroupType, total} = this.state;
        return (
            <View key={DIDI}>
                {!this._getContainSupplier(DIDI) || serviceId === 7 || serviceId === 8 || total === 0 ||
                <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20}}>

                    <View style={[styles.line, styles.line_center]}/>

                </View>}

                {!this._getContainSupplier(DIDI) || serviceId === 7 || serviceId === 8 || total === 0 ||
                <TouchableOpacity
                    onPress={this.onCarSelect.bind(this, DIDI)}
                    style={[styles.item, styles.item_height, styles.item_paddingTop]}>
                    <TouchableOpacity style={{height: 12, width: 12}} onPress={this.onCarSelect.bind(this, DIDI)}>
                        <Image style={{height: 12, width: 12}}
                               source={supplier === DIDI ? images['ic_car_select'] : images['ic_car_noselect']}></Image>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', flex: 1}}>
                        <View style={{marginLeft: 18, flexDirection: 'column'}}>
                            <Text style={{
                                fontSize: 14,
                                color: '#666666'
                            }}>预估价 <Text style={{
                                color: '#ed7140',
                                fontSize: 18
                            }}>{(estimates && estimates[DIDI] && this.getEstimates(DIDI, carGroupType)) ? '¥' + this.getEstimates(DIDI, carGroupType).price : ''}</Text></Text>
                            {/*<Text style={{color: '#666666', fontSize: 10}}>预估价,仅供参考,以实际费用为准</Text>*/}
                        </View>
                        <Image
                            style={{width: 100, height: 15, alignSelf: 'center'}}
                            source={images['ic_didi_logo']}></Image>
                    </View>
                </TouchableOpacity>}
            </View>
        )
    };

    /**
     * 绘制神州
     * @returns {XML}
     */
    renderShenZhouSupplier() {
        var {supplier, estimates, serviceId, carGroupType, total} = this.state;
        return (
            <View key={SHENZHOU}>
                {!this._getContainSupplier(SHENZHOU) || serviceId === 14 || total === 0 ||
                <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20}}>

                    <View style={[styles.line, styles.line_center]}/>

                </View>}
                {!this._getContainSupplier(SHENZHOU) || serviceId === 14 || total === 0 || <TouchableOpacity
                    onPress={this.onCarSelect.bind(this, SHENZHOU)}
                    style={[styles.item, styles.item_height, styles.item_paddingTop]}>
                    <TouchableOpacity style={{height: 12, width: 12}}
                                      onPress={this.onCarSelect.bind(this, SHENZHOU)}>
                        <Image style={{height: 12, width: 12}}
                               source={supplier === SHENZHOU ? images['ic_car_select'] : images['ic_car_noselect']}></Image>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', flex: 1}}>
                        <View style={{marginLeft: 18, flexDirection: 'column'}}>
                            <Text style={{
                                fontSize: 14,
                                color: '#666666'
                            }}>预估价 <Text style={{
                                color: '#ed7140',
                                fontSize: 18
                            }}>{(estimates && estimates.shenzhou && this.getEstimates(SHENZHOU, carGroupType)) ? '¥' + this.getEstimates(SHENZHOU, carGroupType).price : ''}</Text></Text>
                            {/*<Text style={{color: '#666666', fontSize: 10}}>预估价,仅供参考,以实际费用为准</Text>*/}
                        </View>
                        <Image
                            style={{width: 100, height: 15, alignSelf: 'center'}}
                            source={images['ic_shenzhou_logo']}></Image>
                    </View>
                </TouchableOpacity>}
            </View>
        )
    }

    /**
     * 绘制供应商列表
     * @returns {*}
     */
    renderSupplier() {
        var {carGroupType, orderId} = this.state;
        if (orderId) return null;
        var didiPrice = this.getEstimates(DIDI, carGroupType) ? this.getEstimates(DIDI, carGroupType).price : 0;
        var shenzhouPrice = this.getEstimates(SHENZHOU, carGroupType) ? this.getEstimates(SHENZHOU, carGroupType).price : 0;
        var suppliers = [];
        if (didiPrice === 0) {
            return this.renderShenZhouSupplier();
        } else if (shenzhouPrice === 0) {
            return this.renderDIDISupplier();
        } else {
            if (shenzhouPrice >= didiPrice) {
                suppliers.push(DIDI);
                suppliers.push(SHENZHOU);
            } else {
                suppliers.push(SHENZHOU);
                suppliers.push(DIDI);
            }
            return suppliers.map((supplier) => {
                if (supplier === DIDI) {
                    return this.renderDIDISupplier();
                } else if (supplier === SHENZHOU) {
                    return this.renderShenZhouSupplier();
                }
            });
        }
    };

    /**
     * 绘制地图入口
     * @returns {*}
     */
    renderMap() {
        const {isShowMap} = this.state;
        if (!isShowMap) return null;
        return (
            <TouchableOpacity
                onPress={this._goToMap}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 45,
                    justifyContent: 'space-between',
                    marginTop: 12,
                    backgroundColor: 'white',
                    paddingLeft: 20,
                    paddingRight: 20,
                }}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={images['ic_carmap']}
                           style={{height: 20, width: 20}}></Image>

                    <Text style={{marginLeft: 12}}>查看地图</Text>
                </View>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>

                    <Image source={images['ic_right_arrow_tint']}></Image>

                </View>

            </TouchableOpacity>
        )
    };

    /**
     * 绘制用车界面
     * @returns {XML}
     * @private
     */
    _renderAppointmentCar() {
        const that = this;
        const checkDate = this._checkDate();
        const dateString = checkDate ? this._parseDate() : '请选择用车时间';
        const dateTextColor = checkDate ? {color: '#333333'} : {color: '#999999'};
        var {supplier, estimates, orderId, serviceId, type, isSubmitable, passengerName, passengerMobile, editFlightDate, item, editNo, initDate, date, time, editCity, estimate, isCarInit, car_style, carSelect, carGroupType, driverName, total, status} = this.state;
        if (!orderId) orderId = 0;
        if (!estimate) estimate = [];
        var immediately = true;
        if (orderId) {
            if (supplier === DIDI) {
                if (serviceId === 301) {
                    immediately = false;
                } else if (serviceId === 201) {
                    if (type === 0) {
                        immediately = false;
                    } else if (type === 1) {
                        immediately = true;
                    }
                }
            } else if (supplier === SHENZHOU) {
                if (serviceId === 14) {
                    immediately = false;
                } else {
                    immediately = true;
                }
            }
        }
        const price_title = status === 9 ? '实际费用' : '预估价';
        return (
            <View style={styles.container}>

                {(orderId === null || orderId === 0) ? this._renderHeader() : null}

                <ScrollView style={styles.container}
                            keyboardShouldPersistTaps={true}>

                    <View style={styles.item}>

                        <Text style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.contact}</Text>
                        <TouchableOpacity
                            disabled={isSubmitable ? false : true}
                            style={[styles.item_column]}
                            hitSlop={{
                                top: 20,
                                bottom: 20,
                                right: Dimensions.get('window').width,
                                left: Dimensions.get('window').width
                            }}
                            onPress={() => {
                                this._getContacts()
                            }}>
                            <Text style={styles.item_text_normal}>{passengerName}</Text>

                        </TouchableOpacity>


                        <View style={{
                            alignSelf: 'center',
                        }}>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    fontSize: 14,
                                    color: '#666666'
                                }}>
                                {Constants.pick_up + ((item.pickUpResult && item.pickUpResult.serviceName) ? item.pickUpResult.serviceName : (item.serviceType ? item.serviceType : '')) }
                            </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                        <View style={[styles.line, styles.line_center]}/>

                    </View>


                    <View style={styles.item}>

                        <Text style={[styles.item_text_normal, styles.item_text_gary]}
                              visible={true}>{Constants.contact_input}</Text>


                        <TextInput
                            editable={isSubmitable}
                            style={[styles.item_text_normal, styles.item_input]}
                            underlineColorAndroid={'transparent'}
                            value={passengerMobile}
                            onChangeText={(text) => {
                                this.setState({passengerMobile: text, bChange: true})
                            }}
                            keyboardType={'numeric'}
                            maxLength={11}
                            clearButtonMode={'while-editing'}></TextInput>


                    </View>

                    {serviceId === 7 ? <View style={[styles.item, styles.item_top]}>

                        <Text
                            style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.flight_number}</Text>


                        {!editNo ?
                            <View style={styles.item_column}>
                                <Text
                                    style={styles.item_text_normal}>{item.pickUpResult.flightNo} {this._parseMonthAndDay()}</Text>
                            </View> :
                            <TextInput
                                style={[styles.item_text_normal, styles.item_input]}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.state.item.pickUpResult.flightNo = text;
                                    this.setState({
                                        item: this.state.item,
                                        bChange: true,
                                    })
                                }}
                                onSubmitEditing={Keyboard.dismiss}
                                returnKeyType="done"
                                keyboardType={'default'}
                                clearButtonMode={'while-editing'}
                                defaultValue={item.pickUpResult.flightNo ? item.pickUpResult.flightNo : ''}></TextInput>
                        }


                    </View> : null}

                    {(serviceId === 7 && editFlightDate) || (serviceId === 7 && orderId !== 0 && orderId !== null && item.pickUpResult.flightDepartDate !== null && item.pickUpResult.flightDepartDate !== undefined) ?
                        <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                            <View style={[styles.line, styles.line_center]}/>

                        </View> : null}
                    {(serviceId === 7 && editFlightDate) || (serviceId === 7 && orderId !== 0 && orderId !== null && item.pickUpResult.flightDepartDate !== null && item.pickUpResult.flightDepartDate !== undefined) ?
                        <View style={[styles.item, styles.item_height]}>
                            <Text
                                style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.airplane_flight_date}</Text>

                            <TouchableOpacity
                                disabled={isSubmitable ? (false || ((serviceId === 7 && orderId !== 0 && orderId !== null && item.pickUpResult.flightDepartDate !== null && item.pickUpResult.flightDepartDate !== undefined))) : true}
                                style={{flex: 1, marginLeft: 20}}
                                hitSlop={{
                                    left: Dimensions.get('window').width,
                                    right: Dimensions.get('window').width,
                                    top: 10,
                                    bottom: 10
                                }}
                                onPress={() => {
                                    initDateInformation();
                                    NativeModule.openDatepicker('起飞时间', dateInformation.date + ' ' + dateInformation.time, dateInformation.date + ' ' + dateInformation.time, 30, 1, false, false, (isNow, date) => {
                                        this.state.item.pickUpResult.flightDate = date
                                        this.setState({
                                            item: this.state.item,
                                        })
                                        this._getEstimate();
                                    })
                                }}
                            >
                                <Text
                                    style={[styles.item_text_normal]}>{item.pickUpResult.flightDate ? this._parseDateByProps(item.pickUpResult.flightDate) : (item.pickUpResult.flightDepartDate) ? this._parseDateByProps(item.pickUpResult.flightDepartDate) : ''}</Text>
                            </TouchableOpacity>

                        </View> : null}

                    <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                        <View style={[styles.line, styles.line_center]}/>

                    </View>

                    {(serviceId !== 7 && serviceId !== 8) &&
                    <View style={[styles.item, styles.item_height, {marginTop: 12, justifyContent: 'space-between'}]}>
                        <Text
                            style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.boarding_time}</Text>

                        {initDate || <TouchableOpacity
                            disabled={isSubmitable ? false : true}
                            style={{flex: 1, marginLeft: 20}}
                            hitSlop={{
                                left: Dimensions.get('window').width,
                                right: Dimensions.get('window').width,
                                top: 10,
                                bottom: 10
                            }}
                            onPress={() => {
                                var value = initDate ? 'now' : date + ' ' + time;
                                let scale = serviceId === 14 ? 10 : 10
                                initDateInformation()
                                let isShowNow = serviceId === 13 ? false : true
                                const dayScale = (serviceId === 7 || serviceId === 8) ? 30 : 3;
                                NativeModule.openDatepicker('选择上车时间', dateInformation.date + ' ' + dateInformation.time, value, dayScale, scale, isShowNow, true, (isNow = false, date) => {
                                    if (isNow) {
                                        this.state.initDate = isNow
                                        var split = date.split(' ');
                                        this.setState({
                                            date: split[0],
                                            time: split[1],
                                            initDate: isNow,
                                        })
                                        this._getNearbycars()
                                    } else {
                                        this._onDateChange(date)
                                    }
                                })
                            }}>
                            <Text
                                style={[styles.item_text_normal, dateTextColor]}>{dateString}</Text>
                        </TouchableOpacity>}
                        {!orderId && <View style={{paddingRight: 25}}>
                            <TimeSwitch
                                status={that.state.initDate ? 'NOW' : 'APPOINTMENT'}
                                callback={(status) => {
                                    let flag = true;
                                    if (status === 'NOW') {
                                        flag = true;
                                    } else {
                                        flag = false;
                                    }
                                    that.state.initDate = flag;
                                    that._clearEstimate();
                                    const {from, to} = that.state.item;
                                    if (from.longitude && from.latitude && to.longitude && to.latitude) {
                                        this._getEstimate()
                                    }
                                }}/>
                        </View>}

                    </View>}

                    {serviceId === 7 ? <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                        <View style={[styles.line, styles.line_center]}/>

                    </View> : (((orderId !== null && orderId !== 0) || (serviceId === 14 || serviceId === 13)) ? null :
                        <View style={{marginTop: 12}}/>)}


                    {((orderId !== null && orderId !== 0) || (serviceId === 14 || serviceId === 13)) ? null :
                        <View style={[styles.item, styles.item_height]}>

                            <Text
                                style={[styles.item_text_normal, styles.item_text_gary]}>{Constants.boarding_time}</Text>


                            {serviceId === 7 ? <View style={{flexDirection: 'row', marginLeft: 20}}>

                                <Text style={styles.item_text_normal}>航班到达后</Text>
                                <TouchableOpacity
                                    disabled={isSubmitable ? false : true}
                                    style={{flex: 1}}
                                    onPress={this._selectDeplytime.bind(this)}>
                                    <Text
                                        style={[styles.item_text_normal, styles.item_text_boardingtime]}>{this.state.delayTime}分钟</Text>
                                </TouchableOpacity>
                                <Text style={styles.item_text_normal}>上车</Text>

                            </View> : <View style={{flexDirection: 'row', marginLeft: 20}}>

                                <TouchableOpacity
                                    disabled={isSubmitable ? false : true}
                                    style={{flex: 1}}
                                    hitSlop={{
                                        left: Dimensions.get('window').width,
                                        right: Dimensions.get('window').width,
                                        top: 10,
                                        bottom: 10
                                    }}
                                    onPress={() => {
                                        var value = initDate ? 'now' : date + ' ' + time;
                                        let scale = serviceId === 14 ? 10 : 10;
                                        initDateInformation();
                                        let isShowNow = serviceId === 13 ? false : true;
                                        const dayScale = (serviceId === 7 || serviceId === 8) ? 30 : 3;
                                        NativeModule.openDatepicker('选择上车时间', dateInformation.date + ' ' + dateInformation.time, value, dayScale, scale, isShowNow, true, (isNow = false, date) => {
                                            if (isNow) {
                                                this.state.initDate = isNow
                                                var split = date.split(' ');
                                                this.setState({
                                                    date: split[0],
                                                    time: split[1],
                                                    initDate: isNow,
                                                })
                                                this._getNearbycars()
                                            } else {
                                                this._onDateChange(date)
                                            }
                                        })
                                    }}>
                                    <Text
                                        style={styles.item_text_normal}>{this._parseDate()}</Text>
                                </TouchableOpacity>

                            </View>}

                        </View>}


                    <View style={styles.item_top}/>


                    <View style={[styles.item, styles.item_height, styles.item_paddingTop]}>

                        <HollowCircle circleStyle={styles.start_point}></HollowCircle>

                        <AddressButton
                            disabled={isSubmitable ? false : true}
                            address={item.from.address ? item.from.address : '请选择上车地点'}
                            onClick={(serviceId === 7) ? this._airPlane.bind(this, 2) : this._poiSearch.bind(this, 2)}>
                        </AddressButton>
                    </View>

                    <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20}}>

                        <View style={[styles.line, styles.line_center, {height: 1}]}/>

                    </View>

                    <View style={[styles.item, styles.item_height, styles.item_paddingTop]}>

                        <HollowCircle circleStyle={styles.end_point}></HollowCircle>

                        <AddressButton
                            disabled={isSubmitable ? false : true}
                            address={item.to.address ? item.to.address : '请选择下车地点'}
                            onClick={serviceId === 8 ? this._airPlane.bind(this, 1) : this._poiSearch.bind(this, 1)}>
                        </AddressButton>
                    </View>

                    {(item.orderId === 0 && estimate.length !== 0 && estimate.length !== 1) &&
                    <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20}}>

                        <View style={[styles.line, styles.line_center]}/>

                    </View>}

                    {(item.orderId === 0 && estimate.length !== 1 && estimate.length !== 0) ?
                        <CarItem ref={(carItem) => {
                            this.state.carItem = carItem
                        }}
                                 estimate={estimate}
                                 estimates={estimates}
                                 selectEstimate={this._selectEstimate}
                                 isInit={isCarInit}
                                 carStyle={car_style}
                                 carSelect={carSelect}/> : null}

                    {this.renderSupplier()}

                    {this._renderGroupInfo()}

                    {this._renderCarNumber()}

                    { item.orderId !== 0 ? <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        height: 45,
                        justifyContent: 'flex-start',
                        marginTop: 12,
                        backgroundColor: 'white',
                        paddingLeft: 20,
                        paddingRight: 20,
                        alignItems: 'center',
                    }}>

                        <Text style={{color: 'gray'}}>{item.carGroupType}</Text>

                    </View> : null}


                    {(orderId !== null && orderId !== 0) &&
                    <View style={[styles.item, styles.item_height, styles.item_paddingTop, {marginTop: 12}]}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', flex: 1}}>
                            <View style={{marginLeft: 8, flexDirection: 'column'}}>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666666',
                                }}>{price_title} <Text style={{color: '#ed7140', fontSize: 18}}>¥{total}</Text></Text>
                                {/*<Text style={{color: '#666666', fontSize: 10}}>预估价,仅供参考,以实际费用为准</Text>*/}
                            </View>
                            <Image
                                style={{width: 100, height: 15, alignSelf: 'center'}}
                                source={supplier === DIDI ? images['ic_didi_logo'] : images['ic_shenzhou_logo']}></Image>
                        </View>
                    </View>}

                    { item.orderId === 0 ? null :

                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            height: 45,
                            justifyContent: 'space-between',
                            marginTop: 12,
                            backgroundColor: 'white',
                            paddingLeft: 20,
                            paddingRight: 20,
                        }}>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity style={{height: 20, width: 20}}
                                                  onPress={this._goToPhone.bind(this, this.state.supplierPhone)}>
                                    <Image source={require('./img/ic_call.png')}
                                           style={{height: 20, width: 20}}></Image>
                                </TouchableOpacity>

                                <Text style={{marginLeft: 12}}>{this.state.item.supplierName}(服务商)</Text>
                            </View>

                            <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>

                                <Text>{this.state.item.orderNo}</Text>

                                <Text style={{fontSize: 10, color: 'gray'}}>红橘订单号</Text>

                            </View>

                        </View>}

                    {(item.orderId !== 0 && (driverName && driverName !== '')) ?
                        <View style={{flexDirection: 'row', backgroundColor: 'white'}}>

                            <View style={[styles.line, styles.line_center]}/>

                        </View> : null}

                    {(item.orderId === 0 || (!driverName || driverName === '')) ? null :

                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            height: 45,
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            paddingLeft: 20,
                            paddingRight: 20,
                        }}>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity style={{height: 20, width: 20}}
                                                  onPress={this._goToPhone.bind(this, this.state.virtualPhonePsg)}>
                                    <Image source={require('./img/ic_call.png')}
                                           style={{height: 20, width: 20}}></Image>
                                </TouchableOpacity>

                                <Text style={{marginLeft: 12, fontSize: 14}}>{this.state.driverName}</Text>


                                <Text style={{fontSize: 14, color: '#333333', marginLeft: 12}}>{this.state.vehicleModel}<Text
                                    style={{
                                        fontSize: 14,
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        height: 5,
                                        width: 5
                                    }}> · </Text>{this.state.vehicleNo}</Text>

                            </View>

                        </View>}

                    {this.renderMap()}

                    {serviceId === 7 ?
                        <View style={{
                            marginTop: 12,
                            marginLeft: 20,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>

                            {<View style={{
                                height: 8,
                                width: 8,
                                backgroundColor: '#faad97',
                                marginRight: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 100,
                            }}></View>}

                            <Text style={{fontSize: 10, color: 'gray'}}>
                                接机服务时,若航班延误可享受免费等待
                            </Text>
                        </View > : null}


                </ScrollView>

                {/*{this._renderSectionCarNumber()}*/}

                {this._renderPay()}

                <DatePicker
                    ref={(picker) => {
                        this.state.picker = picker
                    }}
                    style={{width: 200, height: 0}}
                    date={this.state.date + ' ' + this.state.time}
                    mode="datetime"
                    format="YYYY-MM-DD HH:mm"
                    minDate={dateInformation.date}
                    minTime={dateInformation.time}
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    onDateChange={this._onDateChange}>
                </DatePicker>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loadingVisible ? <Loading/> : this._renderAppointmentCar()}
            </View>)
    }
}


const styles = StyleSheet.create({

    container: {
        backgroundColor: '#f3f3f3',
        flexDirection: 'column',
        flex: 1,
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 20
    },

    item: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
    },

    itemText: {
        fontSize: 15,
        margin: 2
    },

    item_height: {
        height: 50,
    },

    item_top: {
        marginTop: 12,
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
    item_flex: {
        flex: 1,
    },

    item_input: {
        flex: 1,
        marginLeft: 8
    },

    item_text_gary: {
        color: 'gray',
        width: 60,
    },

    item_text_boardingtime: {
        color: '#faad97',
    },

    line: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        height: 0.5,
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
        marginTop: 2
    },
    appointment_button: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    appointment_button_disable: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    appointment_touch: {
        backgroundColor: '#ed7140',
        width: 69,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    appointment_touch_disable: {
        backgroundColor: '#faad97',
        width: 69,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    appointment_touch_cancel: {
        backgroundColor: '#c6c6c6',
        width: 69,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    appointment_touch_cancel_disable: {
        backgroundColor: '#c6c6c6',
        width: 69,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        opacity: 0.5
    },
    bottom_container: {
        backgroundColor: 'white',
        height: 50,
        flexDirection: 'row',
        paddingLeft: 15,
        justifyContent: 'space-between',
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
        marginLeft: 20,
        flex: 1,
    },

    end_point: {
        backgroundColor: '#449ff7',
    },

    start_point: {
        backgroundColor: '#ffb400'
    },

    touchable_pay: {
        backgroundColor: '#ed7140',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 4,
        marginRight: 12,
    },

    touchable_pay_disable: {
        backgroundColor: '#faad97',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 4,
        marginRight: 12,
    },

    text_pay: {
        color: 'white',
        fontSize: 16,
    },
    text_pay_disable: {
        color: 'white',
        fontSize: 16,
        opacity: 0.5,
    },

    touchable_pay_cancel: {
        backgroundColor: '#ed7140',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 4,
        marginRight: 12,
    },
    touchable_pay_cancel_disable: {
        backgroundColor: '#faad97',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 4,
        marginRight: 12,
    },
    navigator_line: {
        height: 2,
        width: 60,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },
    navigator_touch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 40,
        flexDirection: 'column',
    },
    navigator_group: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    navigator_container: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginLeft: 10,
        marginRight: 40,
        justifyContent: 'center',
    },

})
