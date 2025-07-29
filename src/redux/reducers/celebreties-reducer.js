import { get, push, ref, set } from 'firebase/database';
import { db, auth } from '../../firebase/initialization';
import { uploadImage } from '../../firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const SET_CELEBRETIES = "SET-CELEBRETIES/celebreties";
const SET_CELEBRETIES_NUMBER = "SET-CELEBRETIES-NUMBER/celebreties";
const SET_POINTS = "SET-POINTS/celebreties";
const TOGGLE_ACTIVE_POINT = "TOGGLE-ACTIVE-POINT/celebreties";
const SET_SEARCH_CELEBRETY_INPUT = "SET_SEARCH_CELEBRETY_INPUT/celebreties";
const SET_COUNRTY_INPUT = "SET-COUNRTY-INPUT/celebreties";
const SET_CITY_INPUT = "SET-CITY-INPUT/celebreties";
const SET_COUNRTY_LIST = "SET-COUNRTY-LIST/celebreties";
const SET_CITY_LIST = "SET-CITY-LIST/celebreties";
const DEL_COUNRTY_LIST = "DEL-COUNRTY-LIST/celebreties";
const DEL_CITY_LIST = "DEL-CITY-LIST/celebreties";
const SELECT_ALL = "SELECT-ALL/celebreties";
const SET_FILTER_LIST = "SET-FILTER-LIST/celebreties";
const SET_ACTIVE_FILTER_ITEM = "SET-ACTIVE-FILTER-ITEM/celebreties";
const SORT_CELEBRETIES = "SORT-CELEBRETIES/celebreties";

let initialState = {
    celebreties: [],
    points: [],
    searchCelebretyInput: "",
    searchCelebretyList: [],
    countryInput: "",
    cityInput: "",
    countryList: [],
    cityList: [],
    filterList: [],
    celebretiesNumber: -1,
    sortedAddresses: [],
    sortedSearched: []
}

const getFilteredPoints = (state) => {
    return state.celebreties
        .filter(data => {
            if(!state.filterList.some(item => item.isActive)){
                return data
            }

            for(let i = 0; i < state.filterList.length; i++){
                const item = state.filterList[i];

                if(item.isActive && item.title === data.category){
                    if(item.list.some(item => item.isActive)){

                        for(let j = 0; j < item.list.length; j++){
                            const item = state.filterList[i].list[j];

                            if(item.isActive && item.title === data.subcategory){
                                if(item.list.some(item => item.isActive)){

                                    for(let q = 0; q < item.list.length; q++){
                                        const item = state.filterList[i].list[j].list[q];

                                        if(item.isActive && item.title === data.tags[0]){
                                            return data
                                        }
                                    }
                                }else{
                                    return data
                                }
                            }
                        }
                    }else{
                        return data
                    }
                }
            }
        })
        .filter(data => {
            if(state.countryList.length == 0){
                return data
            }

            for(let i = 0; i < state.countryList.length; i++){
                if(state.countryList[i]?.toLowerCase() === data.country?.toLowerCase()){
                    return data
                }
            }
        })
        .filter(data => {
            if(state.cityList.length == 0){
                return data
            }

            for(let i = 0; i < state.cityList.length; i++){
                if(state.cityList[i]?.toLowerCase() === data.city?.toLowerCase()){
                    return data
                }
            }
        })
        .map(item => {
            return{
                ...item, 
                isShow: false
            }
        });
}

const celebretiesReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_CELEBRETIES:
            return{
                ...state,
                celebreties: [...action.data]
            }
        case SET_CELEBRETIES_NUMBER:
            return{
                ...state,
                celebretiesNumber: action.celebretiesNumber
            }
        case SET_POINTS:
            const data = getFilteredPoints(state);

            return {
                ...state,
                points: [...data]
            }
        case TOGGLE_ACTIVE_POINT:
            return{
                ...state,
                points: [...state.points.map((point, i) => {
                    if(i === action.i){
                        return {
                            ...point,
                            isShow: !point.isShow
                        }
                    }
    
                    return {
                        ...point,
                        isShow: false
                    }
                })]
            }
        case SET_SEARCH_CELEBRETY_INPUT:
            const value = action.value.toLowerCase().split(' ');
            const newCelebretyList = [];
            
            state.celebreties.forEach(celebrety => {
                const first_name_first = celebrety.first_name.slice(0, value[0].length).toLowerCase();
                const last_name_first = celebrety.last_name.slice(0, value[0].length).toLowerCase();

                if(action.value !== "" && value.length < 3 && (value[0] === first_name_first || value[0] === last_name_first)){
                    if(value[1]){
                        const first_name_second = celebrety.first_name.slice(0, value[1].length).toLowerCase();
                        const last_name_second = celebrety.last_name.slice(0, value[1].length).toLowerCase();

                        if(value[1] == first_name_second || value[1] == last_name_second){
                            newCelebretyList.push(celebrety);
                        }

                        return
                    }

                    newCelebretyList.push(celebrety);
                }
            });

            return{
                ...state,
                searchCelebretyInput: action.value,
                searchCelebretyList: [...newCelebretyList]
            }
        case SET_COUNRTY_INPUT:
            return{
                ...state,
                countryInput: action.value
            }
        case SET_CITY_INPUT:
            return{
                ...state,
                cityInput: action.value
            }
        case SET_COUNRTY_LIST:
            if(state.countryInput !== "" && state.countryInput !== " "){
                const newValue = state.countryInput.charAt(0).toUpperCase() + state.countryInput.substring(1).toLowerCase();

                return{
                    ...state,
                    countryList: [...state.countryList, newValue],
                    countryInput: ""
                }
            }
        case SET_CITY_LIST:
            if(state.cityInput !== "" && state.cityInput !== " "){
                const newValue = state.cityInput.charAt(0).toUpperCase() + state.cityInput.substring(1).toLowerCase();

                return{
                    ...state,
                    cityList: [...state.cityList, newValue],
                    cityInput: ""
                }
            }
        case DEL_COUNRTY_LIST:
            return{
                ...state,
                countryList: state.countryList.filter((item, i) => i !== action.position)
            }
        case DEL_CITY_LIST:
            return{
                ...state,
                cityList: state.cityList.filter((item, i) => i !== action.position)
            }
        case SELECT_ALL:
            return{
                ...state,
                countryList: [],
                cityList: []
            }
        case SET_FILTER_LIST:
            const new_list = [];

            state.celebreties.forEach(item => {
                let i;
    
                new_list.forEach((elem, j) => {
                    if(elem.title === item.category){
                        i = [j];
    
                        elem.list.forEach((elem, q) => {
                            if(elem.title === item.subcategory){
                                i = [j, q];
    
                                elem.list.forEach((elem, k) => {
                                    if(elem.title === item.tags[0]){
                                        i = [j, q, k];
                                    }
                                });
                            }
                        });
                    }
                });
          
                if(i?.length === 3){
                    new_list[i[0]].list[i[1]].list[i[2]].list.push({
                        title: item.first_name + " " + item.last_name,
                        id: item.id
                    });
                }else if(i?.length === 2){
                    new_list[i[0]].list[i[1]].list.push({
                        title: item.tags[0],
                        isActive: false,
                        list:[
                            {
                                title: item.first_name + " " + item.last_name,
                                id: item.id
                            }
                        ]
                    });
                }else if(i?.length === 1){
                    new_list[i[0]].list.push({
                        title: item.subcategory,
                        isActive: false,
                        list: [
                            {
                                title: item.tags[0],
                                isActive: false,
                                list:[
                                    {
                                        title: item.first_name + " " + item.last_name,
                                        id: item.id
                                    }
                                ]
                            }
                        ]
                    });
                }else{
                    new_list.push({
                        title: item.category,
                        isActive: false,
                        list: [
                            {
                                title: item.subcategory,
                                isActive: false,
                                list: [
                                    {
                                        title: item.tags[0],
                                        isActive: false,
                                        list:[
                                            {
                                                title: item.first_name + " " + item.last_name,
                                                id: item.id
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
                }
            })

            return{
                ...state,
                filterList: new_list
            }
        case SET_ACTIVE_FILTER_ITEM:
            return{
                ...state,
                filterList: state.filterList.map((item, i) => {
                    if(action.position[0] === i) {
                        return {
                            ...item,
                            isActive: true,
                            list: item.list.map((item, j) => {
                                if(action.position[1] === j){
                                    return{
                                        ...item,
                                        isActive: true,
                                        list: item.list.map((item, q) => {
                                            if(action.position[2] === q){
                                                return{
                                                    ...item,
                                                    isActive: true
                                                }
                                            }

                                            return{
                                                ...item,
                                                isActive: false
                                            }
                                        })
                                    }
                                }

                                return{
                                    ...item,
                                    isActive:false
                                }
                            })
                        }
                    }

                    return {
                        ...item,
                        isActive: false
                    }
                })
            }
        case SORT_CELEBRETIES:
            const sorted_celebreties = [ ...state.celebreties ];
            const sorted_searched = [ ...state.celebreties ];

            for(let q = 0; q < sorted_celebreties.length - 1; q ++){
                for(let i = sorted_celebreties.length - 1; i > q  - 1; i--){
                    const item = sorted_celebreties[i];
                    const next = sorted_celebreties[i + 1];

                    if(next?.addresses.length > item?.addresses.length){
                        sorted_celebreties[i] = next;
                        sorted_celebreties[i + 1] = item;
                    }
                }
            }

            for(let q = 0; q < sorted_searched.length - 1; q ++){
                for(let i = sorted_searched.length - 1; i > q - 1; i--){
                    const item = sorted_searched[i];
                    const next = sorted_searched[i + 1];

                    if(next?.searchNumber > item?.searchNumber){
                        sorted_searched[i] = next;
                        sorted_searched[i + 1] = item;
                    }
                }
            }

            return{
                ...state,
                sortedAddresses: sorted_celebreties,
                sortedSearched: sorted_searched
            }
        default:
            return state;
    }
}

export const setCelebreties = (data) => ({type: SET_CELEBRETIES, data: data});
export const setCelebretiesNumber = (celebretiesNumber) => ({type: SET_CELEBRETIES_NUMBER, celebretiesNumber: celebretiesNumber});
export const setPoints = (filter) => ({type: SET_POINTS, filter: filter});
export const toggleActivePoint = (i) => ({type: TOGGLE_ACTIVE_POINT, i: i});
export const setSearchCelebretyInput = (value) => ({type: SET_SEARCH_CELEBRETY_INPUT, value: value});
export const setCountryInput = (value) => ({type: SET_COUNRTY_INPUT, value: value});
export const setCityInput = (value) => ({type: SET_CITY_INPUT, value: value});
export const setCountryList = () => ({type: SET_COUNRTY_LIST});
export const setCityList = () => ({type: SET_CITY_LIST});
export const delCountryList = (position) => ({type: DEL_COUNRTY_LIST, position: position});
export const delCityList = (position) => ({type: DEL_CITY_LIST, position: position});
export const selectAll = () => ({type: SELECT_ALL});
export const setFilterList = () => ({type: SET_FILTER_LIST});
export const setActiveFilterItem = (position) => ({type: SET_ACTIVE_FILTER_ITEM, position: position});
export const sortCelebreties = () => ({type: SORT_CELEBRETIES})

export const getCelebretiesThunkCreator = () => async (dispatch) => {
    const dbRef = ref(db, 'celebreties');
    const snapshot = await get(dbRef);
    const newList = [];

    if (snapshot.exists()) {
        const data = snapshot.val();

        for(const key in data){
            const item = data[key];

            if(item.isConfirm){
                const newAddresses = [];

                item.addresses?.forEach(address => {
                    if(address.isConfirm){
                        newAddresses.push(address)
                    }
                });

                newList.push({
                    ...item,
                    searchNumber: item.searchNumber? item.searchNumber: 0,
                    addresses: newAddresses,
                    key
                })
            }
        };

        dispatch(setCelebretiesNumber(Object.values(snapshot.val()).length))
    }

    dispatch(setCelebreties(newList));
    dispatch(setPoints({
        country: [],
        city: []
    }));
    dispatch(setFilterList());
    dispatch(sortCelebreties());
}

const updateReportCounter = async (values, addressKey) => {
    if(auth.currentUser){
        const dbRef = ref(db, 'users');
        const snapshot = await get(dbRef);

        if(snapshot.val()){
            const data = Object.values(snapshot.val());

            for(let key in data){
                if(auth.currentUser.email == data[key].email){
                    const category = values.category !== "other"? values.categories: values.category_individual;
                    const categories = data[key].categories? [...data[key].categories, category]: [category];   
                    const newDbRef = ref(db, 'users/'+key);

                    set(newDbRef, {
                        ...data[key],
                        categories: values.category? categories: data[key].categories,
                        reportArray: [(!!newDbRef.length && newDbRef.length !== 0)? [...newDbRef, addressKey]: [addressKey] ]
                    });
                }
            }
        }
    }
}

export const createCelebretyThunkCreator = (values, celebretiesNumber) => async (dispatch) => {
    const photo = await uploadImage(values.photo, "photos");

    const key = uuidv4();

    const data = {};

    values.context.forEach((item) => {
        if(item.id.search(/place/) >= 0){
            data.city = item.text
        }else if(item.id.search(/country/) >= 0){
            data.country = item.text
        }
    });

    const birthDate = new Date(values.birth);
    const currentDate = new Date();

    const ageInMilliseconds = currentDate - birthDate;
    const age = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

    const date = values.date.replace(/-/g, ".");

    const dbRef = ref(db, 'celebreties');
    const newDbRef = push(dbRef);
    
    await set(newDbRef, {
        id: celebretiesNumber + 1,
        first_name: values.full_name.split(" ")[0],
        last_name: values.full_name.split(" ")[1] ? values.full_name.split(" ")[1]: "",
        country: data.country,
        city: data.country,
        age: age,
        birth: values.birth.replace(/-/g, "."),
        tags: values.tags.split(" "),
        category: values.category === "other"? values.category_individual: values.category,
        subcategory: values.subcategory === "other"? values.subcategory_individual: values.subcategory,
        photo: photo,
        movies: [],
        location: {...values.location},
        last_update: date,
        description: "",
        career: "",
        wealth: "",
        isConfirm: false,
        gender: values.gender,
        social_networks: {
            facebook: values.facebook,
            instagram: values.instagram,
            twitter: values.twitter
        },
        addresses: [
            {
                time: values.time,
                links: values.links.split(" "),
                country: values.address.split(" ")[0],
                city: values.address.split(" ")[1],
                date: date,
                location: {...values.location},
                key: key,
                isConfirm: false
            }
        ]
    });

    await updateReportCounter(values, key);
}

export const addAddressThunkCreator = (values, id) => async (dispatch) => {
    const proof = await uploadImage(values.proof, "proofs");

    const key = uuidv4();

    const data = {};

    values.context.forEach((item) => {
        if(item.id.search(/place/) >= 0){
            data.city = item.text
        }else if(item.id.search(/country/) >= 0){
            data.country = item.text
        }
    });

    const dbRef = ref(db, 'celebreties');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        const snapshotData = snapshot.val();

        for(let key in snapshotData){
            if(snapshotData[key].id === +id){
                const newDbRef = ref(db, 'celebreties/'+key);
                
                const newAddresses = [];

                if(snapshotData[key].addresses){
                    snapshotData[key].addresses.forEach(item => {
                        newAddresses.push(item);
                    });
                }

                newAddresses.push({
                    address: values.address,
                    city: data.city,
                    country: data.country,
                    date: values.date,
                    newspapers: values.newspapers,
                    location: values.location,
                    postal: values.postal,
                    time: values.time,
                    proof: proof,
                    isConfirm: false,
                    key: key
                })

                set(newDbRef, {
                    ...snapshotData[key],
                    location: values.location,
                    addresses: newAddresses
                });
            }
        }
    }

    await updateReportCounter(values, key);
}

export const changeSearchNumberThunkCreator = (id) => async (dispatch) => {
    const dbRef = ref(db, 'celebreties');
    const snapshot = await get(dbRef);
    const newList = [];

    if (snapshot.exists()) {
        const snapshotData = snapshot.val();

        for(let key in snapshotData){
            if(snapshotData[key].id === +id){
                const newDbRef = ref(db, 'celebreties/'+key);
                
                set(newDbRef, {
                    ...snapshotData[key],
                    searchNumber: snapshotData[key].searchNumber? snapshotData[key].searchNumber + 1: 1
                });
            }
        }

        Object.values(snapshot.val()).forEach(item => {
            if(item.isConfirm){
                const newAddresses = [];

                item.addresses?.forEach(address => {
                    if(address.isConfirm){
                        newAddresses.push(address)
                    }
                });

                newList.push({
                    ...item,
                    searchNumber: item.searchNumber? item.searchNumber: 0,
                    addresses: newAddresses
                })
            }
        });

        dispatch(setCelebreties(newList));
    }

    dispatch(sortCelebreties());
}

export default celebretiesReducer;