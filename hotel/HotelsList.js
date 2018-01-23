/**
 * Created by chenty on 16/10/17.
 */
/**
 * Created by chenty on 2016/10/18.
 * @flow
 */
/**
 * Created by chenty on 2016/10/18.
 */
import React from 'react';
import {
    View,
} from 'react-native';
import {connect} from 'react-redux'
import Hotels from './hotelsList/';
import * as NATIVE from '../native';
import {track} from '../common/utils';

class HotelsList extends React.Component {
    componentDidMount() {
        showTitleEvent(false);
        track('hotel_list', '酒店列表');
    }

    componentWillUnmount() {
        showTitleEvent(true);
    }

    render() {
        return (
            <Hotels {...this.props} />
        )
    }
}

function mapStateToProps(state) {
    return {
        Hotels: state.hotels,
        Search: state.search,
        Brands: state.brand,
        Config: state.config,
    }
}
function showTitleEvent(show) {
    if (NATIVE.showTitleEvent)
        NATIVE.showTitleEvent(show)
}
export default connect(mapStateToProps)(HotelsList);
