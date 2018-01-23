/**
 * Created by haosha on 16/8/27.
 */
import {combineReducers} from 'redux';
import trips from './trip';
import modal from './modal';

export default combineReducers({
        trips,
        modal
    }
);