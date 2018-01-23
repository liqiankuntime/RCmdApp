/**
 * Created by yonyou on 16/7/4.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from './containers/app';
import {setBaseUrl} from '../common/utils';

const store = configureStore();

class Root extends Component {
    constructor(props) {
        super(props);
        setBaseUrl(props.baseUrl, props.travelUrl);
    }

    render() {
        return (
            <Provider store = {store}>
                <App />
            </Provider>
        );
    }
}

export default Root;