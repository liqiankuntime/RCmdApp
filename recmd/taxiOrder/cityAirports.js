/**
 * Created by huangzhangshu on 16/9/20.
 */
'use strict'

import React from 'react';
import {
    View,
    Text,
    ListView,
} from 'react-native';

import {getCityAirportList} from '../common/ApiRequest'

var data = [{aaa:'aaa',bbb:'bbb'}, {aaa:'ccc',ddd:'ddd'}]

export default class CityAirports extends React.Component {

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
        this.state = {
            dataSource: ds.cloneWithRows(data)
        }
        this._renderRow = this.renderRow.bind(this)
    }

    componentDidMount() {
        var params = {
            cityId: '1',
        }
        getCityAirportList(params, (response) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(response)
            })
        }, (error) => {
        })


        setTimeout(() => {
            data = ['aaa', 'aaa', 'dd', 'ff']
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data)
            })
        }, 2000)
    }

    renderRow = (rowData,sectionId,rowId) => {
        return (
            <View>
                <Text>{rowData.aaa}{sectionId}{rowId}</Text>
            </View>
        )
    }

    render() {
        const {dataSource} = this.state;
        return (
            <View>

                <ListView
                    dataSource={dataSource}
                    renderRow={this._renderRow}></ListView>

            </View>
        )
    }

}