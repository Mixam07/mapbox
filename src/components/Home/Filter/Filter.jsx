import { useEffect, useState } from "react";
import filter from "../../../assets/icons/filter.svg";
import search from "../../../assets/icons/search.svg";
import close from "../../../assets/icons/close.svg";
import arrow_right from "../../../assets/icons/arrow_right_black.svg";
import arrow_left from "../../../assets/icons/arrow_left_black.svg";
import { NavLink } from "react-router-dom";

const Subfilter = (props) => {
    return(
        <>
            <li>
                <button className="font-semibold py-1.5 flex items-center" onClick={ () => { props.setActiveFilterItem([-1]) } }>
                    <img className="w-6" src={arrow_left} alt="arrow" />
                    <p>Go back</p>
                </button>
            </li>
            <li>
                <p className="font-semibold py-1.5 text-300">{props.filterList.map(item => {
                    if(item.isActive) return item.title
                })}</p>
                <ul className="relative pl-3 before:content-[''] before:absolute before:top-0 before:left-[4px] before:h-full before:w-[1px] before:bg-300">
                    {
                    props.filterList.map((item, i) => {
                        if(item.isActive) return item.list.map((item, j) => {

                            if(item.isActive) return(
                                <li key={j+1}>
                                    <button className="font-semibold py-1 flex items-center justify-between w-full"
                                        onClick={ () => { props.setActiveFilterItem([i, -1]) } }>
                                        <p className="text-300">{item.title}</p>
                                        <img className="w-5 rotate-90" src={arrow_right} alt="arrow" />
                                    </button>
                                    <ul className="relative pl-3 before:content-[''] before:absolute before:top-0 before:left-[4px] before:h-full before:w-[1px] before:bg-300">
                                        {
                                        item.list.map((item, q) => {
                                            
                                            if(item.isActive) return(
                                                <li key={q+1}>
                                                    <button className="font-semibold py-1 flex items-center justify-between w-full"
                                                        onClick={ () => { props.setActiveFilterItem([i, j, -1]) } }>
                                                        <p className="text-300">{item.title}</p>
                                                        <img className="w-5 rotate-90" src={arrow_right} alt="arrow" />
                                                    </button>
                                                    <ul className="relative pl-3 before:content-[''] before:absolute before:top-0 before:left-[4px] before:h-full before:w-[1px] before:bg-300">
                                                        {
                                                        item.list.map((item, k) => {
                                                            return(
                                                                <li key={k+1}>
                                                                    <NavLink className="font-semibold py-1.5" to={`/profile/${item.id}`}>{item.title}</NavLink>
                                                                </li>
                                                            )
                                                        })
                                                        }
                                                    </ul>
                                                </li>
                                            )

                                            return(
                                                <li key={q+1}>
                                                    <button className="font-semibold py-1 flex items-center justify-between w-full"
                                                        onClick={ () => { props.setActiveFilterItem([i, j, q]) } }>
                                                        <p>{item.title}</p>
                                                        <img className="w-5" src={arrow_right} alt="arrow" />
                                                    </button>
                                                </li>
                                            )
                                        })    
                                        }
                                    </ul>
                                </li>
                            )

                            return (
                                
                                <li key={j+1}>
                                    <button className="font-semibold py-1 flex items-center justify-between w-full"
                                        onClick={ () => { props.setActiveFilterItem([i, j]) } }>
                                        <p>{item.title}</p>
                                        <img className="w-5" src={arrow_right} alt="arrow" />
                                    </button>
                                </li>
                            )
                            });
                    })
                    }
                </ul>
            </li>
        </>
    )
};

const Filter = (props) => {
    const [isActive, setIsActive] = useState(false);
    const list_country_tags = props.countryList.map((item, i) => {
        return(
            <li key={i+1} className="flex border-300 border-[1px] border-solid rounded-3xl py-2 px-4 whitespace-nowrap">
                <p className="text-300">{item}</p>
                <button onClick={ () => { props.delCountryList(i) } }>
                    <img src={close} alt="close" />
                </button>
            </li>
        )
    });
    const list_city_tags = props.cityList.map((item, i) => {
        return(
            <li key={i+1} className="flex border-300 border-[1px] border-solid rounded-3xl py-2 px-4 whitespace-nowrap">
                <p className="text-300">{item}</p>
                <button onClick={ () => { props.delCityList(i) } }>
                    <img src={close} alt="close" />
                </button>
            </li>
        )
    });
    const primary_filter = props.filterList.map((item, i) => {
        return (
            <li key={i+1}>
                <button className="font-semibold py-1 flex items-center justify-between w-full" onClick={ () => { props.setActiveFilterItem([i]) } }>
                    <p>{item.title}</p>
                    <img className="w-6" src={arrow_right} alt="arrow" />
                </button>
            </li>
        )
    });

    useEffect(() => {
        props.setPoints();
    }, [props.countryList, props.cityList, props.filterList]);

    return(
        <div className="absolute top-4 left-[3.125rem] z-10">
            <button onClick={ () => { setIsActive(!isActive) } } className="w-12 h-12 bg-300 rounded-full flex justify-center items-center">
                <img src={filter} alt="filter" />
            </button>
            <div className={`absolute bottom-[-0.5rem] left-0 translate-y-full bg-400 border-[1px] border-solid border-300 rounded-2xl
                duration-500 w-60 ${isActive? "opacity-1 pointer-events-auto": "opacity-0 pointer-events-none"}`}>
                <ul className="px-4 py-2 flex flex-col gap-y-1">
                    {
                        props.filterList.some(item => item.isActive)? <Subfilter {...props} />: primary_filter
                    }
                </ul>
                <div className="p-4 pt-0 flex flex-col gap-y-2">
                    <div>
                        <div className="relative mb-2">
                            <input className="w-full bg-gradient-to-l from-500/75 to-500/50 py-1.5 pl-4 pr-10 rounded-3xl placeholder:text-200 text-200/60"
                            id="country" name="country" type="text" placeholder="Country" value={props.countryInput} onChange={ (e) => { props.setCountryInput(e.target.value) } } />
                            <button onClick={ ()  => { props.setCountryList() }} className="absolute bottom-2/4 right-4 translate-y-2/4">
                                <img src={search} alt="search" />
                            </button>
                        </div>
                        <ul className="flex gap-x-1.5 gap-y-1 flex-wrap">
                            {list_country_tags}
                        </ul>
                    </div>
                    <div>
                        <div className="relative mb-2">
                            <input className="w-full bg-gradient-to-l from-500/75 to-500/50 py-1.5 pl-4 pr-10 rounded-3xl placeholder:text-200 text-200/60"
                            id="city" name="city" type="text" placeholder="City" value={props.cityInput} onChange={ (e) => { props.setCityInput(e.target.value) } } />
                            <button onClick={ ()  => { props.setCityList() }} className="absolute bottom-2/4 right-4 translate-y-2/4">
                                <img src={search} alt="search" />
                            </button>
                        </div>
                        <ul className="flex gap-x-1.5 gap-y-1 flex-wrap">
                            {list_city_tags}
                        </ul>
                    </div>
                    <div>
                        <button onClick={ () => { props.selectAll() }} className="bg-300 text-400 py-1 px-3 rounded-3xl">Select All</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter;