/**
 * Created by haosha on 16/9/1.
 */

import React, {Component} from 'react';
import {View, Text,Metal, TouchableOpacity,StyleSheet,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectItem} from '../common/comm'
import {switchTrafficTab, visibleDelView} from '../actions';
import TraficLabel_Gather from './TraficLabel_Gather';
import Hotel from '../hotel/';
export class Container extends Component {
    constructor(props) {
        super(props);
        this._setDeleteFunc = this._setDeleteFunc.bind(this);
        this._setTabFunc = this._setTabFunc.bind(this);
        this._onDeleteButton = this._onDeleteButton.bind(this);
        this._onTabButton = this._onTabButton.bind(this);
    }

    _setDeleteFunc(func) {
        this._delete = func;
    }

    _setTabFunc(func) {
        this._tabFunc = func;
    }

    _onDeleteButton() {
        const {tripId, id} = this.props;
        switch (true) {
            case this._delete == undefined:
            case this._delete && this._delete():
                this.props.visibleDelView(tripId, id, true);
                break;
            default:
                break;
        }
    }
	
    _onTabButton(code) {
        const {tripId, id} = this.props;
        const {selected} = this.props.item;
        if (code == 'flight' || code == 'train') {
            if (!this.props.item[code]) {
                return;
            }
            switch (true) {
                case this._tabFunc == undefined:
                case this._tabFunc && this._tabFunc(selected, code):
                    this.props.switchTrafficTab(tripId, id, code);
                    break;
                default:
                    break;
            }
        }
    }

    _renderChild() {
        const {comp:{component:Comp}} = this.props;
        return <Comp
            {...this.props.item}
            navigator={this.props.navigator}
            tripId={this.props.tripId}
            setDeleteFunc={this._setDeleteFunc}
            setTabFunc={this._setTabFunc}
            setBackCallback={this.props.setBackCallback}
            />;
    }

    render() {
        if (!this.props.item || !this.props.item.id) {
            return <View />;
        }
        let {comp:{tabs}} = this.props;
        tabs = tabs.map(tab => {
            return {...tab, item: this.props.item};
        });
        return (
            <View>
                {this._renderChild()}
                <TouchableOpacity
                    style={{position:'absolute',top:0,left:0,width:Dimensions.get('window').width-20,height:36,borderLeftWidth:1,borderColor:'#c6c6c6',}}>
	                <TraficLabel_Gather
                        tabs={tabs}
                        onDelete={this._onDeleteButton}
                        onSwitch={this._onTabButton}
                        canDelete={this.props.item.status ? false : true}
                        />
	            </TouchableOpacity>

            </View>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const item = selectItem(state, ownProps.tripId, ownProps.id);
    return item ? {item} : {item: undefined};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        switchTrafficTab,
        visibleDelView
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);

