/**
 * Created by zhaoxj on 16/10/19.
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import FacilitiesCpmponent from './facilitiesCpmponent';

class RoomInformationCpmponent extends Component {

    render(){
        return(
            <View>
                <View>
                    <FacilitiesCpmponent
                        facilities={this.props.facilities}
                        type={'row'}
                        otherFacilities={this.props.otherFacilities?this.props.otherFacilities:''}
                        styleControl={this.props.styleControl}
                    />
                </View>
                <View style={{marginTop:7}}>
                    <Text style={[styles.text,{color:this.props.styleControl==1?'#999999':'#fff'}]}>
                        其他    {this.props.roomDescriptioin}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    text:{
        paddingLeft:10,
        paddingRight:10,
    }

});
export default RoomInformationCpmponent;