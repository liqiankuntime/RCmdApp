/**
 * Created by huangzhangshu on 2016/10/22.
 */
'use strict'

import React, {Component} from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
} from 'react-native'

import Header from '../common/Header';
import StarRating from '../common/StarRating'
import HotelFacilities from '../common/HotelFacilities'
import Common from '../common/constants'
const FACILITIES = {
    15: '专职行李员',
    17: '行李寄存',
    65: '全部房间免费无线',
    66: '全部房间收费无线',
    69: '部分房间免费无线',
    70: '部分房间收费无线',
    204: '公共区域收费无线',
    205: '公共区域免费无线',
    196: '无停车场',
    197: '免费停车',
    198: '收费停车',
    242: '免费接机服务',
    269: '收费接机服务',
    160: '健身中心',
    163: '室内游泳池',
    268: '室外游泳池',
}

export default class HotelDetail extends Component {

    constructor(props) {
        super(props)

        this.renderNavigator = this.renderNavigator.bind(this)
        this.renderDetail = this.renderDetail.bind(this)
        this.tapHotelPhone = this.tapHotelPhone.bind(this)

        this.state = {
            numberOfLines: 3,
            facilitiesMoreVisible: false,
        }

    }

    /**
     * 电话点击事件
     */
    tapHotelPhone() {
        var tel = 'tel:' + this.props.detail.phone
        Linking.canOpenURL(tel).then(supperted => {
            if (supperted) {
                Linking.openURL(tel)
            }
        })
    }

    renderNavigator() {
        var title = '酒店信息'
        return (
            <Header
                leftIcon='ic_back'
                leftIconAction={()=>this.props.navigator.pop()}
                title={title}
            />
        )
    }

    tapMore() {
        // if(!this.state.numberOfLines){
        //     this.refs.roomScrool.scrollTo({x:0,y:0,animated:true})
        // }
        this.setState({
            numberOfLines: this.state.numberOfLines === 3 ? null : 3,
        })
    }

    tapFacilitiesMore() {
        this.setState({
            facilitiesMoreVisible: !this.state.facilitiesMoreVisible
        })
    }

    renderDetail() {
        const facilities = []
        for(let item of this.props.detail.facilities){
            if(!FACILITIES[item]) continue
            facilities.push(item)
        }
        var helpfulTips = ''
        var initFacilities, moreFacilities
        if (facilities.length > 3) {
            initFacilities = facilities.slice(0, 3)
            moreFacilities = facilities.slice(3, facilities.length)
        } else {
            initFacilities = facilities.slice(0, facilities.length)
        }
        for (var i = 0; i < this.props.detail.helpfulTips.length; i++) {
            helpfulTips = helpfulTips + (i + 1) + '.' + this.props.detail.helpfulTips[i] + '\n'
        }
        return (
            <View>
                <View style={{
                    backgroundColor: '#ed7140',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center',height:30,width:Common.window.width-70}}>
                        <View style={{maxWidth:Common.window.width/1.5,}}>
                            <Text
                                style={styles.hotelText} numberOfLines={1}>{this.props.detail.hotelName}</Text>
                        </View>
                        <TouchableOpacity style={{height: 25, width: 25, marginLeft: 10}}
                                          onPress={this.tapHotelPhone.bind(this)}>
                            <Image source={require('../images/ic_call_black.png')} style={{width: 25, height: 25}}/>
                        </TouchableOpacity>
                    </View>
                    <StarRating
                        maxStars={5} rating={Number(this.props.detail.starRate)}
                        starSize={15}
                        disabled={false}/>
                </View>

                <View style={{flexDirection: 'row', height: 66,marginBottom:3}}>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 18,
                            color: '#ea7242'
                        }}>{this.props.detail.serviceRank.bookingSuccessScore}</Text>
                        <Text style={{fontSize: 13, color: '#999999', marginTop: 5}}>预定成功率</Text>
                    </View>

                    <View style={{backgroundColor: '#e5e5e5', width: 1, height: 30, alignSelf: 'center'}}/>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 18,
                            color: '#ea7242'
                        }}>{this.props.detail.serviceRank.instantConfirmScore}</Text>
                        <Text style={{fontSize: 13, color: '#999999', marginTop: 5}}>及时确认率</Text>
                    </View>
                    <View style={{backgroundColor: '#e5e5e5', width: 1, height: 30, alignSelf: 'center'}}/>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 18,
                            color: '#ea7242'
                        }}>{this.props.detail.serviceRank.complaintScore}</Text>
                        <Text style={{fontSize: 13, color: '#999999', marginTop: 5}}>用户投诉率</Text>
                    </View>

                </View>

                {this.renderSeparatorLine()}

                <View style={{margin: 12}}>

                    <Text style={{fontSize: 18,color:'#333333'}}>{'酒店介绍\n'}</Text>
                    <Text style={{fontSize: 14, color: '#999999',lineHeight:30}}
                          numberOfLines={this.state.numberOfLines}>{this.props.detail.introduce.IntroEditor + '\n\n'}
                        <Text style={{fontSize: 15, color: '#333333'}}>{'温馨提示\n'}</Text>
                        <Text style={{marginTop: 10, fontSize: 13, color: '#999999'}}>{'\n' + helpfulTips}</Text>
                        <Text style={{color: '#ea7242', fontSize: 13}}>支持卡种
                            <Text style={{
                                color: '#999999',
                                fontSize: 13
                            }}>{'\t   ' + this.props.detail.introduce.CreditCards}</Text>
                        </Text>
                    </Text>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', marginTop: 12,flexDirection:'row',justifyContent:'center'}}
                                      onPress={this.tapMore.bind(this)}>
                        <Text style={{color: '#ea7242', fontSize: 12}}>{this.state.numberOfLines === 3 ? '查看更多' : '收起'}</Text>
                        <Image style={{width:14,height:10,marginLeft:5}} source={this.state.numberOfLines === 3 ? require('../images/ic_down.png') : require('../images/ic_up.png')}></Image>
                    </TouchableOpacity>


                </View>

                {this.renderSeparatorLine()}

                <View style={{marginTop: 12, marginBottom: 12, marginLeft: 12}}>
                    <Text style={{fontSize: 18, marginBottom: 10}}>酒店设施</Text>

                    <HotelFacilities facilities={initFacilities} rowNumber={3} direction='row'/>

                    {(moreFacilities && this.state.facilitiesMoreVisible) ?
                        <HotelFacilities facilities={moreFacilities} rowNumber={3} direction='row'/> : null}

                    {
                        moreFacilities ?
                            <TouchableOpacity style={{flex: 1, alignItems: 'center', marginTop: 12,flexDirection:'row',justifyContent:'center'}}
                                              onPress={this.tapFacilitiesMore.bind(this)}>
                                <Text style={{color: '#ea7242', fontSize: 14}}>{(moreFacilities && this.state.facilitiesMoreVisible) ?  '收起' : '查看更多'}</Text>
                                <Image style={{width:14,height:10,marginLeft:5,alignSelf:'center',alignItems:'center'}} source={(moreFacilities && this.state.facilitiesMoreVisible) ? require('../images/ic_up.png') : require('../images/ic_down.png')}></Image>
                            </TouchableOpacity>:null
                    }


                </View>

                {this.renderSeparatorLine()}

                <View style={{marginTop: 12, marginBottom: 12}}>
                    <View style={{borderBottomWidth:1,borderColor:'#e5e5e5'}}>
                        <Text style={{fontSize: 18, marginBottom: 10,marginLeft:12}}>周边交通</Text>
                    </View>

                    <Text style={{fontSize: 13, color: '#999999',marginLeft:14,marginTop:10,lineHeight:30}}>{this.props.detail.traffic + '\n\n'}
                    </Text>

                    {/*<TouchableOpacity style={{flex: 1, alignItems: 'center', marginTop: 12}}*/}
                                      {/*onPress={this.tapFacilitiesMore.bind(this)}>*/}
                        {/*<Text style={{color: '#ea7242', fontSize: 12}}>查看更多</Text>*/}
                    {/*</TouchableOpacity>*/}

                </View>

            </View>
        )
    }

    renderSeparatorLine() {
        return (
            <View style={{backgroundColor: '#e5e5e5', height: 6}}/>
        )
    }

    render() {
        return (
            <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false} ref="roomScrool">
                {this.renderNavigator()}

                {this.renderDetail()}

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    hotelText: {
        color: 'white',
        fontSize: 16
    },
});
