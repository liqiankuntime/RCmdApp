/**
 * Created by huangzhangshu on 2016/10/21.
 */
'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native'
import Common from './constants'
const FACILITIES = {
    15: '专职行李员',
    17: '行李寄存',
    65: '全部免费无线',
    66: '全部收费无线',
    69: '部分免费无线',
    70: '部分收费无线',
    204: '公共收费无线',
    205: '公共免费无线',
    196: '无停车场',
    197: '免费停车',
    198: '收费停车',
    242: '免费接机服务',
    269: '收费接机服务',
    160: '健身中心',
    163: '室内游泳池',
    268: '室外游泳池',
}

const FACILITIES_ICON= {
    15: require('../images/hotel_facilities_luggage.png'),
    17: require('../images/hotel_facilities_luggage.png'),
    65: require('../images/hotel_facilities_wifi.png'),
    66: require('../images/hotel_facilities_wifi.png'),
    69: require('../images/hotel_facilities_wifi.png'),
    70: require('../images/hotel_facilities_wifi.png'),
    204: require('../images/hotel_facilities_wifi.png'),
    205: require('../images/hotel_facilities_wifi.png'),
    196: require('../images/hotel_facilities_park.png'),
    197: require('../images/hotel_facilities_park.png'),
    198: require('../images/hotel_facilities_park.png'),
    242: require('../images/hotel_facilities_airplane.png'),
    269: require('../images/hotel_facilities_airplane.png'),
    163: require('../images/hotel_facilities_pool.png'),
    268: require('../images/hotel_facilities_pool.png'),
    160: require('../images/hotel_facilities_gym.png'),
}
const FACILITIES_ICON_White={
    15: require('../images/hotel_facilities_luggage_white.png'),
    17: require('../images/hotel_facilities_luggage_white.png'),
    65: require('../images/hotel_facilities_wifi_white.png'),
    66: require('../images/hotel_facilities_wifi_white.png'),
    69: require('../images/hotel_facilities_wifi_white.png'),
    70: require('../images/hotel_facilities_wifi_white.png'),
    204: require('../images/hotel_facilities_wifi_white.png'),
    205: require('../images/hotel_facilities_wifi_white.png'),
    196: require('../images/hotel_facilities_park_white.png'),
    197: require('../images/hotel_facilities_park_white.png'),
    198: require('../images/hotel_facilities_park_white.png'),
    242: require('../images/hotel_facilities_airplane_white.png'),
    269: require('../images/hotel_facilities_airplane_white.png'),
    163: require('../images/hotel_facilities_pool_white.png'),
    268: require('../images/hotel_facilities_pool_white.png'),
    160: require('../images/hotel_facilities_gym_white.png'),
}
export default class HotelFacilities extends Component {

    constructor(props) {
        super(props)
    }

    /**
     * 绘制单个
     * @param facilitie
     * @returns {*}
     */
    renderFacilitie(facilitie) {
        if (facilitie === -1) return null
        const {direction} = this.props
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: direction}}>
                {
                    direction=='row'
                     ?
                        <Image source={FACILITIES_ICON[facilitie]} style={{width: 25, height: 25,marginBottom:direction=='column'?5:0}}></Image>
                     :
                        <Image source={FACILITIES_ICON_White[facilitie]} style={{width: 25, height: 25,marginBottom:direction=='column'?5:0}}></Image>
                }

                <View style={{maxWidth:Common.window.width/3-30,}}>
                    <Text style={direction === 'row' ? styles.row_text : styles.column_text}
                          numberOfLines={1}>{FACILITIES[facilitie]}</Text>
                </View>


            </View>
        )
    }

    /**
     * 绘制一行
     * @param data
     * @returns {Array}
     */
    renderFacilities(data) {
        var {direction} = this.props
        return Object.keys(data).map((id) => {
            var facilities = data[id]
            return (
                <View style={{flexDirection: 'row'}} key={id}>
                    {Object.keys(facilities).map((id) => {
                        return (
                            <View style={direction === 'row' ? styles.row_container : styles.column_container} key={id}>
                                {this.renderFacilitie(facilities[id])}
                            </View>
                        )
                    })}
                </View>
            )
        })
    }

    render() {
        var {facilities, rowNumber} = this.props
        if (!facilities) return null
        var data = []
        var temp = []
        for (let type of facilities) {
            if(!FACILITIES[type]) continue
            temp.push(type)
            if (temp.length === rowNumber) {
                data.push(temp)
                temp = []
            }
        }
        if (temp.length !== 0) {
            while (temp.length < rowNumber) {
                temp.push(-1)
            }
            data.push(temp)
        }
        return (
            <View>
                {this.renderFacilities(data)}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    row_text: {
        fontSize: 13, marginLeft: 5, flexWrap: 'nowrap', color: '#999999'
    },
    column_text: {
        fontSize: 13, marginTop: 5, flexWrap: 'nowrap', color: '#999999'
    },
    row_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 10
    },
    column_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    }
})