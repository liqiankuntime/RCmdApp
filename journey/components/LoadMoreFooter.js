/**
 * Created by chenty on 16/6/25.
 */
import React from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

export default class LoadMoreFooter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theEndShow:true,
        }
    }
    render() {
        const {loadMoreText} = this.props;
        if(loadMoreText=='继续上滑查看部门行程' || loadMoreText=='暂无行程哦,继续上滑查看部门行程' || loadMoreText=='继续上滑查看直属下属行程' || loadMoreText=='暂无行程哦,继续上滑查看直属下属行程'){
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>{loadMoreText}</Text>
                </View>
            )
        }else if(loadMoreText=='暂时没有行程呦!' || loadMoreText=='下属员工暂时没有行程呦!' || loadMoreText=='本部门员工暂时没有行程呦!'){
            return (
                <View style={[styles.footer,styles.footerEmpty,{paddingTop:100,flexDirection:'column',height:270,alignItems:'center'}]}>
                    <Image
                        source={require('../img/ic_null_list.png')}
                        style={{width:113,height:110}}

                    />
                    <Text style={[styles.footerTitle,{marginTop: 10,
                            fontSize: 18,
                            color: '#ed7140'}]}>{loadMoreText}</Text>
                </View>
            )
        }else if(loadMoreText=='已经到底了'){
            return (

                <View style={styles.footer}>
                    <Text style={this.state.theEndShow?styles.footerTitle:styles.footerTitleNone}>{loadMoreText}</Text>
                </View>
            );

        }
        return (
            <View style={styles.footer}>
                <ActivityIndicator/>
                <Text style={styles.footerTitle}>{loadMoreText}</Text>
            </View>
        )
    }
    _dataEndTip(){
        let m=this;
        setTimeout(function () {
            m.setState(
                {
                    theEndShow:false,
                }
            )
        },1000);
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        backgroundColor:'#f3f3f3',
    },
    footerEmpty:{
        paddingTop:60,
        height:100
    },

    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    },
    footerTitleNone: {
        marginLeft: 10,
        fontSize: 15,
        color: '#f3f3f3'
    }
})