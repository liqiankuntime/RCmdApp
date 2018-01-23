/**
 * Created by yonyou on 16/7/4.
 */
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducers,initialState);
}