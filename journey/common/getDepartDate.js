/**
 * Created by yonyou on 16/7/8.
 */
import moment from 'moment';

let getdepartDate = (date) => {
    let showdate='';
    let dYear,dMonth,dDay;
    //出发日期
    let departDate = moment(date);
    let departWeek = departDate.day();
    //今天
    let nowDate = moment();
    let nowymd = nowDate.format('YYYY-MM-DD');
    let nowWeek = nowDate.day();
    //明天
    let tomorrowDate = moment().add(1,'day');
    let tomorrowymd = tomorrowDate.format('YYYY-MM-DD');
    let tomorrowWeek = tomorrowDate.day();

    let Week = ['日','一','二','三','四','五','六'];

    if(date == nowymd){
        return showdate='今天'+'周'+Week[nowWeek];
    }else if(date == tomorrowymd){
        return showdate='明天'+'周'+Week[tomorrowWeek];
    }else{
        dYear = parseInt(date.substring(0,5));
        dMonth = parseInt(date.substring(5,7));
        dDay = parseInt(date.substring(8,10));
        return dYear+'年'+dMonth+'月'+dDay+'日'+'周'+Week[departWeek];
        //return showdate=date+'周'+Week[departWeek];
    }

    // made by myself using js
    // let showdate='';
    // //票出发日期
    // let departDate = date;
    // let departDatesz = departDate.split('-');
    // let year = parseInt(departDatesz[0]);
    // let month = parseInt(departDatesz[1]);
    // let day = parseInt(departDatesz[2]);
    // let departD = new Date(departDate);
    // let departWeek = departD.getDay();
    // //今天
    // let d = new Date();
    // let dyear = d.getFullYear();
    // let dmonth = d.getMonth()+1;
    // let dday = d.getDate();
    // let dweek = d.getDay();
    // //明天
    // let dd = new Date();
    // dd.setDate(dd.getDate()+1);
    // let ddyear = dd.getFullYear();
    // let ddmonth = dd.getMonth()+1;
    // var ddDay = dd.getDate();
    // let ddweek = dd.getDay();
    //
    // let Week = ['日','一','二','三','四','五','六'];
    //
    // if(year==dyear && month==dmonth && day==dday){
    //     return showdate='今天'+'星期'+Week[dweek];
    // }else if(year==ddyear && month==ddmonth && day==ddDay){
    //     return showdate='明天'+'星期'+Week[ddweek];
    // }else{
    //     return showdate=departDate+'星期'+Week[departWeek];
    // }
}
export default getdepartDate;
