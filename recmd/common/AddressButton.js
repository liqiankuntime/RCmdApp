import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';

import images from '../../hotel/images';

const AddressButton = (props) => {
    const {onClick, address, disabled} = props;
    const extra = (address === '请选择上车地点' || address === '请选择下车地点') ? {color: '#999', fontSize: 14} : {fontSize: 15};
    return (
        <TouchableOpacity onPress={onClick} style={styles.address_button} disabled={disabled}>
            <Text style={[styles.address_text, extra]}>{address}</Text>
            {!disabled && <Image source={images['ic_right_arrow_tint']}></Image>}
        </TouchableOpacity>
    )
}

AddressButton.PropTypes = {
    onClick: React.PropTypes.func.isRequired,
    address: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
    address_text: {
        textAlign: 'left',
        fontSize: 14,
        color: '#333',
        marginLeft: 18,
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 1,

    },
    address_button: {
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 1,
    },
})

export default AddressButton;
