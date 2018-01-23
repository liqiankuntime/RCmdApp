/**
 * Created by haosha on 16/8/26.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    ListView,
    Image,
    Modal} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Taxi from './taxi';
import Traffic from './traffic';
import Hotel from './hotel';
import Container from './common/Container';
import {ITEM_TAXI_TO, ITEM_TAXI_FROM, ITEM_TRAFFIC, ITEM_HOTEL} from './common/comm';
import Data_Label from './common/Data_Label';
import MoreModal from './traffic/MoreModal';
import ModalLayer from './common/Modal_Layer';
import Title_Message from './common/Title_Message';
import {deleteItem, visibleDelView} from './actions';
import Loading from '././common/Loading'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._datasource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount() {
    }

    _selectComponent(item) {
        switch (item.type) {
            case ITEM_TAXI_TO:
                return {
                    component:Taxi,
                    tabs:[
                        {
                            code:'arrival',
                            name: item => {
                                if (item.pickUpResult
                                    && item.pickUpResult.serviceId
                                    && item.pickUpResult.serviceId == 13) {
                                    return "送站";
                                }
                                return "送机";
                            },
                            tabType: 'char',
                            dynamic: true
                        }
                    ]
                };
            case ITEM_TAXI_FROM:
                return {
                    component:Taxi,
                    tabs:[
                        {
                            code:'departure',
                            name: '接机',
                            tabType: 'char'
                        }
                    ]
                };
            case ITEM_TRAFFIC:
                return {
                    component:Traffic,
                    tabs:[
                        {
                            code:'flight',
                            name: item => item.selected == 'flight' ?
                                require('./img/aireplane.png') :
                                require('./img/airplane_nochecked@3x.png'),
                            tabType: 'image',
                            dynamic: true
                        },
                        {
                            code:'train',
                            name: item => item.selected == 'train' ?
                                require('./img/train@3x.png') :
                                require('./img/train_nochecked@3x.png'),
                            tabType: 'image',
                            dynamic: true
                        }
                    ]
                };
            case ITEM_HOTEL:
                return {
                    component:Hotel,
                    tabs:[
                        {
                            code:'hotel',
                            name: require('./img/hotelPic@3x.png'),
                            tabType: 'image'
                        }
                    ]
                };
            default:
                return {
                    component: View,
                    tabs: []
                };
        }
    }

    _renderComp(tripId, item) {
        //console.log("Render Component "+item.type);
        switch (item.type) {
            case ITEM_TAXI_TO:
            {
                const {from:{time, address}} = item;
                return (
                    <View key={item.id}>
                        <Title_Message start_time={time} start_address={address}/>
                        <Container comp={this._selectComponent(item)}
                                   tripId={tripId}
                                   id={item.id}
                                   navigator={this.props.navigator}
                                   updateVisible={this._updateVisible}/>
                    </View>);
            }
            case ITEM_TRAFFIC:
            {
                const selected = item[item.selected];
            	const {from:{time, station,weatherInfo}} = selected;
                const {to:{time:to_time, station:to_station, weatherInfo:to_weatherInfo}} = selected;
                return (
                    <View key={item.id}>
                        {weatherInfo ?
                        <Title_Message
                            start_time={time}
                            start_address={item.selected=='flight' ? station+selected.Departterminalname : station}                           
                            weatherpic={weatherInfo ? weatherInfo.weatherIdDay : undefined}
                            weathercondition={weatherInfo ? weatherInfo.conditionDay : undefined}
                            top_temperature={weatherInfo ? weatherInfo.tempDay : undefined}
                            low_temperature={weatherInfo ? weatherInfo.tempNight : undefined}/>
                        :
                        <Title_Message
                            start_time={time}
                            start_address={item.selected=='flight' ? station+selected.Departterminalname : station}                           
                            />}
                        <Container comp={this._selectComponent(item)}
                                   tripId={tripId}
                                   id={item.id}
                                   navigator={this.props.navigator}/>
                        <Title_Message start_time={to_time}
                                       start_address={item.selected=='flight' ? to_station+selected.Arriveterminalname : to_station}
                                       weatherpic={to_weatherInfo ? to_weatherInfo.weatherIdDay : undefined}
                                       weathercondition={to_weatherInfo ? to_weatherInfo.conditionDay : undefined}
                                       top_temperature={to_weatherInfo ? to_weatherInfo.tempDay : undefined}
                                       low_temperature={to_weatherInfo ? to_weatherInfo.tempNight : undefined}/>
                    </View>);
            }
            case ITEM_TAXI_FROM:
            {
                return (
                    <View key={item.id}>
                        <Container comp={this._selectComponent(item)}
                                   tripId={tripId}
                                   id={item.id}
                                   navigator={this.props.navigator}/>
                    </View>);
            }
            case ITEM_HOTEL:{
                return (
                    <View key={item.id}>
                        <Container comp={this._selectComponent(item)}
                                   tripId={tripId}
                                   id={item.id}
                                   navigator={this.props.navigator}/>
                    </View>);
            }
            default:
                return <View key={item.id}/>;
        }
    }
    
    _renderRow(rowData) {
        const {id:tripId, date, items} = rowData;
        return (
        	<View style={{marginLeft:20,marginRight:10,}}>
        		<Data_Label date={date}/>
        		<View>
                    {items.map(item => this._renderComp(tripId, item))}
	            </View>
        	</View>
        );
    }

    _renderAttention() {
        return (
            <View style={{height:180,marginTop:150,alignItems:'center'}}>
                <Image source={require('./img/warning@3x.png')} style={{width:60,height:60}} />
                <View style={{marginTop:30}}>
                    <Text style={{marginLeft:12}}>小微的智商余额不足,</Text>
                    <Text>请搜索可直达的行程哦!</Text>
                </View>
            </View>
        );
    }

    render() {
        if (0 == this.props.trips.length) {
            return this._renderAttention();
        }
        return (
            <View style={{flex:1, flexDirection:'column', backgroundColor:'#f3f3f3',marginTop:-20}}>
                <Modal transparent={true} visible={this.props.loading.visible} onRequestClose={() => {}}>
                    <Loading />
                </Modal>
                <ModalLayer model={this.props.delModal}
                            btnText={"删除"}
                            callback={this.props.deleteItem}
                            visibleView={this.props.visibleDelView}/>
                <ListView
                    removeClippedSubviews={false} // react issue https://github.com/facebook/react-native/issues/10142
                    showsVerticalScrollIndicator={false}
                    dataSource={this._datasource.cloneWithRows(this.props.trips)}
                    renderRow={this._renderRow}
                    enableEmptySections={true}/>
                <MoreModal />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.modal.loading,
        delModal: state.modal.del,
        trips: state.trips
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({deleteItem, visibleDelView}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);