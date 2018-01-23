/**
 * Created by yonyou on 16/7/4.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Navigator,
    View,
} from 'react-native';
import StrollingContainer from '../containers/StrollingContainer';
class App extends React.Component {
    render() {

        return (
            <View style={styles.container}>


                <StrollingContainer></StrollingContainer>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

})

export default App;
