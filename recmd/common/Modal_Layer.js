/*
   created by Liqiankun 16/9/19
 * */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Modal,
    Switch,
    TouchableOpacity,
} from 'react-native';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {active: false,};
        this._onHighlight = this.onHighlight.bind(this);
        this._onUnhighlight = this.onUnhighlight.bind(this);
    }

    onHighlight() {
        this.setState({active: true,});
    }

    onUnhighlight() {
        this.setState({active: false,});
    }

    render() {
        var colorStyle = {color: this.state.active ? '#fff' : '#000',};
        return (
            <TouchableHighlight onHideUnderlay={this._onUnhighlight}
                                onPress={this.props.onPress}
                                onShowUnderlay={this._onHighlight}
                                style={[styles.button, this.props.style]}
                                underlayColor="#a9d9d4">
                <Text style={[styles.buttonText, colorStyle]}>
                    {this.props.children}
                </Text>
            </TouchableHighlight>
        );
    }
}
class ModalLayerWithButton extends Component {
    constructor(props) {
        super(props);
    }

    _setModalVisible() {
        const {tripId, id, visible} = this.props.model;
        this.props.visibleView(tripId, id, !visible);
    }

    _clickBtn() {
        const {tripId, id} = this.props.model;
        this._setModalVisible();
        this.props.callback(tripId, id);
    }

    render() {
        return (
            <View style={{paddingTop:20,paddingLeft:10,paddingRight:10}}>
                <Modal transparent={true}
                       visible={this.props.model.visible}
                       onRequestClose={() => {}}>
                    <TouchableOpacity style={styles.container} onPress={() => this._setModalVisible()}>
                        <View style={styles.innerContainer}>
                            <Button onPress={() => this._clickBtn()}
                                    style={styles.modalButton}>
                                <Text style={{color:'white'}}>
                                    {this.props.btnText}
                                </Text>
                            </Button>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        padding: 20,
    },
    row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },
    modalButton: {
        alignSelf: 'center',
        borderRadius: 100,
        width: 60,
        height: 60,
        backgroundColor: '#ed7140'
    },
});

export default ModalLayerWithButton;