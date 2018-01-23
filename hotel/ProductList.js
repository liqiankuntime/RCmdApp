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
    ScrollView,
    Dimensions,
    ListView,
    Modal,
    TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import RoomInformationCpmponent from './common/roomInformationComponent';
import ProductLayerCpmponent from './productList/productLayer';
import ProductListCpmponent from './productList/listComponent';
import Header from './common/Header';
import images from './images/';
import * as NATIVE from '../native';

class ProductList extends Component {
    constructor(props){
        super(props);
        this.state={
            inforShow:false,
            modalVisible: false,
            layerData:{},
        }
    }
    //房型信息按钮
    _renderButton(){
        return(
            <TouchableOpacity onPress={this._showRoomInfor.bind(this)}>
                <View style={styles.roomInfroView}>
                    <Text style={{marginRight:6,fontSize:12,color:'#fff'}}>房型信息</Text>
                    <View style={{paddingTop:11}}>
                        <View
                            style={this.state.inforShow?styles.arrowLeftLineTurn:styles.arrowLeftLine}
                        >
                        </View>
                        <View
                            style={this.state.inforShow?styles.arrowRightLineTurn:styles.arrowRightLine}
                        >
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    //房型设施
    _roomFacilities(roomInfo){
        let window='有窗';
        if(roomInfo.window==0){
            window='无窗';
        }
        if(roomInfo.window==-1){
            window='';
        }
        let otherFacilities={
            'area':roomInfo.area||'',
            'capcity':roomInfo.capcity||'',
            'floor':roomInfo.floor||'',
            'bedType':roomInfo.bedType||'',
            'window':window||'',
        }
        console.log('otherFacilities>',otherFacilities)
        return otherFacilities;
    }
    //房型名称
    _roomName(roomInfo){
        let result='';
        if(roomInfo.roomTypeName.length>9){
            result = roomInfo.roomTypeName.substring(0,10)+'...';
        }else{
            result=roomInfo.roomTypeName;
        }
        return result;
    }

    //render房型详情页面
    render(){
        let roomInfo=this.props.roomInfo;
        let titleName='酒店房型';
        let facilities=roomInfo.facilities;
        let roomImgNum=0;
        if(this.props.roomTypeImage){
            roomImgNum=this.props.roomTypeImage.length;
        }
        console.log('roomInfo:>>',roomInfo,roomInfo.ratePlan);
        return(
            <View  style={{backgroundColor:'#fff'}}>
                <Header
                    leftIcon='ic_back'
                    leftIconAction={()=>this.props.navigator.pop()}
                    title={titleName}

                />
                <View style={{height:require('Dimensions').get('window').height-60}}>
                    <ScrollView>
                        <View>
                            <View style={styles.topView}>
                                <TouchableOpacity onPress={this._imgBtn.bind(this,this.props.roomTypeImage)} style={{width:54,height:54}}>
                                    {roomInfo.imageUrl==''?
                                        <Image source={images['roomImg_none']} style={[styles.Img,{backgroundColor:'#fff'}]}/>:
                                        <View>
                                            <Image source={{uri: roomInfo.imageUrl}} style={styles.Img}/>
                                            <Text style={styles.roomImg}>{roomImgNum}张</Text>
                                        </View>
                                    }

                                </TouchableOpacity>
                                <Text style={{fontSize:16,color:'#fff'}}>{this._roomName(roomInfo)}</Text>
                                {this._renderButton()}
                            </View>
                            {/*折叠信息*/}
                            <View>
                                {this.state.inforShow?
                                <View
                                    style={[styles.roomFacilities]}
                                    >
                                    <RoomInformationCpmponent
                                        facilities={facilities}
                                        otherFacilities={this._roomFacilities(roomInfo)}
                                        roomDescriptioin={roomInfo.description}
                                        styleControl={0}
                                    />
                                    </View>:
                                    <View></View>
                                }
                            </View>
                        </View>
                        <View>
                            {/*列表信息*/}
                            <ProductListCpmponent
                                layerData={this._layerData.bind(this)}//传递点击事件
                                products={roomInfo.ratePlan}
                                {...this.props}
                            />
                        </View>

                    </ScrollView>
                    <Modal
                        animationType={'fade'}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {this._setModalVisible(false)}}
                    >
                        <ProductLayerCpmponent
                            setModalVisible={this._setModalVisible.bind(this)}
                            layerData={this.state.layerData}
                            guaranteeRulesSet={this.props.guaranteeRules}//担保规则
                            prepayRulesSet={this.props.prepayRules}//预付规则
                            bookingRulesSet={this.props.bookingRules}//预订规则
                            valueAddsSet={this.props.valueAdds}//增值服务
                        />
                    </Modal>


                </View>
            </View>
        )
    }
    //控制modal显示
    _setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    //控制modal显示并传输数据
    _layerData(visible,data) {
        this.setState(
            {
                modalVisible: visible,
                layerData:data
            }
        );
    }
    //控制房型信息展开收起
    _showRoomInfor(){
        this.setState(prevState =>({
                inforShow:!prevState.inforShow,
            }));
    }
    //浏览房型图片
    _imgBtn(imageData){
        if(NATIVE.toRoomGallery)
            return NATIVE.toRoomGallery(imageData);
    }
}
const styles=StyleSheet.create({
    topView:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:58,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#666',
        paddingTop:1,
        paddingBottom:1
    },
    roomInfroView:{
        flexDirection:'row',
    },
    text:{
        paddingLeft:10,
        paddingRight:10
    },
    arrowLeftLine:{
        width:9,
        height:1.5,
        backgroundColor:'#fff',
        marginTop:-6,
        transform:[{rotate: '45deg'}],
    },
    arrowRightLine:{
        width:9,
        height:1.5,
        backgroundColor:'#fff',
        marginTop:-2,
        marginLeft:6,
        transform:[{rotate: '-45deg'}],
    },
    arrowLeftLineTurn:{
        width:9,
        height:1.5,
        backgroundColor:'#fff',
        marginTop:-6,
        transform:[{rotate: '315deg'}],
    },
    arrowRightLineTurn:{
        width:9,
        height:1.5,
        backgroundColor:'#fff',
        marginTop:-2,
        marginLeft:6,
        transform:[{rotate: '-135deg'}],
    },
    Img:{
        width:54,
        height:54,
    },
    roomFacilities:{
        backgroundColor:'#666',
        paddingTop:20,
        paddingBottom:16
    },
    roomImg:{
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'#000',
        color:'#fff',
        fontSize:8,
        paddingLeft:2,
        paddingRight:2,
        opacity:0.9
    }
});

function mapStateToProps(state, ownProps) {
    const {roomId} = ownProps;
    const roomInfo = state.detail.data.rooms.find(room => room.roomId == roomId);
    const roomTypeImage = state.detail.data.images['8'][roomId];
    const {
        bookingRules,
        guaranteeRules,
        prepayRules,
        valueAdds,
        hotelId,
        cityId,
        cityName,
    } = state.detail.data;
    return {
        roomInfo,
        bookingRules,
        guaranteeRules,
        prepayRules,
        valueAdds,
        hotelId,
        cityId,
        cityName,
        roomTypeImage,
    };
}

export default connect(mapStateToProps)(ProductList);
