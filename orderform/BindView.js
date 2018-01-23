/**
 * Created by jack on 17/3/13.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux'
import RCTWebView from '../orderform/webview';
import Entry from './Entry';
class BindView extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let stats = {
            js:'https://home.m.jd.com/newAllOrders/newAllOrders.action?_format_=json'
        };
        return (
            //row column
            <View
                style={{backgroundColor: 'white', flexDirection: 'column',paddingBottom:50,borderBottomColor:"#dfdfdf",borderBottomWidth:2}}>
                <RCTWebView
                    style={{
                        backgroundColor: '#de11ee',
                        flex: 1
                    }}
                    url={stats.js}
                />
            </View>
        );
    }

    next() {
        let {navigator} = this.props;

        navigator.push({
                name: 'Entry',
                component: Entry
            }
        );
        // InteractionManager.runAfterInteractions(() => {
        //
        // })

    }

    componentWillMount(){
        DeviceEventEmitter.addListener(
            'orderformnext',
            (events) =>{
                this.next();
            }
        );
    }

}




export default connect()(BindView)//关联redux