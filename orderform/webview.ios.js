// ImageView.js

import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
name: 'RCWebView',
propTypes: {
    url: PropTypes.string,
    ...View.propTypes // 包含默认的View的属性
},
};

module.exports = requireNativeComponent('RCWebView', iface);
