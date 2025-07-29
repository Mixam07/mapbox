import { auth } from "../../firebase/initialization";
import { useFormik } from 'formik';
import { Navigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onCreateUserWithEmailAndPassword, onGoogleAuthProvider } from "../../firebase/auth";
import user_icon from "../../assets/icons/user.svg";
import passport from "../../assets/icons/passport.svg";
import email from "../../assets/icons/email.svg";
import eye from "../../assets/icons/eye.svg";
import google from "../../assets/icons/google.svg";

const Register = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((maybeUser) => {
            if (maybeUser != null) return setUser(maybeUser);

            setUser(null);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            country: ""
        },
        validate: (values) => {
            const errors = {};

            if(values.first_name === "" || values.first_name === " "){
                errors.first_name = "The field cannot be empty";
            }
            if(values.last_name === "" || values.last_name === " "){
                errors.last_name = "The field cannot be empty";
            }
            if(values.username === "" || values.username === " "){
                errors.username = "The field cannot be empty";
            }
            if(values.email === "" || values.email === " "){
                errors.email = "The field cannot be empty";
            }
            if(values.password === "" || values.password === " "){
                errors.password = "The field cannot be empty";
            }
            if(values.country === "" || values.country === " "){
                errors.country = "The field cannot be empty";
            }

            return errors
        },
        onSubmit: async (values, { setErrors, resetForm }) => {
            const dataForLogin = [values.email, values.password, {
                first_name: values.first_name,
                last_name: values.last_name,
                username: values.username,
                country: values.country
            }];

            try{
                await onCreateUserWithEmailAndPassword(...dataForLogin);

                resetForm();
            }catch(e){
                setErrors({
                    email: "This email is occupied",
                });
            }
        }
    });
    return(
        <section className="w-full min-h-[calc(100vh-5.75rem)] flex items-center justify-center">
            <div className="max-w-lg w-full">
                <h2 className="mb-4 uppercase">Start for free</h2>
                <h1 className="mb-12 uppercase text-300 font-bold text-5xl">Create new account.</h1>
                <form onSubmit={formik.handleSubmit} className="flex w-full gap-y-4 flex-col">
                    <div>
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Username</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.username? "border-600": "border-600/0"}`} type="text" placeholder="Enter your username" id="username" name="username"
                                onChange={formik.handleChange} value={formik.values.username} />
                            <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={user_icon} alt="user" />
                        </div>
                        {formik.errors.username ? <div className="text-600 mt-1">{formik.errors.username}</div> : null}
                    </div>
                    <div className="flex gap-x-2">
                        <div>
                            <div className="w-full relative">
                                <p className="absolute top-4 left-6 text-xs uppercase">First name</p>
                                <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.first_name? "border-600": "border-600/0"}`} placeholder="Enter your first name" id="first_name" name="first_name"
                                    onChange={formik.handleChange} value={formik.values.first_name} />
                                <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={passport} alt="passport" />
                            </div>
                            {formik.errors.first_name ? <div className="text-600 mt-1">{formik.errors.first_name}</div> : null}
                        </div>
                        <div>
                            <div className="w-full relative">
                                <p className="absolute top-4 left-6 text-xs uppercase">Last name</p>
                                <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.last_name? "border-600": "border-600/0"}`} type="text" placeholder="Enter your last name" id="last_name" name="last_name"
                                    onChange={formik.handleChange} value={formik.values.last_name} />
                                <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={passport} alt="passport" />
                            </div>
                            {formik.errors.last_name ? <div className="text-600 mt-1">{formik.errors.last_name}</div> : null}
                        </div>
                    </div>
                    <div>
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Email</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.email? "border-600": "border-600/0"}`} type="email" placeholder="Enter your email" id="email" name="email"
                                onChange={formik.handleChange} value={formik.values.email} />
                            <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={email} alt="email" />
                        </div>
                        {formik.errors.email ? <div className="text-600 mt-1">{formik.errors.email}</div> : null}
                    </div>
                    <div>
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Password</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.password? "border-600": "border-600/0"}`} type="password" placeholder="****************" id="password" name="password"
                                onChange={formik.handleChange} value={formik.values.password} />
                            <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={eye} alt="eye" />
                        </div>
                        {formik.errors.password ? <div className="text-600 mt-1">{formik.errors.password}</div> : null}
                    </div>
                    <div>
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Your country</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.country? "border-600": "border-600/0"}`} type="text" placeholder="Enter your country" id="country" name="country"
                                onChange={formik.handleChange} value={formik.values.country} />
                        </div>
                        {formik.errors.password ? <div className="text-600 mt-1">{formik.errors.country}</div> : null}
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <button type="submit" className="p-7 bg-300 text-white rounded-2xl uppercase font-bold">
                            Login
                        </button>
                        <button onClick={ (e) => { onGoogleAuthProvider(e, true) } } className="p-5 bg-300 text-white rounded-2xl uppercase font-bold
                            flex justify-center items-center gap-x-4">
                            <img className="w-8" src={google} alt="google" />
                            Login with google
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center uppercase">
                    ALREADY AN HAVE ACCOUNT?
                    <NavLink className="text-300 font-bold ml-2" to="/login">Login</NavLink>
                </p>
            </div>
            {user && <Navigate to="/"/>}
        </section>
    )
}

export default Register;