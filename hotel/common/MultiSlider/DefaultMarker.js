import React, {
  PropTypes,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableHighlight,
} from 'react-native';


export default class DefaultMarker extends React.Component {
  static propTypes = {
    pressed: PropTypes.bool,
    pressedMarkerStyle: View.propTypes.style,
    markerStyle: View.propTypes.style
  };

  render() {
    const text = this.props.currentValue==850?'不限':'￥'+this.props.currentValue
    return (
      <TouchableHighlight>

        <View
          style={{flexDirection:'column',alignItems:'center'}}
        >

          <Text style={{flex:1,flexDirection:'row',marginBottom:2 }}>{text}</Text>
          <View
              style={[styles.markerStyle, this.props.markerStyle, this.props.pressed && styles.pressedMarkerStyle, this.props.pressed && this.props.pressedMarkerStyle]}
          />

        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  markerStyle: {
    ...Platform.select({
      ios: {
        height: 28,
        width: 28,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
      },
      android: {
        height: 28,
        width: 28,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: '#c6c6c6',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
      }
    }),
  },
  pressedMarkerStyle: {
    ...Platform.select({
      ios: {
      },
      android: {
        
      },
    }),
  },
});
