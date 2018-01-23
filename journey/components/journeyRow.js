/**
 * Created by yonyou on 16/7/6.
 */
import React from 'react';
import {NativeModules} from 'react-native';//ios/android原生混编react native
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ListView,
} from 'react-native';
let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

import getdepartDate from '../common/getDepartDate';
import moment from 'moment';
import HotelOrder from '../components/hotelOrder';
import TrainOrder from '../components/trainOrder';
import PlaneOrder from '../components/planeOrder';
import NoJourneyTrainOrder from '../components/noJouneryTrainOrder';
import NoJourneyPlaneOrder from '../components/noJourneyPlaneOrder';
import NoJourneyHotelrder from '../components/noJourneyHotelOrder';
import {fetchJourney} from '../actions/strollingActions';

let canLoadMore = false;
let canLoadHisMore = false;
let isLoading = false;
let clickRowId = 0;
let clickSectionId = 0;
let clickShen = -1;
let clickShenSectionId = -1;

export default class JourneyRow extends React.Component {

    constructor(props){
        super(props);
        this._renderRow = this._renderRow.bind(this);
        //this._renderRow2 = this._renderRow2.bind(this);
        //this._renderRow3 = this._renderRow3.bind(this);
        this.state={
            dataSource:new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            show:false,
        }
    }

    render() {
        const {data} = this.props;
        const {Strolling} = this.props;
        const {sectionID} = this.props;
        const {rowID} = this.props;
        //console.log(rowID);
        let dataDetail = Strolling.journeyDetail;
        // let detailDeparDate ='';
        // if(dataDetail.length>0){
        //     detailDeparDate = dataDetail[0].departDate;
        //     arriveCity = dataDetail[0].arriveCity;
        // }

        if(data.travel) {//查看自己的行程
            let DATA = data.travel;
            switch (DATA.type) {

                case "飞机":
                    return (
                        <View style={{paddingRight:10}}>
                            <View>
                                <PlaneOrder data={DATA} pubPriType={data.pubPriType} flightDynamic={'航班动态'}/>
                            </View>
                        </View>

                    )
                case "火车":
                    return (
                        <View style={{paddingRight:10}}>
                            <View>
                                <TrainOrder data={DATA} pubPriType={data.pubPriType}/>
                            </View>
                        </View>
                    )
                case "酒店":
                    return (
                        <View style={{paddingRight:10}}>
                            <View>
                                <HotelOrder data={DATA} pubPriType={data.pubPriType}/>
                            </View>
                        </View>

                    )
                default:
                    return (
                        <View></View>
                    )

            }

            }else if(data.detailId == 0){//部门人员未关联申请单

                    switch (data.type) {

                        case "飞机票":
                            return (
                                <View style={{paddingRight:10}}>
                                    <NoJourneyPlaneOrder data={data}/>
                                </View>
                            )
                        case "火车票":
                            return (
                                <View style={{paddingRight:10}}>
                                    <NoJourneyTrainOrder data={data}/>
                                </View>
                            )
                        case "酒店":
                            return (
                                <View style={{paddingRight:10}}>
                                    <NoJourneyHotelrder data={data}/>
                                </View>
                            )
                        default:
                            return (
                                <View></View>
                            )

                    }

            }else{//部门人员关联申请单
            return (
                <View style={{paddingRight:10}}>
                    {dataDetail.length>0 && (clickRowId==rowID) && (clickSectionId==sectionID)?
                        <View></View> :
                        <TouchableOpacity
                            onPress={this._showJourneyList.bind(this,data,sectionID,rowID)}
                            activeOpacity={data.hasTicket?0:1}
                            disabled={data.hasTicket?false:true}
                        >
                            <View>
                                <View style={styles.journeyLine}>
                                    <View style={styles.journeyLineIn}>
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{flex:4,flexDirection:'row'}}>
                                                <Text style={{color:'#666'}}>{data.toCity}</Text>
                                                <Text style={{color:'#666'}}>{this._personJourneyDays()}</Text>

                                            </View>
                                            <View style={{flex:2,flexDirection:'row',justifyContent:'flex-end'}}>
                                                <Text style={{textAlign:'right',color:'#666'}}>{data.staffName}</Text>
                                                {data.hasTicket?
                                                    <View style={{width:10,marginLeft:6}}>
                                                        <View style={styles.arrowLeftLine}></View>
                                                        <View style={styles.arrowRightLine}></View>
                                                    </View>:
                                                    <View></View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',marginTop:5}}>
                                            <Text style={{color:'#666',flex:8}}>{data.reason}</Text>
                                            {data.detailId?
                                                <TouchableOpacity
                                                    style={{paddingTop:2,paddingBottom:2,paddingLeft:2,flex:2}}
                                                    onPress={this._turnToShen.bind(this,data,sectionID,rowID)}
                                                >
                                                        <Text style={{color:'#449ff7',fontSize:12,textAlign:'right',paddingRight:data.hasTicket?15:0}}>申请单</Text>
                                                </TouchableOpacity>:
                                                <View></View>
                                            }
                                        </View>
                                    </View>
                                </View>
            
                            </View>
                        </TouchableOpacity>
                    }
                    {dataDetail.length>0 && (clickRowId==rowID) && (clickSectionId==sectionID)?
                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(dataDetail)}
                            renderRow={this._renderRow}
                        /> :
                        <View></View>
                    }
            
                </View>
            )
        }

    }
    //直接下属和所有下属行程,挂在申请单上(即有行程)展示
    _renderRow(datai,sectionID,rowID){
        //console.log(datai);
        const {data} = this.props;
        datai.toCity = data.toCity;
        datai.name = data.staffName;
        datai.reason = data.reason;
        datai.startDate = data.startDate;
        datai.endDate = data.endDate;
        datai.detailId = data.detailId;
        datai.applicationId = data.applicationId;
        switch (datai.type) {

            case "飞机":
                return (
                <View>
                    <View>
                        <PlaneOrder data={datai} pubPriType={datai.pubPriType}/>
                    </View>
                </View>

                )
            case "火车":
                return (
                <View>
                    <View>
                        <TrainOrder data={datai} pubPriType={datai.pubPriType}/>
                    </View>
                </View>
                )
            case "酒店":
                return (
                <View>
                    <View>
                        <HotelOrder data={datai} pubPriType={datai.pubPriType}/>
                    </View>
                </View>

                )

        }
    }

    _showJourneyList(data,sectionID,rowID){
        const {dispatch} = this.props;
        clickRowId = rowID;
        clickSectionId = sectionID;
        let opts = {
            //'date': data.startDate,
            'date': sectionID,
            'detailId': data.detailId,
            'passengerId':data.staffId,
            'querySourceType':2
        }

        dispatch(fetchJourney( opts, false, false, false ));
    }
    _personJourneyDays(){
        let sdDay = parseInt(this.props.data.startDate.substring(8,10));
        let edDay = parseInt(this.props.data.endDate.substring(8,10));
        return sdDay+'日—'+edDay+'日';
        
    }
    _turnToShen(data,sectionID,rowID){
        if(clickShen != 1){
            clickShen = 1;
            YYRNBridgeModule.openMissionWithID(data.applicationId);

        }
        setTimeout(function () {
            clickShen = -1;
        },1500);

    }

}

const styles = StyleSheet.create({
    journeyLine:{
        marginLeft:5,
        borderStyle:'solid',
        borderLeftWidth:1,
        borderColor:'#dad9d7',
        paddingLeft:5,
        //marginRight:10,

    },
    journeyLineIn:{
        //flexDirection:'row',
        backgroundColor:'#fff',
        //flex:1,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
        //height:40,
        alignItems:'center',
        marginBottom:16,
        borderRadius:3,
        borderBottomWidth:1,
        borderColor:'#BDBDBD',
        borderStyle:'solid',
        borderLeftWidth:1,
        borderLeftColor:'#E1E1E1',
        borderStyle:'solid',
        borderRightWidth:1,
        borderRightColor:'#E1E1E1',
        borderStyle:'solid',
        marginTop:10
    },
    shenIcon:{
        backgroundColor:'#FFB400',
        borderRadius:10,
        paddingLeft:2,
        paddingRight:2,
        //paddingTop:2,//ios device
        //paddingBottom:2,//ios device
        //marginTop:3,
        marginRight:3,
        //width:10,
        //height:10
    },
    arrowLeftLine:{
        width:6,
        height:1,
        backgroundColor:'#666',
        marginTop:7,
        transform:[{rotate: '45deg'}],
    },
    arrowRightLine:{
        width:6,
        height:1,
        backgroundColor:'#666',
        marginTop:-1,
        marginLeft:4,
        transform:[{rotate: '-45deg'}],
    }

})
