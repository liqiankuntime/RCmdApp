/**
 * Created by shane on 17/4/15.
 */
import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Alert,
	StatusBar,
	TouchableOpacity,
	Platform,
	PropTypes
} from 'react-native';
import * as Native from '../../native'
import Icon from '../../hotel/common/Icon';

export default class NavBar extends React.Component {

	static PropTypes = {
		//leftIcon: PropTypes.string,
		//title: PropTypes.string,
	};


	static defaultProps = {
		leftIcon: 'ic_back',
		title: '微财务'
	};

	leftIconAction(){
		if (this.props.leftIconAction != undefined){
			this.props.leftIconAction();
		}
		else if (this.props.navigator){
			let {navigator} = this.props;
			const routes = navigator.getCurrentRoutes();
			if (routes.length > 1) {
				navigator.pop();
			}
			else {
				Native.navigatorEvent();
			}
		}
		else {
			Alert.alert('需要自己实现leftIconAction方法或赋值navigator')
		}
	}

	render() {
		let bar = [];
		bar.push(
			<TouchableOpacity
				key={'leftIcon'}
				style={styles.leftIcon}
				onPress={()=>this.leftIconAction()}
			>
				<Icon style={{width:25, height:25}} name={this.props.leftIcon}/>
			</TouchableOpacity>
		);
		bar.push(
			<View key={'title'} style={styles.titleView}>
				<Text style={styles.titleLabel}>{this.props.title}</Text>
			</View>
		);

		return(
			<View>
				<View style={styles.container}>
					{bar}
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({

	container: {
		flexDirection: 'row',
		alignItems:'flex-end',
		backgroundColor: '#ed7140',
		...Platform.select({
			ios: {
				height:64
			},
			android: {
				height:44
			}
		}),
	},

	leftIcon: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 44,
		marginLeft: 0,
		marginBottom: 0,
	},

	titleView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 0,
		marginRight: 50,
		height: 44,
	},

	titleLabel: {
		fontSize: 19,
		color: 'white',
	}
});