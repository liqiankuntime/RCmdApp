/**
 * Created by huangzhangshu on 16/9/1.
 */

'use strict'

import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    BackAndroid,
    Platform,
} from 'react-native';

import AutoComplete from './AutoComplete';
import PoiSearchModule from '../native/PoiSearchModule';

class PoiSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            query: props.query !== 'undefined' ? props.query : '',
            city: props.city !== 'undefined' ? props.city : '',
        }
    }

    componentDidMount() {
        if (Platform.OS = 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
        }
        setTimeout(() => {
            this._findSuggestions(this.state.query)
        },300);
    }

    componentDidUnMount() {
        if (Platform.OS = 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    _onBackAndroid = () => {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (navigator && routers && routers.length > 1) {
            navigator.pop();
            return true;
        }
        return false;
    }

    _findSuggestions = (query) => {
        if (query == '') {
            this.setState({
                suggestions: [],
            })
        } else {
            PoiSearchModule.search(this.state.city, query, (value) => {
                this.setState({
                    suggestions: value,
                })
            })
        }
    }

    _popResult = (result) => {
        const {navigator} = this.props;
        if (navigator) {
            if (this.props.update) {
                this.props.update(result);
            }
            navigator.pop();
        }
    }

    render() {
        const {query, suggestions} = this.state;
        return (
            <View style={styles.container}>
                <AutoComplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={suggestions}
                    defaultValue={query}
                    onChangeText={text => this._findSuggestions(text)}
                    placeholder="请输入关键字"
                    renderItem={({key, city, latitude, longitude, district}) => (
                        <TouchableOpacity
                            onPress={() => {
                                const result = {
                                    key, city, latitude, longitude,
                                }
                                this._popResult(result);
                            }}>
                            <Text style={styles.itemText}>
                                {key}
                            </Text>
                            <Text style={styles.districtText}>{city}{district}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }

}

const border = {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 10
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 10
    },
    itemText: {
        fontSize: 14,
        marginLeft: 2,
        marginTop: 8,
    },
    districtText: {
        color: 'gray',
        fontSize: 10,
    },
    info: {
        paddingTop: 60,
        flex: 4,
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    }
});

export default PoiSearch