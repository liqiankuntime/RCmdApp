/**
 * Created by shane on 16/10/26.
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

import Row from './row'

import constants from '../common/constants'

export default class People extends React.Component{

    getCustomerNames(customers){
        if (this.props.data.orderType!=undefined && this.props.data.orderType=='api') {
            let arr = [];
            if (customers != undefined && customers.length > 0) {
                customers.map((customer)=> {
                    arr.push(customer.customerName)
                })
            }
            return arr.toString();
        }
        else
            return this.props.data.openUserName;
    }

    render(){
        const data = this.props.data;
        const customerNames = this.getCustomerNames(data.hotelOrderCustomer);
        const linkuserMobile = data.linkuserMobile;
        const hasEmail = data.supplierCode==='hrs'?true:false;
        const email = data.linkuserEmail;
        return(
            <View style={{flexDirection:'column',paddingTop:6,backgroundColor:constants.colors.lightGray}}>
                <Row title="入住人" body={customerNames} isEditable={false} isInput={false}/>
                <Row title="联系电话" body={linkuserMobile} isEditable={false} isInput={false}/>
                {hasEmail?
                    <Row title="邮箱" body={email} isEditable={false} isInput={false}/>:null
                }
            </View>
        )
    }
}
