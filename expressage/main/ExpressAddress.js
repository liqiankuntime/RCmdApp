/**
 * Created by huangzhangshu on 17/4/20.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {address} from './ExpressConstant';
import OrderItem from './OrderItem';
import OrderAddressItem from './OrderAddressItem';
import StreetList from '../StreetList';
import NavBar from '../navigation'
import * as Native from '../../native'
import {connect} from 'react-redux';
import {
    updateDataSourceForItem,
    updateTitleForType,
    fetchCompanyAddress,
    updateForProps,
    clearAddressState,
    updateStreetVisible,
    updateStreetData,
} from '../actions';
import {travelUrl, Network, Api} from '../../common/utils';
import {alertShow} from '../../common/Alert';
import HSheet from '../../common/HSheet';

const BOTTOM_HEIGHT = 46;
var dataSource;

class ExpressAddress extends Component {

    constructor(props) {
        super(props);
        dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.onPress = this.onPress.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getItemFromDataSource = this.getItemFromDataSource.bind(this);
        this.onStreetResult = this.onStreetResult.bind(this);
        this.checkDataStatus = this.checkDataStatus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
        this.onCompleted = this.onCompleted.bind(this);
    }

    componentWillMount() {
        const {dispatch, type, action, address} = this.props;
        dispatch(updateTitleForType(type));
        if (type === 'from' && action === 'add') {
            dispatch(fetchCompanyAddress())
        } else if (action === 'edit') {
            dispatch(updateForProps(address));
        }
    }

    backEvent() {
        this.props.navigator.pop();
    }

    getItemFromDataSource(source, code) {
        let result;
        for (let item of source) {
            if (item.code === code) {
                result = item;
                break;
            }
        }
        return result;
    }

    onStreetResult(result) {
        const {dispatch, data} = this.props;
        let street = this.getItemFromDataSource(data, 'street');
        dispatch(updateDataSourceForItem(street, result));
        dispatch(updateStreetVisible('sheet'));
    }

    onPress(rowData) {
        var that = this;
        let province = this.getItemFromDataSource(this.props.data, 'province');
        const {dispatch} = this.props;
        if (rowData.code === 'province') {
            let result = province.result ? province.result : {};
            if (Native.getSFProvice)
                Native.getSFProvice(result, (error, result) => {
                    const {dispatch} = that.props;
                    dispatch(updateDataSourceForItem(rowData, result));
                })
        } else if (rowData.code === 'street') {
            Native.getSFStreetByArea(province.result, (error, data) => {
                dispatch(updateStreetData(data));
                dispatch(updateStreetVisible('sheet'));
            })
        }
    }

    checkDataStatus() {
        const {data} = this.props;
        let flag = true;
        for (let item of data) {
            if ((!item.value || item.value === '')) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    onChangeText(rowData, text) {
        const {type, companyAddress, action} = this.props;
        if (type === 'from' && rowData.code === 'address' && action === 'add') {
            if (companyAddress.addressHead && text.length >= companyAddress.addressHead.length) {
                const {dispatch} = this.props;
                dispatch(updateDataSourceForItem(rowData, text));
            }
        } else {
            const {dispatch} = this.props;
            dispatch(updateDataSourceForItem(rowData, text));
        }
    }

    renderRow(rowData) {
        if (rowData.code === 'street') {
            let province = this.getItemFromDataSource(this.props.data, 'province');
            if (province.result) {
                return <OrderItem onPress={this.onPress.bind(this, rowData)}
                                  onChangeText={this.onChangeText.bind(this, rowData)}>{rowData}</OrderItem>
            } else {
                return null;
            }
        } else if (rowData.type === 'address') {
            return <OrderAddressItem onPress={this.onPress.bind(this, rowData)}>{rowData}</OrderAddressItem>;
        } else {
            return <OrderItem onPress={this.onPress.bind(this, rowData)}
                              onChangeText={this.onChangeText.bind(this, rowData)}>{rowData}</OrderItem>
        }
    }

    renderFooter() {
        return (
            <View style={styles.empty_view}/>
        )
    }

    saveAddress() {
        const {data, type, onAddressResult, addOnDialog, action, address, dispatch} = this.props;
        const result = {};
        for (let item of data) {
            result[item.code] = item.result;
        }
        const param = {
            ...result,
            type,
            province: result.province.province,
            city: result.province.city,
            area: result.province.area,
        }
        if (action === 'add') {
            Network.post(travelUrl + Api.expressage.staffaddress, param, (response) => {
                onAddressResult(response, addOnDialog, action);
                dispatch(clearAddressState());
                this.props.navigator.pop();
            }, (error) => {
                console.log('保存失败==>' + error);
            })
        } else if (action === 'edit') {
            param.id = address.id;
            Network.put(travelUrl + Api.expressage.staffaddress, param, (response) => {
                console.log('修改结果====>' + JSON.stringify(response));
                onAddressResult(response, addOnDialog, action);
                dispatch(clearAddressState());
                this.props.navigator.pop();
            }, (error) => {
                console.log('保存失败==>' + error);
            })
        }
    }

    renderBottom() {
        const status = this.checkDataStatus();
        const opacity = status ? 1 : 0.5;
        const color = status ? '#ed7140' : '#faad97';
        return (
            <View style={styles.bottom}>
                <TouchableOpacity style={[styles.pay_touchable, {opacity: opacity, backgroundColor: color}]}
                                  disabled={!status}
                                  onPress={this.saveAddress}>
                    <Text style={[styles.pay_text, {opacity: opacity}]}>保存</Text>
                </TouchableOpacity>
            </View>
        )
    }

    onCompleted() {
        const {dispatch} = this.props;
        dispatch(updateStreetVisible('sheet'));
    }

    renderStreet() {
        const {streetSheetVisible, streetData, dispatch} = this.props;
        return (
            <HSheet
                visible={streetSheetVisible}
                onCompleted={this.onCompleted}>
                <StreetList leftTitle="取消"
                            midTitle="请选择街道"
                            _leftCallback={this.onCompleted}
                            data={streetData}
                            onPress={this.onStreetResult.bind(this)}>

                </StreetList>
            </HSheet>
        )
    }

    render() {
        const {data, type, action} = this.props;
        const title = type === 'from' ? (action === 'add' ? '新增邮寄地址' : '编辑邮寄地址') : (action === 'add' ? '新增收件地址' : '编辑收件地址');
        return (
            <View style={styles.container}>
                <NavBar leftIconAction={() => this.backEvent()} title={title}/>
                <ListView
                    dataSource={dataSource.cloneWithRows(data)}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                />
                {this.renderBottom()}
                {this.props.streetSheetVisible && this.renderStreet()}
            </View>
        )
    }

}
;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    empty_view: {
        height: 50,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        height: BOTTOM_HEIGHT,
        width: Dimensions.get('window').width,
    },
    pay_touchable: {
        alignSelf: 'flex-end',
        height: BOTTOM_HEIGHT,
        width: 100,
        backgroundColor: '#ed7140',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pay_text: {
        color: 'white',
    },
});


function mapStateToProps(state) {
    return {
        data: state.address.data,
        companyAddress: state.address.companyAddress,
        streetVisible: state.address.streetVisible,
        streetSheetVisible: state.address.streetSheetVisible,
        streetData: state.address.streetData,
    }
}

export default connect(mapStateToProps)(ExpressAddress);

