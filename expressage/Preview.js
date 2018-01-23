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
    Button,
} from 'react-native';
import {connect} from 'react-redux'
import {travelUrl,baseUrl, Api, Network, MessageBox } from '../common/utils';
import {styles} from './Style';
import RCTWebView from '../orderform/webview';
import {Alert,Platform} from 'react-native';
import ModalTitle from './common/ModalTitle';
import NavBar from './navigation'
import {alertShow} from '../common/Alert'
class Preview extends Component {
//todo 订单number
    // 初始化模拟数据
    constructor(props) {
        super(props);
        const query = {
            orderNo: this.props.orderNo,
        };
        const param = JSON.stringify(query);
        this.state = {
            scalingEnabled: true,
            url:travelUrl + Api.expressage.preview + '?param=' + param
        };
    }

    render() {
        return (
            <View  style={{
                   backgroundColor: '#fff000',
                   flex:1 }}>
                <NavBar title={'面单预览'} navigator={this.props.navigator}/>
                {Platform.OS === 'android'?<RCTWebView
                    style={{
                            flex:1,
                            backgroundColor: '#ffffff',
                        }}
                    url={this.state.url}
                />:<WebView style={{
                    flex:1,
                    backgroundColor: '#ffffff',
                    }}
                    source={{uri:this.state.url}}/>}
                <TouchableOpacity style={[styles.email_view]} onPress={this.sendEmail.bind(this)}>
                    <Text style={[styles.email_text]} >发送至Email</Text>
                </TouchableOpacity>
            </View>
        );
    }

    sendEmail(){
        const query = {
            orderNo: this.props.orderNo,
        };
        const param = JSON.stringify(query);
        const url = travelUrl + Api.expressage.sendEmail + '?param=' + param;
        // increase page index
        // dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {
                console.log("发送面单成功!" + response);
                alertShow("发送面单成功")
            },
            error => {
                console.log("发送面单失败!" + error);
                alertShow("发送面单失败")
            }
        );
    }
}


export default connect()(Preview)//关联redux