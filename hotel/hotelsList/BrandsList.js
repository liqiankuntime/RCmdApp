/**
 * Created by chenty on 2016/10/22.
 */
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ListView,
    View,
    Text,
    PixelRatio,
    plateform,
    Dimensions
} from 'react-native';

import images from '../images/';
import Common from '../common/constants';
var WinWidth=Dimensions.get('window').width;
let Groups = [
    {id: 2, name: '经济'},
    {id: 3, name: '三星'},
    {id: 4, name: '四星'},
    {id: 5, name: '五星'},
];
class BrandsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: 2,
            refresh: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
        this._existBrand = this._existBrand.bind(this);

    }

    _isActive(group) {
        return group.id == this.state.group;
    }

    _existBrand(brand) {
        let {search} = this.props;
        return search.brand.indexOf(brand.id) > -1

    }

    _existGroup(group, brands, search) {
      console.log('group,brands',group, brands, search)
        for (let brand of brands) {
            if (brand.group == group) {
                if (search.brand.indexOf(brand.id) > -1) {
                    return true;
                }
            }
        }

        return false;
    }

    _filterBrandsBy(brands) {
        //brands:
        // [
		//   {groupName: "经济", group: 2, id: 1, name: "如家"},
		//
        //   {groupName: "经济", group: 2, id: 2, name: "七天"},
		//
        //   {groupName: "舒适", group: 3, id: 3, name: "裕龙酒店"},
		//
        //   {groupName: "高档", group: 4, id: 4, name: "假日大酒店"},
		//
        //   {groupName: "豪华", group: 5, id: 5, name: "香格里拉大酒店"}
        // ]
        console.log('_filterBrandsBy',brands);
        let group = this.state.group;
        let filtered = [];
        for (let brand of brands) {
            // if (group == 2 && brand.group < group) {
            //     filtered.push(brand);
            // }
            if (brand.group == group) {
                filtered.push(brand);
            }
        }
        console.log('filtered>',filtered);
        return filtered;
    }

    _cleanGroup(group) {
        let {search, brands} = this.props;
        for (let brand of brands) {
            if (brand.group == group) {
                let idx = search.brand.indexOf(brand.id);
                if (idx > -1) {
                    search.brand.splice(idx, 1);
                }
            }
        }
    }

    renderRow(brand) {
        let checked = this._existBrand(brand);
        let {search, brands} = this.props;
        console.log('search,brands::',search, brands,checked,brand);
        return (
            <TouchableHighlight
                underlayColor="white"
                onPress={()=> {

                    if (this._existBrand(brand)) {
                        let idx = search.brand.indexOf(brand.id);
                        search.brand.splice(idx, 1);
                    } else {
                        search.brand.push(brand.id);
                    }

                    let _exist = this._existGroup(this.state.group,brands,search);
                    this.setState({
                        clear: !_exist
                    })
                }}
            >
                <View>
                    <View style={styles.row}>
                        <Text style={{flex:1,fontSize:16,marginLeft:10}}>
                            {brand.name}
                        </Text>
                        {
                            checked ?
                                <Image style={[styles.rightIcon,{marginRight:10}]} source={images['choosed']} />
                             :
                                <Image style={[styles.rightIcon,{marginRight:10}]} source={images['nochecked']} />
                        }



                    </View>
                </View>

            </TouchableHighlight>
        )
    }
    //头部'不限'组件
    renderHeader() {
        let {brands,search} = this.props;
        let isNotExist = !this._existGroup(this.state.group,brands,search);
        console.log('brands:',brands);
        return (
            <TouchableHighlight

                style={{flex: 1, flexDirection: 'row', backgroundColor: 'white'}}
                onPress={()=> {
                    this._cleanGroup(this.state.group);

                    this.setState({
                        clear: true
                    })
                }}
            >
                <View style={{flex:1,height:48,borderBottomWidth: 1,borderColor:'#e5e5e5',justifyContent:'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{flex:1,fontSize:16,marginLeft:10}}>
                            不限
                        </Text>
                        {
                            isNotExist?

                                <Image style={[styles.rightIcon,{width:15,height:10,marginRight:10,marginTop:5}]} source={images['sortListRight']} />

                             :
                             null
                        }

                    </View>
                </View>

            </TouchableHighlight>
        )
    }

    render() {
        let {brands, search} = this.props;
        console.log('this.props:',brands,search);
        let clear = !this._existGroup(this.state.group,brands,search);
        return (
            <View style={styles.container}>
                <View style={styles.group}>
                    <View >
                        {Groups.map((group, idx)=> {
                            return (
                                <TouchableHighlight
                                    underlayColor="white"
                                    key={`group_${idx}`}
                                    style={[this._isActive(group) ? styles.active :styles.noActive]}
                                    onPress={()=> {
                                            this.setState({
                                            group: group.id,
                                        })
                                     }}
                                >
                                    <View style={styles.cell}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{flex:1,fontSize:16}}>
                                                {group.name}
                                            </Text>
                                            {this._existGroup(group.id, brands, search) ?
                                                <View style={{width:5,height:5,backgroundColor:'green',borderRadius:100}}></View>
                                                : null}
                                        </View>
                                    </View>

                                </TouchableHighlight>

                            )
                        })}
                    </View>
                </View>
                <View style={{flex:7,backgroundColor:'white'}}>
                    <View style={{flex:1,backgroundColor:'white'}}>
                        <ListView
                            showsVerticalScrollIndicator={false}
                            dataSource={this.state.dataSource.cloneWithRows(this._filterBrandsBy(brands))}
                            enableEmptySections={true}
                            renderRow={this.renderRow.bind(this)}
                            renderHeader={this.renderHeader.bind(this)}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity

                                style={[styles.Button,{width:WinWidth/4,borderWidth:1}]}
                                onPress={()=> {
                                this._cleanGroup(this.state.group);
                                this.setState({
                                    refresh: true,
                                    clear: true
                                })
                            }}
                            >
                                <Text style={{color: clear?'#e5e5e5':'#666',fontSize:16}}>
                                    清空
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity

                                style={[styles.Button,{width:WinWidth/3,backgroundColor:'#ed7140'}]}
                                onPress={()=> {
                                if (this.props.callback) {
                                    this.props.callback(search.brand);
                                }
                            }}
                            >
                                <Text style={{color:'#fff',fontSize:16}}>确定</Text>

                            </TouchableOpacity>


                        </View>
                    </View>
                </View>

            </View>


        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        height:48,
        borderBottomWidth: 1,
        borderColor:'#e5e5e5',
        alignItems:'center'
    },
    group: {
        flex:3,

    },
    cell: {
        flexDirection: 'row',
        marginTop:3,
        height:45,
        borderBottomWidth: 1,
        borderColor:'#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',

    },
    active: {
        backgroundColor: 'white',
    },
    noActive: {
        backgroundColor: '#F6F6F6',
    },
    rightIcon: {
        height: 24,
        width: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom:10
    },
    Button:{
        height:50,
        borderColor:'#e5e5e5',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    }
});
export default BrandsList;