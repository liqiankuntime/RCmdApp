/**
 * Created by zhaoxj on 16/10/19.
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ListView,
    Modal,
    TouchableOpacity
} from 'react-native';

import HotelOrder from '../HotelOrder';
class ProductListCpmponent extends Component {
    constructor(props){
        super(props);
        this._renderRow=this._renderRow.bind(this);
        var dataSource=new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state={
            dataSource:dataSource.cloneWithRows(this.props.products),
        }
    }
    //所剩房间数
    _restamount(data){
        let currentAlloment='';
        if(data.status==1 && data.currentAlloment!=0){
            currentAlloment='仅剩'+data.currentAlloment+'间房';
            return(
                <Text style={styles.restnum}>{currentAlloment}</Text>
            )
        }
    }
    //是否显示担保
    _isGuarantee(data){
        if(data.guaranteeInfo.IsGuarantee=='true'){
            return(
                <Text style={styles.guarantee}> {'担保'}</Text>
            )
        }
    }
    //价格类型(内宾价、外宾价...)
    _customerType(data){
        let customerType='';
        switch (data.customerType) {
            case 'All':
                customerType='统一价';
                break;
            case 'Chinese':
                customerType='内宾价';
                break;
            case 'OtherForeign':
                customerType='外宾价';
                break;
            case 'HongKong':
                customerType='港澳台客人价';
                break;
            case 'Japanese':
                customerType='日本客人价';
                break;
        }
        return customerType;
    }
    //productTitle
    _title(data){
        let ratePlanName = data.ratePlanName;
        let result='';
        if(ratePlanName.length>9){
            result = ratePlanName.substring(0,10)+'...';
        }else{
            result=ratePlanName;
        }
        return result;
    }
    _renderRow(data,rowID){
        // data:{
        //  ratePlanName:'艺龙旅行网络',
        //  supplierName:"含早餐",
        //  customerType:"Japanese",
        //  averageRate:"110",
        //  status:'1',
        //  currentAlloment:"10",
        //  guaranteeInfo:{IsGuarantee:'true'},
        //  paymentType:'SelfPay'
        // }

        return(
            <TouchableOpacity onPress={this._rowButton.bind(this,data)}>
                <View style={styles.item}>
                    <View>
                        <View>
                            <Text style={styles.title}>{this._title(data)}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={styles.cancelRule}>{data.supplierName}  </Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.neibin}>
                                <Text style={styles.neibinText}>{this._customerType(data)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View>
                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text style={styles.pricetxt}><Text style={{fontSize:15}}>¥</Text>{data.averageRate}</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                {this._restamount(data)}
                                {this._isGuarantee(data)}
                            </View>
                        </View>

                        {this._renderBookButton(data)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        return(
            <ListView
                style={{marginTop:0}}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
            />
        )
    }
    //render预订按钮
    _renderBookButton(data){
        let status = data.status;
        let btnText='订';
        if(status==0){
            btnText='满房';
        }
        let paymentType='';
        if(data.paymentType=='SelfPay'){
            paymentType='到店付';
        }else if(data.paymentType=='Prepay'){
            paymentType='预付';
        }
        return(
            <TouchableOpacity disabled={status==0?true:false} onPress={this._book.bind(this,data)}>
                <View style={[styles.bookBtn,status==0?styles.bookBtnDisable:'']}>
                    <Text style={[styles.bookText,status==0?styles.bookTextDisalbe:'']}>{btnText}</Text>
                </View>
                <View style={styles.bookBtnPay}>
                    <Text style={styles.payModeText}>{paymentType}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    //预订事件
    _book(data){
        this.props.navigator.push({
            name: 'ProductListContainer',
            component: HotelOrder,
            passProps:{
                cityId:this.props.cityId,
                cityName:this.props.cityName,
                hotelId:this.props.hotelId,
                roomTypeId:data.roomTypeId,
                ratePlanId:data.ratePlanId,

            }
        })
    }

    _rowButton(data){
        this.props.layerData(true,data);
    }
}
const styles=StyleSheet.create({
    item:{
        borderBottomWidth:1,
        borderBottomColor:'#e5e5e5',
        borderStyle:'solid',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:15,
        paddingBottom:15
    },
    cancelRule:{
        color:'#999',
        fontSize:12,
        paddingTop:5,
        paddingBottom:6
    },
    bookBtn:{
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#ed7140',
        width:50,
        height:25,
        marginLeft:10,
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
        paddingLeft:5,
        paddingRight:5,
        backgroundColor:'#ed7140',
    },
    bookBtnDisable:{
        backgroundColor:'#d8d8d8',
        borderColor:'#d8d8d8',
    },
    bookBtnPay:{
        borderStyle:'solid',
        borderWidth:1,
        borderTopWidth:0,
        borderColor:'#e5e5e5',
        width:50,
        height:20,
        marginLeft:10,
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
        paddingLeft:2,
        paddingRight:2,
        paddingTop:2,
        paddingBottom:2,
        backgroundColor:'#fff',
    },
    bookText:{
        color:'#fff',
        fontSize:15,
        textAlign:'center',
        lineHeight:20,
    },
    bookTextDisalbe:{
        color:'#666',
    },
    payModeText:{
        color:'#333',
        fontSize:12,
        lineHeight:14,
        textAlign:'center',
    },
    bookBtnText:{
        height:26,
        lineHeight:20,
    },
    title:{
        fontSize:16,
        color:'#333'
    },
    neibin:{
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#ed7140',
        borderRadius:10,
        paddingLeft:7,
        paddingRight:7,
        paddingTop:1,
        paddingBottom:1
    },
    neibinText:{
        fontSize:11,
        color:'#333'
    },
    pricetxt:{
        fontSize:18,
        color:'#ed7140'
    },
    restnum:{
        fontSize:12,
        color:'#ed7140'
    },
    guarantee:{
        color:'#333',
        fontSize:12
    }


});
export  default ProductListCpmponent;