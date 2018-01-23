/**
 * Created by huangzhangshu on 16/8/29.
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Constants from './constant';

export default class CarItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            estimate: props.estimate,
            sedan_color: props.carStyle.sedan_color,
            commercial_7seats_color: props.carStyle.commercial_7seats_color,
            limousine_color: props.carStyle.limousine_color,
            sedan_text_color: props.carStyle.sedan_text_color,
            commercial_7seats_text_color: props.carStyle.commercial_7seats_text_color,
            limousine_text_color: props.carStyle.limousine_text_color,
            estimates: props.estimates,

        }
        this._selectEstimate = props.selectEstimate;
    }

    _clearStatus = () => {
        this.setState({
            initialSelect: false,
            sedan_color: 'white',
            commercial_7seats_color: 'white',
            limousine_color: 'white',
            sedan_text_color: '#333333',
            commercial_7seats_text_color: '#333333',
            limousine_text_color: '#333333',
        });
    }

    render() {
        this.state.estimate = this.props.estimate
        if (!this.state.estimate || this.state.estimate === 'null' || this.state.estimate.length === 0) return null;
        let isInit = this.props.isInit
        var {estimates, estimate} = this.props;
        const prices = [];
        const didi = estimates['didi'];
        const shenzhou = estimates['shenzhou'];
        if (didi) estimate = didi;
        if (shenzhou) estimate = shenzhou;
        let length = estimate.length;
        if (isInit && length >= 1) {
            if (this.props.carSelect === 0) {
                this.state.sedan_color = 'white'
                this.state.sedan_text_color = '#faad97'
            } else if (this.props.carSelect === 1) {
                this.state.commercial_7seats_color = 'white'
                this.state.commercial_7seats_text_color = '#faad97'
            } else if (this.props.carSelect === 2) {
                this.state.limousine_color = 'white'
                this.state.limousine_text_color = '#faad97'
            }
        }
        if (didi && shenzhou) {
            for (let item of didi) {
                let price_1 = item.price;
                for (let item_2 of shenzhou) {
                    if (item_2.name === item.name) {
                        let price_2 = item_2.price;
                        if (price_1 >= price_2) {
                            prices.push(price_2)
                        } else {
                            prices.push(price_1);
                        }
                        break;
                    }
                }
            }
        } else {
            for (let item of estimate) {
                prices.push(item.price);
            }
        }
        return (
            <View style={carStyles.container}>
                {length >= 1 ? <TouchableOpacity
                    style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-start'}}
                    onPress={() => {
                        this._clearStatus();
                        this.setState({
                            sedan_color: 'white',
                            sedan_text_color: '#faad97',
                            car_value: Constants.sedan
                        });
                        this._selectEstimate(this.state.estimate[0], {
                            sedan_color: '#faad97',
                            commercial_7seats_color: '#333333',
                            limousine_color: '#333333',
                            sedan_text_color: '#faad97',
                            commercial_7seats_text_color: '#333333',
                            limousine_text_color: '#333333'
                        })
                    }}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: this.state.sedan_text_color
                        }}>{estimate[0].name}</Text>
                        <Text style={{
                            color: this.state.sedan_text_color,
                            alignSelf: 'center',
                        }}>¥{prices[0]}<Text
                            style={{fontSize: 10, color: this.state.sedan_text_color}}> 起</Text></Text>
                    </View>

                </TouchableOpacity> : null}

                {/*{length >= 2 ? <View style={{width: 1, backgroundColor: '#e5e5e5'}}/> : null}*/}


                {length >= 2 ? <TouchableOpacity
                    style={{flex: 1, justifyContent: 'center', backgroundColor: 'white', alignItems: 'center'}}
                    onPress={() => {
                        this._clearStatus();
                        this.setState({
                            commercial_7seats_color: '#faad97',
                            commercial_7seats_text_color: '#faad97',
                            car_value: Constants.commercial_7seats
                        });
                        this._selectEstimate(this.state.estimate[1], {
                            sedan_color: 'white',
                            commercial_7seats_color: '#faad97',
                            limousine_color: '333333',
                            sedan_text_color: '#333333',
                            commercial_7seats_text_color: '#faad97',
                            limousine_text_color: '#333333',
                        })
                    }}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: this.state.commercial_7seats_text_color
                        }}>{estimate[1].name}</Text>
                        <Text style={{
                            color: this.state.commercial_7seats_text_color,
                            alignSelf: 'center',
                        }}>¥{prices[1]}<Text
                            style={{fontSize: 10, color: this.state.commercial_7seats_text_color}}> 起</Text></Text>
                    </View>
                </TouchableOpacity> : null}

                {/*{length >= 3 ? <View style={{width: 1, backgroundColor: '#e5e5e5'}}/> : null}*/}

                {length >= 3 ? <TouchableOpacity
                    style={{flex: 1, justifyContent: 'center', backgroundColor: 'white', alignItems: 'flex-end'}}
                    onPress={() => {
                        this._clearStatus();
                        this.setState({
                            limousine_color: '#faad97',
                            limousine_text_color: '#faad97',
                            car_value: Constants.limousine
                        });
                        this._selectEstimate(this.state.estimate[2], {
                            sedan_color: '#333333',
                            commercial_7seats_color: '#333333',
                            limousine_color: '#faad97',
                            sedan_text_color: '#333333',
                            commercial_7seats_text_color: '#333333',
                            limousine_text_color: '#faad97',
                        })
                    }}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: this.state.limousine_text_color
                        }}>{estimate[2].name}</Text>
                        <Text style={{
                            color: this.state.limousine_text_color,
                            alignSelf: 'center',
                        }}>¥{prices[2]}<Text
                            style={{fontSize: 10, color: this.state.limousine_text_color}}> 起</Text></Text>
                    </View>
                </TouchableOpacity> : null}


            </View>
        )
    }
}

CarItem.PropTypes = {
    estimate: React.PropTypes.object.isRequired,
    selectEstimate: React.PropTypes.func.isRequired,
    isInit: React.PropTypes.bool.isRequired,
}

const carStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 50,
        paddingLeft: 42,
        paddingRight: 15,
    },

});