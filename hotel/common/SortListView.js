/*
    Created By gaoyh 16/10/17
    SortListView
* */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    PixelRatio,
    Image,
    Modal,
} from 'react-native';
import images from '../images/';
import * as listData from './SortListViewData';
import * as comm from './comm';
let tabs = new Array() //数据源
let sort//选中的行
let startEntryTime = 14//开始时间
var arrayLenth = 24+6//结束时间

let begainEntryTime = 14

 export  function  getStartHour(props)
    {
        var nowTime = new Date()

        var date = nowTime.getDate()//日
        var hours = nowTime.getHours()//时
        var minutes = nowTime.getMinutes()//分
        var month = nowTime.getMonth()//月


        begainEntryTime = startEntryTime
        // let enTime = props.dateLater
        // let nowFormat = comm.getNowFormatDate()
        // let dif = comm.getDateDiffer(enTime,nowFormat)
        //
        // alert(enTime +'/'+ nowTime+'/'+dif )
        if (comm.getDateDiffer(props.dateLater,comm.getNowFormatDate()) == 0) {

// || (hours == startEntryTime && minutes >=30)
            if (hours>=startEntryTime ) {
              begainEntryTime = hours+1;
            }
            if (minutes >= 30) {
              begainEntryTime += 1;
            }

        }

        // return index
        return begainEntryTime

    }

export function  createEntryTimeArray(props){

        var index  = getStartHour(props)
        var timeArray = new Array();
        while(index<=arrayLenth)
        {
            let time = getTimeString(index)
            let detailStr  =  getDetailString(index,props);
            timeArray.push(
                {
                    sort:time,
                    title:time,
                    guarantee: detailStr.length?true:false,
                    detail: detailStr
                }
                )
            index += 1;
        }
        return timeArray

    }



  export  function    getTimeString(index)
        {
            var hour = parseInt(index)>23?parseInt(index)-24:parseInt(index)
            var minute = (index - parseInt(index))*60
            var time = (hour<=6?'0'+hour:hour) + ':' + (minute==0?'00':minute);
            if (time == '00:00') {
              time = '23:59'
            }
            return time
        }
  export  function   getDetailString(timeNumber,props){

            if (props.startTime) {

                let startGCostTime = parseFloat(props.startTime);
                let endGCostTime = parseFloat(props.endTime);

                if (endGCostTime<startGCostTime) {
                    endGCostTime += 24
                }
                if (timeNumber>startGCostTime
                    && timeNumber <= endGCostTime) {
                    return ' 需担保（担保费'+props.guaranteeCost+'）'
                }
                return ''
            }
            return ''
        }
export class SortListView extends Component{

    constructor(props){
        super(props);

        if (props.dataType=='entryTime' ) {


          tabs = createEntryTimeArray(props);
          //  tabs =  this.props.dataSource?thiss.props.dataSource:createEntryTimeArray(props);
           let selectedRow = (begainEntryTime == startEntryTime) ?0:(tabs.length>=2?2:tabs.length);

           sort = this.props.sort?this.props.sort:this.getRowSort(tabs[selectedRow],selectedRow);

        } else
          if (props.dataSource) {
              tabs = props.dataSource;
              sort = this.props.sort?this.props.sort:this.getRowSort(tabs[0],0);
          }

         var ds =  new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !==r2 })

        this.state = {
            dataSource: ds.cloneWithRows(tabs),
            titleString: props.titleString?props.titleString:'最晚到店时间'
        }

    }

//获取每行的key
    getRowSort(rowData,rowIndex) {

        return rowData.sort?rowData.sort:String(rowIndex)
    }


    selected(rowData,rowID){

        ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !==r2 })
        sort = this.getRowSort(rowData,rowID)
        this.setState({
            dataSource: ds.cloneWithRows(tabs),
        });


    	if (this.props.callback) {

            if (this.props.dataType=='entryTime' ) {
                let backData = {
                    'time': rowData.title,
                    'guarantee': rowData.guarantee,
                    'detail':rowData.detailStr
                }
                this.props.callback(backData)
            }else{
    		  this.props.callback(sort)
            }
    	}
    }
    checkIfSelectedRow(rowSort){
    	return rowSort == sort
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => { this.selected(rowData,rowID) }} >
                <View>
                    <View style={styles.row}>
                        <Text style={{flex:0,fontSize:16,marginLeft:0}}>{rowData.title}</Text>
                        <Text style={{flex:1,fontSize:16,marginLeft:0, color: '#999999'}}>{rowData.detail}</Text>

 						{this.checkIfSelectedRow(this.getRowSort(rowData,rowID))
 							?<Image source={images['sortListRight']} style={{height: 13, width: 13}}></Image>
                       		:null
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _disMissSelf(){
        if (this.props.disMissCallback) {
            this.props.disMissCallback()
        }
    }


    render() {
        return (
        	// <View style = {{flex: 1, flexDirection:'column',justifyContent:'flex-end',backgroundColor: 'transparent'}} >
        	<View style = {{ flexDirection:'column',justifyContent:'flex-end',backgroundColor: 'transparent'}} >
					<TouchableOpacity onPress={() => { this._disMissSelf() }} style = {{flex: 1}}>
        				<View style = {{flex: 1 ,flexDirection: 'column',justifyContent:(this.props.showStyle=='bottom')?'flex-end':'flex-start',backgroundColor: 'transparent'}}>

        					<View style={{flex: 1 , flexDirection: 'column' ,justifyContent:'flex-end',backgroundColor:'white' }}>
                                {(this.props.showStyle == 'bottom')?
                                <View style={styles.bottomTitle}>
                                        <Text style={{textAlign: 'center',color: 'white', fontSize:14}}>{this.state.titleString}</Text>
                                </View>
                                :null}

        	        			<ListView style = {{maxHeight:300}}
            		    			dataSource={this.state.dataSource}
                					renderRow={this.renderRow.bind(this)}
                					selecImgId = {this.state.selecImgId}
            						>
            					</ListView>
        					</View>
        				</View>
        			</TouchableOpacity>

			</View>

        );
    }
}
var styles = StyleSheet.create({
	 container: {
        //position: 'absolute',
        backgroundColor: 'white',
        //zIndex: 2,
        flexDirection: 'column',

        justifyContent:'flex-end'
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f6f6f6',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor:'#e5e5e5'
    },
    thumb: {
        width: 50,
        height: 50,
    },
    bottomTitle: {
        flex: 0 ,
        height: 33.75,
        flexDirection: 'column' ,
        justifyContent:'center',
        backgroundColor: '#ed7140'
    },

});

//export default SortListView;
