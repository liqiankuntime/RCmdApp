/**
 * Created by huangzhangshu on 2016/11/14.
 */

import {
    Platform,
    Alert,
} from 'react-native';

import {showAlert} from '../native'

export function alertShow(message, positive = null, negative = null) {
    if (Platform.OS === 'android' && showAlert) {
        var showModel = {
            model: negative ? 2 : 1
        }
        if(typeof (message) !== 'string') message = '';
        showAlert(message, showModel, (model) => {
            if (model === 1 && positive) {
                positive()
            } else if (model === 2 && negative) {
                negative()
            }
        })
    } else if (Platform.OS === 'ios') {
        var func = []
        if (positive) {
            func.push({text: '确定', onPress: positive})
        }
        if (negative) {
            func.push({text: '取消', onPress: negative})
        }
        Alert.alert('提示', message, func)
    }
}