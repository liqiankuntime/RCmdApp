/**
 * Created by haosha on 16/8/31.
 */
import moment from 'moment'

export const ITEM_TAXI_TO = 1;   //送机
export const ITEM_TAXI_FROM = 3; //接机
export const ITEM_TRAFFIC = 2;   //长途交通

export function selectItem(state, tripId, itemId) {
    const trips = state.trips.filter(trip => trip.id == tripId);
    if (trips && 0 < trips.length) {
        const items = trips[0].items.filter(item => item.id == itemId);
        if (items && 0 < items.length) {
            return items[0];
        }
    }
    return {};
}

export function selectTrip(state, tripId) {
    const trips = state.trips.filter(trip => trip.id == tripId);
    if (trips && 0 < trips.length) {
        return trips[0];
    }
    return {};
}

export function selectTaxiItems(state, tripId) {
    const trips = state.trips.filter(trip => trip.id == tripId);
    if (trips && 0 < trips.length) {
        const items =
            trips[0].items.filter(item => item.type == ITEM_TAXI_TO || item.type == ITEM_TAXI_FROM);
        return items;
    }
    return {};
}

//获取当前日期
//output: 2016-10-09
export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//Input: 2000-01-01
//Output: "1月1日"
export function getDate(YYMMdd){
    if (YYMMdd && YYMMdd.length==10){
        const date = new Date(Date.parse(YYMMdd.replace(/-/g, '/')));
        const mm = date.getMonth()+1;
        const dd = date.getDate();
        //const day = (mm < 10 ? '0' + mm : mm) + '月' + (dd < 10 ? '0' + dd : dd) + '日';
        const  day = mm + '月' + (dd < 10 ? '0' + dd : dd) + '日';
        return day;
    }
    else
        return ''
}

//Input: 2000-01-01
//Output: "周日","周一","周二","周三","周四","周五","周六"
export function getDayOfWeek(YYMMdd){
    const date = new Date(Date.parse(YYMMdd.replace(/-/g, '/')));
    const dayOfWeek = new Array("周日","周一","周二","周三","周四","周五","周六");
    const day = dayOfWeek[date.getDay()];
    return day;
}

//Input: 2000-01-01,2000-01-03
//Output: 2
export function getDateDiffer(YYMMdd1,YYMMdd2){
    if (YYMMdd1 && YYMMdd1.length==10 && YYMMdd2 && YYMMdd2.length==10){
        const date1 = new Date(Date.parse(YYMMdd1.replace(/-/g, '/')));
        const date2 = new Date(Date.parse(YYMMdd2.replace(/-/g, '/')));
        const days = date2.getTime() - date1.getTime();
        const num = parseInt(days / (1000 * 60 * 60 * 24));
        return num;
    }
    else
        return ''
}

//Input: 2000-01-01 13:13:00, 2000-01-03 13:14:00
//Output: 1 param1>param2
//Output: 0 param1==param2
//Output: -1 param1<param2
export function getTimeDiffer(time1,time2) {
    let date1 = moment(time1).format();
    let date2;
    if (time2==undefined || time2==null){
        date2 = moment().format();
    }
    else
        date2 = moment(time2).format();
    if (date1 > date2) {
        return 1;
    }
    else if (date1 == date2) {
        return 0;
    }
    else
        return -1;
}

export function mergeFromAndTo(origin, item) {
    const {from: item_from, to: item_to} = item;
    const {from: origin_from, to: origin_to} = origin;
    const from = {...origin_from, ...item_from};
    const to = {...origin_to, ...item_to};
    return {...origin, ...item, from, to};
}


//手机号校验
export function checkPhoneNumber(num) {
    let myreg = /^((1[0-9]{1})+\d{9})$/;
    if(myreg.test(num)) {
        return true;
    }
    else
        return false;
}

//邮箱校验
export function checkEmail (email) {
    let emailPat = /\w@\w*\.\w/;    //^(.+)@(.+)$/;
    if (emailPat.test(email)) {
        return true;
    }
    else
        return false;
}