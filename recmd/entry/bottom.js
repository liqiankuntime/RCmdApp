/**
 * Created by shane on 16/9/6.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native';

var imgXuanzhong = require('../img/zhaofaxuanzhong.png')
var imgWeixuan = require('../img/zhaofaweixuan.png')
var textColorOne
var backColorOne
var textColorTwo
var backColorTwo

export default class RenderBottom extends React.Component {

    constructor(props) {
        super(props)
        var isPub

       if (this.props.pubPri && this.props.pubPri=='pri'){
            isPub = false
            textColorTwo = 'white'
            backColorTwo = '#faad94'
            textColorOne = '#666666'
            backColorOne = 'white'
        }
        else{ 
            isPub = true
            textColorOne = 'white'
            backColorOne = '#faad94'//初始化的状态
            textColorTwo = '#666666'
            backColorTwo = 'white'
        }

        this.state = {
            isPrior:this.props.isPrior?this.props.isPrior:false,
            isPub:isPub,

            img:this.props.isPrior?imgXuanzhong:imgWeixuan,
            textColorOne:textColorOne,
            backColorOne:backColorOne,
			textColorTwo:textColorTwo,
            backColorTwo:backColorTwo
        }
    }

    render() {
        if (this.props.applicationId){
            return(
                <View style={{flex:1,flexDirection:'row',backgroundColor:'white', height:50}}>
                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>this.changeIsprior()}
                    >
                        <Image style={{marginLeft:15}} source={this.state.img}>

                        </Image>
                        <Text style={{flex:1,marginLeft:10,fontSize:15,color:'#333333'}}>
                            优选夕发朝至列车
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return(
                <View style={{flex:1,flexDirection:'row',backgroundColor:'white', height:50}}>
                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                      onPress={()=>this.changeIsprior()}
                    >
                        <Image style={{marginLeft:15}} source={this.state.img}>

                        </Image>
                        <Text style={{flex:1,marginLeft:10,fontSize:15,color:'#333333'}}>
                            优选夕发朝至列车
                        </Text>
                    </TouchableOpacity>
                    <View style={{flex:1,flexDirection:'row',marginRight:15,alignItems:'center',justifyContent:'flex-end'}}>
                        <TouchableOpacity style={{
                            alignItems:'center',height:30,width:50,
                            backgroundColor:this.state.backColorOne,justifyContent:'center',
                            borderTopLeftRadius:5,borderBottomLeftRadius:5,
                            borderWidth:0.5,borderRightWidth:0,
                            borderColor:'#e5e5e5'
                        }}
                                          onPress={()=>this.selectPub()}
                        >
                            <Text style={{color:this.state.textColorOne,fontSize:15}}>
                                因公
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems:'center',height:30,width:50,
                            backgroundColor:this.state.backColorTwo,justifyContent:'center',
                            borderTopRightRadius:5,borderBottomRightRadius:5,
                            borderWidth:0.5,borderLeftWidth:0,
                            borderColor:'#e5e5e5'
                        }}
                                          onPress={()=>this.selectPri()}
                        >
                            <Text style={{color:this.state.textColorTwo,fontSize:15}}>
                                因私
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

    }

    changeIsprior(){
        this.setState({
            isPrior : !this.state.isPrior,
            img:!this.state.isPrior?imgXuanzhong:require('../img/zhaofaweixuan.png'),
        })
        if (this.props.changeIsPriorCallBack){
            this.props.changeIsPriorCallBack(!this.state.isPrior)
        }
    }

    selectPub() {
        this.setState({
            textColorOne: 'white',
            backColorOne: '#faad94',  //点击变换的颜色
            textColorTwo: '#666666',
            backColorTwo: 'white',
        })
        if (this.props.changePubPriTypeCallBack) {
            this.props.changePubPriTypeCallBack('pub')
        }
    }

    selectPri() {
        this.setState({
            textColorTwo: 'white',
            backColorTwo: '#faad94',
            textColorOne: '#666666',
            backColorOne: 'white',
        })
        if (this.props.changePubPriTypeCallBack){
            this.props.changePubPriTypeCallBack('pri')
        }
    }
}
