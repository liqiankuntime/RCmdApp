/**
 * Created by chenty on 16/9/6.
 */
import React, {Component} from 'react';
import {View, Text} from 'react-native';

class DayDiff extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let {days} = this.props;
        if (days>0){
            return(<Text style={{color:'#ffb400',fontSize:10}}>+{days}</Text>)
        }
        return(<View></View>);
    }
}

export default DayDiff;