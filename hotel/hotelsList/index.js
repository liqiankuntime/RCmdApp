/**
 * Created by chenty on 2016/10/18.
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    InteractionManager,
    RefreshControl,
    Animated,
} from 'react-native';

import {
    fetchHotels,
    refreshHotels,
    update_search_condition,
    resetPageIndex,
    resetHotelsList,
    fetchBrands,
    fetchConfig,

} from '../actions';

import Header from '../common/Header';
import Loading from '../common/Loading';
import LoadMoreFooter from '../common/LoadMoreFooter';
import Common from '../common/constants';
import SearchHeader from './SearchHeader';
import FilterHeader from './FilterHeader';
import HotelCard from './HotelCard';
import RoomList from '../RoomList';
import EmptyView from './EmptyView';
import {navigatorEvent} from '../../native/';
let page = 1;
let canLoadMore = false;
let isRefreshing = false;
let isLoading = true;

export default class HotelsList extends React.Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            refreshTimes: 0,
            // 排序视图Y值
            sortTypeViewY: new Animated.Value(0),
            // 排序三角角度
            angleRotation: new Animated.Value(0),
            // 遮盖层透明度
            coverViewOpacity: new Animated.Value(0),
        }
    }

    componentDidMount() {

        const {dispatch, Config} = this.props;
        dispatch(fetchConfig());
        dispatch(fetchBrands());

        dispatch(fetchHotels(canLoadMore, isRefreshing, isLoading));

        // InteractionManager.runAfterInteractions(() => {
        //
        //
        // })
        let seconds = Config.seconds * 1000;
        this.interval = setInterval(
            () => {
                this.refreshData();
            }, seconds
        )

    }

    componentWillUnmount() {
        // 退出时重置hotelsListReducer状态
        const {dispatch} = this.props;
        dispatch(resetPageIndex());
        if (this.interval) {
            clearInterval(this.interval);
        }

    }

    componentWillReceiveProps(nextProps) {
        //通常在组件接收新的props时触发，就是说state发生改变时触发
        /*if (nextProps.Hotels) {
         console.log(nextProps.Hotels.list);
         }*/
    }

    onScroll() {
        if (!canLoadMore) canLoadMore = true;
    }

    fetchData(canLoadMore, isRefreshing, isLoading) {
        const {dispatch, Hotels} = this.props;

        dispatch(fetchHotels(canLoadMore, isRefreshing, isLoading));
    }

    refreshData() {
        const {dispatch, Config, Hotels} = this.props;
        let limit = Config.limit;
        if (!Hotels.list.allOk && this.state.refreshTimes < limit) {
            this.setState({refreshTimes: (this.state.refreshTimes + 1)});
            dispatch(refreshHotels());


        } else {
            // if (this.interval) {
            //     clearInterval(this.interval);
            // }

            console.log('hotel was refreshed: ' + this.state.refreshTimes);
            this.setState({refreshTimes: 0});
        }
    }

    renderSearchHeader() {
        let {Search, dispatch}= this.props;

        return (
            <SearchHeader dispatch={dispatch} search={Search}/>
        )
    }

    _isShowCoverView() {
        let {Hotels}= this.props;
        return Hotels.filter.brandFilter.visible ||
            Hotels.filter.distanceFilter.visible ||
            Hotels.filter.starPriceFilter.visible ||
            Hotels.filter.priceSortFilter.visible;
    }

    // 遮盖层
    renderCoverView() {
        return (
            <TouchableOpacity
                style={{position: 'absolute', top: 90}}
                activeOpacity={1}
                onPress={() => console.log('close CoverView')}
            >
                <Animated.View
                    style={{
                        width: Common.window.width,
                        height: Common.window.height - 90,
                        backgroundColor: 'green',
                        opacity: this.state.coverViewOpacity,
                    }}
                />
            </TouchableOpacity>
        )
    }

    render() {


        return (
            <View style={styles.container}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={() => {
                        let {navigator} = this.props;
                        const routes = navigator.getCurrentRoutes();
                        if (routes.length > 1) {
                            navigator.pop();
                        }
                        else {
                            navigatorEvent();
                        }

                    }}

                    titleView={this.renderSearchHeader.bind(this)}
                />
                {this.renderFilter()}
                <View style={{height: 7, backgroundColor: '#e5e5e5'}}></View>
                {this.renderList()}
            </View>
        )
    }

    renderFilter() {
        let {Search}= this.props;
        return (
            <FilterHeader/>
        )
    }

    renderList() {
        const {Brands, Search, Hotels, dispatch} = this.props;
        if (Hotels.isLoading) {
            return (
                <Loading />
            )
        } else {
            return (

                <ListView

                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource.cloneWithRows(Hotels.list.data)}
                    enableEmptySections={true}
                    renderRow={this.renderRow}
                    onScroll={this.onScroll}
                    onEndReached={this.onEndReach.bind(this)}
                    onEndReachedThreshold={10}
                    renderFooter={this.renderFooter.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={Hotels.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            title="正在加载中……"
                            color="#ccc"
                        />
                    }
                />)

        }


    }

    renderRow(hotel) {

        return (
            <TouchableOpacity
                style={styles.hotelsCell}
                onPress={() => {
                    this.props.navigator.push({
                        name: 'RoomListContainer',
                        component: RoomList,
                        passProps: {
                            hotel: hotel
                        }
                    })
                }}
            >
                <HotelCard hotel={hotel}/>

                <View style={styles.lightStyle}/>
            </TouchableOpacity>
        )
    }


    // 下拉刷新
    onRefresh() {
        page = 1;
        const {dispatch} = this.props;
        canLoadMore = false;
        isRefreshing = true;
        dispatch(resetPageIndex());
        let condition = {
            searchKey: Date.now().toString()
        };
        dispatch(update_search_condition(condition));
        this.fetchData(canLoadMore, isRefreshing, isRefreshing);

    }

    // 上拉加载
    onEndReach() {
        const {dispatch,Search} = this.props;
        if (canLoadMore) {
            isLoading = false;
            isRefreshing = false;
            let condition = {
                searchKey: Date.now().toString()
            };

            dispatch(update_search_condition(condition));
            console.log("new search is:");
            console.log(JSON.stringify(Search) );
            this.fetchData(canLoadMore, isRefreshing, isLoading);
            canLoadMore = false;
        }
    }

    renderFooter() {
        const {Hotels} = this.props;
        if (Hotels.isLoadMore) {
            return <LoadMoreFooter />
        }
    }

    renderHeader() {
        const {Brands, Search, Hotels, dispatch} = this.props;
        if (!Hotels.isLoading && Search.pageIndex == 1 && Hotels.list.data.length == 0) {
            return (<EmptyView search={Search} brands={Brands} dispatch={dispatch}/>)
        }
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    hotelsCell: {

        paddingLeft: 10,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },


    lightStyle: {

        height: 2,

        backgroundColor: 'green',

    },

})