/**
 * Created by haosha on 16/10/22.
 * @flow
 */

import { AppRegistry } from 'react-native';
import Main, {
    Journey,
    Hotel,
    Recommend,
    OrderForm,
		Expressage
} from './main';

AppRegistry.registerComponent('ReactNativeApp', () => Main);
AppRegistry.registerComponent('JourneyApp', () => Journey);
AppRegistry.registerComponent('HotelApp', () => Hotel);
AppRegistry.registerComponent('RCmdApp', () => Recommend);
AppRegistry.registerComponent('OrderFormApp', () => OrderForm);
AppRegistry.registerComponent('ExpressageApp', () => Expressage);