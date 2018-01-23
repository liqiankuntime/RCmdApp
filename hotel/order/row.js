/**
 * Created by shane on 16/10/22.
 */
import React from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,

} from 'react-native'

import Icon from '../common/Icon'
import constants from '../common/constants'


export default class Row extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inputText : ''
        }
    }

    static defaultProps = {
        keyboardType: 'default',
        placeholder: '请在此处输入内容',
    };

    render(){
        const title = this.props.title;
        const text = this.props.body;
        const placeholder = this.props.placeholder;
        const keyboardType = this.props.keyboardType;
        const isNotEditable = !this.props.isEditable;
        const isNotInput = !this.props.isInput;
        return(
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'white',marginTop:1}}>
                <Text style={{marginTop:15,marginBottom:15,marginLeft:10,width:70,color:constants.colors.textLight,fontSize:16}}>
                    {title}
                </Text>
                {isNotEditable ? //是否可编辑
                    <Text style={{marginLeft:15,width:constants.window.width-110,marginTop:15,marginBottom:15,fontSize:16}} numberOfLines={2}>{text}</Text>
                    :
                    isNotInput ? //是否可输入
                        <TouchableOpacity style={{flexDirection:'row',marginLeft:15,width:constants.window.width-100,}} onPress={this.props.textEdit.bind(this)}>
                            <Text style={{flex:1,fontSize:16}}>
                                {text}
                            </Text>
                            <Icon style={{paddingRight:-5,width:9,height:15}} name="ic_hotel_address"></Icon>
                        </TouchableOpacity>
                        :
                        <TextInput
                            style={{marginLeft:15,width:constants.window.width-110,fontSize:16}}
                            autoCapitalize="none"
                            placeholder={placeholder}
                            placeholderTextColor="lightgray"
                            returnKeyType="done"
                            //maxLength={11}
                            blurOnSubmit = {true}
                            keyboardType={keyboardType}
                            clearButtonMode="while-editing"
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            defaultValue = {text}
                            onChange = {(event)=>{
                                if(Platform.OS === 'ios') return;
                                if (this.props.textInputEdit){
                                    this.props.textInputEdit(event.nativeEvent.text)
                                }
                            }}

                            onBlur = {(event)=>{
                                if(Platform.OS === 'android') return;
                                if (this.props.textInputEdit){
                                    this.props.textInputEdit(event.nativeEvent.text)
                                }
                            }}


                        />
                }
            </View>
        )
    }
}
