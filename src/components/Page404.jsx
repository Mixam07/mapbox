import { NavLink } from "react-router-dom";
import img_404 from "../assets/img/404.jpg"; 

const Page404 = (props) => {
    return(
        <section className="pt-16 flex flex-col items-center justify-center min-h-[100vh] gap-y-3">
            <h1 className="text-5xl font-bold">Page not found</h1>
            <img width="40%" src={img_404} alt="404" />
            <NavLink to="/" className="text-xl">Go to the main page</NavLink>
        </section>
    )
}

export default Page404;