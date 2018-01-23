
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
import ActionRow from './ActionRow'
import * as NATIVE from '../../native'
import {updateOrder} from '../actions';

import {SortListView} from '../common/SortListView';
import * as listData from '../common/SortListViewData';



  let invoice ;

export default class InvoiceDetail extends React.Component{



  _cancelClick() {
      this.setState({isShow:false})
  }

switchValueChange(value)
{
this.setState({switchIsOn: value})
  this.props.dispatch(updateOrder({isNeedInvoice:value}))
}

  updateInvoice()
  {
    this.props.dispatch(updateOrder({invoice:invoice}))
  }

  fapiaoTitle(title)
  {
  invoice.Title = title
  this.updateInvoice()
  }
  fapiaoneirong(){
    this.setState({isShow:!this.state.isShow})
  }
  fapiaoneirongCallBack(data)
  {
      this.setState({isShow:!this.state.isShow})
    if (data != null) {
      invoice.ItemName = data;
      this.updateInvoice()
    }

  }
  fapiaoyoujidizhi(){
      if (NATIVE.getMailAddrass)
          NATIVE.getMailAddrass(
            invoice.Recipient
            ,(error, result)=> {
              if (error) {}
              else if (result)  {

                  invoice.Recipient = result
                  this.updateInvoice()
              }
          })
  }

  constructor(props){
      super(props);
      this.state={
        isShow:false
      }
  }

    render(){

      const switchIsOn = this.props.data.isNeedInvoice
      const editable = this.props.editable
      invoice =  this.props.data.invoice
      if (invoice == null) {

          invoice = {Recipient:{}}

      }

      invoice.ItemName = invoice.ItemName?invoice.ItemName:'代订房费'
      invoice.Amount = this.props.data.sumPrice
        return(
            <View style={{flexDirection:'column',paddingTop:6,backgroundColor:constants.colors.lightGray}}>

              {

                editable?<ActionRow  editable={editable} rowTitle = '需要发票'  rowType = 'switch'  value = {switchIsOn}  onValueChange={ (value)=>this.switchValueChange(value)} />
              : switchIsOn? <Row title="发票状态" body=  {this.props.data.invoiceStatus} isEditable={false} isInput={false} />:null
              }

                  {
                    switchIsOn?<View>
                  <Row title='发票抬头'  body={invoice.Title} placeholder="个人或公司名称" isEditable={editable} isInput={editable}  textInputEdit={(text)=>this.fapiaoTitle(text)}/>
                  <Row title="发票内容" body={invoice.ItemName} isEditable={editable} isInput={false} textEdit={()=>this.fapiaoneirong()}/>
                  <Row title="邮寄地址" body={invoice.Recipient.Street?invoice.Recipient.City+invoice.Recipient.District+invoice.Recipient.Street:'请选择邮寄地址'} isEditable={editable} isInput={false} textEdit={()=>this.fapiaoyoujidizhi()}/>
                  <Row title="发票金额" body=  {this.props.data.sumPrice} isEditable={false} isInput={false} />
                    <View style={{backgroundColor:constants.colors.backBody}}>
                        <Text style={{flex:1,marginLeft:10,marginRight:10,marginTop:10,marginBottom:30,fontSize:12,color:constants.colors.textLight}}>
                          您的发票由艺龙公司开具，发票金额仅为线上支付/企业支付的酒店费用；发票将会在您离店后寄出，普通快递5日左右送达；
                        </Text>
                    </View>
                  <Modal
                      animationType='fade'
                      transparent={true}
                      visible={this.state.isShow}
                      onShow={() => {
                      }}
                      onRequestClose={() => {
                      }}>
                      <View style={{flex:1,flexDirection:'column-reverse' ,backgroundColor: 'rgba(131, 131, 131, 0.3)'}}>
                          {
                              <SortListView titleString = '发票内容'  showStyle="bottom"  sort = {invoice.ItemName} dataSource = {listData.fapiao} callback={this.fapiaoneirongCallBack.bind(this)}/>
                          }
                          <TouchableWithoutFeedback style={{flex: 1, zIndex: 1}} onPress={this._cancelClick.bind(this)}>
                              <Animated.View style={{flex: 1, backgroundColor: 'transparent'}}></Animated.View>
                          </TouchableWithoutFeedback>
                      </View>
                  </Modal>
                  </View>:null
                }
            </View>
        )
    }
}
