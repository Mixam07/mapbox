import { auth } from "./firebase";
import { useFormik } from 'formik';
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkIsEmptyEmail, onCreateUserWithEmailAndPassword, onGoogleAuthProvider, onSignInWithEmailAndPassword } from "./auth";

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
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: ""
        },
        onSubmit: async (values, { resetForm }) => {
            const dataForLogin = [values.email, values.password, {
                first_name: values.first_name,
                last_name: values.last_name,
                username: values.username
            }];

            if(await checkIsEmptyEmail(values.email)){
                onCreateUserWithEmailAndPassword(...dataForLogin);
            }else{
                onSignInWithEmailAndPassword(...dataForLogin);
            }

            resetForm();
        },
    });

    return(
        <section className="w-full h-[100vh] flex items-center justify-center pt-16">
            <form onSubmit={formik.handleSubmit} className="flex max-w-md w-full gap-y-5 flex-col">
                <div className="w-full">
                    <p className="text-sm mb-2">First name</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="text" placeholder="Enter your first name" id="first_name" name="first_name"
                        onChange={formik.handleChange} value={formik.values.first_name} />
                </div>
                <div className="w-full">
                    <p className="text-sm mb-2">Last name</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="text" placeholder="Enter your last name" id="last_name" name="last_name"
                        onChange={formik.handleChange} value={formik.values.last_name} />
                </div>
                <div className="w-full">
                    <p className="text-sm mb-2">Username</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="text" placeholder="Enter your username" id="username" name="username"
                        onChange={formik.handleChange} value={formik.values.username} />
                </div>
                <div className="w-full">
                    <p className="text-sm mb-2">Email</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="email" placeholder="Enter your email" id="email" name="email"
                        onChange={formik.handleChange} value={formik.values.email} />
                </div>
                <div className="w-full">
                    <p className="text-sm mb-2">Password</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="password" placeholder="****************" id="password" name="password"
                        onChange={formik.handleChange} value={formik.values.password} />
                </div>
                <div className="flex flex-col gap-y-3">
                    <button type="submit" className=" text-white bg-[#4B5563] block w-full py-4 rounded-md">Login</button>
                    <button onClick={onGoogleAuthProvider} className=" text-white bg-[#4B5563] block w-full py-4 rounded-md">Login google</button>
                </div>
            </form>
            {user && <Navigate to="/"/>}
        </section>
    )
}

export default Login;