/**
 * Created by huangzs on 16/10/17.
 */

'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableHighlight,
    Image,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    Linking,
    Platform,
} from 'react-native'
import {connect} from 'react-redux';
import {fetchHotelDetail, update_search_condition,fetchDetailConfig} from './actions';
import Header from './common/Header';
import Swiper from './common/react-native-swiper'
import StarRating from './common/StarRating'
import constants  from './common/constants'
import Loading from './common/Loading';
import ProductList from './ProductList'
import HotelDetail from './roomList/HotelDetail'
import HotelFacilities from  './common/HotelFacilities'
import * as NATIVE from '../native';
import FacilitiesCpmponent from './common/facilitiesCpmponent';

import imagesindex from './images'

const depayTimeout = 5 //轮播时间
const swiperHeight = 215 //轮播图高度
const windowWidth = constants.window.width
const windowHeight = constants.window.height

var dataSource

class RoomList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            searchKey: Date.now().toString(),
            refreshTimes: 0,
        }

        dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        })

        this.renderHotelRow = this.renderHotelRow.bind(this)
        this.renderHotelList = this.renderHotelList.bind(this)
        this.renderSwiperInfo = this.renderSwiperInfo.bind(this)
        this.tapHotelRow = this.tapHotelRow.bind(this)
        this.tapSwiper = this.tapSwiper.bind(this)
        this.renderImage = this.renderImage.bind(this)
        this.renderSwiper = this.renderSwiper.bind(this)
        this.renderHotelDetail = this.renderHotelDetail.bind(this)
        this.renderHotelDate = this.renderHotelDate.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.tapHotelDetail = this.tapHotelDetail.bind(this)
        this.tapHotelPhone = this.tapHotelPhone.bind(this)
        this.tapHotelMap = this.tapHotelMap.bind(this)
        this.changeDate = this.changeDate.bind(this)
    }

    componentDidMount() {
        const {Config} = this.props

        this.props.dispatch(fetchDetailConfig());

        this.props.dispatch(fetchHotelDetail(
            this.props.hotel.cityId,
            this.props.hotel.cityName,
            this.props.hotel.hotelId,
            this.searchKey));

        let seconds = Config.seconds * 1000;
        this.interval = setInterval(
            () => {
                this.refreshData();
            }, seconds
        )
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    componentWillUnMount() {
        // if(NATIVE.showOrHideNav){
        //     NATIVE.showOrHideNav(false)
        // }
    }

    refreshData() {
        const {Config, detail, dispatch} = this.props
        let limit = Config.limit;
        if (!detail.allOk && this.state.refreshTimes < limit) {
            this.setState({refreshTimes: (this.state.refreshTimes + 1)});
            dispatch(fetchHotelDetail(
                this.props.hotel.cityId,
                this.props.hotel.cityName,
                this.props.hotel.hotelId,
                this.searchKey,
            ));
        } else {
            console.log('hotelDetail was refreshed: ' + this.state.refreshTimes);
            this.state.refreshTimes = 0
        }
    }

    /**
     * 轮播图点击事件
     * @param imageUrl
     */
    tapSwiper(imageUrl) {
        if (NATIVE.toGallery)
            NATIVE.toGallery(this.props.detail.images)
    }

    /**
     * row点击事件
     * @param rowData
     */
    tapHotelRow(rowData) {
        if (this.props.initialRoute && this.props.initialRoute === 'HotelsList') {
            var hotel = null
            for (let item of this.props.hotels) {
                if (item.hotelId === this.props.detail.hotelId) {
                    hotel = item
                    break
                }
            }
            hotel.startDate = this.props.search.startDate
            hotel.endDate = this.props.search.endDate
            let data = {
                hotel: hotel,
                startDate: this.props.search.startDate,
                endDate: this.props.search.endDate,
            }
            NATIVE.autoBookHotelOrder(data)
        } else {
            let roomId = rowData.roomId;
            // InteractionManager.runAfterInteractions(()=> {
            this.props.navigator.push({
                name: 'ProductListContainer',
                component: ProductList,
                passProps: {
                    roomId
                }
            })
            // })
        }
    }

    /**
     * 详情点击事件
     */
    tapHotelDetail() {
        // InteractionManager.runAfterInteractions(()=> {
        this.props.navigator.push({
            name: 'HotelDetailContainer',
            component: HotelDetail,
            passProps: {
                detail: this.props.detail
            }
        })
        // })
    }

    tapHotelMap() {
        const {lat, lng, hotelName, address} = this.props.detail
        if (NATIVE.toHotelMap)
            NATIVE.toHotelMap(Number(lat), Number(lng), hotelName, address)
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

    /**
     * 更改酒店日期
     * @param key
     */
    changeDate() {
        let data = {
            startDate: this.props.search.startDate,
            endDate: this.props.search.endDate,
        }
        if (NATIVE.selectDateEvent) {
            if (Platform.OS === 'android') {
                NATIVE.selectDateEvent(data, (error, result)=> {
                    if (error) {

                    }
                    else {
                        this.props.dispatch(update_search_condition(result))
                    }
                })
            } else {
                NATIVE.selectDateEvent(data, (error, result)=> {
                    if (error) {

                    }
                    else {
                        this.props.dispatch(update_search_condition(result))
                    }
                })
            }

        }
    }

    /**
     * 绘制轮播图片
     * @param data 图片数据
     * @returns {Array}
     */
    renderImage(images) {
        return Object.keys(images).map((id) => {
            return (
                <TouchableHighlight onPress={this.tapSwiper.bind(this, images[id])} key={id}>
                    <Image resizeMode='stretch' source={{uri: images[id]}}
                           style={{height: swiperHeight, width: windowWidth}}/>
                </TouchableHighlight>
            )
        })
    }

    /**
     * 绘制轮播组件
     * @param data 图片数据
     * @returns {XML}
     */
    renderSwiper() {
        var {images} = this.props.detail
        if (!images) {
            images = {}
            images[5] = []
        }
        return (
            <Swiper style={styles.wrapper} height={swiperHeight} showsButtons={false} loop={true} autoplay={true}
                    showsPagination={false} autoplayTimeout={depayTimeout}>
                {this.renderImage(images[5])}
            </Swiper>
        )
    }

    calImageSize(images) {
        return Object.keys(images).map((key) => {
            var data = images[key]
            if (data instanceof Array) {
                return data.length
            } else if (data instanceof Object) {
                return this.calImageSize(data)
            }
        })
    }

    /**
     * 绘制轮播组件信息
     * @returns {XML}
     */
    renderSwiperInfo() {
        var imageSize = 0
        var {images} = this.props.detail
        if (images) {
            Object.keys(images).map((key, index) => {
                var data = images[key]
                if (data instanceof Array) {
                    imageSize = imageSize + data.length
                } else if (data instanceof Object) {
                    var array = this.calImageSize(data)
                    for (var len of array) {
                        imageSize = imageSize + Number(len)
                    }
                }
            })
        }
        return (
            <View style={styles.frameWrapper}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{maxWidth: windowWidth / 1.5,}}>
                        <Text
                            style={[styles.hotelText, {fontWeight: 'bold'}]}
                            numberOfLines={1}>{this.props.detail.hotelName}</Text>
                    </View>

                    <TouchableOpacity style={{height: 25, width: 25, marginLeft: 5}}
                                      onPress={this.tapHotelPhone.bind(this)}>
                        <Image source={imagesindex['ic_hotel_call']} style={{width: 25, height: 25}}/>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 5}}>
                    <StarRating
                        maxStars={5} rating={Number(this.props.detail.starRate)}
                        starSize={15}
                        disabled={false}/>
                    <View style={styles.size}>
                        <Image source={require('./images/ic_camera.png')} style={styles.image_size}></Image>
                        <Text style={styles.text_size}>{imageSize}</Text>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * 绘制地点信息
     * @returns {XML}
     */
    renderHotelAddress() {
        return (
            <TouchableOpacity style={styles.address_container} onPress={this.tapHotelMap.bind(this)}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('./images/ic_hotel_map.png')} style={{height: 20, width: 20}}></Image>

                    <View style={{marginLeft: 10, width: windowWidth - 70}}>
                        <Text style={{fontSize: 16, marginTop: 3, marginBottom: 3}}
                              numberOfLines={1}>{this.props.detail.address}</Text>
                        <Text numberOfLines={1}
                              style={{
                                  fontSize: 14,
                                  color: '#999999',
                                  marginBottom: 3
                              }}>{this.props.detail.traffic}</Text>
                    </View>
                </View>
                <Image style={{width: 8, height: 14, alignSelf: 'center'}}
                       source={require('./images/ic_hotel_address.png')}></Image>
            </TouchableOpacity>
        )
    }

    /**
     * 绘制详情
     * @returns {XML}
     */
    renderHotelDetail() {
        var summaryScore = 0
        const {serviceRank} = this.props.detail
        if (serviceRank) summaryScore = serviceRank.summaryScore
        return (
            <View>
                {this.renderSeparatorLine()}
                <View style={{height: 40, justifyContent: 'center'}}>
                    <Text style={{
                        fontSize: 16,
                        marginLeft: 12,
                        marginTop: 12,
                        marginBottom: 8,
                        color: '#333333'
                    }}>酒店详情</Text>
                </View>
                {this.renderSeparator(0, 0)}
                <View style={{padding: 12, marginTop: 3, marginBottom: 6}}>
                    <Text style={{color: '#ea7140', fontSize: 16}}>{summaryScore}<Text
                        style={{fontSize: 12}}>分</Text></Text>
                    {/*<Text style={{fontSize: 12, color: 'black', marginLeft: 10, paddingLeft: 10}}>   {this.props.detail.introduce ? this.props.detail.introduce.IntroEditor: ''}</Text>*/}
                </View>
                <HotelFacilities facilities={this.props.detail.facilities} rowNumber={4} direction='column'/>
                <TouchableOpacity style={{
                    flex: 1,
                    alignItems: 'center',
                    marginBottom: 12,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
                                  onPress={this.tapHotelDetail.bind(this)}>
                    <Text style={{color: '#ea7140', fontSize: 14}}>查看全部信息</Text>
                    <Image style={{width: 8, height: 14, alignSelf: 'center', marginLeft: 5}}
                           source={require('./images/ic_hotel_address.png')}></Image>
                </TouchableOpacity>
                {this.renderSeparatorLine()}
            </View>
        )
    }

    /**
     * 计算相差天数
     * @param strDateStart
     * @param strDateEnd
     * @returns {Number|*}
     */
    getDays(strDateStart, strDateEnd) {
        var strSeparator = "-"; //日期分隔符
        var oDate1;
        var oDate2;
        var iDays;
        oDate1 = strDateStart.split(strSeparator);
        oDate2 = strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
        return iDays;
    }

    /**
     * 绘制日期
     * @returns {XML}
     */
    renderHotelDate() {
        var {startDate, endDate} = this.props.search
        var startMonth = '', startDay = '', endMonth = '', endDay = '', days_ = ''
        if (startDate) {
            startMonth = startDate.split('-')[1]
            startDay = startDate.split('-')[2]
        }
        if (endDate) {
            endMonth = endDate.split('-')[1]
            endDay = endDate.split('-')[2]
        }
        var days = this.getDays(startDate, endDate)
        return (
            <View
                style={{flexDirection: 'row', backgroundColor: 'white', height: 50, marginBottom: 10, marginTop: 10,}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 3}}>

                    <TouchableOpacity onPress={this.changeDate} style={{marginLeft: -40}}>
                        <Text style={{fontSize: 14, color: '#999999'}}>入住</Text>
                        <Text style={{fontSize: 18, color: '#333333'}}>{startMonth}月{startDay}日</Text>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 3}}>
                    <TouchableOpacity onPress={this.changeDate} style={{marginLeft: -40}}>
                        <Text style={{fontSize: 14, color: '#999999'}}>离店</Text>
                        <Text style={{fontSize: 18, color: '#333333'}}>{endMonth}月{endDay}日</Text>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 2}}>
                    <Text style={{fontSize: 18, color: '#333333'}}>共{days}晚</Text>
                </View>
            </View>
        )
    }

    /**
     *绘制房型列表
     * @param rowData
     * @param sectionId
     * @param rowId
     * @returns {XML}
     */
    renderHotelRow(rowData, sectionId, rowId) {
        let area = (rowData.area && rowData.area !== '') ? (rowData.area + '平米') : ''
        return (
            <TouchableOpacity
                style={{
                    height: 80,
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 5,
                    alignItems: 'center',
                    paddingBottom: 15,
                    marginTop: 15
                }}
                onPress={this.tapHotelRow.bind(this, rowData)}>
                <Image
                    source={(rowData.imageUrl && rowData.imageUrl !== '') ? {uri: rowData.imageUrl} : require('./images/roomImg_none.png')}
                    style={{width: 66, height: 66}}/>
                <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginTop: 10, marginBottom: 10,height:80}}>
                    <View style={{flex: 1, justifyContent: 'center', width: windowWidth / 2}}>
                        <Text style={{
                            fontSize: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#333333'
                        }}
                              numberOfLines={1}
                        >{rowData.roomTypeName}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{
                            fontSize: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#999999'
                        }}>{area} {rowData.bedType}</Text>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
                    <Text style={{color: '#ea7242', alignSelf: 'center', fontSize: 16}}>¥{rowData.lowRate}<Text
                        style={{color: '#999999', fontSize: 12}}>起</Text></Text>
                    <Image source={require('./images/ic_hotel_address.png')}
                           style={{height: 12, width: 8, marginLeft: 10, alignSelf: 'center'}}></Image>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * 绘制间隔条
     * @param sectionID
     * @param rowID
     * @returns {XML}
     */
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={{
                    width: windowWidth,
                    height: 1,
                    backgroundColor: '#e5e5e5',
                }}
                key={"sectionID_" + sectionID + "_rowID_" + rowID}
            />
        )
    }

    /**
     * 绘制list
     * @returns {XML}
     */
    renderHotelList() {
        var {rooms} = this.props.detail
        if (!rooms) rooms = []
        return (
            <ListView
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                dataSource={dataSource.cloneWithRows(rooms)}
                renderRow={this.renderHotelRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                renderSeparator={this.renderSeparator.bind(this)}
                enableEmptySections={true}
            />
        )
    }

    renderNavigatorbar() {
        let top = Platform.OS === 'android' ? 15 : 15
        return (
            <TouchableOpacity style={{
                position: 'absolute',
                top: top,
                left: 10,
                height: 28,
                width: 28,
                justifyContent: 'center',
                alignItems: 'center'
            }}
                              onPress={()=> {
                                  let {navigator} = this.props;
                                  const routes = navigator.getCurrentRoutes();
                                  if (routes.length > 1) {
                                      navigator.pop();
                                  }
                                  else {
                                      NATIVE.navigatorEvent();
                                  }

                              }}
                              hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}>
                <View style={{
                    flex: 1,
                    opacity: 0.8,
                    alignSelf: 'center',
                    backgroundColor: '#ed7140',
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 28,
                    height: 28
                }}>
                    <Image source={require('./images/ic_back.png')}
                           style={{height: 20, width: 20, alignSelf: 'center', opacity: 1}}/>
                </View>

            </TouchableOpacity>
        )

    }

    /**
     * 绘制头部
     * @returns {XML}
     */
    renderHeader() {
        const {rooms, hotelId} = this.props.detail
        let isEmpty = ((!rooms || rooms.length === 0) && !hotelId) ? true : false
        return (
            (isEmpty ? <View style={{flex: 1, width: windowWidth, height: windowHeight}}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={()=>this.props.navigator.pop()}
                    title={ this.props.hotel.hotelName}
                />

                <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                  onPress={()=> {
                                      this.props.dispatch(fetchHotelDetail(
                                          this.props.hotel.cityId,
                                          this.props.hotel.cityName,
                                          this.props.hotel.hotelId));
                                  }}>
                    <Text style={{color: '#333333', fontSize: 16, alignSelf: 'center'}}>点击重新加载</Text>
                </TouchableOpacity>

            </View> : <View>
                {/*<Header*/}
                {/*leftIcon='ic_back'*/}
                {/*leftIconAction={()=>this.props.navigator.pop()}*/}
                {/*title={this.props.detail.name}*/}
                {/*/>*/}

                {this.renderSwiper()}

                {this.renderSwiperInfo()}

                {this.renderNavigatorbar()}

                {this.renderHotelAddress()}

                {this.renderHotelDetail()}

                {this.renderHotelDate()}


            </View>)

        )
    }

    /**
     * 绘制提示信息
     * @returns {XML}
     */
    renderFooter() {
        const {rooms, hotelId} = this.props.detail
        let isEmpty = ((!rooms || rooms.length === 0) && !hotelId) ? true : false
        if (isEmpty) return null
        return (
            <View style={{paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10, flex: 1}}>
                <Text style={{fontSize: 16, color: '#333333'}}>温馨提示</Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{fontSize: 12, color: '#999999'}}>预定须知</Text>
                    <Text
                        style={styles.text_notice}>{this.props.detail.hotelAvailPolicys}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{fontSize: 12, color: '#999999'}}>入离通知</Text>
                    <Text
                        style={styles.text_notice}>{this.props.detail.checkInAndLeaveTime}</Text>
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
        console.log('config==>' + JSON.stringify(this.props.Config))
        console.log(this.props.detail.allOk + ' detail==>' + JSON.stringify(this.props.detail))
        return (
            <View style={styles.container}>
                {(this.props.isLoading) ?
                    <Loading/> : this.renderHotelList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wrapper: {},
    frameWrapper: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 168,
        left: 12,
        right: 12,
        flex: 1
    },
    hotelText: {
        color: 'white',
        fontSize: 16
    },
    size: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image_size: {
        height: 11,
        width: 15
    },
    text_size: {
        color: 'white',
        marginLeft: 8,
        fontSize: 12,
    },
    text_notice: {
        fontSize: 12,
        marginLeft: 12,
        width: windowWidth - 80,
        color: '#999999'
    },
    address_container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-between'
    }
});

function mapStateToProps(state) {
    // console.log('data===>'+JSON.stringify(state.detail))
    return {
        hotels: state.hotels.list.data,
        detail: state.detail.data,
        isLoading: state.detail.loading,
        search: state.search,
        Config: state.detailConfig,
    }
}

export default connect(mapStateToProps)(RoomList);