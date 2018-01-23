/**
 * Created by yonyou on 16/7/4.
 */
import Constants from './constants';

let DEBUG = Constants.DEBUG;
let Util = {
    /*
     * fetch简单封装
     * url: 请求的URL
     * successCallback: 请求成功回调
     * failCallback: 请求失败回调
     *
     * */
    postJson: (url, successCallback, failCallback) => {
           fetch(
               url,
               {
                   headers: {
                       "Content-Type": "application/JOSN",
                       "Accept":"application/JOSN",
                   },
               }
           )
            .then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            })
            .catch((err) => {
                console.log(err);
                failCallback(err);
            });
    },
    log: (msg,...context)=> {
        if (DEBUG){
            console.log(msg);
            for (var item of context) {
                console.log(item);
            }

        }
    },
}

export default Util;


