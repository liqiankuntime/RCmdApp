/**
 * Created by haosha on 16/10/21.
 */

import * as types from '../actions/actionTypes';
import store from '../store';
import {createEntryTimeArray} from '../common/SortListView'
import {getTimeDiffer} from '../common/comm'

const initialState = {
    data:{},
    detail:null,
    success: false,
    viewLoading: false,
    modalLoading: false
}

function get_ratePlan_detail(state=initialState, action) {
    const hotel = action.data;
    const room = hotel.rooms[0];
    const ratePlan = room.ratePlan[0];
    let data = {...state.data,...getState(hotel,room,ratePlan)};
    return {...state, detail:action.data, success:true, data}
}

function create_hotel_order(state=initialState, action) {
    const globalState = store.getState();
    const detail = globalState.detail.data;
    const room = detail.rooms.find(room => {
            return room.ratePlan.find(ratePlan => {
                return ratePlan.ratePlanId == action.ratePlanId;
            });
        }
    );
    const ratePlan = room.ratePlan.find(ratePlan => {
        return ratePlan.ratePlanId == action.ratePlanId;
    });
    let data = {...state.data,...getState(detail,room,ratePlan)};
    return {...state,detail:{...detail,rooms:[{...room,ratePlan:[{...ratePlan}]}]}, success:true, data};
}

function update_hotel_order(state, action) {
    // const {invoice, ...rest} = action.data;
    // const {invoice:origin} = state.order.data;
    // const inv = {...origin, ...invoice};
    // const data = {...state.data, ...rest, invoice:inv};
    const data = {...state.data, ...action.data}
    return {...state, data};
}

export default function orderReducer(state=initialState, action = {}) {
    switch (action.type) {
        case types.CREATE_HOTEL_ORDER:
            return create_hotel_order(state, action);
        case types.UPDATE_HOTEL_ORDER:
            return update_hotel_order(state, action);
        case types.UPDATE_HOTEL_DETAIL:
            return {...state, detail:action.detail};
        case types.SHOW_HOTEL_ORDER_LOADING:
            return {...state, viewLoading: action.viewLoading, modalLoading: action.modalLoading};
        case types.GET_HOTEL_ORDER:
            return {...state, data: action.data};
        case types.GET_RATEPLAN_DETAIL:
            return get_ratePlan_detail(state,action);
        case types.SUBMIT_HOTEL_ORDER:
            return {...state, data: action.data};
        case types.CANCEL_HOTEL_ORDER:
            return update_hotel_order(state, action);
        default :
            return state;
    }
}

function getState(hotel,room,ratePlan) {


    let data = {

        id: 0,
        orderNo: null,
        orderNoSupplier: null,
        orderStatus: "",
        payStatus: "",

        orderType:hotel.orderType,
        openUserName:hotel.openUserName,
        cityId: hotel.cityId,
        cityName: hotel.cityName,
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        hotelAddress: hotel.address,
        traffic: hotel.traffic,
        hotelPhone: hotel.phone,
        lat:hotel.lat,
        lng:hotel.lng,
        roomTypeId: ratePlan.roomTypeId,
        roomTypeName: room.roomTypeName,
        roomDescription: room.description,
        ratePlan: {...ratePlan,hotel:{...hotel,rooms:[{...room,ratePlan:[{...ratePlan}]}]}},
        extendInfo: ratePlan.extendInfo,
        ratePlanId: ratePlan.ratePlanId,
        ratePlanName: ratePlan.ratePlanName,
        currencyCode: ratePlan.currencyCode,
        breakfast: ratePlan.breakfast,
        startDate: hotel.startDate,
        endDate: hotel.endDate,
        dayCount: hotel.days,
        nightlyRates: ratePlan.nightlyRates,

        timeEarly: null,//
        timeLater: null,//
        sumPrice: ratePlan.totalRate,//
        roomNum: 1,//
        guaranteeAmount: ratePlan.guaranteeInfo.IsGuarantee=='true'?ratePlan.guaranteeInfo.GuaranteeCost:0,
        isNeedInvoice:   ratePlan?ratePlan.invoiceMode == 'Elong':false,
        // invoice: null
        averageRate: ratePlan.averageRate,
        remark: "", //to
        isDayGuarantee: false,
        isTimeGuarantee: false,
        // isNeedInvoice

        // companyId: 3, //to
        // groupId: 1, //to
        // staffId: 714, //to
        // mobile: 13838383838, //to
        // userName: "wangwei", //to
        // hotelOrderCustomer: [], //to
        // linkuserName: "", //to
        // linkuserMobile: "", //to
        // linkuserEmail: '',

        pubPriType: "pub", //to
        isInstantConfirm: null,
        paymentDeadlineTime: null,
        paymentType: ratePlan.paymentType,
        supplierCode: ratePlan.supplierCode,
        supplierName: ratePlan.supplierName,
        customerIp: "127.168.1.1",

        orderRule: allRule(
            getRules(hotel.bookingRules,ratePlan.bookingRules),
            getRules(hotel.guaranteeRules,ratePlan.guaranteeRules),
            getRules(hotel.prepayRules,ratePlan.prepayRules),
            getRules(hotel.valueAdds,ratePlan.valueAdds)
        ),
        // bookingRules: getRules(hotel.bookingRules,ratePlan.bookingRules),
        // guaranteeRules: getRules(hotel.guaranteeRules,ratePlan.guaranteeRules),
        // prepayRules: getRules(hotel.prepayRules,ratePlan.prepayRules),
        // valueAdds: getRules(hotel.valueAdds,ratePlan.valueAdds),
    };
    if (hotel.timeLater==undefined||hotel.timeLater==null) {
        let pro = {
            dateLater: hotel.startDate,
            startTime: ratePlan.guaranteeInfo.StartTime,
            endTime: ratePlan.guaranteeInfo.EndTime,
            guaranteeCost: ratePlan.guaranteeInfo.GuaranteeCost,
            guaranteeInfo: ratePlan.guaranteeInfo,
        };
        let timeArray = createEntryTimeArray(pro);
        let time = hotel.startDate+' 13:30:00';
        const {guarantee,sort} = getTimeDiffer(time)==1?timeArray[0]:timeArray[2];
        let guaranteeInfo = ratePlan.guaranteeInfo;
        if (guaranteeInfo.IsGuarantee == 'condition' && guarantee) {
            data.guaranteeAmount = guaranteeInfo.GuaranteeCost;
        }
        data.timeLater = sort;
        data.isTimeGuarantee = guarantee;
    }

    return data;
}

function getRules(rulesObject,rulesArray) {
    let rules = [];
    rulesArray.map((ruleId)=>{
        rules.push(rulesObject[ruleId])
    });
    return rules;
}

function allRule(bookingRules,guaranteeRules,prepayRules,valueAdds) {
    let ruleString = "";
    bookingRules.map((string)=>{
        ruleString = ruleString+string+"\n"
    });
    guaranteeRules.map((string)=>{
        ruleString = ruleString+string+"\n"
    });
    prepayRules.map((string)=>{
        ruleString = ruleString+string+"\n"
    });
    valueAdds.map((string)=>{
        ruleString = ruleString+string+"\n"
    });
    return ruleString;
}
