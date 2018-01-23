/**
 * Created by chenty on 2016/10/20.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    PixelRatio,
    Platform
} from 'react-native';
import {
    update_search_condition,
    resetPageIndex,
    refreshHotels,
    fetchHotelsList,
    fetchHotels,
    fetchBrands,
} from '../actions/';
import Common from '../common/constants';
import images from '../images/';
import {
    selectDateEvent,
    selectPlaceEvent,
    selectKeywordEvent
} from '../../native';

export default class SearchHeader extends React.Component {

    componentWillUnmount() {
        if (this.interval) {
            clearTimeout(this.interval);
        }
    }

    updateFilter(condition, refresnBrand) {
        let {dispatch} = this.props;
        let canLoadMore = false;
        let isRefreshing = false;
        let isLoading = true;
        dispatch(fetchHotelsList(canLoadMore, isRefreshing, isLoading));
        dispatch(resetPageIndex());
        condition.searchKey = Date.now().toString();
        dispatch(update_search_condition(condition));
        dispatch(fetchHotels(canLoadMore, isRefreshing, isLoading));

        // this.interval = setTimeout(
        //     () => {
        //         dispatch(refreshHotels());
        //     }, 2000
        // )

        if (refresnBrand) {
            dispatch(fetchBrands());
        }
    }

    /**
     * 日期选择 用户触发
     */
    selectDate() {
        let {search} = this.props;
        let data = {
            startDate: search.startDate,
            endDate: search.endDate
        };


        selectDateEvent(data, (error, result)=> {
            if (error) {

            }
            else {
                if (result) {
                    let search = {
                        startDate: result.startDate,
                        endDate: result.endDate
                    };
                    this.updateFilter(search, false);
                }
            }
        })
    }

    /**
     * 地点选择 用户触发
     */
    selectPlace() {
        let {search} = this.props;
        let data = {
            cityName: search.cityName,
            cityId: search.cityId
        };

        selectPlaceEvent(data, (error, result)=> {
            if (error) {
                console.log(error);
            }
            else {
                if (result) {
                    let condition = {
                        lat: result.lat,
                        lng: result.lng,
                        location: result.location,
                        keywords: ''

                    };
                    if (result.cityName && result.cityId) {
                        condition.cityName = result.cityName;
                        condition.cityId = result.cityId;

                    }
                    let keepBrand = search.cityId == result.cityId;
                    this.updateFilter(condition, !keepBrand);

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
                    let keepBrand = this.props.search.cityId == result.cityId;
                    this.updateFilter(search, !keepBrand);
                }
            }
        })
    }

    render() {
        let {search} = this.props;
        let bookDays = search.startDate.substring(5) + '\n' + search.endDate.substring(5);
        if(search.version && search.version > Common.version) {
            return (
                <View style={styles.header}>
                    <View style={styles.searchInput}>
                        <View style={{flex:2}}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={{height: 30, marginTop: 2}}
                                onPress={this.selectDate.bind(this)}
                            >
                                <View style={styles.inputDay}>
                                    <Text style={[styles.daysPlaceholder,{fontSize:Common.window.width<376?9:11}]}
                                          allowFontScaling={false}>{bookDays}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={{flex:8,}}>
                            <TouchableOpacity
                                activeOpacity={0.1}
                                style={[styles.locationInput]}
                                onPress={this.selectKeyword.bind(this)}
                            >
                                <Image
                                    style={[styles.searchIcon, {alignSelf: 'center', justifyContent: 'center'}]}
                                    source={images['search']}
                                />
                                <View style={{maxWidth:Common.window.width-160,justifyContent:'center',marginLeft:-5}}>
                                    <Text style={styles.locationPlaceholder}
                                          numberOfLines={1}>{search.keywords ? search.keywords : search.location}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                    </View>


                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={this.selectPlace.bind(this)}
                    >
                        <Text style={[styles.mapMarginTop,{color: 'white', fontSize: 16}]}>地图</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return (
                <View style={styles.header}>
                    <View style={styles.searchInput}>
                        <View style={{flex:2}}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={{height: 30, marginTop: 2}}
                                onPress={this.selectDate.bind(this)}
                            >
                                <View style={styles.inputDay} >
                                    <Text style={[styles.daysPlaceholder,{fontSize:Common.window.width<376?9:11}]} allowFontScaling={false} >{bookDays}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={{flex:8,}}>
                            <TouchableOpacity
                                activeOpacity={0.1}
                                style={[styles.locationInput]}
                                onPress={this.selectPlace.bind(this)}
                            >
                                <Image
                                    style={[styles.searchIcon, {alignSelf: 'center', justifyContent: 'center'}]}
                                    source={images['search']}
                                />
                                <View style={{maxWidth:Common.window.width-160,justifyContent:'center',marginLeft:-5}}>
                                    <Text style={styles.locationPlaceholder} numberOfLines={1}>{search.location}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                    </View>


                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={this.selectPlace.bind(this)}
                    >
                        <Text style={[styles.mapMarginTop,{color: 'white', fontSize: 16}]}>地图</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ed7140'

    },

    searchInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        width: Common.window.width - 60 - 6 * 4,
        margin: 3,
        backgroundColor: '#ee7f53',
        borderRadius: 20,
        ...Platform.select({
            ios:{
                marginRight:6,
                marginTop:15
            },
            android:{
                marginRight:6
            }
        })

    },
    inputDay:{
        flexDirection: 'row',
        height:25,
        justifyContent: 'center',
        marginLeft:5,
        alignItems:'center',
        borderRightWidth:1,
        borderColor:'white',
        paddingRight:5,
    },
    searchIcon: {
        width: 15,
        height: 15,
    },

    mapIcon: {
        width: 30,
        height: 30,
        alignSelf: 'flex-end',

    },
    daysPlaceholder: {
        marginLeft: 10,
        width: 30,
        textAlign: 'center',
        color: '#fff',
    },
    locationInput: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 30,
    },
    locationPlaceholder: {
        marginLeft: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 15,
        color: 'white'
    },
    mapMarginTop:{
        ...Platform.select({
            ios:{
                marginTop:15
            },
            android:{
                marginTop:0
            }
        })
    }
})

