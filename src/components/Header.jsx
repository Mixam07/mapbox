import { NavLink } from "react-router-dom";

const Header = () => {
    
    return(
        <header className="fixed top-0 left-0 z-[100] w-full before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:z-[-1]
            before:backdrop-blur-3xl">
            <div className="max-w-3xl mx-auto">
                <nav className="flex gap-x-5 justify-between">
                    <NavLink className="uppercase py-4" to="/">HOME</NavLink>
                    <div className="relative py-4 nav-item">
                        <p className="uppercase cursor-pointer">FIND A PERSON</p>
                        <ul className="absolute bottom-0 left-0 translate-y-[100%] min-w-full block px-1 py-1 flex flex-col gap-y-2 opacity-0 duration-100
                            pointer-events-none before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:z-[-1] before:backdrop-blur-3xl">
                            <li>
                                <NavLink className="block py-1.5 px-2" to="/directory">Directory</NavLink>
                            </li>
                            <li>
                                <NavLink className="block py-1.5 px-2" to="/map">Map</NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink className="uppercase py-4" to="/report">REPORT A PERSON</NavLink>
                    <NavLink className="uppercase py-4" to="/ranking">RANKING</NavLink>
                    <NavLink className="uppercase py-4" to="/about">ABOUT</NavLink>
                    <NavLink className="uppercase py-4" to="/login">LOGIN</NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header;