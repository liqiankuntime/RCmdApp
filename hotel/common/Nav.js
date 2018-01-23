/**
 * Created by haosha on 16/10/19.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    Platform,
    BackAndroid,
} from 'react-native';
import Entry from '../Entry';
import HotelOrder from '../HotelOrder';
import HotelsList from '../HotelsList';
import RoomList from '../RoomList';
import Store from '../store';
import {
    define_initial_comp,
    update_search_condition,
} from '../actions';

import {showOrHideNav} from '../../native'

let NavigationBarRouteMapper = {
    // 左键
    LeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <View style={styles.navContainer}>
                    <TouchableOpacity
                        underlayColor='transparent'
                        onPress={() => {
                            if (index > 0) {
                                navigator.pop()
                            }
                        }}>
                        <Text style={styles.leftNavButtonText}>
                            后退
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    },
    // 右键
    RightButton(route, navigator, index, navState) {
        if (route.onPress)
            return (
                <View style={styles.navContainer}>
                    <TouchableOpacity
                        onPress={() => route.onPress()}>
                        <Text style={styles.rightNavButtonText}>
                            {route.rightText || '右键'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
    },
    // 标题
    Title(route, navigator, index, navState) {
        return (
            <View style={styles.navContainer}>
                <Text style={styles.title}>
                    {route.title}
                </Text>
            </View>
        );
    }
};

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.renderScene = this.renderScene.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    componentWillMount() {
        const {initial, ...rest} = this.props;
        Store.dispatch(define_initial_comp(initial));
        switch (initial) {
            case "HotelOrder":
                this.passProps = {passProps: rest, component: HotelOrder};
                break;
            case "HotelsList":
            {
                const {search, ...passProps} = rest;
                Store.dispatch(update_search_condition(search));
                this.passProps = {passProps, component: HotelsList};
                break;
            }
            case "RoomList":
            {
                const{
                    startDate,
                    endDate,
                    cityId,
                    cityName,
                    hotelId,
                    ...passProps} = rest;
                Store.dispatch(update_search_condition({startDate, endDate}));
                passProps.hotel = {cityId, cityName,hotelId};
                this.passProps = {passProps, component: RoomList};
                break;
            }
            default:
                this.passProps = {passProps: rest, component: Entry};
                break;
        }

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        const nav = this.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
            return true;
        }
        return false;
    };
    /**
     * 配置场景动画
     * @param route 路由
     * @param routeStack 路由栈
     * @returns {*} 动画
     */
    configureScene(route, routeStack) {
        let config = Navigator.SceneConfigs.PushFromRight; // 右侧弹出
        if (route.type == 'Bottom') {
            config = Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
        }
        if (Platform.OS === 'android') {
            config = Navigator.SceneConfigs.FadeAndroid;
        }

        return {...config, gestures: {}};
    }

    /**
     * 使用动态页面加载
     * @param route 路由
     * @param navigator 导航器
     * @returns {XML} 页面
     */
    renderScene(route, navigator) {
        // if(showOrHideNav && route.name === 'RoomListContainer'){
        //     showOrHideNav(true)
        // }else if(showOrHideNav){
        //     showOrHideNav(false)
        // }
        return <route.component navigator={navigator}  {...route.passProps} initialRoute={this.props.initial} />;
    }

    /**
     * 页面渲染
     * @returns {XML}
     */
    render() {
        return (
            <Navigator
                ref={nav => { this.navigator = nav; }}
                style={{flex:1}}
                initialRoute={this.passProps}
                configureScene={this.configureScene}
                renderScene={this.renderScene}/>
        );
    }
}

var styles = StyleSheet.create({
    // 页面框架
    container: {
        flex: 4,
        marginTop: 100,
        flexDirection: 'column'
    },
    // 导航栏
    navContainer: {
        backgroundColor: '#81c04d',
        paddingTop: 12,
        paddingBottom: 10,
    },
    // 导航栏文字
    headText: {
        color: '#ffffff',
        fontSize: 22
    },
    // 按钮
    button: {
        height: 60,
        marginTop: 10,
        justifyContent: 'center', // 内容居中显示
        backgroundColor: '#ff1049',
        alignItems: 'center'
    },
    // 按钮文字
    buttonText: {
        fontSize: 18,
        color: '#ffffff'
    },
    // 左面导航按钮
    leftNavButtonText: {
        color: '#ffffff',
        fontSize: 18,
        marginLeft: 13
    },
    // 右面导航按钮
    rightNavButtonText: {
        color: '#ffffff',
        fontSize: 18,
        marginRight: 13
    },
    // 标题
    title: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        flex: 1
    }
});
