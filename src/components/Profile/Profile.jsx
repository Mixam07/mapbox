import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import instagram from "../../assets/icons/social_madia/instagram.svg";
import twitter from "../../assets/icons/social_madia/twitter.svg";
import facebook from "../../assets/icons/social_madia/facebook.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import arrow_left from "../../assets/icons/arrow_left.svg";
import arrow_right from "../../assets/icons/arrow_right.svg";
import ReportContainer from "../Report/ReportContainer";
import clock from "../../assets/icons/clock_light.svg";
import Map from "./Map/Map"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/initialization";
import { get, ref, set } from "firebase/database";

const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const customizedDate = (date) => {
    const dateArr = date.split(".");
    const day = dateArr[0];
    const month = dateArr[1];
    const year = dateArr[2];

    return `${monthList[month - 1]} ${day}, ${year}`
}

const customizedTime = (time, date) => {
    const dateArr = date.split(".");
    const day = dateArr[0];
    const month = dateArr[1];
    const year = dateArr[2];

    const postDate = new Date(`${monthList[month - 1]} ${day}, ${year} ${time}`);

    const todayDate = new Date();

    const difference = todayDate - postDate;

    const differenceInMinutes = Math.floor(difference / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInMonths / 365);

    const lessDifference = differenceInYears || differenceInMonths || differenceInDays || differenceInHours || differenceInMinutes;

    const timePeriod = differenceInYears === lessDifference && "year" ||
                        differenceInMonths === lessDifference && "month" ||
                        differenceInDays === lessDifference && "day" ||
                        differenceInHours === lessDifference && "hour" ||
                        differenceInMinutes === lessDifference && "min";

    return `${lessDifference} ${timePeriod} ago`
}

const Profile = (props) => {
    const swiperRef = useRef(null);
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isReportActive, setIsReportActive] = useState(false);
    const [celebrety, setCelebrety] = useState({
        movies: [],
        tags: []
    });

    onAuthStateChanged(auth, async (user) => {
        const dbRef = ref(db, 'users');
        const snapshot = await get(dbRef);

        if(snapshot.exists()){
            const data = Object.values(snapshot.val());

            for(const key in data){
                const item = data[key];

                if(item?.email === user?.email){
                    setUser({
                        ...item,
                        key
                    })
                }
            }
        }
    });

    const slideNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };
    
    const slidePrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    useEffect(() => {
        props.celebreties.forEach(item => {
            if(item.id == userId){
                setCelebrety(item);
            }
        });
    }, [props.celebreties]);

    const follow = async (e) => {
        let followers = celebrety.followers? [...celebrety.followers]: [];
        const isFollower = followers.some(item => item == user.key);

        if(!isFollower){
            followers.push(user.key)
        }else{
            followers = followers.filter(item => item !== user.key);
        }

        const newDbRef = ref(db, 'celebreties/'+ celebrety.key);

        await set(newDbRef, {
            ...celebrety,
            followers
        });

        props.getCelebreties();
    }

    return(
        <>
            <section className="py-10">
                <div className="container mx-auto">
                    <div className="w-full bg-400 px-14 py-10 rounded-2xl">
                        <div className="flex gap-x-20 pb-4 mb-4">
                            <div className="min-w-96">
                                <img className="w-full h-[27rem] object-cover rounded-3xl mb-6" src={celebrety.photo} alt="" />
                                <div className="flex justify-between items-center">
                                    <button onClick={follow} className="bg-300 text-400 px-10 py-2 rounded-2xl">
                                        {celebrety.followers?.some(item => item == user?.key)? "Unfollow": "Follow"}
                                    </button>
                                    <div className="flex justify-center itemc-center gap-x-3">
                                        <a href={celebrety?.social_networks?.instagram}>
                                            <img className="w-6" src={instagram} alt="instagram" />
                                        </a>
                                        <a href={celebrety?.social_networks?.twitter}>
                                            <img className="w-6" src={twitter} alt="twitter" />
                                        </a>
                                        <a href={celebrety?.social_networks?.facebook}>
                                            <img className="w-6" src={facebook} alt="facebook" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl text-center uppercase font-semibold mb-4">{celebrety.first_name} {celebrety.last_name}</h1>
                                <div className="flex justify-between mb-3">
                                    {
                                        celebrety?.tags.map((item, i) => {
                                            return(
                                                <div key={i+1} className="bg-700 px-4 py-1.5 rounded-2xl">#{item}</div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="mb-4 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full
                                    after:h-[1px] after:bg-700">
                                    <h1 className="bg-300 text-400 text-center py-2.5 rounded-2xl font-bold mb-6">Description</h1>
                                    <p className="leading-relaxed tracking-wide">{celebrety.description}</p>
                                </div>
                                <div className="mb-4 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full
                                    after:h-[1px] after:bg-700">
                                    <h1 className="bg-300 text-400 text-center py-2.5 rounded-2xl font-bold mb-6">Career</h1>
                                    <p className="leading-relaxed tracking-wide">{celebrety.career}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full after:h-[1px]
                            after:bg-700 mb-4">
                            <h3 className="uppercase font-bold text-center mb-4">ESTIMATED WEALTH</h3>
                            <div className="text-center">{celebrety.wealth}</div>
                        </div>
                        <div className="pb-6 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full after:h-[1px]
                            after:bg-700 mb-4">
                            <h3 className="uppercase font-bold text-center mb-4">CURRENT ADDRESS</h3>
                            <div className="text-center">{celebrety.addresses && celebrety.addresses[celebrety.addresses.length - 1]?.address}</div>
                        </div>
                        <Map celebrety={celebrety} setIsReportActive={setIsReportActive} />
                        <div className="mb-4 pb-6 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full after:h-[1px]
                            after:bg-700">
                            <h3 className="uppercase font-bold text-center mb-4">Notable Work</h3>
                            <Swiper
                                ref={swiperRef}
                                spaceBetween={100}
                                slidesPerView={5}
                                loop={true}
                                className="mb-6"
                            >
                                {
                                    celebrety.movies?.map((item, i) => {
                                        return (
                                            <SwiperSlide key={i+1}>
                                                <div className="p-4 rounded-3xl bg-[#EBEAED] inline-block mb-2">
                                                    <img className="min-w-44 h-48 rounded-2xl object-cover" src={item.image} alt="image" />
                                                </div>
                                                <p className="text-center uppercase font-semibold">{item.name}</p>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                            <div className="flex justify-center gap-x-1">
                                <button className="bg-300 h-8 w-8 rounded-full flex justify-center items-center" onClick={slidePrev}>
                                    <img src={arrow_left} alt="arrow" />
                                </button>
                                <button className="bg-300 h-8 w-8 rounded-full flex justify-center items-center" onClick={slideNext}>
                                    <img src={arrow_right} alt="arrow" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="uppercase font-bold text-center mb-4">Latest news</h3>
                            <ul className="flex justify-between">
                                {
                                    celebrety?.news?.map((item, i) => {
                                        return(
                                            <li key={i+1}>
                                                <div className="relative mb-2">
                                                    <img className="rounded-2xl" src={item.image} alt="photo" />
                                                    <h3 className="absolute bottom-2 left-2 w-[calc(100%-16px)] text-400 text-2xl font-bold">{item.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-x-4">
                                                    <div>{customizedDate(item.date)}</div>
                                                    <div className="flex items-center gap-x-1">
                                                        <div>
                                                            <img src={clock} alt="clock" />
                                                        </div>
                                                        <p>{customizedTime(item.time, item.date)}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <ReportContainer activeId={userId} setActiveId={() => {}} isActive={isReportActive} setIsActive={setIsReportActive} />
        </>
    )
}

export default Profile;