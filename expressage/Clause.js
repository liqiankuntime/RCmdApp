/**
 * Created by lc on 14/04/15.
 * 面单
 */
import React, {Component, PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    WebView,
    Button
} from 'react-native';
import {connect} from 'react-redux'
import {travelUrl,baseUrl, Api, Network, MessageBox } from '../common/utils';
import {styles} from './Style';
import RCTWebView from '../orderform/webview';
import {Alert,Platform} from 'react-native';
import ModalTitle from './common/ModalTitle';
import NavBar from './navigation'
class Clause extends Component {
//todo 订单number
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            scalingEnabled: true,
            url:travelUrl + Api.expressage.agreement
        };
    }

    render() {
        return (
            <View  style={{
                   backgroundColor: '#fff000',
                   flex:1 }}>
                <NavBar title={'快递条款'} navigator={this.props.navigator}/>
                {Platform.OS === 'android'?<RCTWebView
                    style={{
                            flex:1,
                            backgroundColor: '#ffffff',
                        }}
                    url={this.state.url}
                />:<WebView style={{
                    flex:1,
                    backgroundColor: '#ffffff',
                    }} source={{uri:this.state.url}}/>}
            </View>
        );
    }

}


export default connect()(Clause)//关联redux