/**
 * Created by yonyou on 16/7/4.
 */
import * as types from './actionTypes';
import Util from '../common/utils';
import {NativeModules} from 'react-native';//ios原生混编react native
import React from 'react';
import {Alert} from 'react-native';
let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

export let fetchJourney = ( opts, isLoadMore, canLoadHisMore, isLoading)=> {

    //let host ='http://testtrade.wecaiwu.com/';//交易端测试
    //let host ='http://trade.wecaiwu.com/';//交易端正式
    //let host ='http://test.wecaiwu.com/';//管理端正式
    // url 为 http 请求,需要修改plist

    let URL='';
    let param = {};


    //请求月行程日期和姓名
    if(opts.calenderDate){
        URL ='staffcalendar/getcalendarofmonth/';
        param = {
            year:opts.year,
            month:opts.month,
            queryType:opts.queryType
        }
        let pm = JSON.stringify(param);
        return dispatch =>{
            //dispatch(fetchJourneyList(isLoadMore, canLoadHisMore, isLoading));
            return YYRNBridgeModule.RNGetListDateOCCallBack(
                URL,
                pm,
                (error,events)=> {
                    if (error) {
                        console.error(error);
                        let errorTxt=JSON.parse(error);
                        let msgTxt='';
                        if(errorTxt.errorCode==5000){
                            msgTxt='网络异常,请稍后再试';
                        }else if(errorTxt.errorCode==2501){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2502){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2503){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2504){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2505){
                            msgTxt=errorTxt.msg;
                        }else {
                            msgTxt='网络异常,请稍后再试';
                        }
                        Alert.alert('','error:'+msgTxt,[
                            {text:'确定'}
                        ]);
                        let errorData = {};
                        dispatch(receiveMonthCalenderDate(errorData));
                    } else {
                        //this.setState({events: events});
                        dispatch(receiveMonthCalenderDate(events));
                    }
                }
            )
        }
    }


    //请求行程信息
    if(opts.querySourceType == 2){//部门行程订单详情
        URL ='staffcalendar/getapplicationdetail/';
        param = {
            date:opts.date,
            detailId:opts.detailId,
            passengerId:opts.passengerId
        }
        let pm = JSON.stringify(param);
        return dispatch =>{
            dispatch(fetchJourneyList(isLoadMore, canLoadHisMore, isLoading));
            return YYRNBridgeModule.RNGetListDateOCCallBack(
                URL,
                pm,
                (error,events)=> {
                    if (error) {
                        console.error(error);
                        let errorTxt=JSON.parse(error);
                        let msgTxt='';
                        if(errorTxt.errorCode==5000){
                            msgTxt='网络异常,请稍后再试';
                        }else if(errorTxt.errorCode==2501){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2502){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2503){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2504){
                            msgTxt=errorTxt.msg;
                        }else if(errorTxt.errorCode==2505){
                            msgTxt=errorTxt.msg;
                        }else {
                            msgTxt='网络异常,请稍后再试';
                        }
                        Alert.alert('','error:'+msgTxt,[
                            {text:'确定'}
                        ]);
                        let errorData = {data:[]};
                        dispatch(receiveJourneyDetailList(errorData));
                    } else {
                        //this.setState({events: events});
                        dispatch(receiveJourneyDetailList(events));
                    }
                }
            )
        }

    }else if(opts.querySourceType == 1){//部门行程
        URL ='staffcalendar/getchildrencalendar/';
        //URL ='staffcalendar/testchildren/';
        param = {
            date: opts.date,
            dateType: opts.dateType,
            scrollType: opts.scrollType,
            queryType:opts.queryType,
            //index: opts.index,
            pageCapacity:opts.pageCapacity,
            childrenPrivilege: opts.childrenPrivilege,
            departmentPrvilege:opts.departmentPrvilege,
        }

    }else if(opts.querySourceType == 0){//自己的行程
        URL ='staffcalendar/getstaffcalendar/';
        param = {
            date: opts.date,
            dateType: opts.dateType,
            scrollType: opts.scrollType,
            //index: opts.index,
            pageCapacity:opts.pageCapacity,
            childrenPrivilege: opts.childrenPrivilege,
            departmentPrvilege:opts.departmentPrvilege,
        }
    }
    let pm = JSON.stringify(param);
    return dispatch =>{
        dispatch(fetchJourneyList(isLoadMore, canLoadHisMore, isLoading));
        return YYRNBridgeModule.RNGetListDateOCCallBack(
            URL,
            pm,
            (error,events)=> {
                if (error) {
                    //alert(JSON.stringify(error));
                    console.error(error);
                    let errorTxt=JSON.parse(error);
                    let msgTxt='';
                    if(errorTxt.errorCode==5000){
                        msgTxt='网络异常,请稍后再试';
                    }else if(errorTxt.errorCode==2501){
                        msgTxt=errorTxt.msg;
                    }else if(errorTxt.errorCode==2502){
                        msgTxt=errorTxt.msg;
                    }else if(errorTxt.errorCode==2503){
                        msgTxt=errorTxt.msg;
                    }else if(errorTxt.errorCode==2504){
                        msgTxt=errorTxt.msg;
                    }else if(errorTxt.errorCode==2505){
                        msgTxt=errorTxt.msg;
                    }else {
                        msgTxt='网络异常,请稍后再试';
                    }
                    Alert.alert('','error:'+msgTxt,[
                        {text:'确定'}
                    ]);
                    let errorData = {data:[]};
                    dispatch(receiveJourneyList(errorData));
                } else {
                    //this.setState({events: events});
                    dispatch(receiveJourneyList(events));
                }
            }
        )
    }
    //本地
    // return dispatch => {
    //     // 请求轮播数据
    //     dispatch(fetchJourneyList(isLoadMore, isRefreshing, isLoading));
    //
    //     return Util.postJson(URL, (response) => {
    //         console.log(response);
    //         dispatch(receiveJourneyList(response))
    //     }, (error) => {
    //         console.log(error);
    //         dispatch(receiveJourneyList([]));
    //     });
    // }
}

let fetchJourneyList = (isLoadMore, canLoadHisMore, isLoading)=> {
    return {
        type: types.FETCH_Journey_LIST,
        isLoadMore: isLoadMore,
        canLoadHisMore: canLoadHisMore,
        isLoading: isLoading,
    }
}

let receiveJourneyList = (journey) => {
    //let dfg = feeds.sort(this.compare);
    if(journey.childrenPrivilege!=undefined || journey.departmentPrvilege!=undefined){
        return {
            type: types.RECEIVE_Journey_LIST,
            journey: journey.data,
            isEnd:journey.isEnd,
            childrenPrivilege:journey.childrenPrivilege,
            departmentPrvilege:journey.departmentPrvilege,
            toDepartment:journey.toDepartment,
            queryType:journey.queryType

        }
    }else{
        return {
            type: types.RECEIVE_Journey_LIST,
            journey: journey.data,
            isEnd:journey.isEnd,
            queryType:journey.queryType
            
        }
    }

}
let receiveJourneyDetailList = (journeyDetail) =>{
        return {
            type:types.RECEIVE_JourneyDetail_LIST,
            journeyDetail:journeyDetail.data,
        }
}

export let receiveCalenderHeight = (height) => {
    return {
        type:types.RECEIVE_Calender_Height,
        calenderHeight:height,
    }
}
export let receiveCalenderYearmonth = (yearMonth) => {
    return {
        type:types.RECEIVE_Calender_Yearmonth,
        calenderYm:yearMonth
    }
}
export let receiveTodayBtn = (showTodayBtn) => {
    return {
        type:types.RECEIVE_Today_Btn,
        showTodayBtn:showTodayBtn
    }
}
export let receiveCalenderDate = (canOnReachedEnd) => {
    return {
        type:types.RECEIVE_Calender_Date,
        canOnReachedEnd:canOnReachedEnd
    }
}
export let receiveshowFooter = (showFooter) => {
    return {
        type:types.RECEIVE_Show_Footer,
        showFooter:showFooter
    }
}
export let receiveCalenderViewHeight = (calenderViewHeight) => {
    return {
        type:types.RECEIVE_Show_CalenderViewHeight,
        calenderViewHeight:calenderViewHeight
    }
}
export let receiveRefreshOption = (refreshedOptiion) => {
    return {
        type:types.RECEIVE_Refresh_Option,
        refreshedOptiion:refreshedOptiion
    }
}
export let receiveMonthCalenderDate = (monthCalenderDate) => {
    return {
        type:types.RECEIVE_Month_CanlenderDate,
        monthCalenderDate:monthCalenderDate
    }
}
export let receiveCalenderLoadingData = (calenderLoading) => {
    return {
        type:types.RECEIVE_Calener_LoadingData,
        calenderLoading:calenderLoading
    }
}
