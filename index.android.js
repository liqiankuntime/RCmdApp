/**
 * Created by haosha on 16/10/22.
 * @flow
 */

import { AppRegistry } from 'react-native';
import Main from './main';
import * as NATIVE from './native';
import CookieManager from './common/CookieManager';
import {Journey,Hotel,Recommend,OrderForm,Expressage} from "./main";

if (NATIVE.CookieAndroid && CookieManager) {
    NATIVE.CookieAndroid.getCookies((err, cookies) => {
      if (cookies) {
          for (var cookie of cookies)
              CookieManager.setFromResponse(cookie.domain, cookie.sessionid, () => {});
      }
  });
}

AppRegistry.registerComponent('ReactNativeApp', () => Main);
AppRegistry.registerComponent('JourneyApp', () => Journey);
AppRegistry.registerComponent('HotelApp', () => Hotel);
AppRegistry.registerComponent('RCmdApp', () => Recommend);
AppRegistry.registerComponent('OrderFormApp', () => OrderForm);
AppRegistry.registerComponent('ExpressageApp', () => Expressage);
