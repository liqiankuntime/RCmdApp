/**
 * Created by chenty on 2016/10/27.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Dimensions,
} from 'react-native';
import moment from 'moment';

const window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
const starRates = ['', '', '经济', '三星', '四星', '五星'];
export default class HotelItem extends React.Component {
    _getScore(review) {
        if (review.count>0){
            let score = (review.good / review.count) * 100;
            score= Math.round(score * 100) / 100
            return `${score}%好评`;
        }
        return '';

    }

    _getDistance(distance) {

        if (distance < 1000) {
            return distance + ' 米';
        } else {
            let number = distance / 1000;
            let k = Math.round(number * 100) / 100;
            return k + ' 公里';
        }
    }

    _getDate(date) {
        let d = moment(date).format('M月D日');
        return d;
    }

    _getDays(start, end) {
        let d1 = moment(start).dayOfYear();
        let d2 = moment(end).dayOfYear();
        return d2 - d1;
    }
    _renderButtons(){
        return(
            <View></View>
        )
    }
    render() {
        let {hotel,Button}=this.props;
        let number = hotel.review.score;
        let score = Math.round(number * 100) / 100;
        if (Button == undefined){
            Button = this._renderButtons.bind(this);
        }
        return (
            <View style={styles.container}>
                <Image style={styles.hotelThumb} source={{uri: hotel.thumbNailUrl}}/>
                <View style={styles.titleContainer}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{width:window.width/3,justifyContent:'center'}}>
                            <Text style={styles.hotelName} numberOfLines={1}>{hotel.hotelName}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.lowRate}>{`¥${hotel.lowRate}`}</Text>
                                <Text style={{fontSize:12,alignSelf:'flex-end',color:'#666',marginBottom:1}}>起</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{width:window.width/2,}}>
                        <Text style={{color: 'gray',fontSize:12}} numberOfLines={1}>{hotel.address || '地址'}</Text>
                    </View>

                    <View style={styles.reviewContainer} >
                        <View style={{flexDirection: 'row', marginRight: 3, alignItems: 'flex-end'}}>
                            <Text style={{color: '#ed7140', fontSize: 18}}>{score}</Text>
                            <Text style={{color: '#ed7140',marginBottom:2}}>分</Text>
                        </View>

                        <Text style={styles.starRate}>{this._getScore(hotel.review)}</Text>
                        <View style={{width:window.width/6}}>
                            <Text style={styles.comments} numberOfLines={1}>{`${hotel.review.count}条点评`}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'gray',marginRight: 5,fontSize:12}}>{starRates[hotel.starRate] || '经济'}</Text>
                        <Text style={{
                            color: 'gray',fontSize:12
                        }}>{`距离目的地 ${this._getDistance(hotel.distance)}` || ''}</Text>

                    </View>
                    <View style={{flexDirection: 'row',marginTop:2}}>
                        <Text style={[styles.hotelName,{ marginRight: window.width>400? 5:3,fontSize:window.width>360? 16:12}]}>{`${this._getDate(hotel.startDate)}入住`}</Text>
                        <Text style={[styles.hotelName,{ marginRight: window.width>400? 5:3,fontSize:window.width>360? 16:12}]}>{`${this._getDate(hotel.endDate)}离店`}</Text>
                        <Text style={[styles.hotelName,{fontSize:window.width>360? 16:12}]}>{`共${this._getDays(hotel.startDate, hotel.endDate)}晚`}</Text>
                    </View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },

    hotelThumb: {
        width: 80,
        height: 100,
        marginLeft: 5,
        marginTop:15
    },

    titleContainer: {
        flex: 1,
        marginLeft: 5,
        marginTop:11,
        justifyContent:'space-around'

    },

    hotelName: {
        color: '#333',
    },

    reviewContainer: {
        flexDirection: 'row',
        alignItems:'center',
        alignItems:'flex-end',
    },
    starRate: {
        color: '#ed7140',
        marginRight: 3,
        fontSize:12,
        marginBottom:2
    },
    comments: {
        fontSize: 12,
        color: 'gray',
        marginBottom:2
    },
    priceContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight:20,
    },
    lowRate: {
        color: '#666',
        fontSize: 16,
        textAlign:'right'
    },
});