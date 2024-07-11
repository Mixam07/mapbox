import { NavLink } from "react-router-dom";
import search from "../assets/icons/search.svg";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "./firebase";

const Directory = (props) => {
    const [searchCelebrety, setSearchCelebrety] = useState("");
    const [celebreties, setCelebreties] = useState([]);
    const [searchCelebretyList, setSearchCelebretyList] = useState([]);
    const users = searchCelebretyList.map((item, i) => (
        <li key={i+1} className="border-solid border-t-[1px] border-[#E1E2ED] py-6 flex items-center">
            <div className="w-full flex gap-x-4 items-center">
                <img className="w-12 h-12 rounded-full object-cover" src={item.photo} alt="photo" />
                <p className="uppercase font-semibold">{item.first_name} {item.last_name}</p>
            </div>
            <div className="w-full flex justify-center gap-x-14">
                <p>{item.country}</p>
                <p>{item.city}</p>
            </div>
            <ul className="w-full flex justify-end gap-x-4">
                {item.tags.map((tag, i) => {
                    if(i < 3){
                        return(
                            <li className="py-1.5 px-3 bg-gradient-to-l from-500 to-500/75 rounded-2xl min-w-24 text-center">#{tag}</li>
                        )
                    }
                })}
            </ul>
        </li>
    ));

    const onChange = (e) => {
        setSearchCelebrety(e.target.value);

        const value = e.target.value.toLowerCase().split(' ');
        const newCelebretyList = [];
        
        celebreties.forEach(celebrety => {
            const first_name_first = celebrety.first_name.slice(0, value[0].length).toLowerCase();
            const last_name_first = celebrety.last_name.slice(0, value[0].length).toLowerCase();

            if(e.target.value !=+ "" && value.length < 3 && (value[0] === first_name_first || value[0] === last_name_first)){
                if(value[1]){
                    const first_name_second = celebrety.first_name.slice(0, value[1].length).toLowerCase();
                    const last_name_second = celebrety.last_name.slice(0, value[1].length).toLowerCase();

                    if(value[1] == first_name_second || value[1] == last_name_second){
                        newCelebretyList.push(celebrety);
                    }

                    return
                }

                newCelebretyList.push(celebrety);
            }
        });

        setSearchCelebretyList(newCelebretyList);
    }

    const fetchData = async () => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            setCelebreties(Object.values(snapshot.val()));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    return(
        <section className="pt-[10%]">
            <div className="max-w-6xl mx-auto">
                <h1 className="uppercase text-300 font-bold text-center text-5xl mb-6">FIND A CELEBRITY</h1>
                <h2 className="uppercase text-center mb-6">Learn about actors, creators, musicians, and more!  You can also search by tags.</h2>
                <div className="bg-gradient-to-l from-500 to-500/75 p-6 rounded-xl mb-6">
                    <div className="relative">
                        <input placeholder="Find a celebrety" type="text" value={searchCelebrety} onChange={onChange}
                            className={`w-full py-6 pr-16 pl-10 ${users.length === 0? "rounded-xl": "rounded-t-xl"} uppercase font-semibold text-2xls`} />
                        <button className="absolute bottom-2/4 right-[2.5rem] translate-y-2/4">
                            <img src={search} alt="search" />
                        </button>
                        <ul className="absolute bottom-0 left-0 translate-y-full bg-white w-full px-10 rounded-b-xl z-1">
                            {users}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-center gap-x-1 uppercase">
                    <p>there's no one you're looking for?</p>
                    <NavLink className="text-300 relative before:content-[''] before:absolute before:bottom-0 before:left-0
                        before:w-full before:h-[1px] before:bg-300" to="/">add</NavLink>
                </div>
            </div>
        </section>
    )
}

export default Directory;