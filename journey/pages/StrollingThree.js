/**
 * Created by chenty on 16/6/25.
 */
import React from 'react';
import {NativeModules} from 'react-native';//ios原生混编react native
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Navigator,
    View,
    ListView,
    RefreshControl,
    Image,
    InteractionManager,
    DeviceEventEmitter,
    //Animated,
    ToastAndroid,
    ScrollView,
    PanResponder,
    Platform,
} from 'react-native';
import {fetchJourney} from '../actions/strollingActions';
import Loading from '../components/Loading';
import JourneyRow from '../components/journeyRow';
import Header from '../components/Header';
import LoadMoreFooter from '../components/LoadMoreFooter';
import moment from 'moment';
import {commondispatchrefresh} from '../common/commonDispatch';
import {commondispatchonendreached} from '../common/commonDispatch';
import {commondispatchtodayandfuthur} from '../common/commonDispatch';
import {receiveTodayBtn} from '../actions/strollingActions';
import {receiveCalenderDate} from '../actions/strollingActions';
import {receiveCalenderYearmonth} from '../actions/strollingActions';
import {receiveCalenderViewHeight} from '../actions/strollingActions';
import {receiveCalenderHeight} from '../actions/strollingActions';
import {receiveRefreshOption} from '../actions/strollingActions';
import Common from '../common/constants';
import getdepartDate from '../common/getDepartDate';

let YYRNBridgeModule = NativeModules.YYRNBridgeModule;

let canLoadMore = 'newData';
let canLoadHisMore = false;
let isLoading = true;
let today = moment().format("YYYY-MM-DD");
let year = moment().year();
let month = moment().month()+1;
let opts = {
    'date': today,
    'dateType': 2,
    'scrollType': 1,
    //index':0,
    'pageCapacity':7,
    'childrenPrivilege': null,
    'departmentPrvilege':null,
    'querySourceType':0
}
let optsCalenderDate = {
    'year':year,
    'month':month,
    'queryType':1,
    'calenderDate':true
}

let sids = [];
let datas = [];
let theDispatch;
let gestureSystem = false;
let calenderH;

export default class Main extends React.Component {
    //const {dispatch} = this.props;

    constructor(props) {
        super(props);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataSource: new ListView.DataSource({
                getRowData: (data, sectionID, rowID) => {
                    return data[sectionID][rowID];
                },
                getSectionHeaderData: (data, sectionID) => {
                    return data[sectionID];
                },
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (section1, section2) => section1 !== section2,

            }),

        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(fetchJourney( optsCalenderDate, 'newData', canLoadHisMore, isLoading));
            dispatch(fetchJourney( opts, 'newData', canLoadHisMore, isLoading));
        });
        gestureSystem=false;
    }
    /* 具有上滑加载下属行程功能,暂时不加
    componentWillMount(){
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) =>
            {
              if(gestureSystem){
                  console.log('0');
                  return true;
              }
                return false;
            },

            onMoveShouldSetPanResponder: (evt, gestureState) =>
            {
                if(gestureSystem){
                    console.log('1');
                    return true;
                }
                return false;
            },

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

                // gestureState.{x,y}0 现在会被设置为0
            },
            onPanResponderMove:this._handlePanResponderRelease.bind(this),

            // onPanResponderMove: (evt, gestureState) => {
            //     // 最近一次的移动距离为gestureState.move{X,Y}
            //
            //     // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            // },


            onPanResponderRelease: this._handlePanResponderRelease.bind(this),


        });
    }
    componentWillReceiveProps(gestureSystem){
        this.setState({
            likesIncreasing: gestureSystem.likeCount > this.props.likeCount
        });
    }

    _handlePanResponderRelease(e: Object, gestureState: Object) {
        gestureSystem = false;
        if(gestureState.dy<=-10){
            const {dispatch} = this.props;
            const {Strolling} = this.props;
            let canReachedEnd = Strolling.canOnReachedEnd;
            let queryType = Strolling.queryType;
            let childrenPrivilege = Strolling.childrenPrivilege;
            let departmentPrvilege = Strolling.departmentPrvilege;
            let isEnd = Strolling.isEnd;
            let toDepartment = Strolling.toDepartment;
            let thedate = sids[sids.length-1];
            let date = moment(thedate).add(1,'day').format('YYYY-MM-DD');
            setTimeout(function () {
                commondispatchonendreached(dispatch,queryType,childrenPrivilege,departmentPrvilege,date,isEnd,toDepartment,canLoadMore);
            },500);

        }

    }*/

    render() {
        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let isEnd = Strolling.isEnd;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        let journey = Strolling.journey;
        let queryType = Strolling.queryType;
        let calenderYm = Strolling.calenderYm;
        let calenderHeight = Strolling.calenderHeight;
        let calenderViewHeight = Strolling.calenderViewHeight;
        let monthCalenderDate = Strolling.monthCalenderDate;
        let requireData = journey;

        /*具有上滑加载下属功能,暂时不加
        //触发滑动手势
        if(queryType==1 && isEnd && (childrenPrivilege || departmentPrvilege)){
            gestureSystem=true;
        }
        */

        let sourceData={};
        let sectionIDs=[];
        let sectionids=[];
        let rowIDs =[];
        let row=[];
        let RowData = [];
        //获取月份日期和出差员工的名字
        let calenderDates=[];
        let calenderNames =[];
        if(monthCalenderDate){
            calenderDates = Object.keys(monthCalenderDate);
            for(let i=0;i<calenderDates.length;i++){
                calenderNames.push(monthCalenderDate[calenderDates[i]]);
            }

        }

        theDispatch = dispatch;
        calenderH = calenderViewHeight;

            //获取sectionIDs
            for(let i=0;i<requireData.length;i++){
                sectionids.push(Object.keys(requireData[i]))
            }

            for(let i=0;i<sectionids.length;i++){
                sectionIDs.push(sectionids[i][0]);
            }
            sids=sectionIDs;
            //console.log(sectionIDs);
            //获取rowIDs
            for(let y=0;y<requireData.length;y++){
                RowData.push(requireData[y][sectionIDs[y]]);//数据重组时使用
                let row=[];
                for(let m=0;m<requireData[y][sectionIDs[y]].length;m++){
                    row.push(m);
                }
                rowIDs.push(row);
            }

            //重组数据
            for(let i=0;i<sectionIDs.length;i++){
                sourceData[sectionIDs[i]]=RowData[i];
            }
            datas = sourceData;
        //height:calenderHeight-6  //android device
        //height:calenderHeight+15 //ios device
        //{...this._panResponder.panHandlers}

        return (


               <View style={styles.wrapper}>

                <View>
                    <Header calenderYm={calenderYm} dispatch={dispatch} queryType={queryType} journeyDates={calenderDates} journeyNames={calenderNames} childrenPrivilege={childrenPrivilege} departmentPrvilege={departmentPrvilege} calenderViewHeight={calenderViewHeight}/>
                </View>
                   <View style={{height:calenderHeight,paddingLeft:10}}>

                {Strolling.isLoading || Strolling.calenderLoading?
                    <Loading /> :

                    <ListView
                        dataSource={this.state.dataSource.cloneWithRowsAndSections(sourceData,sectionIDs,rowIDs)}
                        renderSectionHeader={this._renderSectionHeader}
                        renderRow={this._renderRow}
                        initialListSize={1}
                        onScroll={this._onScroll}
                        onEndReached={this._onEndReach.bind(this)}
                        onEndReachedThreshold={20}
                        renderFooter={this._renderFooter.bind(this)}
                        style={{marginTop:18}}
                        enableEmptySections={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={Strolling.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                title="下拉查看历史记录"
                                tintColor="#999"

                            />
                        }

                    />

                }
                       </View>
                    <TouchableOpacity style={Strolling.showTodayBtn ?styles.todayBtnBox:styles.todayBtnNone} onPress={this._todayBtn.bind(this)}>
                        <Image
                            source={require('../img/today.png')}
                            style={{width:56,height:56}}
                        />
                    </TouchableOpacity>
            </View>
        );

    }

    _renderSectionHeader(data,sectionID){
        let showDate = this._showDate(sectionID);
        return (
            <View style={{flexDirection:'row',backgroundColor:'#f3f3f3'}}>
                <View style={{backgroundColor:'#FFB400',flexDirection:'row',alignItems:'center',height:18,paddingLeft:10,paddingRight:10,borderRadius:3}}>
                    <Text style={{color:'#fff',fontSize:12}}>{showDate}</Text>
                </View>
            </View>
        )
    }
    _renderRow(data,sectionID,rowID) {
        const {dispatch} = this.props;
        const {Strolling} = this.props;
            return (
                <View>
                    <JourneyRow data={data} dispatch={dispatch} Strolling={Strolling} sectionID={sectionID} rowID={rowID}/>
                </View>

            )
    }
    /*具有上滑加载下属功能,暂时不用
    _renderFooter() {
        const {Strolling} = this.props;
        let refreshedOptiion = Strolling.refreshedOptiion;
        let queryType = Strolling.queryType;
        let isEnd = Strolling.isEnd;
        let showFooter = Strolling.showFooter;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        //if(refreshedOptiion==false){
        //alert(isEnd);
        if(queryType==2){
            if(isEnd==false){
                return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
            }else{
                if(sids.length==0){
                    return <LoadMoreFooter loadMoreText={'您的下属暂无行程哦'}/>
                }
            }
        }else if(queryType==3){
            if(isEnd==false){
                return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
            }else{
                if(sids.length==0){
                    return <LoadMoreFooter loadMoreText={'您的部门暂无行程哦'}/>
                }
            }
        }else{
                if(sids.length==0){
                    if(childrenPrivilege!=0){
                        return <TouchableOpacity onPress={this._directJouney.bind(this)}><LoadMoreFooter loadMoreText={'暂无行程哦,继续上滑查看直属下属行程'}/></TouchableOpacity>
                    }else if(departmentPrvilege!=0){
                        return <TouchableOpacity onPress={this._departmentJouney.bind(this)}><LoadMoreFooter loadMoreText={'暂无行程哦,继续上滑查看部门行程'}/></TouchableOpacity>
                    }else{
                        return <LoadMoreFooter loadMoreText={'暂无行程哦'}/>
                    }

                }
                if(isEnd==false){
                    return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
                }else{
                    if(loadingDataText==1){
                        if(childrenPrivilege!=0){
                            return <LoadMoreFooter loadMoreText={'继续上滑查看直属下属行程'}/>
                        }else if(departmentPrvilege!=0){
                            return <LoadMoreFooter loadMoreText={'继续上滑查看部门行程'}/>
                        }else{
                            return <LoadMoreFooter loadMoreText={'已经到底了'}/>
                        }
                    }else if(loadingDataText==2){
                        return <LoadMoreFooter loadMoreText={'正在加载直属下属行程'}/>
                    }


                }


                // else if(showFooter==true){
                //
                //
                // }
            }
       // }

    }*/
    _renderFooter() {
        const {Strolling} = this.props;
        let queryType = Strolling.queryType;
        let isEnd = Strolling.isEnd;
        if(queryType==2){
            if(isEnd==false){
                return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
            }else{
                if(sids.length==0){
                    return <LoadMoreFooter loadMoreText={'下属员工暂时没有行程呦!'}/>
                }
            }
        }else if(queryType==3){
            if(isEnd==false){
                return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
            }else{
                if(sids.length==0){
                    return <LoadMoreFooter loadMoreText={'本部门员工暂时没有行程呦!'}/>
                }
            }
        }else{
            if(sids.length==0){
               return <LoadMoreFooter loadMoreText={'暂时没有行程呦!'}/>
            }
            if(isEnd==false){
                return <LoadMoreFooter loadMoreText={'正在加载更多...'}/>
            }
        }

    }

    _onScroll() {
        canLoadMore = 'futureData';
        if(calenderH!=60 && calenderH!=70){
                if(Platform.OS=='ios'){
                    theDispatch(receiveCalenderViewHeight(60));
                    theDispatch(receiveCalenderHeight(Common.window.height-130));
                }else{
                    theDispatch(receiveCalenderViewHeight(74));
                    theDispatch(receiveCalenderHeight(Common.window.height-144));
                }
        }
    }

    // 下拉刷新
    _onRefresh() {
        if(typeof YYRNBridgeModule.baiduLogEvent=='function'){
            YYRNBridgeModule.baiduLogEvent('travman_down','事项列表下拉查看历史事项');//百度统计App事件
        }
        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        let queryType = Strolling.queryType;
        let thedate = sids[0];
        let date='';
        if(thedate){
            date = moment(thedate).format('YYYY-MM-DD');
        }else{
            date = today;
        }

        commondispatchrefresh(dispatch,childrenPrivilege,departmentPrvilege,queryType,date);

    }

    // 上拉加载
    _onEndReach() {

        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let queryType = Strolling.queryType;
        let isEnd = Strolling.isEnd;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        let toDepartment = Strolling.toDepartment;
        let thedate = sids[sids.length-1];
        let date = moment(thedate).add(1,'day').format('YYYY-MM-DD');
        commondispatchonendreached(dispatch,queryType,childrenPrivilege,departmentPrvilege,date,isEnd,toDepartment,canLoadMore);
        /*具有上滑加载下属功能,暂时不加
        //gestureSystem = true;
        */
    }
    _showDate(date){
        return getdepartDate(date);
    }
    //点今天按钮跳用原生方法日历返回今天,加载今天及未来行程
    _todayBtn(){
        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        let queryType = Strolling.queryType;
        let date = moment().format('YYYY-MM-DD');
        dispatch(receiveCalenderDate(true));
        commondispatchtodayandfuthur(dispatch,childrenPrivilege,departmentPrvilege,queryType,date);
        dispatch(receiveTodayBtn(false));
        if(Platform.OS=='ios'){
            dispatch(receiveCalenderViewHeight(60));
        }else{
            dispatch(receiveCalenderViewHeight(74));
        }

        let nowYear = moment().year();
        let nowMonth = moment().month()+1;
        dispatch(receiveCalenderYearmonth(nowYear+'年'+nowMonth+'月'));
        return YYRNBridgeModule.toToday();
    }
    _directJouney() {//暂时不用
        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        dispatch(receiveCalenderDate(true));//允许上拉加载更多
        let today = moment().format('YYYY-MM-DD');
        canLoadMore = 'newData';
        let opts = {
            'date': today,
            'dateType': 2,
            'scrollType': 1,
            'queryType': 2,
            'pageCapacity': 7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege': departmentPrvilege,
            'querySourceType': 1
        }
        let optsCalenderDate = {
            'year':year,
            'month':month,
            'queryType':2,
            'calenderDate':true
        }
        dispatch(fetchJourney( opts, canLoadMore, canLoadHisMore, isLoading));
        dispatch(fetchJourney( optsCalenderDate, false, false, false));
    }
    _departmentJouney(){//暂时不用
        const {dispatch} = this.props;
        const {Strolling} = this.props;
        let childrenPrivilege = Strolling.childrenPrivilege;
        let departmentPrvilege = Strolling.departmentPrvilege;
        dispatch(receiveCalenderDate(true));//允许上拉加载更多
        let today = moment().format('YYYY-MM-DD');
        canLoadMore = 'newData';
        let opts = {
            'date': today,
            'dateType': 2,
            'scrollType': 1,
            'queryType': 3,
            'pageCapacity': 7,
            'childrenPrivilege': childrenPrivilege,
            'departmentPrvilege': departmentPrvilege,
            'querySourceType': 1
        }
        let optsCalenderDate = {
            'year':year,
            'month':month,
            'queryType':3,
            'calenderDate':true
        }
        dispatch(fetchJourney( opts, canLoadMore, canLoadHisMore, isLoading));
        dispatch(fetchJourney( optsCalenderDate, false, false, false));
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor:'#f3f3f3',
        flex:1,
        flexDirection:'column',
    },
    oddBg:{
        height:24,
        backgroundColor:'blue',
        borderRadius: 3,
        paddingTop:4,
        paddingLeft:10,
        paddingRight:10,
    },
    evenBg:{
        height:24,
        backgroundColor:'#ffb400',
        borderRadius: 3,
        paddingTop:4,
        paddingLeft:10,
        paddingRight:10,
    },
    blueTodayIcon:{
        height:50,
        width:50,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#449ff7',
        borderRadius:30,
        shadowColor:'#449ff7',
        shadowOffset:{height:0,width:0},
        shadowOpacity:0.8,
        shadowRadius:5,
        
    },
    todayBtnOuter:{
        width:56,
        height:56,
        borderRadius:50,
        backgroundColor:'#F2F7FD',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    todayBtnMiddle:{
        width:54,
        height:54,
        borderRadius:50,
        backgroundColor:'#E1EDFA',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    todayBtnIn:{
        width:52,
        height:52,
        borderRadius:50,
        backgroundColor:'#D1E4F7',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    todayBtnBox:{
        width:56,
        height:80,
        position:'absolute',
        bottom:0,
        right:20,
        //backgroundColor:'#f00'
    },
    todayBtnNone:{
        width:56,
        height:56,
        position:'absolute',
        bottom:20,
        right:-100
    }



})