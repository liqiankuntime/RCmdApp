import {
    StyleSheet,
    Platform
} from 'react-native';
import Common from '../hotel/common/constants';

export const styles = StyleSheet.create({
    main_text: {
        color: '#333333',
        fontSize: 15,
    },
    sub_text: {
        color: '#999999',
        fontSize: 14,
    },
    tip_text: {
        color: '#999999',
        fontSize: 12,
    },
    preview_text: {
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        textShadowColor:'#ffb400'
    },
    preview_view : {
        backgroundColor:'#fbad96',
        borderColor: '#fbad96',
        borderWidth:10,
        borderRadius: 5,
        height: 24,
        width: 66,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    select_text: {
        color: '#999999',
        fontSize: 17,
        textAlign: 'center'
    },
    selected_text: {
        color: '#000000',
        fontSize: 17,
        textAlign: 'center'
    },
    title_text: {
        color: '#ffffff',
        fontSize: 13,
    },
    title_mid_text: {
        color: '#ffffff',
        fontSize: 14,
    },
    buttons: {
        flexDirection: 'row',
        height: 30,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba(51, 51, 51, 0.5)',

        width: Common.window.width,
        height: Common.window.height - 84,
        flex: 1
    },
    modalCenterStyle: {
        position:'absolute',
        left: Common.window.width/2 - 25,
        bottom: Common.window.height/2 + 25,
        height:50,
        width:50,
    },
    email_text: {
        color: '#ffffff',
        fontSize: 17,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    email_view: {
        backgroundColor: '#ed7140',
        borderWidth: 10,
        borderColor: '#ed7140',
        height: 50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    border_text: {
        color: '#ffffff',
        textAlign: 'center',
        width: Platform.OS === 'android'?17:14,
        height: Platform.OS === 'android'?20:14,
        fontSize: 14,
        backgroundColor:'#00000000',
    },
    border_view: {
        width: 22,
        height: 22,
        borderWidth: 11,
        borderColor: '#ffb400',
        borderRadius: 11,
        marginLeft:5,
        marginRight:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
})