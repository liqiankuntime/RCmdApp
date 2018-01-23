/**
 * Created by huangzhangshu on 17/4/19.
 */

export const constant = [
    {
        name: '寄件地址',
        placeholder: '寄件地址',
        type: 'address',
        code: 'send',
        emptyLine: false,
    },
    {
        name: '收件地址',
        placeholder: '收件地址',
        // value: {
        //     "id": 2,
        //     "staffId": "707",
        //     "groupId": "1",
        //     "companyId": "3",
        //     "province": "上海市",
        //     "city": "上海市",
        //     "area": "嘉定区",
        //     "street": "安亭镇",
        //     "address": "112",
        //     "userName": "sss",
        //     "mobile": "1212121223243",
        //     "company": "kejigongsi",
        //     "type": "to",
        //     "lastUpdate": "2017-04-21T15:19:13.726955",
        //     "lastUsed": null,
        //     "isDeleted": false
        // },
        type: 'address',
        code: 'put',
        emptyLine: true,
    },
    {
        name: '上门时间',
        placeholder: '快递统一收件',
        emptyLine: true,
        showArrow: true,
        code: 'time',
        default: true,
    },
    {
        name: '物品名称',
        type: 'textinput',
        placeholder: '请填写名称',
        emptyLine: false,
        showArrow: false,
        code: 'name',
    },
    {
        name: '产品类型',
        value: '顺丰次日',
        result: '顺丰次日',
        emptyLine: true,
        showArrow: true,
        code: 'product',
    },
    {
        name: '运输时效',
        placeholder: '',
        emptyLine: false,
        showArrow: false,
        code: 'arrivetime',
    },
    {
        name: '增值服务',
        value: '未保价',
        emptyLine: true,
        showArrow: true,
        code: 'value_added_services',
    },
    {
        name: '付款方式',
        value: '寄方付',
        result: '寄方付',
        emptyLine: true,
        showArrow: true,
        code: 'payment',
    },

];

export const address = [
    {
        name: '公司名称',
        type: 'textinput',
        placeholder: '个人或公司名称',
        emptyLine: false,
        showArrow: false,
        code: 'company',
    },
    {
        name: '寄件人',
        type: 'textinput',
        placeholder: '请输入姓名',
        emptyLine: false,
        showArrow: false,
        code: 'userName',
    },
    {
        name: '联系电话',
        type: 'textinput',
        keyboardType: 'numeric',
        maxLength: 13,
        placeholder: '手机号或带区号的固话',
        emptyLine: false,
        showArrow: false,
        code: 'mobile',
    },
    {
        name: '省市区',
        placeholder: '请选择所在的省市区',
        emptyLine: false,
        showArrow: false,
        code: 'province',
    },
    {
        name: '街道',
        placeholder: '请选择街道',
        emptyLine: false,
        showArrow: false,
        code: 'street',
    },
    {
        name: '详细地址',
        type: 'textinput',
        placeholder: '请输入详细的地址门牌',
        emptyLine: false,
        showArrow: false,
        code: 'address',
    },
];

export const initialConstant = constant.slice(0);