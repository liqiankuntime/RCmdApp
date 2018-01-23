/**
 * Created by shane on 17/4/12.
 */
import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import Nav from './navigation/Navigator'
import {setBaseUrl} from '../common/utils';

export default class Expressage extends React.Component {
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