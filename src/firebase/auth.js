import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleAuthProvider } from "./initialization";
import { get, push, ref, set } from "firebase/database";

const dbRef = ref(db, 'users');
const snapshot = await get(dbRef);

const onSignInWithEmailAndPassword = async (email, password, otherData) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
            await saveData({
                ...userCredential.user
            }, otherData)
        })
        .catch(e => { throw new Error(e.message) });
}

const onCreateUserWithEmailAndPassword = async (email, password, otherData) => {
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
            await saveData({
                ...userCredential.user
            }, otherData)
        })
        .catch(e => { throw new Error(e.message) });
}

const onGoogleAuthProvider = async (e, isRegister) => {
    e.preventDefault();

    auth.onAuthStateChanged((maybeUser) => {
        if (maybeUser != null) return 

        signInWithPopup(auth, googleAuthProvider)
            .then(credentials => {
                const otherData = {};

                if(isRegister){
                    const data = prompt("Enter your country", "");

                    otherData.country = data;
                }
                
                saveData({...credentials.user}, otherData)
            })
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
            if(user.email == myData[key].email){
                return key
            }
        }
    }
    return null
}

const saveData = async (user, otherData) => {
    const key = await checkIsUserCreated(user);
    const newDbRef = key? ref(db, 'users/'+key): push(dbRef);

    await set(newDbRef, {
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