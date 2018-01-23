/**
 * Created by haosha on 16/9/12.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BottomSheet from './BottomSheet';
import { selectItem } from '../common/comm';
import {
    visibleMoreView,
    updateTrafficItem,
    updateHotelItem
} from '../actions';

class MoreModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {visible, ...props} = this.props;
        return (
            <Modal visible={visible}
                   animationType={'fade'}
                   transparent={true}
                   onRequestClose={()=>{}}
        	>
                <BottomSheet {...props} />
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const more = state.modal.more;
    const item = selectItem(state, state.modal.more.tripId, state.modal.more.id);
    return item ? {...more, ...item} : {...more};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        visibleMoreView,
        updateTrafficItem,
        updateHotelItem
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreModal);