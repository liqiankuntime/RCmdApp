/**
 * Created by huangzhangshu on 17/4/19.
 */

import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const HEIGHT = 46;
const PADDING = 12;

class OrderAddressItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: HEIGHT,
        }
    }

    renderIcon() {
        const {code} = this.props.children;
        const title = code === 'send' ? '寄' : '收';
        return (
            <View style={styles.icon_container}>
                <Image style={styles.icon}
                       source={code === 'send' ? require('../../hotel/images/ic_yellow_circle.png') : require('../../hotel/images/ic_bule_circle.png')}></Image>
                <View style={styles.icon_text_container}>
                    <Text style={styles.icon_text}>{title}</Text>
                </View>
            </View>
        )
    }

    renderValue(value) {
        const that = this;
        return (
            <View style={styles.value_container}>
                <View style={styles.title_container}>
                    <Text style={styles.title_text}>{value.userName}</Text>
                    <Text style={[styles.title_text, {marginLeft: PADDING}]}>{value.mobile}</Text>
                </View>
                <Text
                    style={styles.name_text} onLayout={(event) => {
                    if (event.nativeEvent.layout.height > HEIGHT) {
                        that.setState({
                            height: event.nativeEvent.layout.height + 20,
                        })
                    }
                }}>{value.province + value.city + value.area + value.street + value.address}</Text>
            </View>
        )
    }

    render() {
        const {value, showArrow, emptyLine, placeholder, disabled} = this.props.children;
        const {onPress} = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.content, {height: this.state.height}]}>
                    {this.renderIcon()}
                    <TouchableOpacity style={styles.touchable_value} onPress={onPress} disabled={disabled}>
                        {value ? this.renderValue(value) :
                            <Text style={styles.text_placeholder}>{placeholder}</Text>}
                    </TouchableOpacity>
                    {showArrow !== false && <Image style={styles.arrow} source={require('../../hotel/images/ic_arrow.png')}></Image>}
                </View>
                {emptyLine ? <View style={styles.empty_line}/> : <View style={styles.separator}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingLeft: PADDING,
        paddingRight: PADDING,
        alignItems: 'center',
    },
    icon_container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 16,
        width: 16,
    },
    icon_text_container: {
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 16,
        width: 16,
        backgroundColor: 'transparent',
    },
    icon_text: {
        color: 'white',
        fontSize: 11,
    },
    arrow: {
        width: 8,
        height: PADDING,
    },
    text_value: {
        color: '#333333',
        marginRight: PADDING,
    },
    text_placeholder: {
        color: '#999999',
        marginRight: PADDING,
    },
    touchable_value: {
        flex: 1,
        marginLeft: PADDING,
    },
    empty_line: {
        height: 10,
    },
    separator: {
        height: 1,
        marginRight: PADDING,
        marginLeft: PADDING,
    },
    value_container: {
        flexDirection: 'column',
    },
    title_container: {
        flexDirection: 'row',
    },
    title_text: {
        color: '#999999',
        fontSize: 11,
    },
    name_text: {
        fontSize: 14,
        color: '#333333',
    }
});

export default OrderAddressItem;