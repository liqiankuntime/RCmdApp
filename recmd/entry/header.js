/**
 * Created by shane on 16/9/3.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    ListView,
    NativeModules,
    TouchableOpacity
} from 'react-native';


export default class RenderHeader extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            reason: this.props.data.reason,
            visitors: this.props.data.visitorsName,
            amount: this.props.data.amount,
        }
    }

    render() {
        return (
            <View style={headerStyle.view}>
                <TextInput style={headerStyle.reason}
                           autoCapitalize="none"
                           placeholder="请填写行程事由"
                           placeholderTextColor="lightgray"
                           returnKeyType="done"
                           clearButtonMode="while-editing"
                           autoCorrect={false}
                           underlineColorAndroid='transparent'
                           defaultValue={this.state.reason}
                           onEndEditing={(event) => {
                               if (this.props.changeReasonCallBack) {
                                   this.props.changeReasonCallBack(event.nativeEvent.text)
                               }
                           }}
                           keyboardType="name-phone-pad"
                >
                </TextInput>
                <View style={headerStyle.line}></View>
                <TouchableOpacity onPress={()=>this.visitorsEvent(this.state.visitorsId)}>
                    <View style={{height: 40, flexDirection: 'row', alignItems: 'center'}}>

                        <Text style={[headerStyle.visitor, {
                            marginLeft: isAndroid(),
                            color: this.state.visitors.length ? '#333333' : 'lightgray'
                        }]}>
                            {this.state.visitors.length ? this.state.visitors.toString() : '请选择出差人'}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: '#999999',
                                marginRight: 20,
                                alignItems: 'flex-end',
                                flexDirection: 'row',
                                textAlign: 'right',
                            }}>
                            出行人
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={headerStyle.line}></View>
                <View style={{height: 40, flexDirection: 'row', alignItems: 'center'}}>

                    <TextInput style={headerStyle.reason}
                               autoCapitalize="none"
                               placeholder="酒店预算"
                               placeholderTextColor="lightgray"
                               returnKeyType="done"
                               clearButtonMode="while-editing"
                               autoCorrect={false}
                               underlineColorAndroid='transparent'
                               onEndEditing={(event) => {
                                   this.props.updateAmount((event.nativeEvent.text === '' || event.nativeEvent.text === '¥') ? null : event.nativeEvent.text)
                                   if ((event.nativeEvent.text.length === 1 && event.nativeEvent.text.indexOf('¥') !== -1) || event.nativeEvent.text.length === 0) {
                                       this.setState({
                                           amount: null,
                                       })
                                   } else if (event.nativeEvent.text.indexOf('¥') === -1 && event.nativeEvent.text.length >= 1) {
                                       this.setState({
                                           amount: '¥' + event.nativeEvent.text,
                                       })
                                   }
                               }}
                               onChangeText={(text) => {
                                   this.setState({
                                       amount: text
                                   })
                                   this.props.updateAmount((text === '' || text === '¥') ? null : text)
                               }}
                               keyboardType="numeric"
                               defaultValue={this.state.amount}
                    >
                    </TextInput>
                    {this.state.amount ?   <Text
                        style={{
                            fontSize: 15,
                            color: '#999999',
                            marginRight: 20,
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            textAlign: 'right',
                        }}>
                        酒店预算
                    </Text> : null}
                </View>

            </View>
        )
    }

    visitorsEvent() {
        let contactsId = this.props.data.passengersId.concat(this.props.data.visitorsId)
        contactsEvent(contactsId, (error, result)=> {
            if (error) {

            }
            else {
                let visitorsId = new Array()
                let passengersIs = new Array()
                let visitorsName = new Array()
                result.map((visitor)=> {
                    if (visitor.contactStaffId != 0) {
                        passengersIs.push(visitor.contactStaffId)
                    }
                    else {
                        visitorsId.push(visitor.id)
                    }
                    visitorsName.push(visitor.name)
                })
                this.setState({
                    visitors: visitorsName.toString()
                })
                if (this.props.changeVisitorsCallBack) {
                    this.props.changeVisitorsCallBack(visitorsName, passengersIs, visitorsId)
                }
            }
        })
    }

}


var headerStyle = StyleSheet.create({
    view: {
        flexDirection: 'column',
        borderColor: 'gray',
        borderWidth: 0,
        backgroundColor: 'white',
        borderRadius: 0,
        height: 120
    },
    line: {
        height: 0.5,
        backgroundColor: '#e5e5e5',
        marginLeft: 20,
        marginRight: 20
    },
    reason: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        textAlign: 'left',
        fontSize: 15,
        color: '#333333',
        height:40,
    },
    visitor: {
        flex: 1,
        marginRight: 15,
        textAlign: 'left',
        fontSize: 15,
    }
})

function isAndroid() {
    if (require('Platform').OS === 'android') {
        return 28
    }
    else
        return 15
}

function contactsEvent(contactsId, callBack) {
    NativeModules.NativeModule.contactsEvent(contactsId, callBack)
}