import { useEffect } from "react";

const Ranking = (props) => {
    const users = props.users.map((item, i) => {
        const first_letter = item.username? item.username[0]: item?.first_name[0];
        return(
            <li key={i} className="bg-400 flex rounded-xl justify-between items-center py-2 px-4">
                <div className="w-14 h-14 bg-black/50 rounded-xl flex justify-center items-center">
                    <p className="text-400 uppercase font-semibold text-3xl">{first_letter}</p>
                </div>
                <div className="w-[calc((100%-3.5rem)/4)] text-center">{item.username? item.username: `${item?.first_name} ${item?.last_name}`}</div>
                <div className="w-[calc((100%-3.5rem)/4)] text-center">{item.country}</div>
                <div className="w-[calc((100%-3.5rem)/4)] text-center">{item.categories?.slice(0,3).join(", ")}</div>
                <div className="w-[calc((100%-3.5rem)/4)] text-center">{item.numberReport}</div>
            </li>
        )
    });

    useEffect(() => {
        props.getUsersThunkCreator();
    }, []);

    return(
        <section className="flex justify-center items-center h-[calc(100vh-5.75rem)] flex-col p-10">
            <h1 className="text-300 font-semibold text-5xl uppercase mb-10 text-center">Spotters Ranking</h1>
            <div className="bg-gradient-to-l from-500 to-500/75 py-10 px-7 h-[90%] w-full rounded-2xl">
                <div className={`flex justify-between items-center mb-3 ${props.users.length > 7 ? "pl-12 pr-16": "px-12"}`}>
                    <div className="w-14"></div>
                    <div className="w-[calc((100%-3.5rem)/4)] text-center">Name</div>
                    <div className="w-[calc((100%-3.5rem)/4)] text-center">Country</div>
                    <div className="w-[calc((100%-3.5rem)/4)] text-center">Tags</div>
                    <div className="w-[calc((100%-3.5rem)/4)] text-center">Number of reports</div>
                </div>
                <ul className="flex flex-col gap-y-4 overflow-auto h-[calc(100%-1.75rem)] px-7 custome-scrollbar">
                    {users}
                </ul>
            </div>
        </section>
    )
}

export default Ranking;