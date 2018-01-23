/**
 * Created by yonyou on 16/7/4.
 */
import React from 'react';
import {
    Platform
} from 'react-native';
import * as types from '../actions/actionTypes';
import moment from 'moment';
import Common from '../common/constants';
let nowYear = moment().year();
let nowMonth = moment().month()+1;
let ym = nowYear+'年'+nowMonth+'月';
const initialState = {

    journey: [],
    journeyDetail:[],
    isLoading: true,
    isLoadMore: 'newData',  //加载数据时用于判断是未来数据还是历史数据还是切换新数据
    isRefreshing: false,
    canLoadHisMore:false,
    isEnd:false,  //数据是否到底
    childrenPrivilege:0,  //保存登录人的职能权限,不为0时有查看直接下属权限
    departmentPrvilege:0,  //保存登录人的职能权限,不为0时有查看直接部门权限
    toDepartment:false,  //为true时切换直接下属行程
    queryType:1,  //显示目前数据时哪一种,1是自己的行程,2是直接下属行程,3是部门行程
    calenderHeight:Platform.OS=='ios'?(Common.window.height-130):(Common.window.height-147),  //控制listView的高度
    calenderYm:ym,  //界面头部年月显示
    showTodayBtn:false,  //控制今天icon显示
    canOnReachedEnd:true,  //控制是否允许上拉加载更多未来行程
    showFooter:true, //控制listView的footer显示的文字
    calenderViewHeight:Platform.OS=='ios'?60:74, //滚动时日历收回,android
    //calenderViewHeight:60, //滚动时日历收回,ios
    refreshedOptiion:false,  //是否做了refresh操作
    monthCalenderDate:[], //记录月份
    loadingDataText:'',
    calenderLoading:false

};

let strollingReducer = (state = initialState, action) =>{
    let journey=[];
    switch (action.type){
        case types.FETCH_Journey_LIST:
            return Object.assign({}, state, {
                isLoadMore: action.isLoadMore,
                canLoadHisMore: action.canLoadHisMore,
                isLoading: action.isLoading,
            })
        case types.RECEIVE_Journey_LIST:
            if(state.isLoadMore=='futureData'){
                journey=state.journey.concat(action.journey);
            }else if(state.isLoadMore=='historyData'){
                journey=action.journey.concat(state.journey);
            }else if(state.isLoadMore=='newData'){
                journey=action.journey;
            }
            return Object.assign({}, state, {
                //journey: state.isLoadMore ? state.journey.concat(action.journey) : action.journey,
                //journey: state.isLoadMore ? action.journey.concat(state.journey) : action.journey,
                journey:journey,
                canLoadHisMore: false,
                isLoading: false,
                isEnd:action.isEnd,
                childrenPrivilege:action.childrenPrivilege!=undefined?action.childrenPrivilege:state.childrenPrivilege,
                departmentPrvilege:action.departmentPrvilege!=undefined?action.departmentPrvilege:state.departmentPrvilege,
                toDepartment:action.toDepartment?action.toDepartment:state.toDepartment,
                queryType:action.queryType,
                calenderLoading:false
            })

        case types.RECEIVE_JourneyDetail_LIST:
            return Object.assign({}, state, {
                journeyDetail: action.journeyDetail,
                canLoadHisMore: false,
                isLoading: false,
            })
        case types.RECEIVE_Calender_Height:
            return Object.assign({}, state, {
                calenderHeight: action.calenderHeight,
            })
        case types.RECEIVE_Calender_Yearmonth:
            return Object.assign({}, state, {
                calenderYm: action.calenderYm,
            })
        case types.RECEIVE_Today_Btn:
            return Object.assign({}, state, {
                showTodayBtn: action.showTodayBtn,
            })
        case types.RECEIVE_Calender_Date://控制是否onEnReached
            return Object.assign({}, state, {
                canOnReachedEnd: action.canOnReachedEnd,
            })
        case types.RECEIVE_Show_Footer://控制是否listView的footer文字
            return Object.assign({}, state, {
                showFooter: action.showFooter,
            })
        case types.RECEIVE_Show_CalenderViewHeight:
            return Object.assign({}, state, {
                calenderViewHeight: action.calenderViewHeight,
            })
        case types.RECEIVE_Refresh_Option:
            return Object.assign({}, state, {
                refreshedOptiion: action.refreshedOptiion,
            })
        case types.RECEIVE_Month_CanlenderDate:
            return Object.assign({}, state, {
                //monthCalenderDate: state.monthCalenderDate.concat(action.monthCalenderDate),
                monthCalenderDate:action.monthCalenderDate
            })
        case types.RECEIVE_Calener_LoadingData:
            return Object.assign({}, state, {
                //monthCalenderDate: state.monthCalenderDate.concat(action.monthCalenderDate),
                calenderLoading:action.calenderLoading
            })

        default:
            return state;
    }
}

export default strollingReducer;