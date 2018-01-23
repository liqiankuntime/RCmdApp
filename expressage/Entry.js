/**
 * Created by lichao on 16/10/17.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux'
import * as Native from '../native'
import NavBar from './navigation'
import ModalTitle from './common/ModalTitle';
import ModalVAS from './common/ModalVAS';
import Order from './Order';

class Entry extends Component {

    constructor(props) {
        super(props);
    }

    backEvent(){
        Native.navigatorEvent();
    }

    render() {
        return (
            <View>
                <NavBar leftIconAction={()=>this.backEvent()}/>
                <ScrollView
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: '#f3f3f3',
                        paddingTop: 20,
                        paddingLeft: 15,
                        paddingRight: 15
                    }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            flexDirection: 'column',
                            paddingBottom: 50,
                            borderBottomColor: "#dfdfdf",
                            borderBottomWidth: 2
                        }}>

                        <Text>首页</Text>
                        <ModalTitle leftTitle="取消" rightTitle="确定" midTitle="请选择"
                                    _leftCallback={this._cancelCallBack.bind(this)}/>
                        <ModalVAS></ModalVAS>
                    </View>
                </ScrollView>
            </View>
        );
    }

    _cancelCallBack() {
        console.log("You tapped the button!");
    }
}

function mapStateToProps(state) {

    return {
        search: state.search
    }
}

export default connect(mapStateToProps)(Entry)//关联redux
