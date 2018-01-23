/**
 * Created by chenty on 2016/10/19.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image

} from 'react-native';
import images from '../images/';

export default class Icon extends React.Component {
    render() {
        let {name,style} = this.props;
        return (
            <Image style={style} resizeMode={'contain'} source={images[name]}></Image>
        )
    }
}

