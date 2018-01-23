/**
 * Created by huangzhangshu on 17/5/16.
 * 用车时间选择组件  包括现在、预约
 * 传递callback方法获取值的变化
 * 传递status设置默认值
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

const NOW = 'NOW'; //现在
const APPOINTMENT = 'APPOINTMENT'; //预约

export default class TimeSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: NOW, //默认状态现在
        };
        this.updateStatus = this.updateStatus.bind(this);
    }

    componentDidMount() {
        const {status} = this.props;
        if (status)
            this.updateStatus(status, false); //参数设置默认值
    }

    updateStatus(status, flag = true) {
        const {callback} = this.props;
        this.setState({
            status: status,
        });
        if (callback && flag)
            callback(status);
    }

    renderNow() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    underlayColor='transparent'
                    style={styles.appointment_touchable} onPress={this.updateStatus.bind(this, APPOINTMENT)}>
                    <Text style={styles.appointment_text}>预约</Text>
                </TouchableHighlight>

                <View
                    underlayColor='transparent'
                    style={styles.now_touchable}
                    onPress={this.updateStatus.bind(this, NOW)}>
                    <Text style={styles.now_text}>现在</Text>
                </View>

                <View style={{
                    height: 0.5,
                    backgroundColor: '#999999',
                    width: 40,
                    position: 'absolute',
                    top: 0,
                    left: 30,
                }}></View>

                <View style={{
                    height: 0.5,
                    backgroundColor: '#999999',
                    width: 40,
                    position: 'absolute',
                    bottom: 0,
                    left: 30,
                }}></View>
            </View>
        )
    }

    renderAppointment() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    underlayColor='transparent'
                    style={styles.now_touchable_2}
                    onPress={this.updateStatus.bind(this, NOW)}>
                    <Text style={styles.now_text_2}>现在</Text>
                </TouchableHighlight>

                <View
                    underlayColor='transparent'
                    style={styles.appointment_touchable_2} onPress={this.updateStatus.bind(this, APPOINTMENT)}>
                    <Text style={styles.appointment_text_2}>预约</Text>
                </View>

                <View style={{
                    height: 0.5,
                    backgroundColor: '#999999',
                    width: 40,
                    position: 'absolute',
                    top: 0,
                    left: 30,
                }}></View>

                <View style={{
                    height: 0.5,
                    backgroundColor: '#999999',
                    width: 40,
                    position: 'absolute',
                    bottom: 0,
                    left: 30,
                }}></View>
            </View>
        )
    }


    render() {
        return this.state.status === NOW ? this.renderNow() : this.renderAppointment();
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    now_touchable: {
        height: 30,
        width: 70,
    },
    now_text: {
        height: 30,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#999999',
        color: '#333333',
        position: 'absolute',
        fontSize: 13,
    },
    appointment_touchable: {
        height: 30,
        width: 70,
        position: 'absolute',
        left: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appointment_text: {
        height: 30,
        paddingLeft: 28,
        paddingRight: 13,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#999999',
        color: '#999999',
        position: 'absolute',
        left: 0,
        top: 0,
        fontSize: 13,
    },

    now_touchable_2: {
        height: 30,
        width: 70,
    },
    now_text_2: {
        height: 30,
        paddingLeft: 13,
        paddingRight: 28,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#999999',
        color: '#999999',
        fontSize: 13,
    },

    appointment_touchable_2: {
        height: 30,
        width: 80,
        position: 'absolute',
        left: 28,
    },
    appointment_text_2: {
        height: 30,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 5,
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#999999',
        color: '#333333',
        position: 'absolute',
        left: 17,
        fontSize: 13,
    },
});