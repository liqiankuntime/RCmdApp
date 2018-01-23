/**
 * Created by chenty on 2016/10/18.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';

import Common from '../hotel/common/constants';

export default class Loading extends React.Component {

    componentWillMount() {
        this.handle_ = InteractionManager.createInteractionHandle();
    }

    componentWillUnmount() {
        InteractionManager.clearInteractionHandle(this.handle_);
    }



    render() {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color="white"/>
                <Text style={styles.loadingTitle}>加载中……</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loading: {
        backgroundColor: 'gray',
        height: 80,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: (Common.window.height-80)/2,
        left: (Common.window.width-100)/2,
    },

    loadingTitle: {
        marginTop: 10,
        fontSize: 14,
        color: 'white'
    }
})
