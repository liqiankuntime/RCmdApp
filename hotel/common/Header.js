/**
 * Created by chenty on 2016/10/18.
 * 导航栏标题
 * @flow
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform
} from 'react-native';

import Icon from './Icon';
import  Common from './constants';
export default class Header extends React.Component {

    render() {

        let NavigationBar = [];

        // 左边图片按钮
        if (this.props.leftIcon != undefined) {
            NavigationBar.push(
                <TouchableOpacity
                    key={'leftIcon'}
                    activeOpacity={0.75}
                    style={styles.leftIcon}
                    onPress={this.props.leftIconAction}
                >
                    <Icon  style={{  width:25,height:25}} name={this.props.leftIcon}/>
                </TouchableOpacity>
            )
        }

        // 标题
        if (this.props.title != undefined) {
            NavigationBar.push(
                <Text key={'title'} style={styles.title}>{this.props.title}</Text>
            )
        }

        // 自定义标题View
        if (this.props.titleView != undefined) {
            let Component = this.props.titleView;

            NavigationBar.push(
                <Component key={'titleView'}/>
            )
        }

        // 右边图片按钮
        if (this.props.rightIcon != undefined) {

            NavigationBar.push(
                <TouchableOpacity
                    key={'rightIcon'}
                    activeOpacity={0.75}
                    style={styles.rightIcon}
                    onPress={this.props.rightIconAction}
                >
                    <Icon color="gray" size={30} name={this.props.rightIcon}/>
                </TouchableOpacity>
            )
        }

        // 右边文字按钮
        if (this.props.rightButton != undefined) {
            NavigationBar.push(
                <TouchableOpacity
                    key={'rightButton'}
                    activeOpacity={0.75}
                    style={styles.rightButton}
                    onPress={this.props.rightButtonAction}
                >
                    <Text style={styles.buttonTitleFont}>{this.props.rightButton}</Text>
                </TouchableOpacity>
            )
        }

        if (this.props.rightMenu != undefined) {
            NavigationBar.push(
                <TouchableOpacity
                    key={'rightMenu'}
                    activeOpacity={0.75}
                    style={styles.rightMenu}
                    onPress={this.props.rightMenuAction}
                >
                    <Text style={{color: 'gray', fontSize: 12}}>{this.props.rightMenu}</Text>
                    <Image source={{uri: 'ic_hotel_ordering'}} style={{width: 16, height: 16}}/>
                </TouchableOpacity>
            )
        }


        return (

            <View>
                <StatusBar  backgroundColor="white" />

                <View style={styles.navigationBarContainer}>
                    {NavigationBar}
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({

    navigationBarContainer: {
        flexDirection: 'row',
        alignItems:'center',
        height: 43,
        alignItems: 'center',
        backgroundColor: '#ed7140',

    },
    statusBar: {
        flex: 1,
        height: 20,
        backgroundColor: 'white',
    },
    title: {
        ...Platform.select({
            ios: {
                fontSize: 16,
                color:'white',
                marginLeft:Common.window.width/2-70,
                marginTop:15
            },
            android: {
                fontSize: 16,
                color:'white',
                marginLeft:5
            }
        }),

    },

    leftIcon: {
        marginLeft: 5,

        ...Platform.select({
            ios:{
                marginTop:15,
            },
            android:{
                marginTop:0
            }
        })
    },

    rightIcon: {
        position: 'absolute',
        right: 10,
        top: 7
    },

    rightButton: {
        position: 'absolute',
        right: 10,
        height: 44,
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonTitleFont: {
        color: 'white',
        fontSize: 15,
    },

    rightMenu: {
        position: 'absolute',
        right: 10,
        height: 44,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
})