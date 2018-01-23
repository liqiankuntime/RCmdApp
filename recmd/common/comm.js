/**
 * Created by haosha on 16/8/31.
 */

export const ITEM_TAXI_TO = 1;   //送机
export const ITEM_TAXI_FROM = 3; //接机
export const ITEM_TRAFFIC = 2;   //长途交通
export const ITEM_HOTEL = 4;     //酒店

export function selectItem(state, tripId, itemId) {
    const trip = state.trips.find(trip => trip.id == tripId);
    return trip ? trip.items.find(item => item.id == itemId) : undefined;
}

export function selectTrip(state, tripId) {
    return state.trips.find(trip => trip.id == tripId);
}

export function selectTripByDate(state, date) {
    return state.trips.find(trip => trip.departDate == date);
}

export function sortTripsByDate(unsorted) {
    const trips = unsorted.concat();
    trips.sort((l, r) => {
        const ldate = l.date.replace(/-/g, '/');
        const rdate = r.date.replace(/-/g, '/');
        return Date.parse(ldate) - Date.parse(rdate);
    });
    return trips;
}

//Input: 2000-01-01
//Output: "1月1日"
export function getDate(YYMMdd){
    if (YYMMdd && YYMMdd.length==10){
        const date = new Date(Date.parse(YYMMdd.replace(/-/g, '/')));
        const mm = date.getMonth()+1;
        const dd = date.getDate();
        //const day = (mm < 10 ? '0' + mm : mm) + '月' + (dd < 10 ? '0' + dd : dd) + '日';
        const  day = mm + '月' + (dd < 10 ? '0' + dd : dd) + '日';
        return day;
    }
    else
        return ''
}

//Input: 2000-01-01
//Output: "周日","周一","周二","周三","周四","周五","周六"
export function getDayOfWeek(YYMMdd){
    const date = new Date(Date.parse(YYMMdd.replace(/-/g, '/')));
    const dayOfWeek = new Array("周日","周一","周二","周三","周四","周五","周六");
    const day = dayOfWeek[date.getDay()];
    return day;
}

export function mergeFromAndTo(origin, item) {
    const {from: item_from, to: item_to} = item;
    const {from: origin_from, to: origin_to} = origin;
    const from = {...origin_from, ...item_from};
    const to = {...origin_to, ...item_to};
    return {...origin, ...item, from, to};
}