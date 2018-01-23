/**
 * Created by Sick on 2017/3/8.
 */
import React,{
    Component
}from 'react';
import {
    View,
    Text,
    Image,
    CheckBox,
    StyleSheet,
    TouchableOpacity,
}from 'react-native';
import Common from '../../hotel/common/constants';
import images from '../images/';
export default class JingDongItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isSelect: false,
        }

    }

    _onCheckBoxPress(fn, rowID, data) {
        //alert(position);
        fn(!this.state.isSelect, rowID, data);
        this.setState({
            isSelect: !this.state.isSelect
        });

    }

    _renderImg(data) {
        if (!data.img || !data.img.length){
            return<View></View>
        }
        if (data.img.length == 1) {
            return (
                <View style={{flexDirection:'row',flex:1}}>
                    <Image source={{uri:data.img[0].imageUrl}} style={styles.item_img}></Image>
                    <Text numberOfLines={3}
                          style={{fontSize:15,textAlign:'left',flex:1,padding:10,flexWrap: 'nowrap',lineHeight:20}}>{data.img[0].wareName?data.img[0].wareName:''}</Text>
                </View>
            );
        } else {
            return (
                data.img.map((item, index)=> {

                        return (
                            <Image key={`${index}`} source={{uri:item.imageUrl}} style={styles.item_img}></Image>
                        );
                    }
                )
            );
        }
    }

    render() {
        let DataSet = this.props.data;
        let rowId = this.props.rowId;
        const data = {
            id: DataSet.orderId,
            date: DataSet.dataSubmit,
            num: (DataSet.orderMsg?DataSet.orderMsg.length:0),
            price: DataSet.price,
            img: DataSet.orderMsg,
            title: "",
            isbesweeped:DataSet.isbesweeped
        };
        if (DataSet.mainText) {
            data.title = DataSet.mainText
        }

        return (
            <View style={[styles.item_container]}>
                <View style={styles.item_top_container}>
                    <Text style={[styles.item_date]}>{data.date}</Text>
                    {data.isbesweeped?this.renderText():this.renderSelect(rowId,data)}
                </View>
                <View style={{flexDirection:'row'}}>
                    {this._renderImg(data)}

                </View>
                <View style={[styles.item_bottom_container]}>
                    <Text style={[styles.item_num]}>共{data.num}件</Text>
                    <Text style={[styles.item_price]}>￥{data.price}</Text>
                </View>
            </View>
        );
    }

    renderSelect(rowId,data){
       return <TouchableOpacity onPress={this._onCheckBoxPress.bind(this,this.props._callback,rowId,data)}>
            <Image
                source={this.state.isSelect?images['ic_multiple_selected']:images['ic_multiple_select']}
                resizeMode={Image.resizeMode.center}
                style={[styles.item_checkbox_img]}/>
        </TouchableOpacity>
    }
    renderText(){
       return <Text style={{color: '#ffb400', marginRight: 10}}>已导入</Text>
    }

}

const styles = StyleSheet.create({
    item_container: {
        width: Common.window.width,
        height: 150,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
        //backgroundColor:'#00ff00'
    },
    item_top_container: {
        width: Common.window.width,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor:'#ff0000'

    },
    item_checkbox_img: {
        width: 25,
        height: 25,
        marginRight: 10,

    },
    item_date: {
        fontSize: 11,
        marginLeft: 10,
        color: '#999999'
    },
    item_bottom_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    item_num: {
        marginRight: 10,
        color: '#999999',
        fontSize: 12,
    },
    item_price: {
        color: '#ff0000',
        fontSize: 14,
        marginRight: 10,
    },
    item_img: {
        width: 70,
        height: 70,
        margin: 5,
    }


});
