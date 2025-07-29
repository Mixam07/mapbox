import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const About = (props) => {
    const celebreties = props.celebreties.map((item, i) => {
        if(i < 6){
            return(
                <li key={i+1}>
                    <NavLink to={`/profile/${item.id}`} className="flex flex-col items-center">
                        <div className="mb-2">
                            <img className="w-36 h-36 rounded-full" src={item.photo} alt="photo" />
                        </div>
                        <div className="uppercase font-semibold">{item.first_name} {item.last_name}</div>
                    </NavLink>
                </li>
            )
        }
    });
    const search_celebreties = props.searchCelebretyList.map((item, i) => (
        <li key={i+1} className="">
            <NavLink  onClick={ () => { props.changeSearchNumberThunkCreator(item.id) } } to={`/profile/${item?.id}`} className="flex rounded-xl justify-between items-center py-2 px-4">
                <div className="w-14">
                    <img className="w-full h-14 rounded-xl" src={item?.photo} alt="photo" />
                </div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.first_name} {item.last_name}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.age}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.country}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.city}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.tags.map((item, i) => {if(i < 5) return item + " "})}</div>
                <div className="w-[calc((100%-7rem-3.5rem)/5)] text-center">{item.category}</div>
            </NavLink>
        </li>
    ));
    const articles = props.articles.map((item, i) => {
        return (
            <li className="mb-4 whitespace-nowrap" key={i+1}>
                <a href={item.href}>{i+1}. {item.title}</a>
            </li>
        )
    });
    const sorted_addresses = props.sortedAddresses.map((item, i) => {
        if(i < 8){
            return(
                <li key={i + 1} className="flex gap-x-6 items-center mb-2">
                    <div className="font-semibold">{i + 1}</div>
                    <div className="flex gap-x-4 items-center">
                        <img className="h-10 w-10 rounded-full" src={item.photo} alt="photo" />
                        <p className="font-semibold uppercase">{item.first_name} {item.last_name}</p>
                    </div>
                </li>
            )
        }
    });
    const sorted_searched = props.sortedSearched.map((item, i) => {
        if(i < 8){
            return(
                <li key={i + 1} className="flex gap-x-6 items-center mb-2">
                    <div className="font-semibold">{i + 1}</div>
                    <div className="flex gap-x-4 items-center">
                        <img className="h-10 w-10 rounded-full" src={item.photo} alt="photo" />
                        <p className="font-semibold uppercase">{item.first_name} {item.last_name}</p>
                    </div>
                </li>
            )
        }
    });

    useEffect(() => {
        props.getArticlesThunkCreator();

        return () => {
            props.setSearchCelebretyInput("");
        }
    }, []);

    return(
        <section className="max-w-5xl w-full mx-auto py-20">
            <div className="mb-10">
                <h1 className="uppercase text-center mb-6 font-extrabold text-2xl">WHAT IS GLOBAL PERSONNALITY TRACKER?</h1>
                <h2 className="text-center mb-6">How about a little history? Global Personnality Tracker originated in Los Angeles around the 1970’s. Traditionally, “Global Personnality Tracker” physical map was commonly sold around the city to help link tourists with the city’s most famous celebrities. Excited fans from all around the world came to explore Hollywood’s movie industry and looked to Star Maps to conveniently locate the homes of their favorite stars.</h2>
                <h2 className="text-center mb-6">For decades now, Global Personnality Tracker has maintained a comprehensive and up-to-date list of the most exclusive mansions in Beverly Hills, Hollywood and the surrounding areas. Today, we continue the tradition by helping our fans connect with their icons country wide through our searchable online database.</h2>
                <p className="text-center font-semibold">Create a <NavLink to="/register" className="underline text-300">free account</NavLink> and test drive our searchable database today!</p>
            </div>
            <div>
                <h1 className="uppercase text-center mb-6 font-extrabold text-2xl">What can I find on GLOBAL PERSONNALITY TRACKER?</h1>
                <h2 className="text-center mb-8">To start, we’ve put together a list of the 10 most searched Celebrities on Global Personnality Tracker Can you guess who they are? </h2>
                <ul className="grid grid-cols-3 gap-y-6 gap-x-20 mb-12">{celebreties}</ul>
                <div className={`relative bg-gradient-to-l from-500 to-500/75 py-6 px-5 w-full mb-6 ${props.searchCelebretyInput? "rounded-t-xl": "rounded-xl"}`}>
                    <p className="text-center mb-4 font-extrabold text-2xl">Find any celebrity address with  PERSONNALITY TRACKER® Pro</p>
                    <input className="w-full py-5 pr-12 pl-6 rounded-xl uppercase font-semibold text-2xls"
                        placeholder="Find a celebrety" type="text" value={props.searchCelebretyInput}
                        onChange={ (e) => { props.setSearchCelebretyInput(e.target.value) } } />
                    <ul className="absolute bottom-0 left-0 translate-y-full w-full bg-400 rounded-b-xl">{search_celebreties}</ul>
                </div>
                <div>
                    <p className="text-center mb-8">If you want to learn more, why not take a stroll through our blog? We have put together a lot of awesome content which makes for a great way to explore and immerse yourself in the world of the rich and famous. Check out our top 10 best articles on Global Personnality Tracker.</p>
                    <ul className="max-w-sm mx-auto mb-10">{articles}</ul>
                    <div className="flex justify-center gap-x-48">
                        <div className="flex flex-col items-center">
                            <h3 className="inline-block uppercase font-extrabold text-2xl mb-2.5 relative before:absolute before:bottom-0
                            before:left-0 before:w-full before:h-[1px] before:bg-[#B5B8D1]">Celebrity Addresses</h3>
                            <ul>{sorted_addresses}</ul>
                        </div>
                        <div className="flex flex-col items-center">
                            <h3 className="inline-block uppercase font-extrabold text-2xl mb-2.5 relative before:absolute before:bottom-0
                            before:left-0 before:w-full before:h-[1px] before:bg-[#B5B8D1]">Top Searches</h3>
                            <ul>{sorted_searched}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;