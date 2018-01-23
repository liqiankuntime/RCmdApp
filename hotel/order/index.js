/**
 * Created by shane on 16/10/20.
 */

import React,{PropTypes}from 'react'
import {View,ScrollView,Modal} from 'react-native'

import * as NATIVE from '../../native'
import {getRatePlanDetail,createOrder,showOrderLoading,getOrder,submitOrder,confirmOrder,updateOrder} from '../actions';
import constans from '../common/constants'
import Head from './order_head'
import Rules from './order_rules'
import Cancel from './order_cancel'
import People from './order_people'
import RoomMessage from './order_room'
import Invoice from './order_invoice'
import Service from './order_service'
import Bottom from './order_bottom'
import Loading from '../common/Loading';
import OrderTips from './order_tips'

import InvoiceDetail from './order_invoiceDetail'

export default class Order extends React.Component{

    static PropTypes= {
        cityId: PropTypes.number,
        cityName: PropTypes.string,
        hotelId: PropTypes.string,
        roomTypeId: PropTypes.number,
        ratePlanId: PropTypes.number,
        billId: PropTypes.number,
    };

    static defaultProps = {

    };

    componentWillMount(){
        if (this.props.billId>0){
            this.props.dispatch(getOrder(this.props.billId))
        }
        else
            this.props.dispatch(getRatePlanDetail(this.props.cityId,this.props.cityName,this.props.hotelId,this.props.roomTypeId,this.props.ratePlanId))
    }

    componentDidMount(){
        if (NATIVE.getUserinfo&&(this.props.billId==undefined||this.props.billId==0)) {
            NATIVE.getUserinfo((login) =>{

                let customers = new Array();
                customers.push({staffId:login.id, customerName:login.name, mobile:login.phone});

                this.props.dispatch(
                    updateOrder({
                        hotelOrderCustomer:customers,
                        linkuserName: login.name,
                        linkuserMobile: login.phone,
                        linkuserEmail: login.email,
                        groupId: login.group,
                        companyId: login.company,
                        staffId: login.id,
                        userName: login.name,
                        mobile: login.phone
                    })
                )
            })
        }


          if (NATIVE.getSavedMailAddrass)
          {
            NATIVE.getSavedMailAddrass(
              (error, result)=> {
                if (error) {}
                else if (result)  {
                    invoice =  {Recipient:result}
                    this.props.dispatch(updateOrder({invoice:invoice}))
                }
            })
          }



    }

    render() {


        const {navigator,dispatch,order,...props} = this.props;
        const isLoadingView = order.viewLoading;
        const isLoadingModal = order.modalLoading;
        const data = order.data;
        const detail = order.detail;
        const editable = (props.editable==undefined || props.editable==true)?true:false;

        if (isLoadingView) {
            return (
                <Loading/>
            )
        }
        else if (data){
          const isHRS = data.supplierCode==='hrs'?true:false;
          const isFAPIAO = data.ratePlan?data.ratePlan.invoiceMode == 'Elong':false
          // const isFAPIAO =  ((data.paymentType == 'Prepay' || data.paymentType == '预付' ) &&data.supplierCode==='elong')
            return (
                <View style={{flex:1,flexDirection: 'column'}}>
                    <View style={{flex:1}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{flex:1,backgroundColor: constans.colors.backBody,}}
                            keyboardDismissMode = "on-drag"
                        >
                            <Head data={data} detail={detail} dispatch={dispatch} navigator={navigator}/>
                            {data.id > 0 ?
                                <Cancel data={data} detail={detail} dispatch={dispatch} navigator={navigator}/> : <Rules data={data}/>
                            }
                            {
                              isHRS >0?  <OrderTips tips = {'担保费仅供参考，以酒店实际扣款金额为准.'}/>:null
                            }

                            {data.id >0 ?
                                <People data={data}/> : <RoomMessage data={data} dispatch={dispatch}/>
                            }

                            {
                              data.orderNoSupplierExtend >0?  <OrderTips tips = {'HRS处理号'} tipsValue ={data.orderNoSupplierExtend} tipsDetailValue = {'电话服务时需要提供该号码'}/>:null
                            }


                            {data.id >0 ?
                                <Service data={data}/> : <Service data={data}/>
                            }

                            {
                              isFAPIAO?
                              <InvoiceDetail editable = {data.id?false: true} data={data}  dispatch={dispatch}/>
                              :<Invoice data={data} dispatch={dispatch}/>
                            }



                        </ScrollView>
                    </View>
                    <View style={{marginTop:0,marginBottom:0,backgroundColor:'white'}}>
                        <Bottom data={data} editable={editable} modalLoading={order.modalLoading} dispatch={dispatch} navigator={navigator}/>
                    </View>

                    <Modal
                        transparent={true}
                        visible={isLoadingModal}
                        onShow={() => {}}
                        onRequestClose={() => {}}>
                        <Loading/>
                    </Modal>
                </View>
            )
        }
        else
            return (
                <View style={{backgroundColor:constans.colors.backBody}}></View>
            )
    }
}
