/**
 * Created by shane on 16/10/31.
 */
import React from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    InteractionManager
} from 'react-native'

import Header from '../common/Header'
import RoomInformationCpmponent from '../common/roomInformationComponent'

export default class RoomDetail extends React.Component{

    _roomFacilities(roomInfo){
        let window='有窗';
        if(roomInfo.window==0){
            window='无窗'
        }
        let otherFacilities={
            'area':roomInfo.area||'',
            'capcity':roomInfo.capcity||'',
            'floor':roomInfo.floor||'',
            'bedType':roomInfo.bedType||'',
            'window':window||'',
        }
        return otherFacilities;
    }

    render(){
        const roomInfo = this.props.roomInfo;
        const otherFacilities = this._roomFacilities(roomInfo);
        return(
            <View style={{backgroundColor:'white',flex:1}}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={()=>this.props.navigator.pop()}
                    title='房型详情'
                />
                <ScrollView>
                    <Text style={{marginLeft:10, marginTop:20, marginBottom:10}}>
                        房型设施
                    </Text>
                    <RoomInformationCpmponent
                        facilities={roomInfo.facilities}
                        otherFacilities={otherFacilities}
                        roomDescriptioin={roomInfo.description}
                        styleControl={1}
                    />
                </ScrollView>
            </View>
        )
    }

}

