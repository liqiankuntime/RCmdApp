/**
 * Created by shane on 16/10/20.
 */
import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert
} from 'react-native';

import {alertShow} from '../../common/Alert'

import MultiSlider from '././MultiSlider/MultiSlider'
var WinWidth = require('Dimensions').get('window').width

var starRate = [],lowRate,highRate

export default class StarLevel extends Component {
    static propTypes = {
        search: PropTypes.object,
        onSureCallBack: PropTypes.func
    }
    static defaultProps = {
        search: {
            starRate:[0],
            lowRate: 0,
            highRate: 850
        },
        onSureCallBack: (json)=>{
            alertShow(JSON.stringify(json))
        }
    }
    constructor(props) {
        super(props)
        starRate = this.props.search.starRate
        lowRate = this.props.search.lowRate
        highRate = this.props.search.highRate>850?850:this.props.search.highRate
        this.state = {
            star: starRate,
            low: lowRate,
            high: highRate
        }
    }
    starEvent =(lev)=>{
        if(lev==0){
            starRate = [0]
        }
        else {
            if (isContain(starRate,0)){
                starRate = [lev]
            }
            else if (isContain(starRate,lev) && starRate.length>=1){
                sliceOne(starRate,lev)
            }
            else {
                starRate.push(lev)
            }
        }
        this.setState({
            star: starRate,
            low:lowRate,
            high:highRate
        })
    }
    cancelEvent = ()=>{
        starRate = [0]
        lowRate = 0
        highRate = 850
        this.setState({
            star:starRate,
            low:lowRate,
            high:highRate
        })
    }
    sureEvent = ()=>{
        highRate = highRate==850?99999:highRate
        this.props.onSureCallBack({starRate:starRate,lowRate:lowRate,highRate:highRate})
    }
    onValuesChangeFinish = (values)=>{
        lowRate = values[0]
        highRate = values[1]
        this.setState({
            low:lowRate,
            high:highRate,
        })
    }
    render() {
        //alert(this.state.low)
        return (
            <View style={{flexDirection:'column',backgroundColor:'#F6F6F6'}}>
                <View style={starStyle.titleView}>
                    <Text style={{color:'white'}}>价格星级</Text>
                </View>
                <View style={starStyle.textView}>
                    <Text style={starStyle.text}>
                        星级(可多选)
                    </Text>
                </View>
                <View style={[starStyle.starlevel,{flex:1,flexDirection:'row'}]}>
                    <TouchableOpacity style={[starStyle.starTouch,{backgroundColor:isContain(this.state.star,0)?'#faad94':'white'}]} onPress={()=>this.starEvent(0)}>
                        <Text style={[starStyle.starText,{color:isContain(this.state.star,0)?'white':'#333'}]}>不限</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[starStyle.starTouch,{backgroundColor:isContain(this.state.star,2)?'#faad94':'white',borderLeftWidth:0,borderRightWidth:0}]} onPress={()=>this.starEvent(2)}>
                        <Text style={[starStyle.starText,{color:isContain(this.state.star,2)?'white':'#333'}]}>经济</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[starStyle.starTouch,{backgroundColor:isContain(this.state.star,3)?'#faad94':'white'}]} onPress={()=>this.starEvent(3)}>
                        <Text style={[starStyle.starText,{color:isContain(this.state.star,3)?'white':'#333'}]}>三星</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[starStyle.starTouch,{backgroundColor:isContain(this.state.star,4)?'#faad94':'white',borderLeftWidth:0,borderRightWidth:0}]} onPress={()=>this.starEvent(4)}>
                        <Text style={[starStyle.starText,{color:isContain(this.state.star,4)?'white':'#333'}]}>四星</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[starStyle.starTouch,{backgroundColor:isContain(this.state.star,5)?'#faad94':'white'}]} onPress={()=>this.starEvent(5)}>
                        <Text style={[starStyle.starText,{color:isContain(this.state.star,5)?'white':'#333'}]}>五星</Text>
                    </TouchableOpacity>
                </View>
                <View style={starStyle.textView}>
                    <Text style={starStyle.text}>
                        价格
                    </Text>
                </View>
                <View style={{flexDirection:'column',justifyContent:'flex-end',height:70,marginLeft:25}}>
                    <MultiSlider min={0} max={850} step={50} values={[this.state.low,this.state.high]} sliderLength={WinWidth-50} onValuesChangeFinish={this.onValuesChangeFinish}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginBottom:20}}>
                    <TouchableOpacity
                        style={[starStyle.Button,{borderWidth:1,marginLeft:20}]}
                        onPress={()=>this.cancelEvent()}
                    >
                        <Text style={{color:(isContain(this.state.star,0||this.state.low||this.state.high!=850))?'#e5e5e5':'#333',fontSize:16}}>清空</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[starStyle.Button,{backgroundColor:'#ed7140',marginRight:20}]}
                        onPress={()=>this.sureEvent()}
                    >
                        <Text style={{color:'white',fontSize:16}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const starStyle = StyleSheet.create({
    titleView:{
        backgroundColor:'#ed7140',
        height:44,
        justifyContent:'center',
        alignItems:'center',
    },
    textView: {
        flexDirection:'column',
        justifyContent:'center',
        marginLeft:15,
        height:50,
        marginTop:5
    },
    text: {
        fontSize:14
    },
    starlevel: {
        marginLeft:20,
        marginRight:20,
        height:50,
        backgroundColor:'white'
    },
    starTouch: {
        flex:1,
        marginTop:0,
        marginBottom:0,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#e5e5e5'
    },
    starText: {
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center'
    },
    Button: {
        justifyContent:'center',
        alignItems:'center',
        width:WinWidth/2-30,
        height:45,
        borderColor:'#e5e5e5',
        borderRadius:5,
    },

})

function isContain(arr, val){
    for(var i=0; i<arr.length; i++){
        if(arr[i] == val)
            return true;
    }
    return false;
}

function sliceOne(arr,val){
    for(var i=0; i<arr.length; i++){
        if(arr.length!=1&&arr[i] == val){
            arr.splice(i,1)
        }

    }
}