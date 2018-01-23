/**
 * Created by lc on 14/04/15.
 * 增值服务
 */
import React, {Component, PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    TextInput,
} from 'react-native';
import ModalTitle from './ModalTitle';
import {styles} from '../Style';
import {alertShow} from '../../common/Alert'
const textdefault1 = '请填写物品的实际价值';
const textdefault2 = '请填写代收贷款';

// <Modal
//     animationType='fade'
//     transparent={true}
//     visible={this._isShow()}
//     onShow={() => {
//                     }}
//     onRequestClose={() => {
//                     }}>
//     <View style={styles.modalStyle}>
//         <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}}
//                                   onPress={this._cancelClick.bind(this)}>
//             <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}/>
//
//         </TouchableWithoutFeedback>
//
//         <StreetList leftTitle="取消" rightTitle="确定" midTitle="付款方式" data={this.state.streetData}
//                     _leftCallback={this._cancelCallBack.bind(this)}
//                     _callBackItemClick={this._cancelCallBackItem}/>
//
//     </View>
// </Modal>

// selectPrice() {
//     // Alert.alert('提示','price');
//     this.setState({modalVisiable: true});
// }
//
// _cancelClick() {
//     this.setState({modalVisiable: false});
// }
//
// _isShow() {
//     return this.state.modalVisiable;
// }

export default class ModalVAS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text1: '',
            text2: '',
            tipShow: false
        };
    }

    render() {
        return (
            <View style={{
                height: 100,
                flex: 1,
                backgroundColor: '#ffffff',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                <ModalTitle style={{height: 38}} leftTitle="取消" rightTitle="确定" midTitle="增值服务"
                            _leftCallback={this._leftCallBack.bind(this)}
                            _rightCallback={this._rightCallBack.bind(this)}/>
                <View style={{
                    height: 62,
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={[styles.sub_text, {marginLeft: 12}]}>保价费</Text>
                    <TextInput
                        style={[styles.sub_text, {flex: 1, color: '#ed7140'}]} keyboardType="numeric"
                        placeholder={textdefault1}
                        placeholderTextColor="lightgray" underlineColorAndroid={'transparent'}
                        value={this.state.text1}
                        onChangeText={(text)=>{if(!checknum(text)) {text = text.substr(0, (text.length - 1));}
                                                this.setState({text1: text,tipShow: text > 20000})
                                                }}
                    />
                    <Text style={[styles.sub_text, {marginRight: 12, color: '#333333'}]}>元</Text>
                </View>
                {this.state.tipShow && <Text style={[styles.sub_text, {marginLeft: 12}]}>温馨提示:最高保价费2万</Text>}

            </View>
        );
    }

// <View style={{height: 1, backgroundColor: '#c1c1c1'}}/>
// <View style={{
//     height: 68,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between'
// }}>
// <Text style={[styles.sub_text, {marginLeft: 12}]}>代收贷款</Text><TextInput
// style={[styles.sub_text, {flex: 1, color: '#ed7140'}]} keyboardType="numeric"
// placeholder={textdefault2}
// placeholderTextColor="lightgray" underlineColorAndroid={'transparent'}
// onChangeText={(text) => this.setState({text2: text})}
// /><Text style={[styles.sub_text, {marginRight: 12, color: '#333333'}]}>元</Text>
// </View>

    _leftCallBack() {
        if (this.props._leftCallback)
            this.props._leftCallback();
    }

    _rightCallBack() {
        console.log("!" + this.state.text1 + " " + this.state.text2);
        if (this.props._rightCallBack) {
            this.props._rightCallBack(this.state.text1, this.state.text2);
        }
        if (this.props._callBackItemClick) {
            this.props._callBackItemClick(this.state.text1, this.state.text2);
        }
    }
}

function checknum(text) {
    if (isNaN(text)) {
        alertShow("请输入数字");
        return false;
    }

    return true;
}