import { get, ref } from 'firebase/database';
import { db } from '../../firebase/initialization';

const SET_ARTICLES = "SET-ARTICLES/articles";

let initialState = {
    articles: []
}


const articlesReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_ARTICLES:
            return{
                ...state,
                articles: action.data
            }
        default:
            return state;
    }
}

export const setArticles = (data) => ({type: SET_ARTICLES, data: data});

export const getArticlesThunkCreator = () => async (dispatch) => {
    const dbRef = ref(db, 'articles');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        dispatch(setArticles(Object.values(snapshot.val())));
    }
}

export default articlesReducer;