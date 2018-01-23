/**
 * Created by haosha on 16/8/26.
 */

import React, {Component} from 'react';
import {
    View, Navigator, Text, TouchableOpacity, NativeModules, StyleSheet, Platform,
    BackAndroid,
} from 'react-native';

import Entry from './Entry'
import TaxiOrder from './TaxiOrder';
import MainPage from './MainPage';
import NavigationBar from './common/NavigationBar';

const pkg = require('../package.json');
const version = 'v' + (__DEV__ ? pkg.devVersion : pkg.version);

const HorizonConfig = Navigator.SceneConfigs.HorizontalSwipeJump;
const NoSwipeConfig = {...HorizonConfig, gestures: {}};
import images from '../hotel/images';

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this._renderScene = this._renderScene.bind(this);
        this._leftItemClick = this._leftItemClick.bind(this);
        this._rightItemClick = this._rightItemClick.bind(this)
        this._setBackCallback = this._setBackCallback.bind(this);
        this._setRightTitle = this._setRightTitle.bind(this);
        this._setLeftTitle = this._setLeftTitle.bind(this);
        this._setShowNav = this._setShowNav.bind(this);
        this.onBackAndroid = this.onBackAndroid.bind(this);
        this._listener = new Map();
        this.state = {
            rightTitle: '',
            leftTitle: '推荐行程 ' + version,
            showNav: true,
        }
    }

    componentWillMount() {


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
        const navigator = this._nav;
        const routers = navigator.getCurrentRoutes();
        console.log('onBackAndroid');
        if (routers.length > 1) {

            navigator.pop();

            return true;
        }
        return false;
    };

    _renderScene(route, navigator) {
        if (route.component) {
            const {name, component:Comp, ...props} = route;
            return <Comp {...props} navigator={navigator} setBackCallback={this._setBackCallback}
                         setRightTitle={this._setRightTitle} setLeftTitle={this._setLeftTitle}
                         _setShowNav={this._setShowNav.bind(this)}/>;
        }
        return <Entry {...this.props} navigator={navigator} setBackCallback={this._setBackCallback}
                      setRightTitle={this._setRightTitle} setLeftTitle={this._setLeftTitle}/>;
    }

    _setBackCallback(fn) {
        if (this._nav) {
            const routes = this._nav.getCurrentRoutes();
            if (routes && 0 < routes.length && routes[routes.length - 1].name) {
                const name = routes[routes.length - 1].name;
                if (!this._listener.has(name)) {
                    this._listener.set(name, new Array());
                }
                const lst = this._listener.get(name);
                if (lst.every(f => f !== fn))
                    lst.push(fn);
            }
        }
    }

    _getInitialRoute() {
        switch (this.props.initial) {
            case "TaxiOrder": {
                const props = this.props.taxi;
                const isCar = this.props.isCar;
                const isOnlyCar = this.props.isOnlyCar;
                return {
                    ...props,
                    isCar,
                    isOnlyCar,
                    name: 'TaxiOrder',
                    component: TaxiOrder
                };
            }
            default: {
                const props = this.props;
                return {name: 'Entry', component: Entry, ...props};
            }
        }
    }

    _leftItemClick() {
        this._setRightTitle('');
        if (this._nav) {
            const routes = this._nav.getCurrentRoutes();
            if (routes && 0 < routes.length && routes[routes.length - 1].name) {
                const name = routes[routes.length - 1].name;
                if (this._listener.has(name)) {
                    const lst = this._listener.get(name);
                    lst.forEach(fn => fn());
                    this._listener.delete(name);
                }
            }
            if (routes.length > 1) {
                this._nav.pop();
            }
            else {
                NativeModules.NativeModule.navigatorEvent()
            }
        }
    }

    _rightItemClick() {
    }

    _setRightTitle(title) {
        this.setState({
            rightTitle: title,
        })
    }

    _setLeftTitle(title) {
        this.setState({
            leftTitle: title,
        })
    }

    _setShowNav(flag) {
        this.setState({
            showNav: flag
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View >
                    {this.state.showNav ? <NavigationBar
                        leftItemFunc={this._leftItemClick}
                        rightItemFunc={this._rightItemClick}
                        title={this.state.leftTitle}
                        leftImageSource={images['ic_back']}
                        titleTextColor='white'
                        rightItemTitle={this.state.rightTitle}
                        rightTextColor={'white'}
                    /> : null}

                </View>
                <Navigator
                    ref={nav => this._nav = nav}
                    initialRoute={this._getInitialRoute()}
                    configureScene={route => NoSwipeConfig}
                    renderScene={this._renderScene}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});