/**
 * Created by zhaoxj on 16/10/18.
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
} from 'react-native';

class BreakfastItem extends Component {
    //早餐类型(单早、双早)
    _beakfastType(data){
        let rusult='';
        if(data==0){
            rusult='';
        }else if(data==1){
            rusult='单早';
        }else if(data==2){
            rusult='双早';
        }else if(data==3){
            rusult='三早';
        }
        return rusult;
    }

    render(){
        let peoples=1;
        if(this.props.peoples!=undefined){
            peoples=this.props.peoples;
        }
        return(
            <View style={styles.itemContainerRow}>
                <Text style={styles.itemTxt}>
                    {this.props.data.Date}
                    <Text style={styles.breakfastTxt}>   {this._beakfastType(this.props.data.Breakfast)}</Text>
                </Text>
                <Text style={[styles.rowPriceText,styles.itemR]}>¥{this.props.data.Price}×{peoples}</Text>
            </View>
        )
    }
}
class BreakfastCpmponent extends Component {

    render(){
        let payMode='';
        if(this.props.breakfasts.paymentType=='SelfPay'){
            payMode='到店支付';
        }else if(this.props.breakfasts.paymentType=='Prepay'){
            payMode='在线支付';
        }
        return(
            <View style={[styles.container]}>
                <View style={{borderBottomWidth:1,borderStyle:'solid',borderColor:'#e5e5e5'}}>
                    <Text style={styles.title}>明细</Text>
                </View>
                <View>
                    {
                        this.props.breakfasts.nightlyRates.map((data,i) => {
                            return (
                                <BreakfastItem
                                    key={i}
                                    data={data}
                                    breakfastType={this.props.breakfasts.breakfast}
                                    peoples={this.props.peoples}
                                />
                            )
                        })
                    }
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{marginTop:15,marginLeft:5}}>
                        <Text style={{fontSize:16,color:'#333',}}>{payMode}</Text>
                    </View>
                    <View>
                        <View style={{marginTop:15}}>
                            <Text style={styles.priceText}>房费  ¥{this._totalPrice()}</Text>
                        </View>
                    </View>
                </View>
            </View>

        )
    }
    _totalPrice(){
        let totalPrice=0;
        let datas=this.props.breakfasts.nightlyRates;
        for(let i=0;i<datas.length;i++){
            var c = 0,
                d = datas[i].Price.toString(),
                e = this.props.peoples.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            let rowPrice = Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
            totalPrice+=rowPrice;
        }
        return totalPrice;
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    itemContainerRow:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        height:44,
        paddingLeft:5,
        paddingRight:5,
        borderBottomWidth:1,
        borderBottomColor:'#e5e5e5',
        borderStyle:'solid',
    },
    itemTxt:{
        fontSize:16,
        flex:3,
        color:'#ed7140'
    },
    breakfastTxt:{
        fontSize:16,
        color:'#999'
    },
    rowPriceText:{
        fontSize:15,
        flex:3,
        color:'#999'
    },
    itemR:{
        textAlign:'right',
    },
    title:{
        paddingLeft:5,
        fontSize:16,
        paddingBottom:15
    },
    priceText:{
        fontSize:17,
        color:'#333',
        textAlign:'right',
        height:20,
        paddingLeft:10,
        paddingRight:5
    }


});
export default BreakfastCpmponent;