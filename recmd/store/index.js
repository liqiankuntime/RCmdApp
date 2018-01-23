/**
 * Created by haosha on 16/9/1.
 */

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import reducer from '../reducers';
import * as middle from './middleware';

const other = [
    middle.onDeleteAction,
    middle.onUpdateAction,
    middle.onRecommendAction,
    middle.onSubmitAction
];
const middleware = process.env.NODE_ENV === 'production' ? [...other, thunk] : [...other, thunk, logger()];
const createStoreWithThunk = applyMiddleware(...middleware)(createStore);

export default createStoreWithThunk(reducer);
