/**
 * Created by shane on 16/10/26.
 */
import React from 'react'
import {
    View,
    Text,
} from 'react-native'

import constants from '../common/constants'

export default class OrderTips extends React.Component{

    render(){
        return (
            <View style={{flexDirection:'column',paddingTop:8,backgroundColor:constants.colors.backBody}}>
                <View style={{flexDirection:'row', backgroundColor:'white'}}>
                    <Text
                        style={{marginLeft:12,marginTop:12,marginBottom:12,marginRight:15,color:constants.colors.textLight,fontSize:14,lineHeight:17}}
                        numberOfLines={0}
                    >
                        {this.props.tips}
                    </Text>
                    <View>
                    <Text
                        style={{marginTop:12,marginRight:15,color:constants.colors.text,fontSize:17,lineHeight:17}}
                        numberOfLines={0}
                    >
                        {this.props.tipsValue}
                    </Text>
                    <Text
                        style={{marginRight:15,marginBottom:2,color:constants.colors.textLight,fontSize:12}}
                        numberOfLines={0}
                    >
                        {this.props.tipsDetailValue}
                    </Text>
                  </View>
                </View>
            </View>
        )
    }

}
