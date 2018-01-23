/**
 * Created by shane on 16/9/3.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    ListView,
    NativeModules,
    TouchableOpacity
} from 'react-native';
import {getDate, getDayOfWeek} from '../common/comm';
import * as NATIVE from '../../native'
import {
    selectPlaceEvent,getCityEvent
} from '../../native'


export default class RenderCell extends Component {

    constructor(props) {
        super(props);
        if (this.props.rowID == 0) {
            this.state = {
                defaultCity: '出发地',
                defaultDate: '出发时间',
                city: this.getCityFrom(),
                date: this.props.rowData.departDate,
                cycleColor: getCycleColor(this.props.rowData.trafficFrom, this.props.rowData.departDate, this.props.rowID),
            }
        }
        else {
            this.state = {
                defaultCity: '目的地',
                defaultDate: '到达时间',
                city: this.getCityTo(),
                date: this.props.rowData.departDate,
                cycleColor: getCycleColor(this.props.rowData.trafficTo, this.props.rowData.departDate, this.props.rowID),
            }
        }

        this.map = {
            lat: null,
            lng: null,
        }

        this.cityChanged = this.cityChanged.bind(this)
    }

    componentWillReceiveProps() {
        //console.log('componentWillReceiveProps===>' + JSON.stringify(this.props.rowData) +'==' + this.props.rowID)
        if (this.props.rowID == 0) {
            this.state = {
                defaultCity: '出发地',
                defaultDate: '出发时间',
                city: this.getCityFrom(),
                date: this.props.rowData.departDate,
                cycleColor: getCycleColor(this.props.rowData.trafficFrom, this.props.rowData.departDate, this.props.rowID)
            }
        }
        else {
            //alert(JSON.stringify(this.props.rowData))
            this.state = {
                defaultCity: '目的地',
                defaultDate: '到达时间',
                city: this.getCityTo(),
                date: this.props.rowData.departDate,
                cycleColor: getCycleColor(this.props.rowData.trafficTo, this.props.rowData.departDate, this.props.rowID)
            }
        }
    }

    getCityFrom(){
        let city = this.props.rowData.trafficFrom;
        if (this.props.rowData.trafficFrom.length>0){
            var {from} = this.props.rowData;
            if (from && from.location){
                city = city + "-" + this.props.rowData.from.location ;
            }
            else
                city = city
                // city = city + "-" + "null";
        }
        return city;
    }

    getCityTo(){
        let city = this.props.rowData.trafficTo;
        if (this.props.rowData.trafficTo.length>0) {
            var {to} = this.props.rowData;
            if (to && to.location){
                city = city + "-" + this.props.rowData.to.location;
            }
            else
                city = city
                // city = city + "-" + "null";
        }
        return city;
    }

    render() {
        if (this.props.rowID == 0) {
            return (

                <View style={{backgroundColor: 'white', flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', height: 49.5}}>
                        <View style={{flexDirection: 'column', width: 35}}>
                            <View style={[style.cycle, {
                                marginLeft: 15,
                                marginTop: 20,
                                borderColor: this.state.cycleColor
                            }]}>
                            </View>
                            <RenderPoint style={{
                                marginLeft: 15,
                                width: 10,
                                height: 20,
                                flexDirection: 'column-reverse',
                                alignItems: 'flex-end'
                            }}>
                            </RenderPoint>
                        </View>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={this.cityChanged.bind(this)}>
                            <Text style={[style.city, {color: this.state.city.length ? '#333333' : 'lightgray'}]}>
                                {this.state.city.length ? this.state.city : this.state.defaultCity}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor: '#e5e5e5', marginLeft: 35, marginRight: 15, height: 0.5}}>

                    </View>
                </View>
            )
        }
        else if (this.props.rowID < this.props.rowNum - 1) {
            return (
                <View style={{backgroundColor: 'white', flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', height: 49.5}}>
                        <View style={{flexDirection: 'column', width: 35}}>
                            <RenderPoint style={{
                                marginLeft: 15,
                                width: 10,
                                height: 20,
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                            </RenderPoint>
                            <View style={[style.cycle, {
                                marginLeft: 15,
                                marginTop: 0,
                                borderColor: this.state.cycleColor
                            }]}>
                            </View>
                            <RenderPoint style={{
                                marginLeft: 15,
                                width: 10,
                                height: 20,
                                flexDirection: 'column-reverse',
                                alignItems: 'flex-end'
                            }}>
                            </RenderPoint>
                        </View>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={this.cityChanged.bind(this)}>
                            <Text style={[style.city, {color: this.state.city.length ? '#333333' : 'lightgray'}]}>
                                {this.state.city.length ? this.state.city : this.state.defaultCity}
                            </Text>
                        </TouchableOpacity>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={{flex:1,justifyContent:'center'}}
                            onPress={()=>this.dateChanged()}>
                            <Text style={[style.date,{color:this.state.date.length?'#333333':'lightgray'}]}>
                            {/*{this.state.date.length?getDate(this.state.date):this.state.defaultDate}*/}
                            </Text>
                            </TouchableOpacity>
                            {this.props.showDelBtn() ?   <TouchableOpacity style={{
                                flex: 0, flexDirection: 'row',
                                marginLeft: 15, marginRight: 15, alignSelf: 'center', justifyContent: 'center'
                            }}
                                                                           onPress={()=>this.remove()}>
                                <Image source={require('../img/xingchengshanchu.png')}>

                                </Image>
                            </TouchableOpacity> : null}

                        </View>
                    </View>

                    <TouchableOpacity style={{marginLeft: 13, marginTop: 5, marginBottom: 5}}
                                      onPress={()=>this.dateChanged()}>
                        <View style={style.line_new}></View>
                        {this.state.date ? <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            color: '#999999'
                        }}>到达时间   <Text style={{color:'#333333'}}>{this.dateParse(this.state.date)}</Text></Text> : <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            color: '#999999'
                        }}>{this.state.defaultDate}</Text>}
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e5e5e5', marginLeft: 35, marginRight: 15, height: 0.5}}>

                    </View>
                </View>
            )
        }
        else {
            return (

                <View style={{backgroundColor: 'white', flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', height: 50}}>
                        <View style={{flexDirection: 'column', width: 35}}>
                            <RenderPoint style={{
                                marginLeft: 15,
                                width: 10,
                                height: 20,
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                            </RenderPoint>
                            <View style={[style.cycle, {
                                marginLeft: 15,
                                marginTop: 0,
                                borderColor: this.state.cycleColor
                            }]}>
                            </View>
                        </View>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={this.cityChanged.bind(this)}>
                            <Text style={[style.city, {color: this.state.city.length ? '#333333' : 'lightgray'}]}>
                                {this.state.city.length ? this.state.city : this.state.defaultCity}
                            </Text>
                        </TouchableOpacity>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={{flex:1,justifyContent:'center'}}
                            onPress={()=>this.dateChanged()}>
                            <Text style={[style.date,{color:this.state.date.length?'#333333':'lightgray'}]}>
                            {/*{this.state.date.length?getDate(this.state.date):this.state.defaultDate}*/}
                            </Text>
                            </TouchableOpacity>
                            {this.props.showDelBtn() ?  <TouchableOpacity style={{
                                flex: 0, flexDirection: 'row',
                                marginLeft: 15, marginRight: 15, alignSelf: 'center', justifyContent: 'center'
                            }}
                                                                          onPress={()=>this.remove()}>
                                <Image source={require('../img/xingchengshanchu.png')}>

                                </Image>
                            </TouchableOpacity> : null}

                        </View>
                    </View>

                    <TouchableOpacity style={{marginLeft: 13, marginTop: 5, marginBottom: 5}}
                                      onPress={()=>this.dateChanged()}>
                        <View style={style.line_new}></View>
                        {this.state.date ? <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            color: '#999999'
                        }}>到达时间   <Text style={{color:'#333333'}}>{this.dateParse(this.state.date)}</Text></Text> : <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            color: '#999999'
                        }}>{this.state.defaultDate}</Text>}
                    </TouchableOpacity>

                </View>
            )
        }

    }

    clone(obj){
        var o;
        if(typeof obj == "object"){
            if(obj === null){
                o = null;
            }else{
                if(obj instanceof Array){
                    o = [];
                    for(var i = 0, len = obj.length; i < len; i++){
                        o.push(this.clone(obj[i]));
                    }
                }else{
                    o = {};
                    for(var k in obj){
                        o[k] = this.clone(obj[k]);
                    }
                }
            }
        }else{
            o = obj;
        }
        return o;
    }

    cityChanged() {
        var data = Number(this.props.rowID) === 0 ? this.clone(this.props.rowData.from) : this.clone(this.props.rowData.to)
        if(data == null) {
            var cityName = this.props.rowData.key === 2 ?  this.props.rowData.trafficFrom : this.props.rowData.trafficTo
            if(cityName === null || cityName === '') cityName = '北京'
            if(getCityEvent){
                getCityEvent(cityName,(error,result) => {
                    if(result === null){
                        data = {}
                    }else{
                        data = {
                            cityName: cityName,
                            cityId: result.id,
                        }
                    }
                    if(selectPlaceEvent){
                        data.carType = Number(this.props.rowID) === 0 ? 'from' : 'to'
                        if(this.map.lat) data.lat = this.map.lat
                        if(this.map.lng) data.lng = this.map.lng
                        selectPlaceEvent(data,(err,result)=>{
                            this.setState({
                                city: result.location,
                            })
                            this.map.lat = result.lat
                            this.map.lng = result.lng
                            console.log('==>' + JSON.stringify(result))
                            this.props.changeCityCallBack(result,this.props.rowID)

                        })
                    }
                })
            }
        }else{
            if(selectPlaceEvent){
                data.carType = Number(this.props.rowID) === 0 ? 'from' : 'to'
                if(this.map.lat) data.lat = this.map.lat
                if(this.map.lng) data.lng = this.map.lng
                selectPlaceEvent(data,(err,result)=>{
                    this.setState({
                        city: result.location,
                    })
                    this.map.lat = result.lat
                    this.map.lng = result.lng
                    console.log('==>' + JSON.stringify(result))
                    this.props.changeCityCallBack(result,this.props.rowID)
                })
            }
        }


        // cityEvent((error, result)=> {
        //     if (error) {
        //
        //     }
        //     else {
        //         let col = getCycleColor(result.name, this.state.date, this.props.rowID)
        //         this.setState({city: result.name, cycleColor: col})
        //         if (this.props.changeCityCallBack) {
        //             this.props.changeCityCallBack(result.name, this.props.rowID)
        //         }
        //     }
        // })
    }

    dateChanged() {
        this.props.openPicker(this.state.date,this.props.rowID,this.dateCallback.bind(this))
        // dateEvent((error,result)=>{
        //     if(error){
        //
        //     }
        //     else {
        //         let col = getCycleColor(this.state.city,result,this.props.rowID)
        //         this.setState({date: result,cycleColor:col})
        //         if(this.props.changeDateCallBack){
        //             this.props.changeDateCallBack(result,this.props.rowID)
        //         }
        //     }
        // })
    }

    dateParse(){
        if (!this.state.date) return null;
        var split = this.state.date.split(' ');
        var parseDate = split[0].split('-')
        if(split.length >1)
         var parseTime = split[1].split(':')
        // var year = this.state.date.getFullYear()
        // var month = this.state.date.getMonth()
        // var day = this.state.date.getDate()
        // var hour = this.state.date.getHours()
        // var mintue = this.state.date.getMinutes()
        var time = (parseTime && parseTime.length > 1) ? parseTime[0] + ':' + parseTime[1] : ''
        return parseDate[1] + '月' + parseDate[2] + '日   ' + time
    }

    dateCallback(date) {
        //this.props.rowData.departDate = date
        this.props.updateData(this.props.rowID,this.props.rowData)
        this.setState({
            date: date,
        })
    }

    remove() {
        if (this.props.deleteCallBack) {
            this.props.deleteCallBack(this.props.rowID)
        }
    }

}

var style = StyleSheet.create({
    view: {
        flexDirection: 'row',
        height: 49.5
    },
    line: {
        backgroundColor: '#e5e5e5',
        marginLeft: 35,
        marginRight: 15,
        height: 0.5
    },
    line_new: {
        backgroundColor: '#e5e5e5',
        marginLeft: 20,
        marginRight: 15,
        height: 0.5
    },
    cycle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1.5,
    },
    city: {
        //flex:1,
        flexDirection: 'row',
        textAlign: 'left',
        fontSize: 15,
        //color:'lightgray'
        //color:'#333333'
    },
    date: {
        //flex:1,
        flexDirection: 'row',
        textAlign: 'right',
        fontSize: 15,
        //color:'#333333'
    }

})

function getCycleColor(city, date, id) {
    //alert(city+'\n'+date)
    if (city && city.length && date && date.length) {
        if (id == 0) {
            return '#faad94'
        }
        else
            return '#449ff7'
    }
    else
        return '#c6c6c6'
}

class RenderPoint extends Component {
    //demo
    //viewStyle:{marginLeft:15,width:10,height:20,flexDirection:'column-reverse',alignItems:'flex-end'}
    constructor(props) {
        super(props)
        this.state = ({
            viewStyle: this.props.style,
            pointStyle: {
                alignSelf: 'center',
                marginBottom: 2,
                width: 2,
                height: 2,
                borderRadius: 1,
                backgroundColor: '#c6c6c6'
            }
        })
    }

    render() {
        return (
            <View style={this.state.viewStyle}>
                <View style={this.state.pointStyle}></View>
                <View style={this.state.pointStyle}></View>
                <View style={this.state.pointStyle}></View>
            </View>
        )
    }
}

function cityEvent(callBack) {
    NativeModules.NativeModule.cityEvent(callBack)
}

function dateEvent(callBack) {
    NativeModules.NativeModule.dateEvent(callBack)
}