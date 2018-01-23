/*
 *     created by Liqiankun 16/9/7
 * 
 * */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Props,
    TouchableOpacity,
} from 'react-native';
import TraficLabel_Send from './traficlabel_gather/TraficLabel_Send';
import TraficLabel_Dele from './traficlabel_gather/TraficLabel_Dele';

export default class TraficLabel_Gather extends React.Component {
	render(){
		return (
			<View style={styles.traficlabel_container}>
				<View style={{flex:2}}></View>
            	<View style={styles.traficlabel_container_left}>
		    		{this.props.tabs.map((tab) =>
                        <TouchableOpacity key={tab.code} onPress={() => this.props.onSwitch(tab.code)}>
                            <TraficLabel_Send tab={tab.dynamic ? tab.name(tab.item) : tab.name}
											  tabType={tab.tabType} />
                        </TouchableOpacity>)}
		    	</View>
		    	{
		    		this.props.canDelete ? 
		    		<View style={styles.traficlabel_container_right}>
			    		<TouchableOpacity onPress={this.props.onDelete}>
			    			<TraficLabel_Dele />
			    		</TouchableOpacity>
			    	</View>
			    	:
			    	<View style={styles.traficlabel_container_right}></View>
		    	}
		    	
    		</View>
		);
	}
}

const styles=StyleSheet.create({
	traficlabel_container:{
		height:30,
		flex:10,
		flexDirection:'row',
		alignItems:'flex-end',
		marginBottom:40,
	},
	traficlabel_container_left:{
		flex:7,
		flexDirection:'row',
		justifyContent:'center',
		paddingBottom:-5,
	},
	traficlabel_container_right:{
		flex:1,
		marginRight:-6,
	},
});
