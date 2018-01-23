/**
 * Created by shane on 16/11/7.
 */
import React from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    InteractionManager
} from 'react-native'

import constants from '../common/constants'
import Header from '../common/Header'
import BreakfastCpmponent from '../common/breakfastCpmponent'
import OrderTips from './order_tips'
export default class AmountDetail extends React.Component{

    render(){
        const data = this.props.data;
        const peoples = this.props.peoples;
        const hasGuarantee = data.guaranteeAmount>0?true:false;
        const guarantee = '担保费'+' ￥'+ data.guaranteeAmount;
        const isHRS = data.supplierCode==='hrs'?true:false;
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={()=>this.props.navigator.pop()}
                    title='费用明细'
                />
                <View style={{marginLeft:0,marginRight:0,height:5,backgroundColor:constants.colors.backBody}}/>
                <ScrollView>
                    <View style={{marginLeft:0,marginRight:0,height:10,backgroundColor:'white'}}/>
                    <BreakfastCpmponent breakfasts={data} peoples={peoples}/>
                    {hasGuarantee?
                        <Text style={{marginTop:5,marginLeft:0,marginRight:10,backgroundColor:'white',textAlign:'right',fontSize:17,color:'#333'}}>
                            {guarantee}
                        </Text>:null}

                    {
                          isHRS >0 && data.guaranteeAmount > 0?  <OrderTips tips = {'担保费仅供参考，以酒店实际扣款金额为准.'}/>:null
                    }

                </ScrollView>


            </View>
        )
    }


}
