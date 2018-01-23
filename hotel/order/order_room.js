/**
 * Created by shane on 16/10/22.
 */
import React from 'react'
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native'

import {updateOrder} from '../actions/orderActions'
import Row from './row'
import RoomNumberView from '../common/RoomNumberView';
import {SortListView} from '../common/SortListView'
import * as NATIVE from '../../native'
import constants from '../common/constants'


export default class RoomMessage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            isShow:false,
            room:false,
            time:false
        }
    }

    static defaultProps = {
        data : {
            roomDescription: '',
            roomNum: 1,
            timeLater: '',
            hotelOrderCustomer: [],
            linkuserMobile: '',
            linkuserEmail: '',
        }
    };

    _cancelClick(){
        this.setState({
            isShow:false,
            room:false,
            time:false
        })
    }

    getCustomerNames(customers) {
        let arr = [];
        if (customers != undefined && customers.length > 0) {
            customers.map((customer)=> {
                arr.push(customer.customerName)
            })
        }
        return arr.toString();

    }

    render(){
        const data = this.props.data;
        const description = data.roomDescription;
        const roomNum = data.roomNum+'间';
        const timeLater = data.timeLater;
        const customerNames = this.getCustomerNames(data.hotelOrderCustomer);
        const linkuserMobile = data.linkuserMobile;
        const hasEmail = data.supplierCode==='hrs'?true:false;
        const email = data.linkuserEmail;
        return(
            <View style={{flexDirection:'column',paddingTop:6,backgroundColor:constants.colors.lightGray}}>
                <Row title='房型信息' body={description} isEditable={false} isInput={false}/>
                <Row title="房间数" body={roomNum} isEditable={true} isInput={false} textEdit={()=>this.fangjianshuEvent()}/>
                <Row title="最晚到店" body={timeLater} isEditable={true} isInput={false} textEdit={()=>this.daodianEvent()}/>
                <Row title="入住人" body={customerNames} isEditable={true} isInput={false} textEdit={()=>this.ruzhurenEvent()}/>
                <Row title="联系电话" body={linkuserMobile} isEditable={true} isInput={true} textInputEdit={(text)=>this.dianhuaEvent(text)}
                     placeholder="请输入联系人电话" keyboardType="number-pad"/>
                {hasEmail?
                    <Row title="邮箱" body={email} isEditable={true} isInput={true} textInputEdit={(text)=>this.emailEvent(text)}
                         placeholder="用于接收HRS酒店确认函" keyboardType="email-address"/>:null
                }
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.isShow}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={{flex:1,flexDirection:'column-reverse' ,backgroundColor: 'rgba(131, 131, 131, 0.3)'}}>

                        {this.state.room ?
                            <RoomNumberView
                                ref="RoomNumberView"
                                callback={(item)=>this.fangjianCallback(item)}
                                currentAlloment = {data.ratePlan.currentAlloment}
                            />:
                            null
                        }
                        {this.state.time ?
                                <SortListView
                                    dataType='entryTime'
                                    showStyle="bottom"
                                    sort={data.timeLater}
                                    dateLater={data.startDate}
                                    startTime= {data.ratePlan.guaranteeInfo.StartTime}
                                    endTime= {data.ratePlan.guaranteeInfo.EndTime}
                                    guaranteeCost= {data.ratePlan.guaranteeInfo.GuaranteeCost}
                                    guaranteeInfo = {data.ratePlan.guaranteeInfo}
                                    callback={(data)=>this.daodianCallback(data)}
                                />
                            :
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

    updateAction(data){
        this.props.dispatch(updateOrder(data))
    }

    resetState(isShow,room,time){
        this.setState({
            isShow:isShow,
            room:room,
            time:time
        })
    }
    fangjianshuEvent(){
        this.resetState(true,true,false);
    }

    fangjianCallback(num){
        this.resetState(false,false,false);
        let guaranteeAmount = this.props.data.guaranteeAmount;
        let guaranteeInfo = this.props.data.ratePlan.guaranteeInfo;
        let isDayGuarantee = guaranteeInfo.Amount!=undefined && guaranteeInfo.Amount<=num;
        if (guaranteeInfo.IsGuarantee == 'true') {
            guaranteeAmount = num * guaranteeInfo.GuaranteeCost
        }
        else if (guaranteeInfo.IsGuarantee == 'false') {
            guaranteeAmount = 0;
        }
        else {
            if (isDayGuarantee || this.props.data.isTimeGuarantee) {
                guaranteeAmount = num * guaranteeInfo.GuaranteeCost
            }
            else {
                guaranteeAmount = 0;
            }
        }
        let number1 = getDecimalDigits(this.props.data.ratePlan.totalRate);
        let number2 = getDecimalDigits(guaranteeInfo.GuaranteeCost);
        this.updateAction({
            roomNum: num,
            sumPrice: (num*this.props.data.ratePlan.totalRate).toFixed(number1),
            guaranteeAmount: guaranteeAmount.toFixed(number2),
            isDayGuarantee: isDayGuarantee
        })
    }

    daodianEvent(){
        this.resetState(true,false,true)
    }

    daodianCallback(data){
        this.resetState(false,false,false);
        let guaranteeAmount = this.props.data.guaranteeAmount;
        let guaranteeInfo = this.props.data.ratePlan.guaranteeInfo;
        if (guaranteeInfo.IsGuarantee == 'true') {
            guaranteeAmount = this.props.data.roomNum * guaranteeInfo.GuaranteeCost
        }
        else if (guaranteeInfo.IsGuarantee == 'false') {
            guaranteeAmount = 0;
        }
        else {
            if (data.guarantee || this.props.data.isDayGuarantee) {
                guaranteeAmount = this.props.data.roomNum * guaranteeInfo.GuaranteeCost
            }
            else {
                guaranteeAmount = 0;
            }
        }
        let number = getDecimalDigits(guaranteeInfo.GuaranteeCost);
        this.updateAction({
            timeLater: data.time,
            guaranteeAmount: guaranteeAmount.toFixed(number),
            isTimeGuarantee: data.guarantee
        })
    }

    ruzhurenEvent(){
        let ids = [];
        if (this.props.data.hotelOrderCustomer!=undefined){
            this.props.data.hotelOrderCustomer.map((customer) => {
                ids.push(customer.staffId?customer.staffId:customer.contactId)
            });
        };
        if (NATIVE.contactsEvent) {
            NATIVE.contactsEvent(ids,(error,result)=>{
                if(error){

                }
                else {
                    let customers = new Array();
                    result.map((visitor)=>{
                        let customer = new Object();
                        customer.customerName = visitor.name;
                        customer.mobile = visitor.mobile;
                        if (visitor.contactStaffId != 0) {
                            customer.staffId = visitor.contactStaffId;
                        }
                        else {
                            customer.contactId = visitor.id;
                        }
                        customers.push(customer);
                    });
                    this.updateAction({hotelOrderCustomer:customers})
                }
            })
        }
    }

    dianhuaEvent(text){
        this.updateAction({linkuserMobile:text})
    }

    emailEvent(text){
        this.updateAction({linkuserEmail:text})
    }
}

function getDecimalDigits(number) {
    let length = String(number).length
    let index = String(number).indexOf('.')+1;
    if (index == 0) {
        return 0;
    }
    else
        return length-index;
}