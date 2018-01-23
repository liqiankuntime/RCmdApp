/**
 * Created by shane on 16/10/26.
 */
import React from 'react'
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native'

import Row from './row'
import constants from '../common/constants'

export default class Service extends React.Component{

    static defaultProps = {
        data: {
            orderNoSupplier: '00000000',
            orderRule: ''
        }
    }

    render(){
        const hasOrderNo = this.props.data.id>0?true:false
        const orderNo = this.props.data.orderNoSupplier;
        const rules = this.props.data.orderRule;
        return(
            <View style={{flexDirection:'column',paddingTop:6,backgroundColor:constants.colors.lightGray}}>
                {
                    hasOrderNo?
                        <View style={{flexDirection:'row',backgroundColor:'white'}}>
                            <Text style={{marginLeft:10,marginTop:15,marginBottom:15,color:constants.colors.textLight,fontSize:16}}>服务商订单号</Text>
                            <Text style={{flex:1,marginLeft:20,marginTop:15,marginBottom:15,color:constants.colors.text,fontSize:16}}>{orderNo}</Text>
                        </View>:
                        null
                }
              
            </View>
        )
    }
}
