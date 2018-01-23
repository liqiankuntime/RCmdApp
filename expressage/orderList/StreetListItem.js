/**
 * Created by lc on 14/04/15.
 * 选择街道
 */
import React, {Component,PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';
import images from '../../expressage/images/';
import {styles} from '../Style';
export default class StreetListItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
    }

    render(){
        const data = this.props.data;
        return(
            <View style={{height:50,flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                <TouchableOpacity style={{height:50,flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={this.props._callBackItemClick?this.props._callBackItemClick.bind(this,data):null}>
                    <Image style={{marginLeft:10,marginRight:10,height:20}}
                           resizeMode={Image.resizeMode.center} source={images['ic_near_address']}>
                    </Image>
                    <View style={{height:50,flex:1,backgroundColor:'#ffffff',flexDirection:'column',justifyContent:'center'}}>
                        <Text style={[styles.main_text]} numberOfLines={10}>{data.street}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
// <Text style={[styles.main_text,{flex:1,marginTop:5,marginBottom:2}]} numberOfLines={10}>{data.province}{data.city}{data.area}</Text>