import { useEffect, useState } from "react";
import filter from "../assets/icons/filter.svg";
import search from "../assets/icons/search.svg";
import close from "../assets/icons/close.svg";
import { get, ref } from "firebase/database";
import { db } from "./firebase";

const Filter = (props) => {
    const [isActive, setIsActive] = useState(false);
    const [listSearch, setListSearch] = useState([]);
    const [listCountry, setListCountry] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [inputSearch, setInputSearch] = useState("");
    const [inputCountry, setInputCountry] = useState("");
    const [inputCity, setInputCity] = useState("");

    const addTag = (input, setInput, list, setList) => {
        if(input === "" || input === " ") return

        const newTagText = input.charAt(0).toUpperCase() + input.substring(1).toLowerCase();
        setList([...list, newTagText]);

        setInput("");
    }

    const delTag = (i, list, setList) => {
        setList([...list.filter((item, j) => {
            if(i !== j){
                return item
            }
        })]);
    }

    const tagGeneration = (item, i, list, setList) => {
        return(
            <li key={i} className="flex border-300 border-[1px] border-solid rounded-3xl py-2 px-4 whitespace-nowrap">
                <p className="text-300">{item}</p>
                <button onClick={ () => { delTag(i, list, setList) } }>
                    <img src={close} alt="close" />
                </button>
            </li>
        )
    }
    const list_search_tags = listSearch.map((item, i) => { return tagGeneration(item, i, listSearch, setListSearch) });
    const list_country_tags = listCountry.map((item, i) => { return tagGeneration(item, i, listCountry, setListCountry) });
    const list_city_tags = listCity.map((item, i) => { return tagGeneration(item, i, listCity, setListCity) });

    const selectAll = () => {
        setListSearch([]);
        setListCountry([]);
        setListCity([]);
    }

    const fetchData = async (filter) => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            props.setPoints(Object.values(snapshot.val())
            .filter(data => {
                if(filter.country.length == 0){
                    return data
                }

                for(let i = 0; i < filter.country.length; i++){
                    if(filter.country[i]?.toLowerCase() === data.country?.toLowerCase()){
                        return data
                    }
                }
            })
            .filter(data => {
                if(filter.city.length == 0){
                    return data
                }

                for(let i = 0; i < filter.city.length; i++){
                    if(filter.city[i]?.toLowerCase() === data.city?.toLowerCase()){
                        return data
                    }
                }
            })
            .map(item => {
                return{
                    ...item, 
                    isShow: false
                }
            }));
        }
    }

    useEffect(() => {
        fetchData({
            country: listCountry,
            city: listCity
        })
    }, [listSearch, listCountry, listCity])

    return(
        <div className="absolute top-4 left-[3.125rem] z-10">
            <button onClick={ () => { setIsActive(!isActive) } } className="w-12 h-12 bg-300 rounded-full flex justify-center items-center">
                <img src={filter} alt="filter" />
            </button>
            <div className={`absolute bottom-[-0.5rem] left-0 translate-y-full bg-400 border-[1px] border-solid border-300 p-4 rounded-2xl
                flex flex-col gap-y-4 duration-500 ${isActive? "opacity-1 pointer-events-auto": "opacity-0 pointer-events-none"}`}>
                {/*
                <div>
                    <div className="relative mb-2 min-w-52">
                        <input className="w-full bg-gradient-to-l from-500/75 to-500/50 py-1.5 pl-4 pr-10 rounded-3xl placeholder:text-200/60"
                        id="search" name="search" type="text" placeholder="Search" value={inputSearch} onChange={ (e) => { setInputSearch(e.target.value) } } />
                        <button onClick={ ()  => { addTag(inputSearch, setInputSearch, listSearch, setListSearch) }} className="absolute bottom-2/4 right-4 translate-y-2/4">
                            <img src={search} alt="search" />
                        </button>
                    </div>
                    <ul className="flex gap-x-1.5 gap-y-1 flex-wrap">
                        {list_search_tags}
                    </ul>
                </div>
                */}
                <div>
                    <div className="relative mb-2 min-w-52">
                        <input className="w-full bg-gradient-to-l from-500/75 to-500/50 py-1.5 pl-4 pr-10 rounded-3xl placeholder:text-200/60"
                        id="country" name="country" type="text" placeholder="Country" value={inputCountry} onChange={ (e) => { setInputCountry(e.target.value) } } />
                        <button onClick={ ()  => { addTag(inputCountry, setInputCountry, listCountry, setListCountry) }} className="absolute bottom-2/4 right-4 translate-y-2/4">
                            <img src={search} alt="search" />
                        </button>
                    </div>
                    <ul className="flex gap-x-1.5 gap-y-1 flex-wrap">
                        {list_country_tags}
                    </ul>
                </div>
                <div>
                    <div className="relative mb-2 min-w-52">
                        <input className="w-full bg-gradient-to-l from-500/75 to-500/50 py-1.5 pl-4 pr-10 rounded-3xl placeholder:text-200/60"
                        id="city" name="city" type="text" placeholder="City" value={inputCity} onChange={ (e) => { setInputCity(e.target.value) } } />
                        <button onClick={ ()  => { addTag(inputCity, setInputCity, listCity, setListCity) }} className="absolute bottom-2/4 right-4 translate-y-2/4">
                            <img src={search} alt="search" />
                        </button>
                    </div>
                    <ul className="flex gap-x-1.5 gap-y-1 flex-wrap">
                        {list_city_tags}
                    </ul>
                </div>
                <div>
                    <button onClick={selectAll} className="bg-300 text-400 py-1 px-3 rounded-3xl">Select All</button>
                </div>
            </div>
        </div>
    )
}

export default Filter;