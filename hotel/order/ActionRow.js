
import React from 'react'
import {
    View,
    Text,
    Image,
    Switch,
    TouchableOpacity,
    StyleSheet,

} from 'react-native'

import Icon from '../common/Icon'
import constants from '../common/constants'


export default class ActionRow extends React.Component{



    render(){
        const {navigator,dispatch,order,rowTitle,rowValue,rowType,editable,...props} = this.props;

        return(

            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',marginTop:1}}>
                <Text style={{marginTop:15,marginBottom:15,marginLeft:10,width:70,color:constants.colors.textLight,fontSize:16}}>
                    {rowTitle}
                </Text>

                {

                  rowType == 'switch'?
                  <View style={{flex:1,flexDirection:'row',justifyContent :'flex-end'}}>
                      <Switch
                        disabled = {!editable}
                          onValueChange = {(value) => {
                              if (this.props.onValueChange) {
                                this.props.onValueChange(value)
                              }
                            }}
                          value={this.props.value}
                      />
                  </View>
                  :
                  <Text
                      style={{color:constants.colors.text,fontSize:16}}
                      numberOfLines={0}
                  >
                    {rowValue}
                  </Text>
                }

            </View>
        )
    }
    selected(value){
      if (this.props.isTapEntable) {
        alert(this.props.textValue)
      }

    }
}
