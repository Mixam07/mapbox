import { NavLink } from "react-router-dom";
import { auth } from "./firebase";
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
        <header className="fixed top-0 left-0 z-[100] w-full bg-400 shadow-xl rounded-b-lg">
            <div className="flex justify-center">
                <nav className="flex gap-x-10 justify-between">
                    <NavLink className="uppercase py-4 text-lg font-bold" to="/">Map</NavLink>
                    <div className="relative py-4 nav-item">
                        <p className="uppercase cursor-pointer text-lg font-bold">Find A Celebrity</p>
                        <ul className="absolute bottom-0 left-2/4 translate-y-full translate-x-[-50%] min-w-[calc(100%+2rem)] block px-2 py-2 flex flex-col gap-y-2 opacity-0
                            duration-500 pointer-events-none bg-400 shadow-xl rounded-b-lg">
                            <li>
                                <NavLink className="block py-1.5 px-2 text-lg font-semibold" to="/directory">Directory</NavLink>
                            </li>
                            <li>
                                <NavLink className="block py-1.5 px-2 text-lg font-semibold" to="/">Map</NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink className="uppercase py-4 text-lg font-bold" to="/report">Spotted!</NavLink>
                    <NavLink className="uppercase py-4 text-lg font-bold" to="/ranking">Spoters Ranking</NavLink>
                    <NavLink className="uppercase py-4 text-lg font-bold" to="/about">About</NavLink>
                    {
                        user == null ?
                        <NavLink className="uppercase py-4 text-lg font-bold" to="/login">Login</NavLink>:
                        <button onClick={handleLogout} className="uppercase py-4 text-lg font-bold">Logout</button>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header;