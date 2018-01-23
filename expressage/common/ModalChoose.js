/**
 * Created by lc on 14/04/15.
 * 选择条目
 */
import React, {Component,PropTypes} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    ListView
} from 'react-native';
import ModalTitle from './ModalTitle';
import ModalChooseItem from './ModalChooseItem';
// <ModalChoose leftTitle="取消" rightTitle="确定" midTitle="付款方式" data={["寄方付","收方付","第三方月结"]} selected="第三方月结"
//              _leftCallback={this._cancelCallBack.bind(this)}
//              _callBackItemClick={this._cancelCallBackItem}/>
export default class ModalChoose extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }

    render(){
        const {leftTitle} = this.props;
        const {midTitle} = this.props;
        const {rightTitle} = this.props;
        const {selected} = this.props;
        return(
            <View style={{height:138,flex:1,backgroundColor:'#ffffff',flexDirection:'column'}}>
                <ModalTitle style={{height:38}} leftTitle={leftTitle} rightTitle={rightTitle} midTitle={midTitle} _leftCallback={this.props._leftCallback} _rightCallback={this.props._rightCallback}/>
                <ListView
                    style={{flex:1,marginTop:60}}
                    dataSource={this.state.dataSource.cloneWithRows(this.props.data)}
                    renderRow={(rowData)=>
                        <ModalChooseItem data={rowData} selected={selected} _callBackItemClick={this.props._callBackItemClick}/>
                        }
                />
            </View>
        );
    }
}