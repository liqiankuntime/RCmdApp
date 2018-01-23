/**
 * Created by zhaoxj on 16/10/18.
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import images from '../images/';
const icons0={
    'iconImage':[images['facility_square'],images['facility_num'],images['facility_floor'],images['facility_bed'],images['facility_window']],
    'iconText':{fontSize:12,color:'#fff'},
}
const icons1={
    'iconImage':[images['hotel_facilities_square'],images['hotel_facilities_num'],images['hotel_facilities_floor'],images['hotel_facilities_bed'],images['hotel_facilities_window']],
    'iconText':{fontSize:12,color:'#999'}
}

class FacilitiesItem extends Component {

    render(){
        var {
          itemShowCon,
          textStyle
        }=this.props;
        return(
          <View style={styles.itemContainerRowBox}>
              {itemShowCon.facilityIcon!='' &&
              <View style={styles.itemContainerRow}>
                  <Image source={itemShowCon.facilityIcon} style={styles.itemImg}  />
                  <Text style={textStyle}>{itemShowCon.facilityText}</Text>
              </View>
              }

          </View>
        )

    }
}
class FacilitiesCpmponent extends Component {

    render(){

        let theFacilities=this._theFacilities();
        let selIcon=icons0;
        if(this.props.styleControl==1){//1表示订单页面的房型设施,0表示房型页面的房型设施
            selIcon=icons1;
        }
        return(
          <View style={styles.container}>
              {theFacilities.length>0 &&
              theFacilities.map((data,i) => {
                  return(
                    <View style={{flexDirection:'row',flex:1,}} key={i}>
                        {data.length>0 &&
                        data.map((data2,y) => {
                            let itemShowCon=this._facilitiesShow(data2);
                            return (
                              <FacilitiesItem key={y} itemShowCon={itemShowCon} textStyle={selIcon.iconText}/>
                            )
                        })
                        }
                    </View>
                  )
              })
              }
          </View>

        )
    }

    _theFacilities(){
        let of=this.props.otherFacilities||'';
        let facilitiesSet=[];
        let facilitiesSetTwo=[];
        let fKeys = Object.keys(of);
        let fVal=[of[fKeys[0]],of[fKeys[1]],of[fKeys[2]],of[fKeys[3]],of[fKeys[4]]];
        let fac=[];
        for(let i=0;i<fVal.length;i++){
            if(fVal[i]!='') {
                if(facilitiesSet.length<3){
                    facilitiesSet.push(fKeys[i]);
                }else{
                    facilitiesSetTwo.push(fKeys[i]);
                }
            }
        }
        if(0<facilitiesSet.length<3){
            for(let i=0;i<3-facilitiesSet.length;i++){
                facilitiesSet.push('0');
            }
        }
        if(0<facilitiesSetTwo.length<3){
            for(let i=0;i<3-facilitiesSetTwo.length;i++){
                facilitiesSetTwo.push('0');
            }
        }
        fac.push(facilitiesSet,facilitiesSetTwo);
        return fac;
    }
    _facilitiesShow(data){
        let facility_1 ='facility_1';
        let itemShowCon={
            facilityText:'',
            facilityIcon:images[facility_1],
        };
        let selIcon=icons0;
        if(this.props.styleControl==1){//1表示订单页面的房型设施,0表示房型页面的房型设施
            selIcon=icons1;
        }
        let otherFacilities=this.props.otherFacilities||'';
        switch (data) {
            case 'area':
                itemShowCon={
                    facilityText:otherFacilities.area+'平米',
                    facilityIcon:selIcon.iconImage[0],
                }
                break;
            case 'capcity':
                itemShowCon={
                    facilityText:'可入住'+otherFacilities.capcity+'人',
                    facilityIcon:selIcon.iconImage[1],
                }
                break;
            case 'floor':
                let floor=otherFacilities.floor+'层'
                itemShowCon={
                    facilityText:floor,
                    facilityIcon:selIcon.iconImage[2],
                }
                break;
            case 'bedType':
                itemShowCon={
                    facilityText:otherFacilities.bedType,
                    facilityIcon:selIcon.iconImage[3],
                }
                break;
            case 'window':
                itemShowCon={
                    facilityText:otherFacilities.window,
                    facilityIcon:selIcon.iconImage[4],
                }
                break;
            case '0':
                itemShowCon={
                    facilityText:'',
                    facilityIcon:'',
                }
                break;
        }
        return itemShowCon;
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    itemContainerRowBox:{
        flex:2,
    },
    itemContainerRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        height:20,
        marginLeft:10,
        marginRight:10,
        marginBottom:15,
    },
    itemImg:{
        marginRight:5,
        width:24,
        height:24,
    },

});
export default FacilitiesCpmponent;