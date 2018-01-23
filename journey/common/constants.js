/**
 * Created by chenty on 16/6/24.
 */

import {Dimensions} from "react-native";

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

let colors = {
    themeColor: 'rgb(217, 51, 58)',
};

let storeKeys = {
    SEARCH_HISTORY_KEY: 'SEARCH_HISTORY_KEY',
};


export default {
    DEBUG: true, //调试模式
    window: window,
    colors: colors,
    storeKeys: storeKeys,

}
