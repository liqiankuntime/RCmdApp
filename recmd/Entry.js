/**
 * Created by hsz on 16/8/26.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ListView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import MainPage from './MainPage';
import {getTimeDiffer} from '../hotel/common/comm'
import RenderHeader from '././entry/header'
import RenderCell from '././entry/tripsRow'
import RenderBottom from '././entry/bottom'
import Loading from '././common/Loading'
import {loadTrips} from './actions';
import {MessageBox} from '../common/utils';
import * as NATIVE from '../native';
import {alertShow} from '../common/Alert'

var currentDate = new Date()
let hour = currentDate.getHours() < 10 ? ('0' + currentDate.getHours()) : currentDate.getHours()
let minutes = currentDate.getMinutes() < 10 ? ('0' + currentDate.getMinutes()) : currentDate.getMinutes()
let month = (1 + currentDate.getMonth()) < 10 ? ('0' + (1 + currentDate.getMonth())) : (1 + currentDate.getMonth())
let day = ( currentDate.getDate()) < 10 ? ('0' + (currentDate.getDate())) : ( currentDate.getDate())

const dateInformation = {
    time: hour + ':' + minutes,
    date: (currentDate.getFullYear()) + '-' + month + '-' + day,
    minDate: (currentDate.getFullYear()) + '-' + (currentDate.getMonth()) + '-' + (currentDate.getDate()),
}

//AppRegistry.registerComponent('Entry', () => MySecond);

const windowHeight = Dimensions.get('window').height;

import DatePicker from './common/picker/index'
var dateCallback, selectDate

let keyNum = 0;
let groupId = 1;
let companyId = 3;
let data = new Object();
var picker = null;

export default class Entry extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        })
        groupId = this.props.groupId
        companyId = this.props.companyId
        data = defaultData(null)
        this.state = {
            netError: false,
            isLoading: false,
            dataSource: ds,
            listdata: ds.cloneWithRowsAndSections(data),
            amount: null,

        }
    }

    componentDidMount() {
        this.getTripsData(this.props)
    }

    _renderNetworkErr() {
        return (
            <View style={{height: 180, marginTop: 150, alignItems: 'center'}}>
                <Image source={require('./img/warning@3x.png')} style={{width: 60, height: 60}}/>
                <Text style={{marginTop: 30}}>网络问题,请检查。</Text>
            </View>
        );
    }

    _onNetError() {
        this.setState({netError: true});
    }

    updateAmount(value) {
        data.header[0].amount = value
        this.setState({
            amount: value
        })
    }

    render() {
        if (this.state.netError) {
            return this._renderNetworkErr();
        }
        return (
            <View style={{flex: 1, flexDirection: 'column', marginTop: 0, backgroundColor: '#f3f3f3'}}>
                {this.state.isLoading ?
                    <Loading/>
                    :
                    <View>
                        <View style={{height: windowHeight - 50 - 64}}>
                            <ListView
                                //dataSource={this.state.dataSource.cloneWithRowsAndSections(data)}
                                dataSource={this.state.listdata}
                                renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}
                                renderSectionHeader={(sectionData, sectionID) => this._renderSectionHeader(sectionData, sectionID)}
                            />
                        </View>
                        <RenderSure navigator={this.props.navigator}
                                    onNetError={this._onNetError.bind(this)}
                                    loadTrips={this.props.loadTrips.bind(this)}
                                    loadingStart={this.loadingStart.bind(this)}
                                    checkStatus={this.checkStatus.bind(this)}
                                    getParameter={this.getParameter.bind(this)}/>
                        {this.renderPicker()}
                    </View>
                }
            </View>

        );
    }

    _renderRow(rowData, sectionID, rowID) {
        //Alert.alert(JSON.stringify(rowData))
        switch (sectionID) {
            case 'header':
                let reason = rowData.reason
                let visitors = rowData.visitorsName
                return (
                    <RenderHeader data={rowData} key={rowData.key}
                                  changeReasonCallBack={this.changeReasonCallBack.bind(this)}
                                  changeVisitorsCallBack={this.changeVisitorsCallBack.bind(this)}
                                  updateAmount={this.updateAmount.bind(this)}
                    />
                )
            case 'trafficlist':
                let rowNum = data.trafficlist.length
                return (
                    <RenderCell rowData={rowData} sectionID={sectionID} rowID={rowID} key={rowData.key} rowNum={rowNum}
                                changeCityCallBack={this.changeCityCallBack.bind(this)}
                                changeDateCallBack={this.changeDateCallBack.bind(this)}
                                deleteCallBack={this.deleteCallBack.bind(this)}
                                openPicker={this.openPicker.bind(this)}
                                updateData={this.updateData.bind(this)}
                                showDelBtn={this.showDelBtn.bind(this)}
                    />
                )
            case 'bottom':
                return (
                    <RenderBottom isPrior={rowData.isPrior} pubPri={rowData.pubpritype}
                                  applicationId={this.props.applicationId}
                                  changeIsPriorCallBack={this.changeIsPriorCallBack.bind(this)}
                                  changePubPriTypeCallBack={this.changePubPriTypeCallBack.bind(this)}
                    />
                )
            default :
                return (
                    <View>
                        <Text>......</Text>
                    </View>
                )
        }
    }

    _renderSectionHeader(sectionData, sectionID) {
        switch (sectionID) {
            case 'bottom':
                return (
                    <View style={{height: 35, marginTop: -13, flexDirection: 'row-reverse'}}>
                        <TouchableOpacity style={{marginTop: 0, marginRight: 30, width: 35, height: 35}}
                                          onPress={() => this.addNewTrip()}>
                            <Image source={require('./img/xingchengtianjia.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                )
            default:
                return (
                    <View style={{height: 18, backgroundColor: '#f3f3f3'}}>

                    </View>
                )
        }
    }


    renderPicker() {
        return (
            <DatePicker
                date={dateInformation.date + ' ' + dateInformation.time}
                ref={(datepicker) => {
                    if (datepicker !== null) {
                        picker = datepicker
                    }
                }}
                style={{width: 200, height: 0}}
                mode="datetime"
                format="YYYY-MM-DD HH:mm"
                minDate={dateInformation.date}
                minTime={dateInformation.time}
                confirmBtnText="确定"
                cancelBtnText="取消"
                onDateChange={this._onDateChange.bind(this)}>
            </DatePicker>
        )
    }

    openPicker(date, rowId, callback) {
        var result
        if (date) {
            var split = date.split(' ')
            result = split.length === 2 ? date : split[0] + ' ' + dateInformation.time
        } else {
            result = dateInformation.date + ' ' + dateInformation.time
        }
        dateCallback = callback
        NATIVE.openDatepicker('选择到达时间', dateInformation.date + ' ' + dateInformation.time, result, 30, 60, false, true, (isNow = false, date) => {
            data.trafficlist[rowId].departDate = date
            this._onDateChange(date)
        })
        // picker.onPressDate(result)
    }

    _onDateChange = (response) => {
        var split = response.split(' ');
        var parseDate = split[0].split('-')
        var parseTime = split[1].split(':')
        var nextDate = new Date()
        nextDate.setFullYear(parseDate[0])
        nextDate.setMonth(parseDate[1])
        nextDate.setDate(parseDate[2])
        nextDate.setHours(parseTime[0])
        nextDate.setMinutes(parseTime[1])
        dateCallback(response)
        this.refreshDataSource()
    }

    updateData(rowData, rowID) {
        data.trafficlist.splice(rowData, rowID)
    }

    changeReasonCallBack(reason) {
        data.header[0].reason = reason
    }

    changeVisitorsCallBack(names, passengersId, visitorsId) {
        data.header[0].visitorsName = names
        data.header[0].passengersId = passengersId
        data.header[0].visitorsId = visitorsId
        this.refreshDataSource()
    }

    changeCityCallBack(result, rowId) {
        const {lat, lng, location, cityId, cityName} = result;
        //console.log(result);
        let detail = new Object();
        detail.lat = lat;
        detail.lng = lng;
        detail.location = location;
        detail.cityId = cityId;
        detail.cityName = cityName;
        //console.log(detail);
        if (rowId == 0) {
            data.trafficlist[0].trafficFrom = cityName;
            data.trafficlist[0].from = detail;
            data.trafficlist[1].trafficFrom = cityName;
            data.trafficlist[1].from = detail;
        }
        else {
            let rowNum = parseInt(rowId);
            data.trafficlist[rowNum].trafficTo = cityName;
            data.trafficlist[rowNum].to = detail;
            if (rowNum + 1 != data.trafficlist.length) {
                data.trafficlist[rowNum + 1].trafficFrom = cityName;
                data.trafficlist[rowNum + 1].from = detail;
            }
            if (rowNum === 1) {
                data.trafficlist[0].trafficTo = cityName
                data.trafficlist[0].to = detail
            }

        }
        this.refreshDataSource()
    }

    changeDateCallBack(name, rowId) {
        let rowNum = parseInt(rowId)
        data.trafficlist[rowNum].departDate = name;
    }

    deleteCallBack(rowId) {
        if (data.trafficlist.length <= 2) {
            alertShow('至少要有一条行程')
        }
        else {
            let rowNum = parseInt(rowId)
            if (data.trafficlist.length != rowNum + 1) {
                data.trafficlist[rowNum + 1].trafficFrom = data.trafficlist[rowNum].trafficFrom
            }
            data.trafficlist.splice(rowNum, 1)
            this.refreshDataSource()
        }
    }

    showDelBtn() {
        return data.trafficlist.length > 2
    }

    addNewTrip() {
        let length = data.trafficlist.length
        let trafficFrom = data.trafficlist[length - 1].trafficTo
        let from = data.trafficlist[length - 1].to
        data.trafficlist.push({trafficFrom: trafficFrom, trafficTo: '', departDate: '', key: keyNum++, from: from})
        this.refreshDataSource()
    }

    refreshDataSource() {
        this.setState({
            listdata: this.state.dataSource.cloneWithRowsAndSections(data)
        })
    }

    changeIsPriorCallBack(bool) {
        data.bottom[0].isPrior = bool
    }

    changePubPriTypeCallBack(pubpri) {
        data.bottom[0].pubpritype = pubpri
    }

    loadingStart(bool) {
        this.setState({
            isLoading: bool
        })
    }

    getTripsData(param) {
        if (param.applicationId) {
            this.loadingStart(true)
            let url = param.managerHost + 'expense/appdetail/' + param.applicationId
            fetch(url)
                .then((response) => response.json())
                .then((response) => {
                    //Alert.alert(JSON.stringify(response))
                    data = defaultData(response)
                    this.refreshDataSource()
                    this.loadingStart(false)
                })
                .catch((error) => {
                    alertShow(JSON.stringify(error))
                    this.loadingStart(false)
                })
                .done();
        }
    }

    checkStatus = () => {
        var flag = true
        console.log(JSON.stringify(data.trafficlist) + '====>' + data.trafficlist.length)
        for (let item of data.trafficlist) {
            let toCity = item.trafficTo
            let fromCity = item.trafficFrom
            if ((toCity && toCity !== '') && (fromCity && fromCity !== '') && ( item.departDate && item.departDate !== '')) {
                continue
            } else {
                return false
            }
        }

        if ((data.header.length > 0) && (!data.header[0].visitorsName) || (data.header[0].visitorsName.length === 0)) {
            return false
        }

        data.trafficlist.forEach((value, index) => {
            if (!value.to) {
                data.trafficlist[index].to = {}
                data.trafficlist[index].to.location = ''
                data.trafficlist[index].to.lat = ''
                data.trafficlist[index].to.lng = ''
                data.trafficlist[index].to.cityName = data.trafficlist[index].trafficTo
                NATIVE.getCityEvent(data.trafficlist[index].to.cityName, (error, result) => {
                    data.trafficlist[index].to.cityId = result.id
                })
            }
            if (!value.from) {
                data.trafficlist[index].from = {}
                data.trafficlist[index].from.location = ''
                data.trafficlist[index].from.lat = ''
                data.trafficlist[index].from.lng = ''
                data.trafficlist[index].from.cityName = data.trafficlist[index].trafficFrom
                NATIVE.getCityEvent(data.trafficlist[index].from.cityName, (error, result) => {
                    data.trafficlist[index].from.cityId = result.id
                })
            }
        })

        // if(!this.state.amount){
        //     return false
        // }

        return flag
    }


    getParameter() {
        if (data.header[0].visitorsId.length + data.header[0].passengersId.length == 0) {
            alertShow('请完善出行人信息')
            return null
        }
        for (let i = 1; i < data.trafficlist.length; i++) {
            let traffic = data.trafficlist[i]
            if (traffic.trafficFrom.length == 0 || traffic.trafficTo.length == 0 || traffic.departDate.length == 0) {
                alertShow('请完善行程信息')
                return null
            }
            else {
                if (!dateCompare(traffic.departDate)) {
                    return null
                }
            }
            if (i > 1) {
                let lastTraffic = data.trafficlist[i - 1]
                if (!dateCompare(traffic.departDate, lastTraffic.departDate)) {
                    return null
                }
            }
        }
        let parameter = new Object()
        parameter.groupId = groupId
        parameter.companyId = companyId
        parameter.reason = data.header[0].reason
        parameter.visitors = data.header[0].visitorsId
        parameter.passengers = data.header[0].passengersId
        parameter.staffId = data.header[0].passengersId.concat(data.header[0].visitorsId)
        parameter.trafficlist = data.trafficlist.slice(1, data.trafficlist.length)
        parameter.pubpritype = data.bottom[0].pubpritype
        parameter.isPrior = data.bottom[0].isPrior
        parameter.budget = Number(this.state.amount)
        //console.log('param==>' + JSON.stringify(parameter))
        return parameter
    }

}


class RenderSure extends Component {
    render() {
        let flag = this.props.checkStatus()
        return (
            <TouchableOpacity onPress={this._sureBtnClicked.bind(this, this.props.getParameter)}
                              disabled={!flag}>
                <View style={flag ? bottomStyle.view : bottomStyle.nosubmit}>
                    <Text style={bottomStyle.text}>计划我的行程</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _sureBtnClicked() {
        let param = this.props.getParameter()
        //console.log('param==>' + JSON.stringify(param))
        if (param == null) {
            return
        }
        this.props.loadingStart(true);
        this.props.loadTrips(param,
            () => {
                this.props.navigator.push({
                    name: 'MainPage',
                    component: MainPage,
                });
            },
            error => {
                if (error.status) {
                    MessageBox.error('提示', '获取推荐信息失败!', error);
                }
                else {
                    this.props.onNetError();
                }
            }
        ).then(() => this.props.loadingStart(false));
    }
}

var bottomStyle = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'rgb(237,113,64)',
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    nosubmit: {
        flex: 1,
        backgroundColor: '#c5c5c5',
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 15,
    }

})

function defaultData(json) {
    if (json) {
        let data = new Object()
        let names = new Array()
        let visitorsid = new Array()
        let passengersid = new Array()
        json.passengers.map(function (passenger) {
            passengersid.push(passenger.id)
            names.push(passenger.name)
        })
        json.visitors.map(function (visitor) {
            visitorsid.push(visitor.id)
            names.push(visitor.name)
        })
        let trafficlist = new Array()
        if (json.travelapplicationdetail_set.length > 0) {
            for (let i = 0; i < json.travelapplicationdetail_set.length; i++) {
                if (i == 0) {
                    let trip = json.travelapplicationdetail_set[0]
                    let traffic1 = new Object()
                    traffic1.tripId = trip.id
                    traffic1.trafficFrom = trip.fromCity
                    traffic1.trafficTo = trip.toCity
                    traffic1.departDate = trip.startDate.length <= 10 ? trip.startDate + ' 12:00' : trip.startDate
                    traffic1.key = keyNum++
                    trafficlist.push(traffic1)
                    let traffic2 = new Object()
                    traffic2.tripId = trip.id
                    traffic2.trafficFrom = trip.fromCity
                    traffic2.trafficTo = trip.toCity
                    traffic2.departDate = trip.startDate.length <= 10 ? trip.startDate + ' 12:00' : trip.startDate
                    traffic2.key = keyNum++
                    trafficlist.push(traffic2)
                }
                else {
                    let lasttrip = json.travelapplicationdetail_set[i - 1]
                    let trip = json.travelapplicationdetail_set[i]
                    if (lasttrip.toCity != trip.fromCity) {
                        let traffic1 = new Object()
                        traffic1.tripId = trip.id
                        traffic1.trafficFrom = lasttrip.toCity
                        traffic1.trafficTo = trip.fromCity
                        traffic1.departDate = trip.endDate.length <= 10 ? trip.endDate + ' 12:00' : trip.endDate
                        traffic1.key = keyNum++
                        trafficlist.push(traffic1)
                    }
                    let traffic2 = new Object()
                    traffic2.tripId = trip.id
                    traffic2.trafficFrom = trip.fromCity
                    traffic2.trafficTo = trip.toCity
                    traffic2.departDate = trip.startDate.length <= 10 ? trip.startDate + ' 12:00' : trip.startDate
                    traffic2.key = keyNum++
                    trafficlist.push(traffic2)
                }
            }
        }
        else {
            trafficlist = [
                {trafficFrom: '', trafficTo: '', departDate: getNowFormatDate(), tripId: 0, key: keyNum++},
                {trafficFrom: '', trafficTo: '', departDate: '', tripId: 0, key: keyNum++},
            ]
        }
        data.header = [{
            reason: json.reason,
            visitorsName: names,
            passengersId: passengersid,
            visitorsId: visitorsid,
            key: 2
        }]
        data.trafficlist = trafficlist
        data.bottom = [{isPrior: false, pubpritype: 'pub'}]
        return data
    }
    else {
        data.header = [{reason: '', visitorsName: [], passengersId: [], visitorsId: [], key: 1}]
        data.trafficlist = [
            {trafficFrom: '', trafficTo: '', departDate: getNowFormatDate(), tripId: 0, key: keyNum++},
            {trafficFrom: '', trafficTo: '', departDate: getNowFormatDate(), tripId: 0, key: keyNum++},
        ]
        data.bottom = [{isPrior: false, pubpritype: 'pub'}]
        return data
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getNowFormatDate() {
    var date = new Date();
    // var seperator1 = "-";
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var strDate = date.getDate();
    // if (month >= 1 && month <= 9) {
    //     month = "0" + month;
    // }
    // if (strDate >= 0 && strDate <= 9) {
    //     strDate = "0" + strDate;
    // }
    // var currentdate = year + seperator1 + month + seperator1 + strDate;
    var now = new Date(date.getTime() + (6 * 60 * 60 * 1000));
    return now.Format('yyyy-MM-dd hh:mm');
    // return dateInformation.date + ' ' + dateInformation.time;
}

function dateCompare(date, lastDate) {
    if (data == undefined || date == null || date == '') {
        alertShow('行程到达日期不能为空！');
        return false;
    }
    else {
        let result = getTimeDiffer(date, lastDate);
        if (result == 0 || result == -1) {
            if (lastDate === undefined) {
                alertShow('行程到达日期不能小于当前日期！')
            }
            else
                alertShow('后面行程到达日期不能小于前面行程到达日期！')
            return false;
        }
        else
            return true;
    }
}
