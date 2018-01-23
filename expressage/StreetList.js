/**
 * Created by lc on 14/04/15.
 * 选择街道
 */
import React, {Component, PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    ListView
} from 'react-native';
import StreetListItem from './orderList/StreetListItem';
import ModalTitle from './common/ModalTitle';
import * as Native from '../native'
// <StreetList leftTitle="取消" rightTitle="确定" midTitle="付款方式" data={this.state.streetData}
//             _leftCallback={this._cancelCallBack.bind(this)}
//             _callBackItemClick={this._cancelCallBackItem}/>
export default class StreetList extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }

    render() {
        const {leftTitle} = this.props;
        const {midTitle} = this.props;
        const {rightTitle} = this.props;
        return (
            <View style={{height: 138, flex: 1, backgroundColor: '#ffffff', flexDirection: 'column'}}>
                <ModalTitle style={{height: 38}} leftTitle={leftTitle} rightTitle={rightTitle} midTitle={midTitle}
                            _leftCallback={this.props._leftCallback} _rightCallback={this.props._rightCallback}/>
                <ListView
                    enableEmptySections={true}
                    style={{flex: 1}}
                    dataSource={this.state.dataSource.cloneWithRows(this.props.data)}
                    renderRow={(rowData) =>
                        <StreetListItem data={rowData} _callBackItemClick={this._callBackItem.bind(this)}/>
                    }
                />
            </View>
        );
    }

    _callBackItem(data) {
        console.log("StreetListItem!" + data.province + data.city + data.area + data.street + " 被点击");
        if (this.props.onPress) {
            this.props.onPress(data);
        }
        // this.props.navigator.pop();
    }
}