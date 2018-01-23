/**
 * Created by shane on 17/4/17.
 */
import {
	Alert,
} from 'react-native';
import * as types from './actionTypes';
import {travelUrl, Api, Network, MessageBox} from '../../common/utils';

export function showLoading(view, modal) {
	return {
		type: types.SHOW_EXPRESSAGE_ORDER_LOADING,
		loadingView: view,
		loadingModal: modal
	}
}

export function getOrder(pk) {
	return dispatch => {
		dispatch(showLoading(true, false));
		const url = travelUrl+Api.expressage.getOrderDetail+'?param='+JSON.stringify({'orderNo':pk});
		return Network.get(url,
			response => {
				dispatch(showLoading(false, false));
				dispatch({
					type: types.GET_EXPRESSAGE_ORDER,
					data: response
				})
			},
			error => {
				dispatch(showLoading(false, false));
				MessageBox.error('提示', '订单获取失败!', error);
			}
		);
	}
}

export function cancelOrder(pk) {
	return dispatch => {
		dispatch(showLoading(false, true));
		const url = travelUrl+Api.expressage.getOrderDetail+'?param='+JSON.stringify({'orderNo':pk});
		return Network.delete(url,
			response => {
				dispatch(showLoading(false, false));
				dispatch({
					type: types.CANCEL_EXPRESSAGE_ORDER,
					data: response
				})
			},
			error => {
				dispatch(showLoading(false, false));
				MessageBox.error('提示', '订单取消失败!', JSON.stringify(error));
			}
		)
	}
}

export function resetData() {
	return {
		type: types.RESET_EXPRESSAGE_ORDER,
		data: null
	}
}