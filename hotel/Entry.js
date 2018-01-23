/**
 * Created by lichao on 16/10/17.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    InteractionManager
} from 'react-native';
import * as NATIVE from '../native';
import {connect} from 'react-redux'
import {update_search_condition,resetHotelsList} from './actions/';
import images from './images/';
import HotelsList from './HotelsList';
import {getDate, getDayOfWeek, getDateDiffer} from './common/comm';
import StarLevel from './common/starLevel';
import Common from './common/constants';
import {alertShow} from '../common/Alert'

let fontGray = 'lightgray'; //color:'lightgray'
let fontDark = '#333333';
let marginLeft = 20;
let defaultCityName = '城市';
let defaultPlace = '关键字';
let defaultRate = '价格/星级';
let defaultStartDate = '入住日期';
let defaultEndDate = '离店日期';
let defaultPub = 'pub';
let defaultPri = 'pri';
let defaultPriName = '因私';
let defaultPubName = '因公';
let StarRates = ['不限', '', '经济', '三星', '四星', '五星'];
let contentStyle = StyleSheet.create({
    line: {
        height: 0.5,
        backgroundColor: '#e5e5e5',
        marginLeft: marginLeft,
        marginRight: 20
    },
    select: {
        marginRight: 15,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 15,
        marginLeft: marginLeft,
        justifyContent: 'center',
        color: fontGray,
        flexDirection: 'row'
    },
    date: {
        flex: 1, height: 58, marginLeft: marginLeft, flexDirection: 'row', alignItems: 'center'
    },
    dateTip: {
        fontSize: 10,
        color: fontGray,
        textAlign: 'left',
        marginLeft: 2
    },
    dateContent: {
        fontSize: 15,
        color: fontDark,
        textAlign: 'left'
    },
    dateWeek: {
        fontSize: 15,
        color: fontDark,
        textAlign: 'left',
        marginLeft: 5
    },
    buttonView: {
        //backgroundColor: '#449FF7',
        width: 203,
        height: 54,
        //borderRadius:100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pubView: {
        alignItems: 'center', height: 27, width: 45,
        backgroundColor: 'white', justifyContent: 'center',
        borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
        borderWidth: 0.5, borderRightWidth: 0,
        borderColor: '#e5e5e5'
    },
    pubViewPress: {
        alignItems: 'center', height: 27, width: 45,
        backgroundColor: '#ffb400', justifyContent: 'center',
        borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
        borderWidth: 0.5, borderRightWidth: 0,
        borderColor: '#e5e5e5'
    },
    priView: {
        alignItems: 'center', height: 27, width: 45,
        backgroundColor: 'white', justifyContent: 'center',
        borderTopRightRadius: 5, borderBottomRightRadius: 5,
        borderWidth: 0.5, borderLeftWidth: 0,
        borderColor: '#e5e5e5'
    },
    priViewPress: {
        alignItems: 'center', height: 27, width: 45,
        backgroundColor: '#ffb400', justifyContent: 'center',
        borderTopRightRadius: 5, borderBottomRightRadius: 5,
        borderWidth: 0.5, borderLeftWidth: 0,
        borderColor: '#e5e5e5'
    },
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba(51, 51, 51, 0.5)',

        width: Common.window.width,
        height: Common.window.height - 84,
        flex: 1
    }
});
class Entry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            priceVisiable: false
        }
        this.getVersion();
    }

    componentWillMount() {

    }

    componentDidMount() {
        showTitleEvent(true);
    }

    render() {
        let {search} = this.props;
        //对 props 做显示级别的转化
        let stats = {
            cityName: defaultCityName,
            location: defaultPlace,
            rate: defaultRate,
            startDate: defaultStartDate,
            endDate: defaultEndDate,
            startWeek: '',
            endWeek: '',
            num: 0,
            keywords:''
        };
        if (search.cityName) {
            stats.cityName = search.cityName
        }
        if (search.location) {
            stats.location = search.location
        }
        if (search.keywords) {
            stats.keywords = search.keywords
        }
        if (search.starRate || search.lowRate || search.highRate) {
            stats.rate = this._getStarPrice(search);
            if (stats.rate == '不限') {
                stats.rate = defaultRate;
            }
        }

        if (search.startDate && search.endDate) {
            stats.num = getDateDiffer(search.startDate, search.endDate);
        }

        if (search.startDate) {
            stats.startDate = getDate(search.startDate);
            stats.startWeek = getDayOfWeek(search.startDate)
        }
        if (search.endDate) {
            stats.endDate = getDate(search.endDate);
            stats.endWeek = getDayOfWeek(search.endDate)
        }

        //showTitleEvent(true);
        //<TouchableOpacity onPress={this.clearPrice.bind(this)}>
        //     <Image style={{marginRight:15,height:stats.rate == defaultRate?0:20}} resizeMode={Image.resizeMode.center} source={images['ic_clear']}>
        //
        //     </Image>
        // </TouchableOpacity>
        if(search.version && search.version>(Common.version)) {
            if(search.pubpritype){
                this.selectPubpri('');
            }
            return (
                //row column
                <ScrollView
                    style={{flex: 1, flexDirection: 'column',backgroundColor:'#f3f3f3',paddingTop:20,paddingLeft:15,paddingRight:15}}>
                    <View
                        style={{backgroundColor: 'white', flexDirection: 'column',paddingBottom:50,borderBottomColor:"#dfdfdf",borderBottomWidth:2}}>

                        <Image style={{height:130,flex:1,width:Common.window.width - 30}}
                               resizeMode={Image.resizeMode.cover}
                               source={images['ic_hotel_index_title_bar']}>

                        </Image>
                        <View style={{height:58,flex:1,justifyContent:'flex-end',flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.selectCity.bind(this)}
                                              style={{height:58,flex:1,justifyContent:'center'}}>
                                <Text
                                    style={[contentStyle.select,{color:stats.cityName == defaultCityName?fontGray:fontDark}]}>
                                    {stats.cityName}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.location.bind(this)}
                                              style={{height:58,justifyContent:'center'}}>
                                <View
                                    style={{height:58,justifyContent:'center',flexDirection: 'column', alignItems: 'center'}}>
                                    <Image style={{marginRight:20,height:20}}
                                           resizeMode={Image.resizeMode.center} source={images['ic_map_location']}>

                                    </Image>
                                    <Text style={[contentStyle.dateTip, {marginRight: 20}]}>
                                        我的位置
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={contentStyle.line}/>
                        <TouchableOpacity onPress={this.selectDate.bind(this)}>
                            <View style={contentStyle.date}>
                                <View style={{flex:1, flexDirection: 'column'}}>
                                    <Text style={[contentStyle.dateTip]}>入店</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={contentStyle.dateContent}> {getDate(this.props.search.startDate)}</Text>
                                        <Text
                                            style={contentStyle.dateWeek}>{getDayOfWeek(this.props.search.startDate)}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1, flexDirection: 'column'}}>
                                    <Text style={[contentStyle.dateTip]}>离店</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={contentStyle.dateContent}> {getDate(this.props.search.endDate)}</Text>
                                        <Text
                                            style={contentStyle.dateWeek}>{getDayOfWeek(this.props.search.endDate)}</Text>
                                    </View>
                                </View>
                                <Text style={{marginRight:20,marginTop:12,fontSize:15}}>共{stats.num}晚</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={contentStyle.line}/>
                        <View
                            style={{height:58,flex:1,flexDirection: 'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{height:58,flex:1,justifyContent:'center'}}
                                              onPress={this.selectKeyword.bind(this)}>
                                <Text
                                    style={[contentStyle.select,{color:stats.location == defaultPlace && !stats.keywords?fontGray:fontDark}]}>
                                    {stats.keywords ? stats.keywords : stats.location}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.clearPlace.bind(this)}>
                                <Image
                                    style={{marginRight:15,height:stats.location == defaultPlace && !stats.keywords?0:20}}
                                    resizeMode={Image.resizeMode.center} source={images['ic_clear']}>

                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={contentStyle.line}/>
                        <View
                            style={{height:58,flex:1,flexDirection: 'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{height:58,flex:1,justifyContent:'center'}}
                                              onPress={this.selectPrice.bind(this)}>
                                <Text style={[contentStyle.select,{color:stats.rate == defaultRate?fontGray:fontDark}]}>
                                    {stats.rate}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View />
                        <View style={contentStyle.line}/>
                    </View>
                    <View style={{height:38,flex:1,marginTop:-28,marginBottom:40,alignItems:'center'}}>
                        <TouchableHighlight onPress={this.query.bind(this)} underlayColor="#00000000">
                            <Image style={[contentStyle.buttonView,{flexDirection:'row',alignItems:'center'}]}
                                   resizeMode={Image.resizeMode.stretch}
                                   source={images['ic_hotel_index_search_bg']}>
                                <Image style={{height:14,width:14}} resizeMode={Image.resizeMode.cover}
                                       source={images['ic_hotel_index_search_label']}/>
                                <Text style={{color:'white',marginLeft:5,fontSize:15}}>查询</Text>
                            </Image>
                        </TouchableHighlight>
                    </View>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this._isShow()}
                        onShow={() => {
                    }}
                        onRequestClose={() => {
                    }}>
                        <View style={contentStyle.modalStyle}>
                            <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}}
                                                      onPress={this._cancelClick.bind(this)}>
                                <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}/>

                            </TouchableWithoutFeedback>

                            <StarLevel style={{flex: 1}} search={search}
                                       onSureCallBack={this._onPriceSortCallBack.bind(this)}/>

                        </View>
                    </Modal>
                </ScrollView>
            );
        }else {//3.1.0以前 兼容
            
            if(!search.pubpritype){
                this.selectPubpri(defaultPub);
            }
            
            return (
                //row column
                <ScrollView
                    style={{flex: 1, flexDirection: 'column',backgroundColor:'#f3f3f3',paddingTop:20,paddingLeft:15,paddingRight:15}}>
                    <View
                        style={{backgroundColor: 'white', flexDirection: 'column',paddingBottom:50,borderBottomColor:"#dfdfdf",borderBottomWidth:2}}>

                        <Image style={{height:78,flex:1,width:Common.window.width - 30}} resizeMode={Image.resizeMode.cover}
                               source={images['ic_hotel_index_title_bar']}>

                        </Image>
                        <TouchableOpacity onPress={this.selectCity.bind(this)}
                                          style={{height:58,flex:1,justifyContent:'center'}}>
                            <Text style={[contentStyle.select,{color:stats.cityName == defaultCityName?fontGray:fontDark}]}>
                                {stats.cityName}
                            </Text>
                        </TouchableOpacity>
                        <View style={contentStyle.line}/>
                        <TouchableOpacity onPress={this.selectDate.bind(this)}>
                            <View style={contentStyle.date}>
                                <View style={{flex:1, flexDirection: 'column'}}>
                                    <Text style={[contentStyle.dateTip]}>入店</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={contentStyle.dateContent}> {getDate(this.props.search.startDate)}</Text>
                                        <Text
                                            style={contentStyle.dateWeek}>{getDayOfWeek(this.props.search.startDate)}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1, flexDirection: 'column'}}>
                                    <Text style={[contentStyle.dateTip]}>离店</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={contentStyle.dateContent}> {getDate(this.props.search.endDate)}</Text>
                                        <Text style={contentStyle.dateWeek}>{getDayOfWeek(this.props.search.endDate)}</Text>
                                    </View>
                                </View>
                                <Text style={{marginRight:20,marginTop:12,fontSize:15}}>共{stats.num}晚</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={contentStyle.line}/>
                        <View style={{height:58,flex:1,flexDirection: 'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{height:58,flex:1,justifyContent:'center'}}
                                              onPress={this.selectPlace.bind(this)}>
                                <Text
                                    style={[contentStyle.select,{color:stats.location == defaultPlace?fontGray:fontDark}]}>
                                    {stats.location}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.clearPlace.bind(this)}>
                                <Image style={{marginRight:15,height:stats.location == defaultPlace?0:20}}
                                       resizeMode={Image.resizeMode.center} source={images['ic_clear']}>

                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={contentStyle.line}/>
                        <View style={{height:58,flex:1,flexDirection: 'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{height:58,flex:1,justifyContent:'center'}}
                                              onPress={this.selectPrice.bind(this)}>
                                <Text style={[contentStyle.select,{color:stats.rate == defaultRate?fontGray:fontDark}]}>
                                    {stats.rate}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View />
                        <View style={contentStyle.line}/>
                        <View
                            style={{height:50,flex:1,flexDirection:'row',marginRight:15,alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={{flex:1,marginLeft:marginLeft,color:fontDark,fontSize:15}}>出行类型</Text>
                            <TouchableOpacity
                                style={this.props.search.pubpritype == defaultPub?contentStyle.pubViewPress:contentStyle.pubView}
                                onPress={this.selectPubpri.bind(this,defaultPub)}>
                                <Text
                                    style={{color:this.props.search.pubpritype == defaultPub?'white':"#666666",fontSize:12}}>
                                    {defaultPubName}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={this.props.search.pubpritype == defaultPri?contentStyle.priViewPress:contentStyle.priView}
                                onPress={this.selectPubpri.bind(this,defaultPri)}>
                                <Text
                                    style={{color:this.props.search.pubpritype == defaultPri?'white':"#666666",fontSize:12}}>
                                    {defaultPriName}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height:38,flex:1,marginTop:-28,marginBottom:40,alignItems:'center'}}>
                        <TouchableHighlight onPress={this.query.bind(this)} underlayColor="#00000000" >
                            <Image style={[contentStyle.buttonView,{flexDirection:'row',alignItems:'center'}]}
                                   resizeMode={Image.resizeMode.stretch}
                                   source={images['ic_hotel_index_search_bg']}>
                                <Image style={{height:14,width:14}} resizeMode={Image.resizeMode.cover}
                                       source={images['ic_hotel_index_search_label']}/>
                                <Text style={{color:'white',marginLeft:5,fontSize:15}}>查询</Text>
                            </Image>
                        </TouchableHighlight>
                    </View>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this._isShow()}
                        onShow={() => {
                    }}
                        onRequestClose={() => {
                    }}>
                        <View style={contentStyle.modalStyle}>
                            <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}} onPress={this._cancelClick.bind(this)}>
                                <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}/>

                            </TouchableWithoutFeedback>

                            <StarLevel style={{flex: 1}} search={search}
                                       onSureCallBack={this._onPriceSortCallBack.bind(this)}/>

                        </View>
                    </Modal>
                </ScrollView>
            );
        }
    }


    _getStarPrice(search) {
        let price = null;
        if (search.lowRate > 0) {
            price = `¥${search.lowRate}以上`;
        }
        if (search.highRate < 9999) {
            price = (price ? price : '') + `¥${search.highRate}以下`;
        }
        let starRates = [];
        if (price) {
            starRates.push(price);
        }
        for (let key of search.starRate) {
            starRates.push(StarRates[key]);
        }
        return starRates.join('、');
    }

    /**
     * 城市选择 用户触发
     */
    selectCity() {
        selectCityEvent((error, result)=> {
            if (error) {

            }
            else {
                if (result) {
                    this.props.search.cityName = result.name;
                    this.props.search.cityId = result.id;
                    let {dispatch,search} = this.props;
                    dispatch(update_search_condition(search));
                    this.clearPlace();
                }
            }
        })
    }

    /**
     * 日期选择 用户触发
     */
    selectDate() {
        let data = new Object();
        data.startDate = this.props.search.startDate;
        data.endDate = this.props.search.endDate;
        selectDateEvent(data, (error, result)=> {
            if (error) {

            }
            else {
                if (result) {
                    let search = {
                        startDate: result.startDate,
                        endDate: result.endDate,
                    };
                    let {dispatch} = this.props;
                    dispatch(update_search_condition(search));
                }
            }
        })
    }

    /**
     * 价位选择 用户触发
     */
    selectPrice() {
        // Alert.alert('提示','price');
        this.setState({priceVisiable: true});
    }

    /**
     * 定位 用户触发
     */
    location() {
        // Alert.alert('提示','price');
        locationEvent((error, result)=>{
            if(error){

            }else{
                if(result){
                    let search = {
                        lat: result.lat,
                        lng: result.lng,
                        location: result.location,
                        keywords: ''
                    };
                    if (result.cityName && result.cityId) {
                        search.cityName = result.cityName;
                        search.cityId = result.cityId;
                    }
                    let {dispatch} = this.props;
                    dispatch(update_search_condition(search));
                }
            }

        });
    }

    /**
     * 地点选择 用户触发
     */
    selectPlace() {
        let data = new Object();
        data.cityName = this.props.search.cityName;
        data.cityId = this.props.search.cityId;
        data.location = this.props.search.location;
        data.lat = this.props.search.lat;
        data.lng = this.props.search.lng;
        selectPlaceEvent(data, (error, result)=> {
            if (error) {

            }
            else {
                if (result) {
                    let search = {
                        lat: result.lat,
                        lng: result.lng,
                        location: result.location,
                        cityName: this.props.search.cityName,
                        cityId: this.props.search.cityId,

                    };
                    // this.props.search.lat = result.lat;
                    // this.props.search.lng = result.lng;
                    // this.props.search.location = result.location;
                    if (result.cityName && result.cityId) {
                        search.cityName = result.cityName;
                        search.cityId = result.cityId;
                    }
                    search.searchKey = Date.now().toString();
                    let {dispatch} = this.props;
                    dispatch(update_search_condition(search));
                }
            }
        })
    }

    /**
     * 关键词选择 用户触发
     */
    selectKeyword() {
        let data = new Object();
        data.cityName = this.props.search.cityName;
        data.cityId = this.props.search.cityId;
        data.location = this.props.search.location;
        data.lat = this.props.search.lat;
        data.lng = this.props.search.lng;
        selectKeywordEvent(data, (error, result)=> {
            if (error) {

            }
            else {
                if (result) {
                    let search = {
                        lat: 0,
                        lng: 0,
                        location: '',
                        cityName: this.props.search.cityName,
                        cityId: this.props.search.cityId,
                        keywords:''
                    };
                    if(result.keywords){
                        search.keywords = result.keywords;
                    }else {
                        search.lat = result.lat;
                        search.lng = result.lng;
                        search.location = result.location;
                        // this.props.search.lat = result.lat;
                        // this.props.search.lng = result.lng;
                        // this.props.search.location = result.location;
                        if (result.cityName && result.cityId) {
                            search.cityName = result.cityName;
                            search.cityId = result.cityId;
                        }
                        search.searchKey = Date.now().toString();
                    }
                    let {dispatch} = this.props;
                    dispatch(update_search_condition(search));
                }
            }
        })
    }

    /**
     * 出现类型 用户触发
     */
    selectPubpri(pubpri) {
        let search = {
            pubpritype: pubpri
        };
        let {dispatch} = this.props;
        dispatch(update_search_condition(search));
        // Alert.alert('提示','place');
    }

    query() {
        let {dispatch,search,navigator} = this.props;
        // if ((search.lat == 0 || search.lng == 0) && !search.keywords) {
        //     if(search.version && search.version > Common.version) {
        //         alertShow('请输入关键词');
        //     }else{
        //         alertShow('请输入酒店名称或关键词');
        //     }
        //     return;
        // }

        dispatch(resetHotelsList());
        search.searchKey = Date.now().toString();
        dispatch(update_search_condition(search));
        navigator.push({
                name: 'HotelsListContainer',
                component: HotelsList
            }
        );
        // InteractionManager.runAfterInteractions(() => {
        //
        // })

    }

    clearPlace() {
        let search = {
            lat: 0,
            lng: 0,
            location: '',
            keywords: ''
        };
        let {dispatch} = this.props;
        dispatch(update_search_condition(search));
    }

    clearPrice() {
        let search = {
            starRate: null,           // 酒店星级
            lowRate: null,                // 最低价格
            highRate: null

        };
        let {dispatch} = this.props;
        dispatch(update_search_condition(search));
    }

    _cancelClick() {
        this.setState({priceVisiable: false});
    }

    _isShow() {
        return this.state.priceVisiable;
    }

    _onPriceSortCallBack(starPrice) {
        console.log(starPrice);
        //{ starRate: [ 3, 5 ], lowRate: 400, highRate: 9999 }
        let search = {
            starRate: starPrice.starRate,
            lowRate: starPrice.lowRate,
            highRate: starPrice.highRate,
        };
        // this.props.search.starRate = starPrice.starRate;
        // this.props.search.lowRate = starPrice.lowRate;
        // this.props.search.highRate = starPrice.highRate;
        let {dispatch} = this.props;
        dispatch(update_search_condition(search));
        this.setState({priceVisiable: false});
        // this.props.search.lat = result.lat;
        // this.props.search.lng = result.endDate;
        // this.props.search.location = result.location;
        // let {dispatch,search} = this.props;
        // dispatch(update_search_condition(search));
    }

    getVersion(){
        getVersion((error,result)=> {
            if(error){
            }else{
                if(result){
                    let search = {
                        version: result,
                    };
                    let {dispatch} = this.props;
                    dispatch(update_search_condition(search));
                }
            }
        })
    }
}
/**
 * 城市选择 与native通信
 * @param callBack
 */
function selectCityEvent(callBack) {
    if (NATIVE.selectCityEvent)
        NATIVE.selectCityEvent(callBack)
}
/**
 * 日期选择 与native通信
 * @param callBack
 */
function selectDateEvent(data, callBack) {
    if (NATIVE.selectDateEvent)
        NATIVE.selectDateEvent(data, callBack)
}
/**
 * 地点选择 与native通信
 * @param callBack
 */
function selectPlaceEvent(data, callBack) {
    if (NATIVE.selectPlaceEvent)
        NATIVE.selectPlaceEvent(data, callBack)
}
/**
 *
 */
function showTitleEvent(b) {
    if (NATIVE.showTitleEvent)
        NATIVE.showTitleEvent(b)
}
/**
 * 关键词
 */
function selectKeywordEvent(data, callBack) {
    if (NATIVE.selectKeywordEvent)
        NATIVE.selectKeywordEvent(data, callBack)
}
/**
 * 定位
 */
function locationEvent(callBack) {
    if (NATIVE.getLocation)
        NATIVE.getLocation(callBack)
}
/**
 * 获得版本
 */
function getVersion(callBack) {
    if (NATIVE.getVersion)
        NATIVE.getVersion(callBack);
}

function mapStateToProps(state) {

    return {
        search: state.search
    }
}

export default connect(mapStateToProps)(Entry)//关联redux
