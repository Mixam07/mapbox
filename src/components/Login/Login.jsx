import { auth } from "../../firebase/initialization";
import { useFormik } from 'formik';
import { Navigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onGoogleAuthProvider, onSignInWithEmailAndPassword } from "../../firebase/auth";
import email from "../../assets/icons/email.svg";
import eye from "../../assets/icons/eye.svg";
import google from "../../assets/icons/google.svg";

const Login = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((maybeUser) => {
            if (maybeUser != null) return setUser(maybeUser);

            setUser(null);
        });
    }, []);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: (values) => {
            const errors = {};

            if(values.email === "" || values.email === " "){
                errors.email = "The field cannot be empty";
            }
            if(values.password === "" || values.password === " "){
                errors.password = "The field cannot be empty";
            }

            return errors
        },
        onSubmit: async (values, { setErrors, resetForm }) => {
            const dataForLogin = [values.email, values.password];

            try{
                await onSignInWithEmailAndPassword(...dataForLogin);

                resetForm();
            }catch(e){
                setErrors({
                    email: "Mail or password is wrong",
                    password: "Mail or password is wrong"
                });
            }
        }
    });

    return(
        <section className="w-full min-h-[calc(100vh-5.75rem)] flex items-center justify-center">
            <div className="max-w-lg w-full">
                <h1 className="mb-12 uppercase text-300 font-bold text-5xl">Login in account.</h1>
                <form onSubmit={formik.handleSubmit} className="flex w-full gap-y-4 flex-col">
                    <div className="w-full">
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Email</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6
                                placeholder:text-200 text-200/60 border-[1px] border-solid ${formik.errors.email? "border-600": "border-600/0"}`} type="email"
                                placeholder="Enter your email" id="email" name="email" onChange={formik.handleChange} value={formik.values.email} />
                            <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={email} alt="email" />
                        </div>
                        {formik.errors.email ? <div className="text-600 mt-1">{formik.errors.email}</div> : null}
                    </div>
                    <div>
                        <div className="w-full relative">
                            <p className="absolute top-4 left-6 text-xs uppercase">Password</p>
                            <input className={`w-full bg-gradient-to-l from-500 to-500/75 rounded-2xl text-200 font-bold pt-10 pr-14 pb-4 pl-6 border-[1px]
                                placeholder:text-200 text-200/60] border-solid ${formik.errors.password? "border-600": "border-600/0"}`} type="password" id="password"
                                placeholder="****************" name="password" onChange={formik.handleChange} value={formik.values.password} />
                            <img className="absolute top-2/4 right-6 translate-y-[-50%] w-6" src={eye} alt="eye" />
                        </div>
                        {formik.errors.password ? <div className="text-600 mt-1">{formik.errors.password}</div> : null}
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <button type="submit" className="p-7 bg-300 text-white rounded-2xl uppercase font-bold">
                            Login
                        </button>
                        <button onClick={onGoogleAuthProvider} className="p-5 bg-300 text-white rounded-2xl uppercase font-bold
                            flex justify-center items-center gap-x-4">
                            <img className="w-8" src={google} alt="google" />
                            Login with google
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center uppercase">
                    Have not had an account yet?
                    <NavLink className="text-300 font-bold ml-2" to="/register">Register</NavLink>
                </p>
            </div>
            {user && <Navigate to="/"/>}
        </section>
    )
}

export default Login;