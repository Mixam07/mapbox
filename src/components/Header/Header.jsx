import { NavLink } from "react-router-dom";
import { auth } from "../../firebase/initialization";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

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
    return(
        <header className="fixed top-0 left-0 z-[100] w-full bg-100 shadow-xl rounded-b-lg">
            <div className={`${props.isHomePage? "px-[3.125rem]": "container"} mx-auto flex justify-between items-center`}>
                <NavLink to="/" className="uppercase font-extrabold text-300">GLOBAL PERSONNALITY TRACKER</NavLink>
                <nav className="flex gap-x-10 justify-between items-center py-8">
                    <NavLink className={({isActive}) => `uppercase text-lg font-bold relative before:absolute before:content-['']
                    before:bottom-0 before:left-0 before:block before:w-full before:h-[1px] before:bg-black before:duration-500
                    ${!isActive && "before:opacity-0"}`} to="/">
                        Map
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
                        <button onClick={handleLogout} className="uppercase text-lg font-bold">Logout</button>
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