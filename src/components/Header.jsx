import { NavLink } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import search from "../assets/icons/search.svg";
import menu from "../assets/icons/menu.svg";

const Header = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setUser(user);
            } else {
              setUser(null);
            }
        });
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        signOut(auth)
            .catch(e => console.error(e));
    };

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: (values, { resetForm }) => {
            console.log(values)

            resetForm();
        },
    });
    return(
        <header className="fixed top-0 left-0 z-[100] w-full bg-100 shadow-xl rounded-b-lg">
            <div className={`${props.isHomePage? "px-[3.125rem]": "container"} mx-auto flex justify-between items-center`}>
                {props.isHomePage &&
                <button className="bg-300 min-w-12 h-12 rounded-full flex justify-center items-center">
                    <img src={menu} alt="manu" />
                </button>}
                <h1 className="uppercase font-extrabold text-300">GLOBAL PERSONNALITY TRACKER</h1>
                {props.isHomePage &&
                <form className="relative" onSubmit={formik.handleSubmit}>
                    <input className="w-64 bg-[#B7BBD2] py-2 pr-10 pl-4 rounded-3xl text-200 placeholder:text-200/60" type="text" id="search"
                        placeholder="Find a celebrity" name="search" onChange={formik.handleChange} value={formik.values.search} />
                    <button type="submit" className="absolute top-2/4 right-4 translate-y-[-50%]">
                        <img src={search} alt="search" />
                    </button>
                </form>}
                <nav className="flex gap-x-10 justify-between items-center">
                    <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                    before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                    ${!isActive && "before:opacity-0"}`} to="/">
                        Map
                    </NavLink>
                    <div className="relative py-8 nav-item">
                        <p className="uppercase cursor-pointer text-lg font-bold">Find A Celebrity</p>
                        <ul className="absolute bottom-0 left-2/4 translate-y-full translate-x-[-50%] min-w-[calc(100%+2rem)] block px-2 py-2 flex flex-col gap-y-2 opacity-0
                            duration-500 pointer-events-none bg-100 shadow-xl rounded-b-lg">
                            <li>
                                <NavLink className="block py-1.5 px-2 text-lg font-semibold" to="/directory">Directory</NavLink>
                            </li>
                            <li>
                                <NavLink className="block py-1.5 px-2 text-lg font-semibold" to="/">Map</NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                    before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                    ${!isActive && "before:opacity-0"}`} to="/report">
                        Spotted!
                    </NavLink>
                    <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                    before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                    ${!isActive && "before:opacity-0"}`} to="/ranking">
                        Spoters Ranking
                    </NavLink>
                    <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                    before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                    ${!isActive && "before:opacity-0"}`} to="/about">
                        About
                    </NavLink>
                    {
                        user == null ?
                        <>
                            <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                            before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                            ${!isActive && "before:opacity-0"}`} to="/login">
                                Login
                            </NavLink>
                            <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                            before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                            ${!isActive && "before:opacity-0"}`} to="/register">
                                Register
                            </NavLink>
                        </>:
                        <button onClick={handleLogout} className="uppercase py-4 text-lg font-bold">Logout</button>
                    }
                </nav>
                {props.isHomePage &&
                <div className="bg-[#CACDDF] border-[1px] border-solid border-white p-2 rounded-2xl flex gap-x-2.5">
                    <button onClick={() => { props.setIsMapActive(true) }}
                    className={`bg-white${props.isMapActive? "" : "/0"} py-2 px-3 rounded-[1rem] duration-500`}>
                        Map
                    </button>
                    <button onClick={() => { props.setIsMapActive(false) }}
                    className={`bg-white${!props.isMapActive? "" : "/0"} py-2 px-3 rounded-[1rem] duration-500`}>
                        List
                    </button>
                </div>}
            </div>
        </header>
    )
}

export default Header;