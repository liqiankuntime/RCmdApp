// ImageView.js

import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
name: 'DatePicker2',
propTypes: {
    festivaldisplay: PropTypes.string,
    todaydisplay: PropTypes.string,
    dpmode: PropTypes.string,
    hasTravel: PropTypes.string,
    journeyDates: PropTypes.array,
    journeyNames:PropTypes.array,
    ...View.propTypes // 包含默认的View的属性
},
};

module.exports = requireNativeComponent('RCTDatePicker', iface);//RCTDatePicker
