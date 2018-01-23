/**
 * Created by haosha on 16/10/22.
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import codePush from "react-native-code-push";
import * as NATIVE from './native'
import RCmdApp from './recmd/App';
import HotelApp from './hotel/App';
import JourneyApp from './journey/root';
import OrderFormApp from './orderform/App';
import ExpressageApp from './expressage/index';

function hookGlobalHandler(defaultHandler){
    return (error, isFatal) => {
        // upload crash log
        if (NATIVE.crashUpload){
            let dict = new Object();
            dict.name = error.name;
            dict.message = error.message;
            dict.stack = error.stack;
            console.log(dict);
            NATIVE.crashUpload(dict,isFatal);
        }
        defaultHandler(error, isFatal);
    };
}

var ErrorUtils = require('ErrorUtils');
if (ErrorUtils._globalHandler) {
    const defaultHandler = ErrorUtils.getGlobalHandler
        && ErrorUtils.getGlobalHandler()
        || ErrorUtils._globalHandler;
    ErrorUtils.setGlobalHandler(hookGlobalHandler(defaultHandler));
}

const codePushOptions = Platform.OS == 'ios'
    ? {installMode: codePush.InstallMode.ON_NEXT_RESUME}
    : {installMode: codePush.InstallMode.ON_NEXT_RESTART,
    mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART};
codePush.sync(codePushOptions);

class Main extends Component {
    render() {
        const {appName, ...props} = this.props;
        switch (appName) {
            case 'JourneyApp':
                return <JourneyApp {...props} />;
            case 'RCmdApp':
                return <RCmdApp {...props} />;
            case 'OrderFormApp':
                return <OrderFormApp {...props} />;
            case 'ExpressageApp':
                return <ExpressageApp {...props} />;
            case 'HotelApp':
            default:
                return <HotelApp {...props}/>;
        }
    }
}

export default Main;
export const Journey = JourneyApp;
export const Hotel = HotelApp;
export const Recommend = RCmdApp;
export const OrderForm = OrderFormApp;
export const Expressage = ExpressageApp;
