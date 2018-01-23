/**
 * Created by haosha on 16/10/17.
 * @flow
 */

import { NativeModules } from 'react-native';

const NativeModule = NativeModules.NativeModule;
const import_native_method = method => NativeModule[method] ? NativeModule[method] : console.log('not found '+method);

export const CookieAndroid = NativeModules.CookieAndroid;
export const selectCityEvent = import_native_method('selectCityEvent');
export const crashUpload = import_native_method('crashUpload');
export const selectDateEvent = import_native_method('selectDateEvent');
export const selectPlaceEvent = import_native_method('selectPlaceEvent');
export const selectKeywordEvent = import_native_method('selectKeywordEvent');
export const getLocation = import_native_method('getLocation');
export const getVersion = import_native_method('getVersion');
export const showTitleEvent = import_native_method('showTitleEvent');
export const toRoomGallery = import_native_method('toRoomGallery');
export const toGallery = import_native_method('toGallery');
export const toHotelMap = import_native_method('toHotelMap');
export const getBaseUrl = import_native_method('getBaseUrl');
export const getUserinfo = import_native_method('getUserinfo');
export const contactsEvent = import_native_method('contactsEvent');
export const orderHotelPayEvent = import_native_method('orderHotelPayEvent');
export const baiduLogEvent=import_native_method('baiduLogEvent');
export const navigatorEvent=import_native_method('navigatorEvent');
export const navigate = import_native_method('navigate');
export const autoBookHotelOrder = import_native_method('autoBookHotelOrder');
export const getCityEvent = import_native_method('getCityEvent');
export const openDatepicker = import_native_method('openDatepicker');
export const openContactInformation = import_native_method('openContactInformation');
export const showOrHideNav = import_native_method('showOrHideNav');
export const showAlert = import_native_method('showAlert');
export const onRefreshHotelList = import_native_method('onRefreshHotelList'); //刷新酒店列表
export const getFileByType = import_native_method('getFileByType');
export const getMailAddrass = import_native_method('getMailAddrass');
export const getSavedMailAddrass = import_native_method('getSavedMailAddrass');
export const loadJs = import_native_method('loadJs');
export const executeJs = import_native_method('executeJs');
export const jdLoginOut = import_native_method('jdLoginOut');
export const jd2ExpenseData = import_native_method('jd2ExpenseData');
export const getSFProvice = import_native_method('getSFProvice');
export const getSFStreetByArea = import_native_method('getSFStreetByArea');
export const showSFTimePickerDialog = import_native_method('showSFTimePickerDialog');
export const showSFAddrass = import_native_method('showSFAddrass');
export const toDriverMap = import_native_method('toDriverMap');
