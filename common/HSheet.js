/**
 * Created by huangzhangshu on 17/4/24.
 */

import React, {Component} from 'react';
import {
    View,
    Animated,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class HSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opacityAnim: new Animated.Value(0),
            heightAnim: new Animated.Value(0),
        }

        this.openAnimated = this.openAnimated.bind(this);
        this.closeAnimated = this.closeAnimated.bind(this);
    }

    closeAnimated() {
        const {duration, onCompleted} = this.props;
        var commonConfig = {
            duration: duration ? duration : 200,
        }
        Animated.timing(
            this.state.heightAnim,
            {toValue: 0, ...commonConfig},
        ).start();
        Animated.timing(
            this.state.opacityAnim,
            {toValue: 0.1, ...commonConfig},
        ).start();
        setTimeout(() => {
            onCompleted();
        }, 200);
    }

    openAnimated() {
        const {sheetHeight, duration} = this.props;
        var commonConfig = {
            duration: duration ? duration : 500,
        }
        Animated.timing(
            this.state.heightAnim,
            {toValue: sheetHeight ? sheetHeight : height / 2, ...commonConfig},
        ).start();
        Animated.timing(
            this.state.opacityAnim,
            {toValue: 0.5, ...commonConfig},
        ).start();
    }

    componentDidMount() {

        this.openAnimated();

    }

    render() {
        const {visible} = this.props;
        if (!visible)
            return null;
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback style={[styles.popover_container, {opacity: this.state.opacityAnim}]}
                                          onPress={this.closeAnimated}>
                    <Animated.View style={[styles.popover, {opacity: this.state.opacityAnim}]}></Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.animated_container, {height: this.state.heightAnim}]}>
                    {this.props.children}
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        height,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    popover_container: {
        zIndex: 100,
    },
    popover: {
        width,
        height,
        backgroundColor: 'black',
        shadowColor: 'black',
        zIndex: 100,
    },
    animated_container: {
        zIndex: 101,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center'
    },
});