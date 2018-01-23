/**
 * Created by zhaoxj on 16/8/27.
 */
import {
    ToastAndroid,
    Platform
} from 'react-native';
import {fetchJourney} from '../actions/strollingActions';
import moment from 'moment';
let today = moment().format("YYYY-MM-DD");
//下拉(刷新)加载历史行程
export let commondispatchrefresh = (dispatch,childrenPrivilege,departmentPrvilege,queryType,date)=>{
    let opts={};
    if(queryType==1){

        opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 2,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':0
        }

    }else if(queryType==2){
        opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 2,
            'queryType':2,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }

    }else if(queryType==3){

        opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 2,
            'queryType':3,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }

    }
    dispatch(fetchJourney( opts, 'historyData', false, false));
}
//上拉加载更多未来行程(具有上滑加载下属功能,暂时不加)
// export let commondispatchonendreached = (dispatch,queryType,childrenPrivilege,departmentPrvilege,date,isEnd,toDepartment,canLoadMore)=>{
//     if(queryType==1){
//         if(isEnd==true && toDepartment==true && childrenPrivilege!=0){
//             //canLoadMore = 'newData';
//             let opts = {
//                 'date': today,
//                 'dateType': 2,
//                 'scrollType': 1,
//                 'queryType':2,
//                 'pageCapacity':7,
//                 'childrenPrivilege': childrenPrivilege,
//                 'departmentPrvilege':departmentPrvilege,
//                 'querySourceType':1
//             }
//             dispatch(fetchJourney( opts, 'newData', false, false));
//
//         }else if(isEnd==true && toDepartment==true && departmentPrvilege!=0){
//             let opts = {
//                 'date': today,
//                 'dateType': 2,
//                 'scrollType': 1,
//                 'queryType':3,
//                 'pageCapacity':7,
//                 'childrenPrivilege': childrenPrivilege,
//                 'departmentPrvilege':departmentPrvilege,
//                 'querySourceType':1
//             }
//             dispatch(fetchJourney( opts, 'newData', false, false));
//         }else{
//             //canLoadMore = 'futureData';
//             let opts = {
//                 'date': date,
//                 'dateType': 2,
//                 'scrollType': 1,
//                 'pageCapacity':7,
//                 'childrenPrivilege': childrenPrivilege,
//                 'departmentPrvilege':departmentPrvilege,
//                 'querySourceType':0
//             }
//             dispatch(fetchJourney( opts, canLoadMore, false, false));
//
//         }
//     }else if(queryType==2){
//         //android device
//         // if(isEnd==true){
//         //     ToastAndroid.show('已经到底了',ToastAndroid.SHORT);
//         // }else{
//         //     //canLoadMore = 'futureData';
//         //     let opts = {
//         //         'date': date,
//         //         'dateType': 2,
//         //         'scrollType': 1,
//         //         'queryType':2,
//         //         //'index': 0,
//         //         'pageCapacity':7,
//         //         'childrenPrivilege': childrenPrivilege,
//         //         'departmentPrvilege':departmentPrvilege,
//         //         'querySourceType':1
//         //     }
//         //     dispatch(fetchJourney( opts, canLoadMore, false, false));
//         // }
//         if(isEnd==false){
//             let opts = {
//                 'date': date,
//                 'dateType': 2,
//                 'scrollType': 1,
//                 'queryType':2,
//                 //'index': 0,
//                 'pageCapacity':7,
//                 'childrenPrivilege': childrenPrivilege,
//                 'departmentPrvilege':departmentPrvilege,
//                 'querySourceType':1
//             }
//             dispatch(fetchJourney( opts, canLoadMore, false, false));
//         }
//
//     }else if(queryType==3){
//         //android device
//         // if(isEnd==true){
//         //     ToastAndroid.show('已经到底了',ToastAndroid.SHORT);
//         // }else {
//         //     //canLoadMore = 'futureData';
//         //     let opts = {
//         //         'date': today,
//         //         'dateType': 2,
//         //         'scrollType': 2,
//         //         'queryType': 3,
//         //         'pageCapacity': 7,
//         //         'childrenPrivilege': childrenPrivilege,
//         //         'departmentPrvilege': departmentPrvilege,
//         //         'querySourceType': 1
//         //     }
//         //     dispatch(fetchJourney(opts, canLoadMore, false, false));
//         // }
//         if(isEnd==false){
//             let opts = {
//                 'date': today,
//                 'dateType': 2,
//                 'scrollType': 2,
//                 'queryType': 3,
//                 'pageCapacity': 7,
//                 'childrenPrivilege': childrenPrivilege,
//                 'departmentPrvilege': departmentPrvilege,
//                 'querySourceType': 1
//             }
//             dispatch(fetchJourney(opts, canLoadMore, false, false));
//         }
//     }
// }
//上拉加载更多未来行程
export let commondispatchonendreached = (dispatch,queryType,childrenPrivilege,departmentPrvilege,date,isEnd,toDepartment,canLoadMore)=>{
    if(isEnd==true){
        // if(Platform.OS=='android'){
        //     ToastAndroid.show('已经到底了',ToastAndroid.SHORT);
        // }
        //ToastAndroid.show('已经到底了',ToastAndroid.SHORT);  //android device
    }else{
        if(queryType==1){
            let opts = {
                'date': date,
                'dateType': 2,
                'scrollType': 1,
                'pageCapacity':7,
                'childrenPrivilege': childrenPrivilege,
                'departmentPrvilege':departmentPrvilege,
                'querySourceType':0
            }
            dispatch(fetchJourney( opts, canLoadMore, false, false));

        }else if(queryType==2){
                let opts = {
                    'date': date,
                    'dateType': 2,
                    'scrollType': 1,
                    'queryType':2,
                    //'index': 0,
                    'pageCapacity':7,
                    'childrenPrivilege': childrenPrivilege,
                    'departmentPrvilege':departmentPrvilege,
                    'querySourceType':1
                }
                dispatch(fetchJourney( opts, canLoadMore, false, false));

        }else if(queryType==3){
            let opts = {
                'date': date,
                'dateType': 2,
                'scrollType': 1,
                'queryType': 3,
                'pageCapacity': 7,
                'childrenPrivilege': childrenPrivilege,
                'departmentPrvilege': departmentPrvilege,
                'querySourceType': 1
            }
            dispatch(fetchJourney(opts, canLoadMore, false, false));

        }
    }

}
//点击日历日期加载某天行程
export let commondispatchcanlenderday = (dispatch,queryType,childrenPrivilege,departmentPrvilege,date,dateType,scrollType,pageCapacity)=>{
    if(queryType==1){

        let opts = {
            'date': date,
            'dateType': dateType,
            'scrollType': scrollType,
            'pageCapacity':pageCapacity,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':0
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }else if(queryType==2){

        let opts = {
            'date': date,
            'dateType': dateType,
            'scrollType': scrollType,
            'queryType':2,
            'pageCapacity':pageCapacity,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }else if(queryType==3){

        let opts = {
            'date': date,
            'dateType': dateType,
            'scrollType': scrollType,
            'queryType':3,
            'pageCapacity':pageCapacity,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }
}
//点击今天按钮加载今天和未来行程
export let commondispatchtodayandfuthur = (dispatch,childrenPrivilege,departmentPrvilege,queryType,date)=>{
    if(queryType==1){

        let opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 1,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':0
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }else if(queryType==2){

        let opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 1,
            'queryType':2,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }else if(queryType==3){

        let opts = {
            'date': date,
            'dateType': 2,
            'scrollType': 1,
            'queryType':3,
            'pageCapacity':7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege':departmentPrvilege,
            'querySourceType':1
        }
        dispatch(fetchJourney( opts, 'newData', false, true));

    }
}
