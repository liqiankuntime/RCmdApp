/**
 * Created by lc on 14/04/15.
 * 订单列表
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
import Order from '../Order';


export default class OrderListItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
    }

    render(){
        const data = this.props.data;
        return(
            <TouchableOpacity style={{height:140,flex:1,marginTop:20,marginBottom:4,backgroundColor:'#ffffff',flexDirection:'column',borderLeftWidth:16,borderRightWidth:16,borderColor:'#ffffff'}} onPress={this.props._callBackItemClick?this.props._callBackItemClick:null}>
                <View style={{height:28,flex:1,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',marginTop:8,marginBottom:5}}>
                    <View  style={{flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                        <Text  style={[styles.tip_text]}>{new Date(data.createTime).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')}</Text>
                        <Text  style={[styles.sub_text]}>{data.orderNo} {data.supplierName}</Text>
                    </View>
                    <Text style={[styles.sub_text,{color:'#ed7140'}]}>{data.status}</Text>
                </View>
                <View style={{height:1,backgroundColor:'#f3f3f3'}}/>
                <View style={{height:38,flex:1,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',marginTop:5}}>
                    <View style={{height:38,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View  style={[styles.border_view,{borderColor:'#ffb400'}]}>
                            <Text  style={[styles.border_text]}>寄</Text>
                        </View>
                        <View style={{height:38,flex:1,backgroundColor:'#ffffff',flexDirection:'column',alignItems:'center'}}>
                            <Text  style={[styles.sub_text]}>{data.refAddressUserName}</Text>
                            <Text  style={[styles.main_text,{height:20}]}>{data.refAddressProvince}</Text>
                        </View>
                    </View>
                    <Image style={{flex:1}}
                           resizeMode={Image.resizeMode.center} source={images['ic_arrow_to']}>
                    </Image>
                    <View style={{height:38,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View  style={[styles.border_view,{borderColor:'#449ff7'}]}>
                            <Text  style={[styles.border_text]}>收</Text>
                        </View>
                        <View style={{height:38,flex:1,backgroundColor:'#ffffff',flexDirection:'column',alignItems:'center'}}>
                            <Text  style={[styles.sub_text]}>{data.refAddressUserNameTo}</Text>
                            <Text  style={[styles.main_text,{height:20}]}>{data.refAddressProvinceTo}</Text>
                        </View>
                    </View>
                </View>
                <View style={{height:22,flex:1,backgroundColor:'#ffffff',flexDirection:'row',alignItems:'center',marginBottom:5}}>
                    <Text  style={[styles.sub_text]}>物品名称</Text>
                    <Text  style={[styles.main_text,{flex:1,marginLeft:8}]}>{data.expressNames}</Text>
                    {data.status != "已取消" && <TouchableOpacity style={[styles.preview_view]} onPress={this.props._callBackPreviewClick?this.props._callBackPreviewClick:null}>
                        <Text  style={[styles.preview_text]}>生成面单</Text>
                    </TouchableOpacity>}
                </View>
            </TouchableOpacity>
        );
    }
}