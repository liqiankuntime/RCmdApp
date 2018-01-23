/**
 * Created by chenty on 2016/10/21.
 */

import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
} from 'react-native';
import {
    fetchHotels,
    showHotelsFilter,
    update_search_condition,
    resetPageIndex,
} from '../actions/';

import images from '../images/';
import Common from '../common/constants';

let StarRates = Common.starRates;
class EmptyView extends React.Component {

    updateFilter(condition) {
        let {dispatch} = this.props;
        let canLoadMore = false;
        let isRefreshing = false;
        let isLoading = true;
        dispatch(resetPageIndex());
        dispatch(update_search_condition(condition));
        dispatch(fetchHotels(canLoadMore, isRefreshing, isLoading));
    }

    _findBrandBy(id, Brands) {
        for (let brand of Brands) {
            if (brand.id == id) {
                return brand.name;
            }
        }
        return null;
    }

    _spliceBrand(id, Brands) {
        for (let [i,brand] of Brands) {
            if (brand.id == id) {
                Brands.splice(i, 1);
            }
        }
    }


    _getPriceRate(Search) {
        let price = null;
        if (Search.lowRate > 0) {
            price = `¥${Search.lowRate}以上`;
        }
        if (Search.highRate < 9999) {
            price = `¥${Search.highRate}以下`;
        }
        let starRates = [];
        if (price) {
            starRates.push(price);
        }

        return starRates.join(',');
    }

    render() {
        let {search, brands} = this.props;

        return (
            <View style={styles.container}>
                <View style={{marginTop: 80, marginBottom: 15,}}>
                    <Text style={styles.title}>暂无符合条件的酒店</Text>
                    <Text style={styles.subTitle}>点击删除标签内容，扩大查询条件</Text>
                </View>

                <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 10}}>
                    {search.brand.map((key, index)=> {
                        return (
                            <TouchableOpacity
                                key={`brand_${key}`}
                                style={styles.cell}
                                onPress={()=> {
                                    //this._spliceBrand(key,search.brand);
                                    search.brand.splice(index, 1);
                                    let condition ={
                                      brand:search.brand
                                    };
                                    this.updateFilter(condition);
                                }}
                            >
                                <Text
                                    style={{margin: 5}}>{this._findBrandBy(key, brands)}</Text>
                                <Image style={styles.rightIcon} source={images['noInformation']}/>
                            </TouchableOpacity>

                        )
                    })}
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 10}}>
                    {search.lowRate > 0 ?
                        <TouchableOpacity style={styles.cell}
                                          onPress={()=> {

                                              this.updateFilter({lowRate:0});
                                          }}>
                            <Text style={{margin: 5}}>{`¥${search.lowRate}以上`}</Text>
                            <Image style={styles.rightIcon} source={images['noInformation']}/>
                        </TouchableOpacity> : null}
                    {search.highRate < 9999 ?
                        <TouchableOpacity style={styles.cell}
                                          onPress={()=> {

                                              this.updateFilter({highRate:9999});
                                          }}>
                            <Text style={{margin: 5}}>{`¥${search.highRate}以下`}</Text>
                            <Image style={styles.rightIcon} source={images['noInformation']}/>
                        </TouchableOpacity> : null}
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 10}}>


                    {search.starRate.map((key, index)=> {
                        if (key > 0) {
                            return (
                                <TouchableOpacity
                                    key={`starRate_${key}`}
                                    style={styles.cell}
                                    onPress={()=> {

                                        search.starRate.splice(index, 1);
                                        this.updateFilter({starRate:search.starRate});


                                    }}
                                >
                                    <Text
                                        style={{margin: 5}}>{StarRates[key]}</Text>
                                    <Image style={styles.rightIcon} source={images['noInformation']}/>
                                </TouchableOpacity>

                            )
                        }

                    })}
                </View>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',


    },
    title: {
        fontSize: 20
    },
    subTitle: {
        fontSize: 13,
        color: 'gray'
    },
    cell: {
        flexDirection: 'row',
        height: 30,
        margin: 5,
        justifyContent: 'space-between',
        borderColor: '#e5e5e5',
        borderWidth: 1,
        borderRadius:3,
        alignItems: 'center',
    },
    rightIcon: {
        height: 10,
        width: 10,
        marginLeft:5,
        marginRight:15
    },

});

export default EmptyView;