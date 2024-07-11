import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "./firebase";

const Ranking = (props) => {
    const [celebreties, setSelebreties] = useState([]);
    const users = celebreties.map((item, i) => {
        return(
            <li key={i} className="bg-400 flex rounded-xl justify-between items-center py-2 px-4">
                <div className="w-14">
                    <img className="w-full h-14 rounded-xl" src={item.photo} alt="photo" />
                </div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.first_name} {item.last_name}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.age}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.country}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.city}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.type_of_activity.join(', ')}</div>
                <div className="w-28">
                    <NavLink to={`/profile/${item.id}`} className="bg-300 block w-full py-2.5 px-4 text-center text-400 rounded-2xl">View</NavLink>
                </div>
            </li>
        )
    });

    const fetchData = async () => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            setSelebreties(Object.values(snapshot.val()));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return(
        <section className="flex justify-center items-center h-[calc(100vh-5.75rem)] flex-col">
            <h1 className="text-300 font-semibold text-5xl uppercase mb-10 text-center">Spotters Ranking</h1>
            <div className="bg-gradient-to-l from-500 to-500/75 py-10 px-7 h-3/5 max-w-6xl w-full rounded-2xl">
                <div className={`flex justify-between items-center mb-3 ${celebreties.length > 5 ? "pl-12 pr-16": "px-12"}`}>
                    <div className="w-14"></div>
                    <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">Name</div>
                    <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">Age</div>
                    <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">Country</div>
                    <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">City</div>
                    <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">Type of activity</div>
                    <div className="w-28"></div>
                </div>
                <ul className="flex flex-col gap-y-3 overflow-auto h-[calc(100%-1.75rem)] px-7 custome-scrollbar">
                    {users}
                </ul>
            </div>
        </section>
    )
}

export default Ranking;