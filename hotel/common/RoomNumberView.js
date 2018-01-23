'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const [aWidth, aHeight] = [width/5.8, 214];
const [left, top] = [0, 0];

export default class RoomNumberView extends Component {
  constructor(props) {
    super(props);
    var Curr  = props.currentAlloment;
    if(Curr==0){
      Curr=20;
    }
    this.state = {
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
      hide: true,

      currentAlloment:Curr<10?10-Curr:0
    };

    this.callback=function(item){};//回调方法
  }
  render() {
      return (
          <View style={styles.container} >
              <View style={styles.tipTitleView}>
                <Text style={styles.tipTitleText}>房间数(间)</Text>
              </View>

              <View style={styles.buttonView1}>
                {
                  [1+this.state.currentAlloment,2+this.state.currentAlloment,3+this.state.currentAlloment,4+this.state.currentAlloment,5+this.state.currentAlloment].map((item,i)=>this._renderItem(item,i))
                }
              </View>

              <View style={styles.buttonView2}>
                {
                  [6+this.state.currentAlloment,7+this.state.currentAlloment,8+this.state.currentAlloment,9+this.state.currentAlloment,10+this.state.currentAlloment].map((item,i)=>this._renderItem(item,i))
                }
              </View>
          </View>
      );
  }

  _renderItem(item , i) {
    if (this.state.currentAlloment>0){
      if (item>10){
        return (
            <TouchableHighlight key={i} style={styles.tipContentView} underlayColor='rgb(232,232,232)'>
              <View style={styles.grayButton}><Text style={styles.tipText2} >{item-this.state.currentAlloment}</Text></View>
            </TouchableHighlight>
        );
      }
      else {
        return (
            <TouchableHighlight key={i} style={styles.tipContentView} underlayColor='rgb(204,74,29)' onPress={this.choose.bind(this,item-this.state.currentAlloment)}>
              <Text style={styles.tipText} >{item-this.state.currentAlloment}</Text>
            </TouchableHighlight>
        );

      }
    }
    else {
      return (
          <TouchableHighlight key={i} style={styles.tipContentView} underlayColor='rgb(204,74,29)' onPress={this.choose.bind(this,item)}>
            <Text style={styles.tipText} >{item}</Text>
          </TouchableHighlight>
      );
    }


  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  //选择
  choose(item) {
    if (this.props.callback){
      this.props.callback(item)
    }

  }
}

const styles = StyleSheet.create({
  container: {
    width:width,
    height:aHeight,
    left:left,
    backgroundColor:"white"
  },
  //标题栏
  tipTitleView: {
    height:50,
    width:width,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'rgb(230,90,50)',
    justifyContent:'center'
  },
  //标题栏文字
  tipTitleText:{
    color:'white',
    fontSize:16
  },

//按钮View
  buttonView1:{
    flex:1,
    backgroundColor:'white',
    justifyContent:'center',
    flexDirection:'row',
    flexWrap:'wrap'
  },
  buttonView2:{
    flex:1,
    top:-15,
    backgroundColor:'white',
    justifyContent:'center',
    flexDirection:'row',
    flexWrap:'wrap'
  },
  //按钮
  grayButton:{
    flex:1,
    height:45,
    backgroundColor:'gray'
  },

  tipContentView: {
    top:15,
    borderWidth:1,
    borderColor:'rgb(228,228,228)',
    width:aWidth,
    height:45,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  //按钮文字
  tipText:{
    color:'rgb(10,10,10)',
    fontSize:17,
    textAlign:"center"
  },
  tipText2:{
    color:'white',
    fontSize:17,
    textAlign:"center",
    top:12
  }
});
