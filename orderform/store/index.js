/**
 * Created by lc on 17/03/10.
 */

import {applyMiddleware, createStore} from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import reducer from '../reducers';
import * as middle from './middleware';

const other = [];
const middleware = process.env.NODE_ENV === 'production'
    ? [...other, thunk]
    : [...other, thunk, logger()];
const createStoreWithThunk = applyMiddleware(...middleware)(createStore);

export default process.env.NODE_ENV === 'production'
    ? createStoreWithThunk(reducer)
    : createStoreWithThunk(reducer, devToolsEnhancer());