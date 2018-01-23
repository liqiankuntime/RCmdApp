/**
 * Created by lc on 14/04/15.
 * 订单列表
 */
import React, {Component,PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    ListView,
    RefreshControl,
    Image
} from 'react-native';
import {connect} from 'react-redux'
import {fetchOrderList,updateRequestStatus} from './actions/';
import ModalTitle from './common/ModalTitle';
import Order from './Order';
import Preview from './Preview';
import OrderListItem from './orderList/OrderListItem';
import Header from '../hotel/common/Header';
import LoadMoreFooter from '../hotel/common/LoadMoreFooter';
import Loading from '../hotel/common/Loading';
import NavBar from './navigation'
import images from '../expressage/images/';


let canLoadMore = false;
class OrderList extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }

    componentDidMount() {
        this.onRefresh();
    }

    render(){
        return(
            <View style={{height:138,flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                <NavBar title={'顺丰快递'} navigator={this.props.navigator}/>
                {this.renderList()}
            </View>
        );
    }

    renderList() {
        const {orderList, dispatch} = this.props;
        if (orderList.isLoading) {
            return (
                <Loading />
            )
        } else {
            return (

                <ListView
                    style={{backgroundColor:'#f3f3f3'}}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource.cloneWithRows(orderList.data)}
                    enableEmptySections={true}
                    renderRow={(rowData)=>
                        <OrderListItem data={rowData} _callBackItemClick={this.toOrder.bind(this,rowData)} _callBackPreviewClick={this.toPreview.bind(this,rowData)}/>
                        }
                    onScroll={this.onScroll}
                    onEndReached={this.onEndReach.bind(this)}
                    onEndReachedThreshold={10}
                    renderFooter={this.renderFooter.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={orderList.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            title="正在加载中……"
                            color="#ccc"
                        />
                    }
                />)

        }
    }
    toOrder(data){
        this.props.navigator.push({
            name: 'Order',
            component: Order,
            passProps: {
                orderNo: data.orderNo,
            }
        })
    }
    toPreview(data){
        this.props.navigator.push({
            name: 'Preview',
            component: Preview,
            passProps: {
                orderNo: data.orderNo,
            }
        })
    }

    onScroll() {
        if (!canLoadMore) canLoadMore = true;
    }

    // 下拉刷新
    onRefresh() {
        let{orderList,dispatch} = this.props;
        dispatch(fetchOrderList(false,true,false));
    }

    // 上拉加载
    onEndReach() {
        let {orderList, dispatch} = this.props;
        if (canLoadMore) {
            dispatch(fetchOrderList(true,false,false));
            canLoadMore = false;
        }
    }

    renderFooter() {
        const {orderList} = this.props;
        if (orderList.isLoadMore) {
            return <LoadMoreFooter />
        }
    }

    renderHeader() {
        const {orderList, dispatch} = this.props;
        if (!orderList.isLoading && !orderList.isRefreshing && orderList.pageIndex == 1 && orderList.data.length == 0) {
            return (
                // <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
                //     <Image style={{marginLeft:10,marginRight:10,height:20}}
                //      resizeMode={Image.resizeMode.center} source={images['ic_near_address']}>
                //     </Image>
                //     <Text style={{flex:1}} > 亲,还没有快递订单哟~!</Text>
                // </View>
                <View style={{paddingTop:100,flexDirection:'column',height:270,alignItems:'center'}}>
                <Image
                    source={images['ic_null_list']}
                    style={{width:113,height:110}}
                />
                <Text style={{ marginLeft: 10,
                            marginTop: 10,
                            fontSize: 18,
                            color: '#ed7140'}}>亲,还没有快递订单哟~!</Text>
                </View>
            )
        }
    }
}

function mapStateToProps(state) {

    return {
        orderList: state.orderList
    }
}

export default connect(mapStateToProps)(OrderList)//关联redux