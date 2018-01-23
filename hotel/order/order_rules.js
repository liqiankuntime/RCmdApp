/**
 * Created by shane on 16/10/26.
 */
import React from 'react'
import {
    View,
    Text,
} from 'react-native'

import constants from '../common/constants'

export default class Rules extends React.Component{

    static defaultProps={
        rules: [],
    }

    render(){
      const orderRule = this.props.data.orderRule;
        return (
            <View style={{flexDirection:'column',paddingTop:8,backgroundColor:constants.colors.backBody}}>
                {this.props.rules.map(rule => this.renderRow(rule))}
                <View style={{backgroundColor:'white'}}>
                    <Text
                        style={{marginLeft:15,marginTop:12,marginBottom:12,marginRight:15,color:constants.colors.textLight,fontSize:14,lineHeight:17}}
                        numberOfLines={0}
                    >
                        {`入住人填写说明${'\n'}预订国内酒店需要提供入住人的姓名，该姓名需与入住时所持证件完全一致;${'\n'}中文姓名中不能包含英文字母。`}
                    </Text>
                    {
                      orderRule?
                      <Text
                          style={{marginLeft:15,marginTop:12,marginBottom:12,marginRight:15,color:constants.colors.textLight,fontSize:14,lineHeight:17}}
                          numberOfLines={0}
                          >
                                {orderRule}
                    </Text>:null
                    }
                </View>
            </View>
        )
    }

    renderRow(rule){
        return(
            <View style={{flexDirection:'row',marginBottom:2,backgroundColor:'white',alignItems:'center'}} key={rule.key}>
                <Text style={{marginLeft:15,width:80,color:constants.colors.text,fontSize:16}}>
                    {rule.title}
                </Text>

                <Text style={{marginLeft:0,marginTop:12,marginBottom:12,width:constants.window.width-110,color:constants.colors.text,fontSize:16}}>
                    {rule.body}
                </Text>

            </View>
        )
    }
}
