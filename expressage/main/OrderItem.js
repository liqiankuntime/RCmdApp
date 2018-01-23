/**
 * Created by huangzhangshu on 17/4/17.
 */

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Platform,
} from 'react-native';

//高度
const HEIGHT = 46;
//间距
const PADDING = 12;

const TEXT_INPUT = 'textinput';

class OrderItem extends Component {

    constructor(props) {
        super(props);

        this.renderTextinput = this.renderTextinput.bind(this);
        this.renderText = this.renderText.bind(this);
        this.renderType = this.renderType.bind(this);

        this.state = {
            height: HEIGHT,
        }
    }

    renderTextinput() {
        const {onChangeText} = this.props;
        const that = this;
        const paddingValue = Platform.OS === 'android' ? 0 : PADDING;
        return (
            <View style={[styles.touchable_value, {marginLeft: paddingValue, height: this.state.height}, {}]}>
                <TextInput style={[styles.text_value, {
                    height: this.state.height,
                    fontSize: 14,
                }]}
                           onChangeText={onChangeText}
                           {...this.props.children}
                           underlineColorAndroid="transparent"
                           multiline={false}
                           clearButtonMode="while-editing"
                           onChange={(event) => {
                               // const {height} = event.nativeEvent.contentSize;
                               // if (height > HEIGHT) {
                               //     that.setState({
                               //         height: height,
                               //     });
                               // }
                           }}></TextInput>
            </View>
        )
    }

    renderText() {
        const {value, placeholder, disabled} = this.props.children;
        const {onPress} = this.props;
        const that = this;
        return (
            <TouchableOpacity style={styles.touchable_value} onPress={onPress} disabled={disabled}>
                {(value !== '' && value !== undefined) ? <Text style={styles.text_value} onLayouth={(event) => {
                    const {height} = event.nativeEvent.layout;
                    if (height > HEIGHT) {
                        that.setState({
                            height: height,
                        });
                    }
                }}>{value}</Text> :
                    <Text style={styles.text_placeholder}>{placeholder}</Text>}
            </TouchableOpacity>
        )
    }

    renderType() {
        const {type} = this.props.children;
        if (type === TEXT_INPUT) {
            return this.renderTextinput();
        } else {
            return this.renderText();
        }
    }

    render() {
        const {name, showArrow, emptyLine} = this.props.children;
        return (
            <View style={styles.container}>
                <View style={[styles.content, {height: this.state.height}]}>
                    <Text style={styles.text_title}>{name}</Text>

                    {this.renderType()}

                    {showArrow !== false &&
                    <Image style={styles.arrow} source={require('../../hotel/images/ic_arrow.png')}></Image>}
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
        flexDirection: 'row',
        backgroundColor: 'white',
        height: HEIGHT,
        alignItems: 'center',
        paddingLeft: PADDING,
        paddingRight: PADDING,
    },
    text_title: {
        color: '#999999',
        width: 66,
    },
    text_value: {
        color: '#333333',
        marginRight: PADDING,
    },
    text_placeholder: {
        color: '#333333',
        marginRight: PADDING,
    },
    touchable_value: {
        flex: 1,
        marginLeft: PADDING,
        height: HEIGHT,
        justifyContent: 'center',
    },
    arrow: {
        width: 8,
        height: PADDING,
    },
    empty_line: {
        height: 10,
    },
    separator: {
        height: 1,
        marginRight: PADDING,
        marginLeft: PADDING,

    }
});


export default OrderItem;