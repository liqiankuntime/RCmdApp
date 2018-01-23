/**
 * Created by lc on 14/04/15.
 * 选择地址
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
export default class AddressListItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
    }

    render(){
        const data = this.props.data;
        const selectId = this.props.selectId;
        return(
            <View style={{backgroundColor:'#ffffff',flexDirection:'column'}}>
                <TouchableOpacity style={{marginTop:10,marginBottom:2,flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={this.props._callBackItemClick?this.props._callBackItemClick.bind(this,data):null} onLongPress={this.props._callBackLongItemClick?this.props._callBackLongItemClick:null}>
                    <TouchableOpacity style={{marginLeft:5,marginRight:5,height:38}} onPress={this.props._callBackEditClick?this.props._callBackEditClick.bind(this,data):null}>
                        <Image style={{height:40,width:40}}
                               resizeMode={'contain'} source={images['ic_address_edit']}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                        <Text style={[styles.main_text]} numberOfLines={10}>{data.userName} {data.mobile}</Text>
                        <Text style={[styles.sub_text,{marginTop:2}]} numberOfLines={10}>{data.province}{data.city}{data.area}{data.street}{data.address}</Text>
                    </View>
                    {((data.lastUsed && data.lastUsed==true) || (selectId && selectId == data.id)) && <Image style={{position:'absolute',right:12,top:8,width:25,height:20}}
                                              resizeMode={'contain'} source={images['ic_address_selected']}>

                    </Image>}
                </TouchableOpacity>
            </View>
        );
    }
}