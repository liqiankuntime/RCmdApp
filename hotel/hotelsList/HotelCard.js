/**
 * Created by chenty on 2016/10/20.
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions
} from 'react-native';

import Common from '../common/constants';
export default class HotelCard extends React.Component {


    _getScore(review){
        if (review.count >0){
            let score = (review.good / review.count) * 100;
            score= Math.round(score * 100) / 100;
            return `${score}%好评`;
        }

        return '';

    }

    _getDistance(distance){

        if (distance<1000){
            return distance +' 米';
        }else {
            let number =distance / 1000;
            let k = Math.round(number * 10) / 10;
            return k +' 公里';
        }
    }
    _getStarRate(starRate){
        let result ='经济';
        if (starRate>2){
            result = Common.starRates[starRate];
        }
        return result;

    }

    render() {
        let {hotel}=this.props;
        let number = hotel.review.score;
        let score = Math.round(number * 100) / 100;
        return (

            <View style={styles.container}>
                <Image style={styles.hotelThumb} source={{uri: hotel.thumbNailUrl}}/>
                <View style={[styles.titleContainer,styles._Hoteltext]}>
                    <View style={{width:Common.window.width/2+35}}>
                        <Text style={styles.hotelName} numberOfLines={1}>{hotel.hotelName}</Text>
                    </View>
                    <View style={[styles.reviewContainer,styles._marginTop,styles._marginBottom]}>
                        <View style={{flexDirection:'row',marginRight:5,}}>
                            <Text style={{color:'#ed7140',fontSize:18,alignSelf:'flex-end'}}>{score}</Text>
                            <Text style={{color:'#ed7140',fontSize:12,marginBottom:2,alignSelf:'flex-end'}}>分</Text>
                        </View>

                        <Text style={styles.starRate}>{this._getScore(hotel.review)}</Text>
                        <Text style={styles.comments}>{`${hotel.review.count}条点评`}</Text>
                    </View>
                    <View style={styles._marginBottom}>
                        <Text style={{color:'gray',fontSize:12}}>{this._getStarRate(hotel.starRate)}</Text>
                    </View>
                    <View style={[styles._marginBottom,styles._marginTop,{ flexDirection: 'row'}]}>
                        <Text style={{color:'gray',marginRight:5,fontSize:12}}>{hotel.districtName}</Text>
                        <Text style={{color:'gray',fontSize:12}}>{hotel.businessZoneName }</Text>
                    </View>
                    {Number(hotel.distance) > 0 && <View style={[styles._marginTop,{ flexDirection: 'row'}]}>
                        <Text style={{color:'gray',marginRight:5,fontSize:12}}>{`距离目的地 ${this._getDistance(hotel.distance)}` || ''}</Text>

                    </View>}
                </View>
                <View style={styles.priceContainer}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.lowRate}>{`¥${hotel.lowRate}`}</Text>
                        <Text style={{fontSize:12,alignSelf:'flex-end',color:'#ed7140',marginBottom:1}}>起</Text>
                    </View>


                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 10,
        justifyContent: 'space-between',
        backgroundColor:'white',
        marginBottom:2,
        alignItems:'center'
    },

    hotelThumb: {
        flex:1,
        width: 50,
        height: 100,
        marginTop:5,
    },

    titleContainer: {
        flex:5,
        marginLeft: 10,
    },

    hotelName: {
        color:'#333',
        fontSize:17
    },

    reviewContainer: {
        flexDirection: 'row',
        alignItems:'flex-end',
    },
    starRate: {
        color: '#ed7140',
        marginRight:5,
        fontSize:12
    },
    comments:{
        fontSize:12,
        color:'gray',
    },
    priceContainer: {
        alignItems:'flex-end',
        justifyContent: 'center',
        flex:4,
        height:18,
        marginTop:15
    },
    lowRate: {
        color: '#ed7140',
        fontSize:18,
        alignSelf:'flex-end'
    },
    _marginBottom: {
        ...Platform.select({
            ios: {
                marginBottom:3
            },
            android: {
                marginBottom:0
            }
        }),
    },
    _marginTop: {
        ...Platform.select({
            ios: {
                marginTop:3
            },
            android: {
                marginTop:3
            }
        }),
    },
    _Hoteltext: {
        ...Platform.select({
            ios: {
                marginTop:5
            },
            android: {
                marginTop:2
            }
        }),
    }

});
