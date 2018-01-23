/**
 * Created by huangzhangshu on 17/4/17.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ListView,
    Dimensions,
    Image,
    BackAndroid,
}  from 'react-native';
import OrderItem from './OrderItem';
import OrderAddressItem from './OrderAddressItem';
import ExpressAddress from './ExpressAddress';
import ModalChoose from '../common/ModalChoose';
import ModalVAS from '../common/ModalVAS';
import AddressList from '../AddressList';
import Loading from '../../common/Loading';
import Clause from '../Clause';
import NavBar from '../navigation'
import HSheet from '../../common/HSheet';
import {connect} from 'react-redux'
import * as Native from '../../native'
import {travelUrl, Network, Api} from '../../common/utils';
import {
    updateDataSource,
    updateVisible,
    updateAddressData,
    fetchFuturePrices,
    optionAddressData,
    fetchArriveTime,
    fetchCreateOrder,
    updateLoadingVisible,
    fetchDeleteAddress,
    cloneModals,
    clearStatus,
} from '../actions'

const BOTTOM_HEIGHT = 40;
var dataSource;

class ExpressNewOrder extends Component {

    constructor(props) {
        super(props);
        dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.navigatorToAddress = this.navigatorToAddress.bind(this);
        this.navigatorToClause = this.navigatorToClause.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.onAddressResult = this.onAddressResult.bind(this);
        this.onPress = this.onPress.bind(this);
        this.updateVisible = this.updateVisible.bind(this);
        this.fetchPrices = this.fetchPrices.bind(this);
        this.checkPrice = this.checkPrice.bind(this);
        this.renderAddressModal = this.renderAddressModal.bind(this);
        this.renderPaymentModal = this.renderPaymentModal.bind(this);
        this.renderServiceModal = this.renderServiceModal.bind(this);
        this.renderProductModal = this.renderProductModal.bind(this);
        this.fetchTime = this.fetchTime.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.checkModelVisible = this.checkModelVisible.bind(this);
        this.backListener = this.backListener.bind(this);
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(clearStatus());
        BackAndroid.addEventListener('hardwareBackPress', this.backListener);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.backListener);
    }

    backListener() {
        const {dispatch} = this.props;
        let modalVisible = this.checkModelVisible();
        if (modalVisible) {
            dispatch(cloneModals());
            return true;
        } else {
            return false;
        }
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

    navigatorToAddress(rowData) {
        var that = this;
        let param = {
            type: rowData.code === 'send' ? 'from' : 'to',
        }
        Network.get(travelUrl + Api.expressage.staffaddresslist + '?param=' + JSON.stringify(param), function (response) {
            if (response.length > 0) {
                const {dispatch} = that.props;
                dispatch(updateAddressData(response, param.type));
                dispatch(updateVisible(rowData.code));
            } else {
                const action = 'add';
                that.props.navigator.push({
                    name: 'ExpressAddress',
                    component: ExpressAddress,
                    passProps: {
                        onAddressResult: that.onAddressResult.bind(that, rowData),
                        type: param.type,
                        action,
                    }
                })
            }

        }, function (error) {

        })

    }

    onChangeText(rowData, text) {
        const {dispatch} = this.props;
        dispatch(updateDataSource(rowData, text));
    }

    onAddressResult(rowData, result, addOnDialog = false, action = 'add') {
        const {dispatch, data, type} = this.props;
        if (addOnDialog) {
            const code = type === 'from' ? 'send' : 'put';
            if (action === 'add')
                this.updateVisible(code);
            dispatch(optionAddressData(result, action));
        } else {
            dispatch(updateDataSource(rowData, result));
            this.checkPrice(rowData, data);
        }
    }

    checkPrice(rowData, data) {
        if (rowData.code === 'send') {
            let item = this.getItemFromDataSource(data, 'put');
            if (item.value && item.result) {
                this.fetchPrices();
                this.fetchTime();
            }
        } else if (rowData.code === 'put') {
            let item = this.getItemFromDataSource(data, 'send');
            if (item.value && item.result) {
                this.fetchPrices();
                this.fetchTime();
            }
        }
    }

    navigatorToClause() {
        this.props.navigator.push({
            name: 'Clause',
            component: Clause,
        })
    }

    fetchPrices() {
        const {dispatch, data} = this.props;
        let send = this.getItemFromDataSource(data, 'send');
        let put = this.getItemFromDataSource(data, 'put');
        let product = this.getItemFromDataSource(data, 'product');
        let param = {
            refAddressProvince: send.result.province,
            refAddressCity: send.result.city,
            refAddressProvinceTo: put.result.province,
            refAddressCityTo: put.result.city,
            expressType: product.result === '顺丰次日' ? '1' : '2',
        };

        dispatch(fetchFuturePrices(param));
    }

    fetchTime() {
        const {dispatch, data} = this.props;
        let send = this.getItemFromDataSource(data, 'send');
        let put = this.getItemFromDataSource(data, 'put');
        if (!send.result || !put.result) return;
        let time = this.getItemFromDataSource(data, 'time');
        let product = this.getItemFromDataSource(data, 'product');
        let param = {
            refAddressProvince: send.result.province,
            refAddressCity: send.result.city,
            refAddressArea: send.result.area,
            refAddressStreet: send.result.street,
            refAddressAddress: send.result.address,
            refAddressProvinceTo: put.result.province,
            refAddressCityTo: put.result.city,
            refAddressAreaTo: put.result.area,
            refAddressStreetTo: put.result.street,
            refAddressAddressTo: put.result.address,
            expressTime: time.default ? 'default' : time.result,
            expressType: product.result === '顺丰次日' ? '1' : '2',
        };

        dispatch(fetchArriveTime(param));
    }

    onPress(rowData) {
        var that = this;
        if (rowData.code === 'time') {
            Native.showSFTimePickerDialog({}, function (error, result) {
                const {dispatch} = that.props;
                dispatch(updateDataSource(rowData, result));
                that.fetchTime();
            })
        } else if (rowData.code === 'product' || rowData.code === 'value_added_services' || rowData.code === 'payment') {
            const {dispatch} = this.props;
            dispatch(updateVisible(rowData.code));
            if (rowData.code === 'product') {
                that.fetchTime();
            }
        }
    }

    renderRow(rowData) {
        if (rowData.type === 'address') {
            return <OrderAddressItem onPress={this.navigatorToAddress.bind(this, rowData)}>{rowData}</OrderAddressItem>;
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

    backEvent() {
        Native.navigatorEvent();
    }

    updateVisible(code) {
        const {dispatch} = this.props;
        dispatch(updateVisible(code));
    }

    createOrder() {
        const {dispatch, data, navigator} = this.props;
        let send = this.getItemFromDataSource(data, 'send');
        let put = this.getItemFromDataSource(data, 'put');
        let time = this.getItemFromDataSource(data, 'time');
        let product = this.getItemFromDataSource(data, 'product');
        let payment = this.getItemFromDataSource(data, 'payment');
        let name = this.getItemFromDataSource(data, 'name');
        let value_added_services = this.getItemFromDataSource(data, 'value_added_services');
        let param = {
            refAddressId: String(send.result.id),
            refCompanyName: send.result.company,
            refAddressProvince: send.result.province,
            refAddressCity: send.result.city,
            refAddressArea: send.result.area,
            refAddressStreet: send.result.street,
            refAddressAddress: send.result.address,
            refAddressUserName: send.result.userName,
            refAddressMobile: send.result.mobile,
            refAddressIdTo: String(put.result.id),
            refCompanyNameTo: put.result.company,
            refAddressProvinceTo: put.result.province,
            refAddressCityTo: put.result.city,
            refAddressAreaTo: put.result.area,
            refAddressStreetTo: put.result.street,
            refAddressAddressTo: put.result.address,
            refAddressUserNameTo: put.result.userName,
            refAddressMobileTo: put.result.mobile,
            expressTime: time.default ? 'default' : time.result,
            expressNum: '1',
            expressType: product.result === '顺丰次日' ? '1' : '2',
            expressTypeName: product.result,
            payMethod: payment.result === '寄方付' ? '1' : '2',
            expressNames: name.result,
            extendValues: '',
            extendValues: (value_added_services.result && value_added_services.result !== '') ? JSON.stringify([
                {
                    name: 'INSURE',
                    value: value_added_services.result,
                }
            ]) : [],
        };
        dispatch(fetchCreateOrder(param, navigator));
    }

    onCompleted(code) {
        this.updateVisible(code);
    }

    renderProductModal() {
        const that = this;
        const {dispatch, productVisible, data} = this.props;
        let product = this.getItemFromDataSource(data, 'product');
        return (
            <HSheet visible={productVisible}
                    onCompleted={this.onCompleted.bind(this, 'product')}>
                <ModalChoose leftTitle="取消"
                             midTitle="产品类型"
                             selected={product.result}
                             data={["顺丰次日", "顺丰隔日"]}
                             _leftCallback={that.updateVisible.bind(that, 'product')}
                             _callBackItemClick={(result) => {
                                 const rowData = that.getItemFromDataSource(data, 'product');
                                 that.updateVisible('product');
                                 dispatch(updateDataSource(rowData, result));
                             }}/>
            </HSheet>
        )
    }

    renderServiceModal() {
        const that = this;
        const {dispatch, valueAddsVisible, data} = this.props;
        return (
            <HSheet visible={valueAddsVisible}
                    onCompleted={this.onCompleted.bind(this, 'value_added_services')}>
                <ModalVAS leftTitle="取消" midTitle="付款方式"
                          _leftCallback={that.updateVisible.bind(that, 'value_added_services')}
                          _callBackItemClick={(result) => {
                              const rowData = that.getItemFromDataSource(data, 'value_added_services');
                              that.updateVisible('value_added_services');
                              dispatch(updateDataSource(rowData, result));
                          }}/>
            </HSheet>
        )
    }

    renderPaymentModal() {
        const that = this;
        const {dispatch, paymentVisible, data} = this.props;
        const payment = this.getItemFromDataSource(data, 'payment');
        return (
            <HSheet visible={paymentVisible}
                    onCompleted={this.onCompleted.bind(this, 'payment')}>
                <ModalChoose
                    leftTitle="取消" selected={payment.result} midTitle="付款方式"
                    data={["寄方付", "收方付"]}
                    _leftCallback={that.updateVisible.bind(that, 'payment')}
                    _callBackItemClick={(result) => {
                        const rowData = that.getItemFromDataSource(data, 'payment');
                        that.updateVisible('payment');
                        dispatch(updateDataSource(rowData, result));
                    }}/>
            </HSheet>
        )
    }

    renderAddressModal() {
        const that = this;
        const {dispatch, addressData, type, addressVisible, data} = this.props;
        const code = type === 'from' ? 'send' : 'put';
        return (
            <HSheet visible={addressVisible}
                    onCompleted={this.onCompleted.bind(this, code)}>
                <AddressList
                    leftTitle="取消"
                    type={type}
                    data={addressData}
                    _leftCallback={() => {
                        that.updateVisible(code)
                    }}
                    _callBackItemClick={(result) => {
                        const rowData = that.getItemFromDataSource(data, code);
                        that.updateVisible(code);
                        dispatch(updateDataSource(rowData, result));
                        that.checkPrice(rowData, data);
                    }}
                    _callBackLongItemClick={(data) => {
                        dispatch(fetchDeleteAddress(data));
                    }}
                    _callBackEditClick={(address) => {
                        const rowData = that.getItemFromDataSource(data, code);
                        const action = 'edit';
                        that.props.navigator.push({
                            name: 'ExpressAddress',
                            component: ExpressAddress,
                            passProps: {
                                onAddressResult: that.onAddressResult.bind(that, rowData),
                                addOnDialog: true,
                                type,
                                action,
                                address,
                            }
                        })
                        that.updateVisible(code)
                    }}
                    _callBackAddClick={() => {
                        const rowData = that.getItemFromDataSource(data, code);
                        const action = 'add';
                        that.props.navigator.push({
                            name: 'ExpressAddress',
                            component: ExpressAddress,
                            passProps: {
                                onAddressResult: that.onAddressResult.bind(that, rowData),
                                addOnDialog: true,
                                type,
                                action,
                            }
                        })
                        that.updateVisible(code)
                    }}/>
            </HSheet>
        )
    }

    checkDataStatus() {
        const {data} = this.props;
        let flag = true;
        for (let item of data) {
            if ((item.code === 'send' || item.code === 'put' || item.code === 'name') && (!item.result || item.result === '')) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    checkModelVisible() {
        const {productVisible, valueAddsVisible, paymentVisible, addressVisible} = this.props;
        return productVisible || valueAddsVisible || paymentVisible || addressVisible;
    }

    renderBottom() {
        const {prices} = this.props;
        const status = this.checkDataStatus();
        const opacity = status ? 1 : 0.5;
        const color = status ? '#ed7140' : '#faad97';
        return (
            <View style={styles.bottom}>
                <View style={styles.explain_container}>
                    <Text style={styles.explain_text}>预估价 {prices}</Text>
                    <View style={styles.clause_container}>
                        <Image style={styles.explain_image} source={require('../../hotel/images/ic_group.png')}></Image>
                        <Text style={[styles.clause_text, {marginLeft: 6}]}>我同意 </Text>
                        <TouchableOpacity onPress={this.navigatorToClause}>
                            <Text style={styles.clause_text}>《快递条款》</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={[styles.pay_touchable, {opacity: opacity, backgroundColor: color}]}
                                  onPress={this.createOrder} disabled={!status}>
                    <Text style={[styles.pay_text, {opacity: opacity}]}>下单</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {data, loading} = this.props;
        if (loading) {
            return (
                <View style={styles.container}>
                    <NavBar leftIconAction={() => this.backEvent()} title="顺丰快递"/>
                    <Loading/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <NavBar leftIconAction={() => this.backEvent()} title="顺丰快递"/>

                <ListView
                    style={styles.listview}
                    dataSource={dataSource.cloneWithRows(data)}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                />
                {this.renderBottom()}
                {this.props.productVisible && this.renderProductModal()}
                {this.props.valueAddsVisible && this.renderServiceModal()}
                {this.props.paymentVisible && this.renderPaymentModal()}
                {this.props.addressVisible && this.renderAddressModal()}

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    scroll_container: {},
    separator: {
        height: 1,
        backgroundColor: '#999999',
    },
    listview: {
        marginTop: 12,
    },
    empty_view: {
        height: 50,
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        height: BOTTOM_HEIGHT,
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
    },
    pay_touchable: {
        height: BOTTOM_HEIGHT,
        width: 100,
        backgroundColor: '#ed7140',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pay_text: {
        color: 'white',
    },
    clause_container: {
        flexDirection: 'row',
    },
    clause_text: {
        color: '#333333',
        fontSize: 12,
    },
    explain_container: {
        marginLeft: 12,
        flexDirection: 'column',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 120,
        height: BOTTOM_HEIGHT,
    },
    explain_text: {
        color: '#ed7140',
        fontSize: 14,
    },
    explain_image: {
        width: 16,
        height: 16,
    }
});

function mapStateToProps(state) {
    return {
        data: state.newOrder.data,
        productVisible: state.newOrder.productVisible,
        valueAddsVisible: state.newOrder.valueAddsVisible,
        paymentVisible: state.newOrder.paymentVisible,
        addressVisible: state.newOrder.addressVisible,
        addressData: state.newOrder.addressData,
        type: state.newOrder.type,
        prices: state.newOrder.prices,
        loading: state.newOrder.loading,
    }
}

export default connect(mapStateToProps)(ExpressNewOrder)
