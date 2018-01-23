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

export default class Invoice extends React.Component{

    render(){

        return(
            <View style={{flexDirection:'column',paddingTop:6,backgroundColor:constants.colors.lightGray}}>
                <Row title='需要发票' body="如需发票, 请到酒店前台索取" isEditable={false} isInput={false}/>
            </View>
        )
    }
}