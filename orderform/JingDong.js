/**
 * Created by Sick on 2017/3/8.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    InteractionManager,
    Button,
    DeviceEventEmitter
} from 'react-native';
import RCTWebView from '../orderform/webview';
import {fetchJDJS,receiveJDList,updateJDLogin} from './actions/';
import * as NATIVE from '../native';
import {travelUrl, Api, Network, MessageBox } from './../common/utils';
import BindView from './BindView';
import {connect} from 'react-redux'
import Common from '../hotel/common/constants';
import images from './images/';
import JingDongItem from './entry/JingDongItem';
let isLoadedJs = false;
let isStartLoadedJs = false;
class JingDong extends Component {

    constructor(props) {
        super(props)

        //var data = [
        //    {
        //        "dataSubmit": "2017-02-13 14:14:56",
        //        "orderId": "49257435315",
        //        "orderStatus": "完成",
        //        "price": "141.20",
        //        "num": 0,
        //        "mainText": "",
        //        "orderMsg": [
        //            {
        //                "buyCount": 1,
        //                "imageUrl": "http://m.360buyimg.com/n4/jfs/t3136/252/5996020304/837203/e83544bf/58981df7Nf0877849.jpg!q70.jpg",
        //                "wareId": "12095404",
        //                "wareName": "好好说话：新鲜有趣的话术精进技巧"
        //            },
        //            {
        //                "buyCount": 1,
        //                "imageUrl": "http://m.360buyimg.com/n4/jfs/t3640/142/1695345313/491175/474b0f11/582e6f62N531a0ddd.jpg!q70.jpg",
        //                "wareId": "12068636",
        //                "wareName": "深入React技术栈"
        //            },
        //            {
        //                "buyCount": 1,
        //                "imageUrl": "http://m.360buyimg.com/n4/jfs/t2065/57/2909596624/92019/7338fafe/56efb7cdNe08c8332.jpg!q70.jpg",
        //                "wareId": "11892998",
        //                "wareName": "博弈心理学+欲望心理学（套装共2册）"
        //            }
        //        ]
        //    }
        //];



    }


    _onDataArrived(newData) {
        if (newData) {
            newData.forEach((item, index)=> {
                for (let i = 0; i < item.orderMsg.length; i++) {
                    if (i == 0) {
                        item['mainText'] = item.orderMsg[0].wareName;

                    }
                    item['num'] = i++;
                }
            });
            // alert(JSON.stringify(newData));
            this.setState({
                ds: this.state.ds.cloneWithRows(newData)
            })
        }

    };

    //getData() {
    //    return fetch('http://facebook.github.io/react-native/movies.json', {
    //        method: 'GET',
    //        headers: {
    //            'Accept': 'application/json',
    //            'Content-Type': 'application/json',
    //        }
    //    }).then((response)=>response.json())
    //        .then((responseJson)=> {
    //            alert(JSON.stringify(responseJson));
    //            this.setState({
    //                datasource: responseJson
    //            })
    //        })
    //        .catch((error)=> {
    //            console.error(error);
    //        });
    //
    //}
    //
    componentWillMount() {
        let {jd} = this.props;
        var data = jd.list.data;
        //alert(JSON.stringify(data));
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2)=>r1 !== r2
        });


        this.state = {
            ds, data,
            isClick: false,
            ids: [],
        }
        DeviceEventEmitter.addListener(
            'orderformlogin',
            (events) =>{
                this.updateLoginState(true);
                this.fetchJs();
            }
        );
        DeviceEventEmitter.addListener(
            'orderformnotlogin',
            (events) =>{
                this.updateLoginState(false);
            }
        );
        this._onDataArrived(this.state.data);
    }

    updateLoginState(b){
        let{dispatch,jd} = this.props;
        if(jd.login != b) {
            dispatch(updateJDLogin(b));
        }
    }
    
    _onBackPress() {

    }

    _onSettingPress() {

    }

    _callBackCommitBtn(isSelect, position, id) {

        if (isSelect) {
            this.state.ids.push(id);
        } else {
            if (this.state.ids.includes(id)) {
                this.state.ids.splice(this.state.ids.indexOf(id), 1);
            }
        }
        this.setState({
            isClick: this.state.ids.length != 0 ? true : false,
        })
    }

    _onCommitPress() {
        //点击确定提交  ids中收集了所有选中的id
        alert(this.state.ids);
    }






    componentDidMount() {
        this.fetchJs();
    }

    fetchJs(){
        let {dispatch} = this.props;
        dispatch(fetchJDJS(false, false, false));
    }

    /**
     * 加载js
     */
    loadJs() {
        let {dispatch,jd,navigator} = this.props;

        NATIVE.loadUrl(jd.js, (error, result)=> {
            if (error) {
                MessageBox.error('提示', '登录失效', '');
                // navigator.pop();
                // navigator.push({
                //         name: 'BindView',
                //         component: BindView
                //     }
                // );
                dispatch(updateJDLogin(false));
            }
            else {
                if (result) {

                    if(!isLoadedJs) {
                        MessageBox.error('提示', '查询列表数据成功!http://10.2.128.25:8000/', result);
                        dispatch(receiveJDList(result, 1));
                    }
                    isLoadedJs = true;

                }
            }
        })
    }
    /**
     * 加载js
     */
    loadUrl(url,count) {
        let {dispatch,jd,navigator} = this.props;
        NATIVE.loadUrl(url, (error, result)=> {
            if (error) {
                MessageBox.error('提示', '登录失效', '');
                navigator.pop();
                navigator.push({
                        name: 'BindView',
                        component: BindView
                    }
                );
            }
            else {
                if (result) {
                    MessageBox.error('提示', '查询列表数据成功!http://10.2.128.25:8000/', result);
                    dispatch(receiveJDList(result,count));
                }
            }
        })
    }
    /**
     * 刷新
     */
    refresh(){

    }

    /**
     * 加载
     */
    load(){

    }















    render() {
        let commitBtnColor = this.state.isClick ? '#ed7140' : '#999999';


        let {jd} = this.props;
        let stats = {
            js:'https://home.m.jd.com/newAllOrders/newAllOrders.action?_format_=json'
        };
        if(jd.js && !isStartLoadedJs){
            //stats.js = jd.js;
            this.loadJs();
            isStartLoadedJs = true;
        }
        this.state.data = jd.list.data;

        return (

            //<View></View>
            <View style={[styles.item_containers]}>
                <RCTWebView
                    style={{
                        backgroundColor: '#de11ee',
                        height: jd.login?0:Common.window.height,
                        width: jd.login?0:Common.window.width
                    }}
                    url={stats.js}
                />
                <View style={[styles.top_containers]}>
                    <TouchableOpacity onPress={()=>this._onBackPress()}>
                        <Image style={[styles.item_btn_back]} source={images['ic_back']}
                               resizeMode={Image.resizeMode.center}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={styles.item_title}>京东商城</Text>
                    <TouchableOpacity onPress={()=>this._onSettingPress()}>
                        <Image style={[styles.item_btn_back,{width:30,height:30,}]}
                               source={images['ic_title_3point_new']}
                               resizeMode={Image.resizeMode.center}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <ListView dataSource={this.state.ds}
                              renderRow={(rowData,sectionId,rowId)=>
                        <JingDongItem data={rowData} rowId={rowId} _callback={this._callBackCommitBtn.bind(this)}/>
                        }
                    />
                </View>
                <TouchableOpacity onPress={()=>this._onCommitPress()} disabled={!this.state.isClick}>
                    <Text style={[styles.item_bottom_btn,{backgroundColor:commitBtnColor}]}>确定</Text>
                </TouchableOpacity>
            </View>
        );
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


export default connect(mapStateToProps)(JingDong)


