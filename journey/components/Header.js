/**
 * Created by chenty on 16/6/25.
 */
import React from 'react';
import {NativeModules} from 'react-native';//ios原生混编react native
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    DeviceEventEmitter,
    Platform
} from 'react-native';
let YYRNBridgeModule = NativeModules.YYRNBridgeModule;
console.log(Platform);
//let RCTCalendarManager = NativeModules.RCTCalendarManager;
import {fetchJourney} from '../actions/strollingActions';
import {receiveCalenderYearmonth} from '../actions/strollingActions';
import {receiveCalenderHeight} from '../actions/strollingActions';
import {receiveTodayBtn} from '../actions/strollingActions';
import {commondispatchcanlenderday} from '../common/commonDispatch';
import {receiveCalenderDate} from '../actions/strollingActions';
//import {receiveshowFooter} from '../actions/strollingActions';
import {receiveCalenderViewHeight} from '../actions/strollingActions';
import {receiveCalenderLoadingData} from '../actions/strollingActions';
import DatePicker2 from '../components/datepicker';
//import DatePicker2 from '../components/datepicker.android.js';//android device
//import DatePicker2 from '../components/datepicker.ios.js';//ios device
import Common from '../common/constants';
import moment from 'moment';

let canLoadMore = 'newData';
let canLoadHisMore = false;
let isLoading = true;
let currentBtn = 1;
let todayDate = false;
let theos = Platform.OS;

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){
        const {dispatch} = this.props;
        let today = moment().format('YYYY-MM-DD');
        DeviceEventEmitter.addListener(
            'datepickerpick',
            (events) =>{
                //alert('点击日历');
                dispatch(receiveCalenderLoadingData(true));
                if(theos=='ios'){
                    dispatch(receiveCalenderViewHeight(60));
                }else{
                    dispatch(receiveCalenderViewHeight(74));
                }
                if(events.date==today){
                    this._requireDataFun(events.date,1,1,1);
                    dispatch(receiveTodayBtn(true));
                    todayDate = true;
                }else if(events.date==''){
                    //dispatch(receiveTodayBtn(false));
                    //this._requireDataFun(today,2,1,5);
                }else{
                    this._requireDataFun(events.date,1,1,1);
                }
                if(theos=='ios'){
                    dispatch(receiveCalenderHeight(Common.window.height-130));
                }else{
                    YYRNBridgeModule.onDatePickerMode(false);
                    dispatch(receiveCalenderHeight(Common.window.height-144));
                }

            }
        );
        DeviceEventEmitter.addListener(
            'datepickeryearmonth',
            (events) =>{
                const {queryType} = this.props;
                let year = events.date.substring(0,4);
                let month = events.date.substring(5,7);
                let ym = year+'年'+month+'月';
                let optsCalenderDate = {
                    'year':parseInt(year),
                    'month':parseInt(month),
                    'queryType':queryType,
                    'calenderDate':true
                }
                dispatch(receiveCalenderYearmonth(ym));
                dispatch(fetchJourney( optsCalenderDate, false, false, false));
            }
        );
        DeviceEventEmitter.addListener(
            'datepickerisTodayWeek',
            (events) =>{
                if(events.isTodayWeek){
                    if(todayDate == false){
                        dispatch(receiveTodayBtn(false));
                    }
                    todayDate=false;
                }else{
                    dispatch(receiveTodayBtn(true));
                }
            }
        );
    }


    render(){
       
        const {queryType} = this.props;
        const {calenderYm} = this.props;
        const {journeyDates} = this.props;
        const {journeyNames} = this.props;
        const {calenderViewHeight} = this.props;
        const {departmentPrvilege} = this.props;
        const {childrenPrivilege} = this.props;
        let calenderY = calenderYm.substring(0,5);
        let calenderM = calenderYm.substring(5,9);


        /*android
        <Image
            source={require('../img/back.png')}
        />*/
        /*ios
        <Image
            source={require('../img/iosBack.png')}
        />*/

        return(

            <View>
            <View style={styles.container}>
                <View style={theos=='android'?styles.headTopAndroid:styles.headTopIos}></View>
                <View style={theos=='android'?styles.headtoolAndroid:styles.headtoolIos}>
                    <View style={{flexDirection:'row',flex:3}}>
                        <TouchableOpacity
                            onPress={this._back.bind(this)}
                            style={theos=='android'?styles.backArrowAndroid:''}
                        >
                            {theos=='ios'?
                                <Image
                                    source={require('../img/iosBack.png')}
                                />:
                                <Image
                                    source={require('../img/back.png')}
                                />
                            }

                        </TouchableOpacity>
                        {departmentPrvilege!=0 || childrenPrivilege!=0?
                            <View></View>:
                            <View style={{paddingLeft:20,alignItems:'center',flexDirection:'row',}}>
                                <Text style={{color:'#fff',fontSize:18}}>行程管理</Text>
                            </View>
                        }
                    </View>
                    {departmentPrvilege!=0 || childrenPrivilege!=0?
                        <View style={{flex:6,flexDirection:'row'}}>
                                <TouchableOpacity onPress={this._myJouney.bind(this)} style={{flex:2,flexDirection:'row'}}>
                                    {queryType==1 || currentBtn==1?
                                        <View style={[styles.bottonLineCommen,styles.bottomLine]}>
                                            <Text style={{color:'#fff',textAlign:'right',paddingTop:10,}}>我的</Text>
                                        </View>:
                                        <View style={[styles.bottonLineCommen,styles.bottomLine,styles.bottomLineNone]}>
                                            <Text style={{color:'#fff',textAlign:'right',paddingTop:10}}>我的</Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                            {childrenPrivilege!=0?
                                <TouchableOpacity onPress={this._directJouney.bind(this)} style={{flex:2,flexDirection:'row'}}>
                                    {queryType==2 || currentBtn==2?
                                        <View style={[styles.bottonLineCommen,styles.bottomLine]}>
                                            <Text style={{color:'#fff',textAlign:'left',paddingTop:10}}>下属</Text>
                                        </View>:
                                        <View style={[styles.bottonLineCommen,styles.bottomLine,styles.bottomLineNone]}>
                                            <Text style={{color:'#fff',textAlign:'left',paddingTop:10}}>下属</Text>
                                        </View>
                                    }
                                </TouchableOpacity>:
                                <View></View>
                            }
                            {departmentPrvilege!=0?
                                <TouchableOpacity onPress={this._departmentJouney.bind(this)} style={{flex:2,flexDirection:'row'}}>
                                    {queryType==3 || currentBtn==3?
                                        <View style={[styles.bottonLineCommen,styles.bottomLine]}>
                                            <Text style={{color:'#fff',textAlign:'center',paddingTop:10}}>部门</Text>
                                        </View>:
                                        <View style={[styles.bottonLineCommen,styles.bottomLine,styles.bottomLineNone]}>
                                            <Text style={{color:'#fff',textAlign:'center',paddingTop:10}}>部门</Text>
                                        </View>
                                    }
                                </TouchableOpacity>:
                                <View></View>
                            }

                        </View>:
                        <View style={{flex:2}}></View>
                    }

                    <TouchableOpacity
                        onPress={this._calender.bind(this)}
                        style={{flex:childrenPrivilege==0 && departmentPrvilege==0?8:2,paddingBottom:5,paddingRight:6}}
                    >
                        {childrenPrivilege==0 && departmentPrvilege==0?
                            <View style={{flexDirection:'row',}}>
                                <Text style={{color:'#fff',paddingTop:6}}>{calenderYm}</Text>
                            </View>:
                            <View>
                                <Text style={{color:'#fff',fontSize:13,textAlign:'right',paddingTop:5}}>{calenderM}</Text>
                                <Text style={{color:'#fff',fontSize:10,textAlign:'right'}}>{calenderY}</Text>
                            </View>
                        }

                    </TouchableOpacity>
                 </View>

            </View>
                <Animated.View style={{height: calenderViewHeight,flex: 1,backgroundColor:'#fff'}}>
                    <DatePicker2 style={{flex: 1}} dpmode="1" journeyDates={journeyDates} journeyNames={journeyNames}/>
                </Animated.View>
            </View>
        )

        //height: calenderViewHeight
        /*暂时不用
        {queryType==2 || queryType==3?
            <TouchableOpacity style={{flex:2}} onPress={this._myJouney.bind(this)}>
                <Text style={{color:'#fff',textAlign:'right'}}>我的</Text>
            </TouchableOpacity>:
            <View></View>
        }
        {queryType==2 && departmentPrvilege!=0?
            <TouchableOpacity style={{flex:2}} onPress={this._departmentJouney.bind(this)}>
                <Text style={{color:'#fff',textAlign:'right'}}>部门</Text>
            </TouchableOpacity>:
            <View></View>
        }
        {queryType==3 && childrenPrivilege!=0?
            <TouchableOpacity style={{flex:2}} onPress={this._directJouney.bind(this)}>
                <Text style={{color:'#fff',textAlign:'right'}}>下属</Text>
            </TouchableOpacity>:
            <View></View>
        }*/
    }
    _myJouney(){
        currentBtn = 1;
        const {dispatch} = this.props;
        const {childrenPrivilege} = this.props;
        const {departmentPrvilege} = this.props;
        dispatch(receiveCalenderDate(true));
        let today = moment().format('YYYY-MM-DD');
        let year = moment().year();
        let month = moment().month()+1;
        canLoadMore = 'newData';
        let opts = {
            'date': today,
            'dateType': 2,
            'scrollType': 1,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':0
        }
        let optsCalenderDate = {
            'year':year,
            'month':month,
            'queryType':1,
            'calenderDate':true
        }
        dispatch(fetchJourney( opts, canLoadMore, canLoadHisMore, true));
        dispatch(fetchJourney( optsCalenderDate, false, false, false));
    }
    _departmentJouney(){
        currentBtn = 3;
        const {dispatch} = this.props;
        const {childrenPrivilege} = this.props;
        const {departmentPrvilege} = this.props;
        dispatch(receiveCalenderDate(true));
        let today = moment().format('YYYY-MM-DD');
        let year = moment().year();
        let month = moment().month()+1;
        canLoadMore = 'newData';
        let opts = {
            'date': today,
            'dateType': 2,
            'scrollType': 1,
            'queryType': 3,
            'pageCapacity': 7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege': departmentPrvilege,
            'querySourceType': 1
        }
        let optsCalenderDate = {
            'year':year,
            'month':month,
            'queryType':3,
            'calenderDate':true
        }
        dispatch(fetchJourney( opts, canLoadMore, canLoadHisMore, true));
        dispatch(fetchJourney( optsCalenderDate, false, false, false));
    }
    _directJouney() {
        currentBtn= 2;
        const {dispatch} = this.props;
        const {childrenPrivilege} = this.props;
        const {departmentPrvilege} = this.props;
        dispatch(receiveCalenderDate(true));
        let today = moment().format('YYYY-MM-DD');
        let year = moment().year();
        let month = moment().month()+1;
        canLoadMore = 'newData';
        let opts = {
            'date': today,
            'dateType': 2,
            'scrollType': 1,
            'queryType': 2,
            'pageCapacity': 7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege': departmentPrvilege,
            'querySourceType': 1
        }
        let optsCalenderDate = {
            'year':year,
            'month':month,
            'queryType':2,
            'calenderDate':true
        }
        dispatch(fetchJourney( opts, canLoadMore, canLoadHisMore, true));
        dispatch(fetchJourney( optsCalenderDate, false, false, false));
    }
    _back(){
        //alert('返回到首页');
        return YYRNBridgeModule.popViewControllerBack();
    }
    _calender(){
        const {dispatch} = this.props;
        dispatch(receiveCalenderDate(false));
        const {calenderViewHeight} = this.props;
        if(theos=='ios'){
            if(calenderViewHeight==60){
                dispatch(receiveCalenderViewHeight(254));
                dispatch(receiveCalenderHeight(Common.window.height-130));
            }else if(calenderViewHeight==254){
                dispatch(receiveCalenderViewHeight(60));
                dispatch(receiveCalenderHeight(Common.window.height-314));
            }
        }else{
            if(calenderViewHeight==74){
                dispatch(receiveCalenderViewHeight(340));
                dispatch(receiveCalenderHeight(Common.window.height-384));
                return YYRNBridgeModule.onDatePickerMode(true);//android device
            }else if(calenderViewHeight==340){
                dispatch(receiveCalenderViewHeight(74));
                dispatch(receiveCalenderHeight(Common.window.height-144));
                return YYRNBridgeModule.onDatePickerMode(false);//android device
            }
        }


    }
    _requireDataFun(date,dateType,scrollType,pageCapacity){

        const {dispatch} = this.props;
        const {queryType} = this.props;
        const {childrenPrivilege} = this.props;
        const {departmentPrvilege} = this.props;
        commondispatchcanlenderday(dispatch,queryType,childrenPrivilege,departmentPrvilege,date,dateType,scrollType,pageCapacity);

    }
}


const styles = StyleSheet.create({

    container:{
        //flexDirection: 'row',
        //flex:1,
        //height:90,
        backgroundColor:'#ed7140',
        //justifyContent:'space-around',
        paddingRight:10,
        paddingLeft:10
    },
    bottonLineCommen:{
        height:34,
        paddingLeft:2,
        paddingRight:2,
        //width:40,
        //marginLeft:10,
    },
    bottomLine:{
        borderBottomWidth:2,
        borderBottomColor:'#fff',
        borderStyle:'solid'
    },
    bottomLineNone:{
        borderBottomWidth:2,
        borderBottomColor:'#ed7140',
        borderStyle:'solid'
    },
    backArrowlt:{
        height:2,
        width:10,
        marginTop:2,
        transform:[{rotate: '45deg'}],
        backgroundColor:'#fff'
    },
    backArrowlb:{
        height:2,
        width:10,
        marginTop:-10,
        transform:[{rotate: '-45deg'}],
        backgroundColor:'#f00'
    },
    headTopIos:{
        height:20
    },
    headTopAndroid:{
        height:0
    },
    headtoolIos:{
        height:44,
        flexDirection:'row',
        alignItems:'center'
    },
    headtoolAndroid:{
        height:44,
        flexDirection:'row',
    },
    backArrowAndroid:{
        marginTop:10
    }

})