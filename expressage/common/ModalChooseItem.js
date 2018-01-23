/**
 * Created by lc on 14/04/15.
 * 选择条目
 */
import React, {Component,PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import {styles} from '../Style';
import images from '../../expressage/images/';

export default class ModalChooseItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
    }

    render(){
        const data = this.props.data;
        const selected = this.props.selected?this.props.selected:'';
        return(
            <View style={{height:38,flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                <TouchableOpacity style={{height:38,flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:data==selected?'#c1c1c1':'#ffffff'}} onPress={this._callBackItemClick?this._callBackItemClick.bind(this,data):null}>
                    <Text style={data==selected?[styles.selected_text,{flex:1}]:[styles.select_text,{flex:1}]}>{data}</Text>
                    {data==selected && <Image style={{position:'absolute',right:20,top:8,width:data==selected?20:0,height:data==selected?20:0}}
                           resizeMode={Image.resizeMode.center} source={images['ic_selected']}>

                    </Image>}
                </TouchableOpacity>
            </View>
        );
    }

    _callBackItemClick(data) {
        console.log("!"+data);
        if(this.props._callBackItemClick){
            this.props._callBackItemClick(data);
        }
    }
}