/**
 * Created by chenty on 2016/10/20.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    InteractionManager,
    Modal,
    Image,
    Platform
} from 'react-native';
import * as listData from '../common/SortListViewData';
import {connect} from 'react-redux';
import {
    fetchHotels,
    refreshHotels,
    showHotelsFilter,
    update_search_condition,
    resetPageIndex,
} from '../actions/';
import Common from '../common/constants';

import StarLevel from '../common/starLevel';
import {SortListView} from '../common/SortListView';
import BrandsList from './BrandsList';

let StarRates = Common.starRates;
class FilterHeader extends React.Component {
    constructor(props) {
        super(props);

    }

    componentWillUnmount() {
        if (this.interval) {
            clearTimeout(this.interval);
        }
    }
    showHotelsFilter(filter, visible) {
        let {dispatch} = this.props;
        dispatch(showHotelsFilter(filter, visible))
    }

    updateFilter(condition) {
        let {dispatch} = this.props;
        let canLoadMore = false;
        let isRefreshing = false;
        let isLoading = true;

        dispatch(resetPageIndex());
        condition.searchKey = Date.now().toString();
        dispatch(update_search_condition(condition));
        dispatch(fetchHotels(canLoadMore, isRefreshing, isLoading));
        // this.interval = setTimeout(
        //     () => {
        //         dispatch(refreshHotels());
        //     }, 2000
        // )
    }

    _findBrandBy(id, Brands) {
        for (let brand of Brands) {
            if (brand.id == id) {
                return brand;
            }
        }
        return null;
    }

    _getBrands() {
        let {Brands, Search} = this.props;
        let selectedBrands = [];
        if (Brands.length > 0) {
            for (let key of Search.brand) {
                let found = this._findBrandBy(key, Brands);
                if (found) {
                    selectedBrands.push(found.name);
                }
            }
        }
        let title = '品牌';
        if (selectedBrands.length > 0) {
            title = selectedBrands.join(',')
        }
        return title;
    }

    _brandClick() {
        this.showHotelsFilter('brandFilter', true);

    }

    _onBrandCallBack(brands) {
        // console.log(starPrice);

        this.updateFilter({brand:brands});
        this.showHotelsFilter('brandFilter', false)
        // console.log(Search);

    }

    _getDistance() {
        let {Search} = this.props;
        let distance = Search.radius;
        if (distance<1000){
            return distance +'米';
        }else {
            let number =distance / 1000;
            let k = Math.round(number * 100) / 100;
            return k +'公里';
        }
        return distance || '区域位置';
    }

    _distanceClick() {
        this.showHotelsFilter('distanceFilter', true);
    }

    _onDistanceCallBack(distance) {
        // console.log(starPrice);

        this.updateFilter({radius:distance});
        this.showHotelsFilter('distanceFilter', false)
        // console.log(Search);

    }

    _getStarPrice() {
        let {Search} = this.props;
        let price = null;
        let starRates = [];
        if (Search.lowRate > 0) {
            price = `¥${Search.lowRate}以上`;
            starRates.push(price);
        }
        if (Search.highRate < 9999) {
            price = `¥${Search.highRate}以下`;
            starRates.push(price);
        }

        for (let key of Search.starRate) {
            starRates.push(StarRates[key]);
        }
        let result = '价格星级 ';
        let idx = starRates.indexOf('不限');
        if (idx>-1){
            starRates.splice(idx,1);
        }
        if (starRates.length>0){
            result = starRates.join(',');


        }
        return result;
    }

    _starPriceClick() {
        this.showHotelsFilter('starPriceFilter', true);
    }

    _onStarPriceCallBack(starPrice) {
        // console.log(starPrice);

        this.updateFilter(starPrice);
        this.showHotelsFilter('starPriceFilter', false)
        // console.log(Search);

    }

    _getPriceSort() {
        let {Search} = this.props;
        let sort = '排序';
        switch (Search.sort) {
            case 'StarRankDesc':
                sort = '推荐星级';
                break;
            case 'RateAsc':
                sort = '从低到高';
                break;
            case 'RateDesc':
                sort = '从高到低';
                break;
            case 'DistanceAsc':
                sort = '由近到远';
                break;

        }
        return sort;
    }

    _priceSortClick() {
        this.showHotelsFilter('priceSortFilter', true);
    }

    _onPriceSortCallBack(sort) {
        // console.log(starPrice);

        this.updateFilter({sort:sort});
        this.showHotelsFilter('priceSortFilter', false)
        // console.log(Search);

    }

    _cancelClick() {
        let {Filter} = this.props;
        let filterName = '';
        if (Filter.brandFilter.visible) {
            filterName = 'brandFilter';
        }
        if (Filter.distanceFilter.visible) {
            filterName = 'distanceFilter';
        }
        if (Filter.starPriceFilter.visible) {
            filterName = 'starPriceFilter';
        }
        if (Filter.priceSortFilter.visible) {
            filterName = 'priceSortFilter';
        }
        this.showHotelsFilter(filterName, false);
    }

    _isShow() {
        let {Filter} = this.props;
        let show = Filter.brandFilter.visible ||
            Filter.distanceFilter.visible ||
            Filter.priceSortFilter.visible ||
            Filter.starPriceFilter.visible

        return show;
    }

    render() {
        let {Search, Filter, Brands} = this.props;
        return (
            <View style={styles.container}>


                <View style={{flexDirection:'row',flex:4}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        <View style={styles.brandFilter}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={[styles.touch,{marginLeft:15}]}
                                onPress={this._brandClick.bind(this)}
                            >

                                <Text numberOfLines={1} style={styles.filterText}>{this._getBrands()}</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                    <View style={{flexDirection:'row',flex:3,}}>
                        <View style={styles.distanceFilter}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.touch}
                                onPress={this._distanceClick.bind(this)}
                            >
                                <Text numberOfLines={1} style={styles.filterText}>{this._getDistance()}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.starPriceFilter}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.touch}
                                onPress={this._starPriceClick.bind(this)}
                            >
                                <Text numberOfLines={1} style={styles.filterText}>{this._getStarPrice()}</Text>

                            </TouchableOpacity>
                        </View>


                        <View style={styles.priceSortFilter}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.touch}
                                onPress={this._priceSortClick.bind(this)}
                            >
                                <Text numberOfLines={1} style={styles.filterText}>{this._getPriceSort()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>





                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this._isShow()}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.modalStyle}>

                        {Filter.brandFilter.visible ?
                            <BrandsList search={Search} brands={Brands} callback={this._onBrandCallBack.bind(this)} />:
                            null
                        }
                        {Filter.distanceFilter.visible ?
                            <SortListView dataSource = {listData.distance} sort={Search.radius}  callback={this._onDistanceCallBack.bind(this)}/> :
                            null
                        }

                        {Filter.starPriceFilter.visible ?
                            <StarLevel style={{flex: 1}} search={Search}
                                       onSureCallBack={this._onStarPriceCallBack.bind(this)}></StarLevel> :
                            null
                        }
                        {Filter.priceSortFilter.visible ?
                            <SortListView dataSource = {listData.sortWay} sort={Search.sort} callback={this._onPriceSortCallBack.bind(this)}/> :
                            null
                        }
                        <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}} onPress={this._cancelClick.bind(this)}>
                            <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}></Animated.View>

                        </TouchableWithoutFeedback>

                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 35,
        backgroundColor: '#ed7140',
    },
    brandFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
    },
    distanceFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        //width: 100,
        flex:1
    },

    starPriceFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
    priceSortFilter: {

        alignItems: 'center',
        justifyContent: 'center',
        flex:1

    },

    normal: {
        color: '#FFF',
    },
    touch:{
        //width:80,height:40,
        justifyContent:'center',
        alignItems:'center',
    },

    filterText: {
        color:'white',
    },
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba(51, 51, 51, 0.5)',
        position: 'absolute',
        width: Common.window.width,
        height: Common.window.height - 100,
        flex: 1,
        ...Platform.select({
            ios:{
                top:100
            },
            android:{
                top:80
            }
        }),
    }
});


function mapStateToProps(state) {
    return {
        Brands: state.brand,
        Search: state.search,
        Filter: state.hotels.filter
    }
}

export default connect(mapStateToProps)(FilterHeader);