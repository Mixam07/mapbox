import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleAuthProvider } from "./firebase";
import { get, push, ref, set } from "firebase/database";

const dbRef = ref(db, 'users');
const snapshot = await get(dbRef);

const onSignInWithEmailAndPassword = (email, password, otherData) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
            await saveData({
                ...userCredential.user
            }, otherData)
        })
        .catch(e => console.error(e));
}

const onCreateUserWithEmailAndPassword = (email, password, otherData) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
            await saveData({
                ...userCredential.user
            }, otherData)
        })
        .catch(e => console.error(e));
}

const onGoogleAuthProvider = async (e) => {
    e.preventDefault();

    auth.onAuthStateChanged((maybeUser) => {
        if (maybeUser != null) return 

        signInWithPopup(auth, googleAuthProvider)
            .then(credentials => saveData({...credentials.user}))
            .catch(e => console.error(e));
    });
}

const checkIsEmptyEmail = async (email) => {
    if (snapshot.exists()) {
        const dbData = snapshot.val();

        for(let key in dbData){
            if(email === dbData[key].email){
                return false;
            }
        }
    }

    return true;
}

const checkIsUserCreated = async (user) => {
    if (snapshot.exists()) {
        const myData = snapshot.val();

        for(let key in myData){
            if(user.uid === myData[key].uid){
                return key
            }
        }
    }
    return null
}

const saveData = async (user, otherData) => {
    const key = await checkIsUserCreated(user);
    const dbRef = key? ref(db, 'users/'+key): push(dbRef);

    await set(dbRef, {
        ...otherData,
        uid: user.uid,
        username: user.displayName != null ? user.displayName : otherData.username,
        email: user.email,
        photoURL: user.photoURL
    });
}

export {
    onSignInWithEmailAndPassword, onCreateUserWithEmailAndPassword, checkIsEmptyEmail,
    onGoogleAuthProvider
}