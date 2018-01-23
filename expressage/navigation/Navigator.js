/**
 * Created by lc on 17/03/10.
 */

import React, {Component} from 'react';
import {
	Navigator,
	Platform,
	BackAndroid,
} from 'react-native';
import Entry from '../Entry';
import OrderList from '../OrderList';
import Preview from '../Preview';
import Clause from '../Clause';
import Store from '../store';
import ExpressNewOrder from '../main/ExpressNewOrder'
import {
	define_initial_comp,
} from '../actions';

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
			case "OrderList":
				this.passProps = {passProps: rest, component: OrderList};
				break;
			default:
				this.passProps = {passProps: rest, component: ExpressNewOrder};
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