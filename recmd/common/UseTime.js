/**
 * Created by chenty on 16/9/6.
 */
import React, {Component} from 'react';
import {View, Text} from 'react-native';

class UseTime extends Component {
    constructor(props) {
        super(props);

    }
    _formatTime(minutes){
        let result = Math.floor(minutes / 60) + '时' + (minutes % 60) + '分';
        return result;
    }
    render() {
        let {minutes} = this.props;
        if (minutes>0){
            return(<Text style={{flex:5,color: '#999',textAlign:'center',fontSize:12}}>{this._formatTime(minutes)}</Text>)
        }
        return(<View></View>);
    }
}

export default UseTime;