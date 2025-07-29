import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Buy.css";


const Buy = (props) => {
    const [active, setActive] = useState(props.plans[0].value);
    const [error, setError] = useState("");

    const plans = props.plans.map((item, i) => {
        return(
            <li key={i+1} className="w-full bg-400 rounded-[2.5rem] p-6 border-300 border-[1px] border-solid flex gap-x-6 cursor-pointer"
                onClick={ () => { setActive(item.value) } }>
                <input className="hidden input" type="radio" name="plan" value={item.value} checked={active === item.value} />
                <div>
                    <div className="w-10 h-10 rounded-full border-4 border-solid border-300 flex items-center justify-center">
                        <span className="block w-6 h-6 rounded-full circle"></span>
                    </div>
                </div>
                <div className="w-full">
                    <h3 className="uppercase text-300 font-extrabold mb-2 text-6">{item.title}</h3>
                    <h4>{item.description}</h4>
                </div>
                <div className="whitespace-nowrap self-center uppercase text-4xl font-bold text-300">
                    ${item.price}
                    <span className="text-300 text-2xl font-medium">/PER MONTH.</span>
                </div>
            </li>
        )
    });

    const onClick = (e) => {
        if(active === "starting"){
            e.preventDefault();

            setError("Сhoose a plan")
        }
    }

    return(
        <section className="pt-32 flex flex-col items-center">
            <h1 className="uppercase font-semibold text-300 text-4xl mb-6">PREMIUM PLAN</h1>
            <h2 className="uppercase font-semibold text-xl mb-6">WELCOME TO GLOBAL PERSONNALITY TRACKER, Oliver!</h2>
            <p className="uppercase font-semibold text-xl mb-6">Choose your plan</p>
            <ul className="max-w-[45rem] w-full flex flex-col gap-y-6 mb-6">{plans}</ul>
            <NavLink onClick={onClick} to={`/payment/${active}`} className="bg-300 text-400 max-w-[45rem] w-full text-center py-2 rounded-[2.5rem]
                uppercase font-bold text-2xl mb-2">Continue</NavLink>
            {error && <p className="text-red-500 font-bold text-lg">{error}</p>}
        </section>
    )
}

export default Buy;