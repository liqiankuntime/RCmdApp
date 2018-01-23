/**
 * Created by lc on 17/03/10.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    InteractionManager,
    Button,
    Image,
    RefreshControl,
    Platform
} from 'react-native';
import {connect} from 'react-redux'
import RCTWebView from '../orderform/webview';
import {receiveJDList,updateJDLogin,updateRequestStatus,updateJDMessage} from './actions/';
import * as NATIVE from '../native';
import {travelUrl, Api, Network, MessageBox ,baseUrl} from './../common/utils';
import BindView from './BindView';
import JingDongItem from './entry/JingDongItem'
import Common from '../hotel/common/constants';
import images from './images/';

import Loading from '../hotel/common/Loading';
import LoadMoreFooter from '../hotel/common/LoadMoreFooter';
import EmptyView from '../hotel/hotelsList/EmptyView';

let isLoadedJs = false;
let isStartLoadedJs = false;
let page = 1;
let canLoadMore = false;
let isRefreshing = false;
let isLoading = true;
let reload = 2;
let js = '';

class Entry extends Component {

    constructor(props) {
        super(props);
        reload = 2;

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            refreshTimes: 0,
            isClick: false,
            ids: [],
        }
    }

    render() {
        let commitBtnColor = this.state.isClick ? '#ed7140' : '#999999';

        let {jd} = this.props;
        let stats = {
            js:'https://home.m.jd.com/newAllOrders/newAllOrders.action?'
        };

        return (
            //row column
            <View style={[styles.item_containers]}>
                <View style={[styles.top_containers]}>
                    <TouchableOpacity onPress={()=>this._onBackPress()}>
                        <Image style={[styles.item_btn_back]} source={images['ic_back']}
                               resizeMode={Image.resizeMode.center}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={styles.item_title}>京东商城</Text>
                    <TouchableOpacity onPress={()=>this._onSettingPress()}>
                        <Image style={[styles.item_btn_back,{width:30,height:jd.login?30:0}]}
                               source={images['ic_title_3point_new']}
                               resizeMode={Image.resizeMode.center}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <RCTWebView
                    style={{
                            backgroundColor: '#ffffff',
                            height: jd.login?0:Common.window.height - 30,
                            width: jd.login?0:Common.window.width
                        }}
                    url={stats.js}
                />
                <View style={[styles.item_containers]} visiable={jd.login}>
                    <View style={{flex:1}}>
                        {this.renderList()}
                    </View>
                    <TouchableOpacity onPress={()=>this._onCommitPress()} disabled={!this.state.isClick}>
                        <Text style={[styles.item_bottom_btn,{backgroundColor:commitBtnColor}]}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    renderList() {
        const {jd, dispatch} = this.props;
        if (jd.isLoading) {
            return (
                <Loading />
            )
        } else {
            return (

                <ListView

                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource.cloneWithRows(jd.list.data)}
                    enableEmptySections={true}
                    renderRow={(rowData,sectionId,rowId)=>
                        <JingDongItem data={rowData} rowId={rowId} _callback={this._callBackCommitBtn.bind(this)}/>
                        }
                    onScroll={this.onScroll}
                    onEndReached={this.onEndReach.bind(this)}
                    onEndReachedThreshold={10}
                    renderFooter={this.renderFooter.bind(this)}
                    renderHeader={this.renderHeader.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={jd.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            title="正在加载中……"
                            color="#ccc"
                        />
                    }
                />)

        }


    }


    onScroll() {
        if (!canLoadMore) canLoadMore = true;
    }

    // 下拉刷新
    onRefresh() {
        let{jd,dispatch} = this.props;
        dispatch(updateRequestStatus(false,true,false));
        if(js) {
            Platform.OS == 'ios' ? this.loadUrl('if(typeof(getJDOrderList)=="function"){getJDOrderList(1,"execute");}else{'+js+'getJDOrderList(1,"execute");}', 1) : this.loadUrl('javascript:if(getJDOrderList){getJDOrderList(1,"execute");}else{'+js+'getJDOrderList(1,"execute");}', 1);
        }else{
            this.fetchJDJS();
        }
    }

    // 上拉加载
    onEndReach() {
        let {jd, dispatch} = this.props;
        if (canLoadMore) {
            dispatch(updateRequestStatus(true, false, false));
            const indexPage = jd.pageIndex + 1;
            Platform.OS=='ios'?this.loadUrl('if(typeof(getJDOrderList)=="function"){getJDOrderList(' + indexPage + ',"execute");}else{'+js+'getJDOrderList(' + indexPage + ',"execute");}', indexPage):this.loadUrl('javascript:if(getJDOrderList){getJDOrderList(' + indexPage + ',"execute");}else{'+js+'getJDOrderList(' + indexPage + ',"execute");}', indexPage);
            canLoadMore = false;
        }
    }

    renderFooter() {
        const {jd} = this.props;
        if (jd.isLoadMore) {
            return <LoadMoreFooter />
        }
    }

    renderHeader() {
        const {jd, dispatch} = this.props;
        if (!jd.isLoading && !jd.isRefreshing && jd.pageIndex == 1 && jd.list.data.length == 0) {
            return (<View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}
            ><Text style={{flex:1}} > {jd.message} </Text></View>)
        }
    }

    _callBackCommitBtn(isSelect, position, data) {

        if (isSelect) {
            this.state.ids.push(data.id);
        } else {
            if (this.state.ids.includes(data.id)) {
                this.state.ids.splice(this.state.ids.indexOf(data.id), 1);
            }
        }
        this.setState({
            isClick: this.state.ids.length != 0 ? true : false,
        })
    }

    _onCommitPress() {
        //点击确定提交  ids中收集了所有选中的id
        // alert(this.state.ids);
        const {jd, dispatch} = this.props;
        let dataExpense = [];
        for(let detail of jd.list.data){
            if(this.state.ids.includes(detail.orderId)){
                const data = {
                id: detail.orderId,
                date: detail.dataSubmit,
                num: (detail.orderMsg?detail.orderMsg.length:0),
                price: detail.price,
                img: detail.orderMsg,
                title: "", 
                isbesweeped:detail.isbesweeped
                };
                if (detail.mainText) {
                    data.title = detail.mainText
                }
                dataExpense.push(data);
            }
        }
        NATIVE.jd2ExpenseData(dataExpense);
    }

    _onBackPress() {
        let {navigator} = this.props;
        const routes = navigator.getCurrentRoutes();
        if (routes.length > 1) {
            navigator.pop();
        }
        else {
            NATIVE.navigatorEvent();
        }
    }

    _onSettingPress() {
        const {dispatch} = this.props;
        NATIVE.jdLoginOut((error, result)=> {
            if (error) {
            }
            else {
                if (result) {
                    this.updateLoginState(false);
                    dispatch(receiveJDList([], 1));
                    let url = 'https://home.m.jd.com/newAllOrders/newAllOrders.action?';
                    NATIVE.executeJs(url, (error, result)=> {
                        if (error) {
                        }
                        else {
                            if(result){
                                
                            }
                        }
                    })
                }
            }
        })
    }

    componentDidMount() {
        this.fetchJDJS()
    }


    componentWillMount() {
        DeviceEventEmitter.addListener(
            'orderformlogin',
            (events) =>{
                this.updateLoginState(true);
            }
        );
        DeviceEventEmitter.addListener(
            'orderformnotlogin',
            (events) =>{
                this.updateLoginState(false);
            }
        );
        DeviceEventEmitter.addListener(
            'isLoadedJs',
            (events) =>{
                isStartLoadedJs = true;
                let{dispatch} = this.props;
                dispatch(receiveJDList([], 1));
            }
        );
    }



    updateLoginState(b){
        console.log('updateLoginState');
        let{dispatch,jd} = this.props;
        if(b && js && isStartLoadedJs){
            this.onRefresh();
            isStartLoadedJs = false;
        }
        if(jd.login != b) {
            if(b){
                isLoadedJs = false;
                isStartLoadedJs = false;
                this.fetchJDJS();
            }
            dispatch(updateJDLogin(b));
        }
    }

    /**
     * 加载js
     */
    loadUrl(url,pageIndex) {
        let {dispatch,jd,navigator} = this.props;
        NATIVE.executeJs(url, (error, result)=> {
            if (error) {
                if(jd.login && reload > 0){//重试
                    // reload--;
                    // isLoadedJs = false;
                    // isStartLoadedJs = false;
                }else{
                    this.updateLoginState(false);
                }
            }
            else {
                if (result) {
                    // MessageBox.error('提示', '查询列表数据成功!base', result);
                    // alert(result);
                    dispatch(receiveJDList(result,pageIndex));
                }
            }
        })
    }

    /**
     * 获取js
     */
    fetchJDJS(){
        let {dispatch,jd} = this.props;
        // dispatch(updateRequestStatus(false,true,false));
        // const url = "http://10.2.128.25:8000/" + (Platform.OS=='ios'?Api.orderform.jdListForIos:Api.orderform.jdList);
        const url = baseUrl + (Platform.OS=='ios'?Api.orderform.jdListForIos:Api.orderform.jdList);

        return Network.get(url,
            response => {
                // MessageBox.error('提示', '查询列表数据失败!http://10.2.128.25:8800/', response);
                console.log(response);
                Platform.OS=='ios'?this.receiveJDJS(response):this.receiveJDJS(response);
                // dispatch(receiveJDJS('javascript:' + response));
            },
            error => {
                // MessageBox.error('提示', '查询列表数据失败!请下拉重试', "");
                //this.receiveJDJS('');
                dispatch(updateJDMessage('获取数据失败,下拉重试'));
            }
        );
    }

    /**
     *
     * @param response
     */
    receiveJDJS(response){
        js = response;
        let {dispatch,jd} = this.props;
        NATIVE.loadJs(Platform.OS=='ios'?js + '\ngetJDOrderList(1,"load");':'javascript:'+js + '\ngetJDOrderList(1,"load");', (error, result)=> {
            if (error) {
                if (jd.login && reload > 0) {//重试
                    reload--;
                    isLoadedJs = false;
                    isStartLoadedJs = false;
                    this.fetchJDJS();
                } else {
                    this.updateLoginState(false);
                }
            }
            else {
                if (result) {
                    if (!isLoadedJs) {
                        dispatch(receiveJDList(result, 1));
                        isLoadedJs = true;
                    }
                }
            }
        })
    }
}
const styles = StyleSheet.create({
    item_containers: {
        flex: 1,
        flexDirection: 'column',

    },
    top_containers: {
        flexDirection: 'row',
        backgroundColor: '#ed7140',
        justifyContent: 'space-around',
        width: Common.window.width,
        height: 40,
        alignItems: 'center'
    },
    item_btn_back: {
        width: 25,
        height: 25,
        marginLeft: 0,
        marginRight: 0,
        //backgroundColor:'#000000'
    },
    item_title: {

        color: '#ffffff',
        fontSize: 15,
        flex: 1,
        textAlign: 'center'
    },

    data_container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    item_bottom_btn: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#ed7140',
        borderRadius: 4,
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 15,
        padding: 12,
    },


});


function mapStateToProps(state) {

    return {
        jd: state.jd
    }
}

export default connect(mapStateToProps)(Entry)//关联redux