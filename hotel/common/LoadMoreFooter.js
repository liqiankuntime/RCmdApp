/**
 * Created by chenty on 2016/10/18.
 */

import React from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default class LoadMoreFooter extends React.Component {
    render() {
        return (
            <View style={styles.footer}>
                <ActivityIndicator />
                <Text style={styles.footerTitle}>正在加载更多……</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },

    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    }
})
