/**
 * Created by haosha on 16/8/26.
 */

import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-redux';
import store from './store';
import Nav from './Nav';
import {loadTrips} from './actions';
import {setBaseUrl} from '../common/utils';

export default class App extends Component {
    constructor(props) {
        super(props);
        setBaseUrl(props.baseUrl, props.travelUrl);
    }

    render() {
        const {initial, ...props} = this.props;
        return (
            <Provider store={store}>
                <Nav
                    {...props}
                    initial={initial}
                    loadTrips={bindActionCreators(loadTrips, store.dispatch)}
                    />
            </Provider>
        )
    }
}