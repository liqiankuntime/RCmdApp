/**
 * Created by zhaoxj on 16/10/18.
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import BreakfastCpmponent from '../common/breakfastCpmponent';
import images from '../images/';

class ProductLayerCpmponent extends Component {
    render(){
        return(
            <View style={styles.container}>
                <View style={[styles.title,styles.lrPad]}>
                    <View><Text style={{fontSize:17}}>{this.props.layerData.ratePlanName}</Text></View>
                    <TouchableOpacity
                        onPress={this._back.bind(this)}
                        style={styles.back}
                    >
                        <Image source={images['layer_delete']} style={styles.Img}/>
                    </TouchableOpacity>
                </View>
                <View style={{height:require('Dimensions').get('window').height-70,}}>
                    <ScrollView>
                        <View style={styles.bg}></View>
                        <View style={[styles.lrPad,styles.tips]}>
                            <View><Text style={{fontSize:16}}>预订须知</Text></View>
                            {this._rules()}
                        </View>
                        <View style={{paddingTop:20,marginBottom:30}}>
                            <BreakfastCpmponent breakfasts={this.props.layerData} peoples={1}/>
                        </View>
                    </ScrollView>
                </View>

            </View>
        )
    }
    _back(){
        return this.props.setModalVisible(false);
    }
    //规则方法
    _result(rule,ruleSet){
        let result='';
        if(rule.length>0){
            for(let i=0;i<rule.length;i++){
                result+=ruleSet[rule[i]]+'\n';
            }
        }
        return result.replace(/[\r\n]/g, '');
    }
    //价格类型描述(内宾价、外宾价...)
    _customerTypeDes(customerType){
        switch (customerType){
            case 'Chinese':
                return this._renderCustomer('内宾价','客人“须持大陆身份证入住”。');
            case 'OtherForeign':
                return this._renderCustomer('外宾价','客人“须持国外护照入住”。');
            case 'HongKong':
                return this._renderCustomer('港澳台客人价','客人“须持港澳台身份证入住”。');
            case 'Japanese':
                return this._renderCustomer('日本客人价','客人“须持日本护照入住”。');
        }
    }
    //价格类型描述render
    _renderCustomer(title,con){
        return(
            <View style={styles.ruleRow}>
                <Text style={[styles.ruleRowL,styles.ruleText]}>{title}    </Text>
                <Text style={[styles.ruleRowR,styles.ruleText]}>{con}</Text>
            </View>
        )
    }

    //判断规则依次为预订规则、担保规则、预付规则、增值服务
    _rules(){
        let {
            bookingRulesSet,
            guaranteeRulesSet,
            prepayRulesSet,
            valueAddsSet,
            layerData,
        }=this.props;

        return(
            <View>
                {layerData.bookingRules?this._ruleRow(layerData.bookingRules,bookingRulesSet,'预订规则'):''}
                {layerData.guaranteeRules?this._ruleRow(layerData.guaranteeRules,guaranteeRulesSet,'担保规则'):''}
                {layerData.prepayRules?this._ruleRow(layerData.prepayRules,prepayRulesSet,'预付规则'):''}
                {layerData.valueAdds?this._ruleRow(layerData.valueAdds,valueAddsSet,'其他'):''}
                {this._customerTypeDes(layerData.customerType)}
            </View>
        )
    }
    //render每行规则
    _ruleRow(data,ruleSet,title){
        if(data.length>0){
            return(
                <View style={styles.ruleRow}>
                    <Text style={[styles.ruleRowL,styles.ruleText]}>{title}    </Text>
                    <Text style={[styles.ruleRowR,styles.ruleText]}>{this._result(data,ruleSet||[])}</Text>
                </View>
            )
        }
    }
}
const styles=StyleSheet.create({
    container:{
        paddingTop:30,
        flex:1,
    },
    title:{
        flexDirection:'row',
        justifyContent:'center',
        height:32,
        paddingTop:2
    },
    bg:{
        backgroundColor:'#f3f3f3',
        height:6,
    },
    back:{
        position:'absolute',
        left:5,
        top:0
    },
    Img:{
        width:16,
        height:16
    },
    lrPad:{
        paddingLeft:5,
        paddingRight:5,
    },
    tips:{
        paddingTop:8,
        marginBottom:10
    },
    ruleRow:{
        flexDirection:'row',
        marginTop:10
    },
    ruleRowL:{
        flex:2,
    },
    ruleRowR:{
        flex:8,
    },
    ruleText:{
        fontSize:14,
        lineHeight:20,
        color:'#666'
    }
});
export  default ProductLayerCpmponent
