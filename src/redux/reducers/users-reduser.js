import { get, ref } from 'firebase/database';
import { db } from '../../firebase/initialization';

const SET_USERS = "SET-USERS/users";

let initialState = {
    users: []
}


const usersReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USERS:
            return{
                ...state,
                users: action.data
            }
        default:
            return state;
    }
}

export const setUsers = (data) => ({type: SET_USERS, data: data});

const checkIsConfirm = async (key) => {
    const dbRef = ref(db, 'celebreties');
    const snapshot = await get(dbRef);

    if(snapshot.exists()){
        const celebreties = snapshot.val();

        for(let celebretyKey in celebreties){
            const celebrety = celebreties[celebretyKey];

            if(celebrety.isConfirm){
                for(let addressKey in celebrety.addresses){
                    const address = celebrety.addresses[addressKey];

                    if(address.key == key && address.isConfirm) {
                        return true
                    }
                }
            }
        }
    }

    return false
}

export const getUsersThunkCreator = () => async (dispatch) => {
    const dbRef = ref(db, 'users');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const newList = [];

        for(let userKey in data){
            const user = data[userKey]

            if(user.reportArray){
                let numberReport = 0;
                

                for(let reportKey in user.reportArray){
                    const key = user.reportArray[reportKey];
                    
                    if(await checkIsConfirm(key)){
                        numberReport += 1;
                    }
                }

                if(numberReport > 0){
                    newList.push({
                        ...user,
                        numberReport
                    });
                }
            }
        }

        dispatch(setUsers(newList));
    }
}

export default usersReducer;