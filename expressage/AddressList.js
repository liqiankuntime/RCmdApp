/**
 * Created by lc on 14/04/15.
 * 选择地址
 */
import React, {Component, PropTypes} from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    View,
    ListView,
    Image,
    Modal,
    Animated
} from 'react-native';
import {travelUrl, baseUrl, Api, Network, MessageBox} from '../common/utils';
import images from './../expressage/images/';
import {Alert, Platform} from 'react-native';
import AddressListItem from './orderList/AddressListItem';
import ModalTitle from './common/ModalTitle';
import {styles} from './Style';
// <StreetList leftTitle="取消" rightTitle="确定" midTitle="付款方式" data={this.state.streetData}
//             _leftCallback={this._cancelCallBack.bind(this)}
//             _callBackItemClick={this._cancelCallBackItem}/>
let type = 'to';

export default class AddressList extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            data: this.props.data,
            deleteVisiable: false,
            deleteData: null,
            isFirstLoad: true,
            type: this.props.type ? this.props.type : type
        };

        this._cancelClick = this._cancelClick.bind(this);
    }

    componentWillMount() {
        // alert(this.state.isFirstLoad)
        // if(this.state.isFirstLoad) {
        //     const {paramType} = this.props;
        //     this.fetchAddressList(paramType ? paramType : type);
        // }
    }

    render() {
        const {leftTitle} = this.props;
        const {midTitle} = this.props;
        const {rightTitle} = this.props;
        const {_callBackLongItemClick} = this.props;
        const that = this;
        return (
            <View style={{flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                <ModalTitle style={{height:38}} leftTitle={leftTitle} rightTitle={rightTitle} midTitle={midTitle}
                            _leftCallback={this.props._leftCallback} _rightCallback={this.props._rightCallback}/>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.data)}
                    renderRow={(rowData)=>
                        <AddressListItem data={rowData} selectId={this.props.selectId} _callBackItemClick={this.props._callBackItemClick} _callBackEditClick={this.props._callBackEditClick} _callBackLongItemClick={this._callBackLongItemClick.bind(this,rowData)}/>
                        }
                />
                <TouchableOpacity style={{position:'absolute',right:20,bottom:20,height:40}}
                                  onPress={this.props._callBackAddClick?this.props._callBackAddClick.bind(this):null}

                >
                    <Image style={{width:40,height:40}}
                           resizeMode={Image.resizeMode.contain} source={images['ic_address_add']}/>
                </TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this._isShow()}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.modalStyle}>
                        <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}}
                                                  onPress={this._cancelClick.bind(this)}>
                            <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}/>

                        </TouchableWithoutFeedback>

                        <TouchableOpacity style={[styles.modalCenterStyle]}
                                                  onPress={() => {
                                                      that._cancelClick();
                                                      if(_callBackLongItemClick){
                                                          _callBackLongItemClick(that.state.deleteData);
                                                      }
                                                  }}>
                        <Image style={{height:50,width:50}}
                               resizeMode={Image.resizeMode.center} source={images['ic_delete_del_orange']}
                               />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }

    fetchAddressList(type) {
        // dispatch(updateAddressRequestStatus(isLoadMore, isRefreshing, isLoading));//更新界面状态 loading状态
        const query = {
            type: type,
        };
        const param = JSON.stringify(query);
        const url = travelUrl + Api.expressage.staffaddresslist + '?param=' + param;
        // increase page index
        // dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {
                console.log("查询列表数据成功!" + response);
                // MessageBox.error('提示', '查询列表数据成功!', response);
                // dispatch(updateAddressViewData(response));
                this.setState({data: response, isFirstLoad: false});
            },
            error => {
                console.log("查询列表数据失败!" + error);
                // MessageBox.error('提示', '查询列表数据失败!', error);
                // dispatch(updateAddressViewData([]));
                this.setState({data: [], isFirstLoad: false});
            }
        );
    };

    _callBackLongItemClick(data) {
        console.log("_callBackLongItemClick!" + data);
        this.setState({deleteVisiable: true, deleteData: data});
    }

    _cancelClick() {
        this.setState({deleteVisiable: false, deleteData: null});
    }

    _isShow() {
        console.log("_isShow!" + this.state.deleteVisiable);
        return this.state.deleteVisiable;
    }
}