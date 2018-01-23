/**
 * Created by haosha on 16/10/17.
 */

import React, { Component } from 'react';
import {Provider} from 'react-redux';
import store from './store';
import Nav from './common/Nav';
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
                <Nav {...props} initial={initial} />
            </Provider>
        )
    }
}

//initial='HotelOrder' billId={127}