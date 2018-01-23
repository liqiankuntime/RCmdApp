/**
 * Created by lc on 16/10/20.
 */
import React, {Component,PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import {styles} from '../Style';
// <ModalTitle leftTitle="取消" rightTitle="确定" midTitle="请选择"
//             _leftCallback={this._cancelCallBack.bind(this)}/>
export default class ModalTitle extends Component {
    render(){
        const {leftTitle} = this.props;
        const {midTitle} = this.props;
        const {rightTitle} = this.props;
        return(
           <View style={{height:38,backgroundColor:'#ed7140',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               <TouchableOpacity style={{height:38,flex:1,justifyContent:'center',alignItems:'flex-start'}} onPress={this.props._leftCallback?this.props._leftCallback:null}>
                    <Text style={[styles.title_text,{marginLeft:15}]}>{leftTitle?leftTitle:""}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{height:38,flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={[styles.title_mid_text]}>{midTitle?midTitle:""}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={{height:38,flex:1,justifyContent:'center',alignItems:'flex-end'}} onPress={this.props._rightCallback?this.props._rightCallback:null}>
                    <Text style={[styles.title_text,{marginRight:15}]}>{rightTitle?rightTitle:""}</Text>
               </TouchableOpacity>
           </View>
        );
    }
}