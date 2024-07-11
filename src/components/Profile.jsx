import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { get, ref } from "firebase/database";
import instagram from "../assets/icons/social_madia/instagram.svg";
import twitter from "../assets/icons/social_madia/twitter.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import arrow_left from "../assets/icons/arrow_left.svg";
import arrow_right from "../assets/icons/arrow_right.svg";

const Profile = (props) => {
    const swiperRef = useRef(null);
    const { userId } = useParams();
    const [celebrety, setCelebrety] = useState({
        movies: [],
        tags: []
    });

    const fetchData = async () => {
        const dbRef = ref(db, 'celebreties');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            Object.values(snapshot.val()).forEach(item => {
                if(item.id == userId){
                    setCelebrety(item);
                }
            });
        }
    }

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
        fetchData();
    }, []);
    return(
        <section className="py-10">
            <div className="container mx-auto">
                <div className="w-full bg-400 px-14 py-10 rounded-2xl">
                    <div className="flex gap-x-20 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:letf-0 after:w-full
                        after:h-[1px] after:bg-700 mb-4">
                        <div className="min-w-96">
                            <img className="w-full h-[27rem] object-cover rounded-3xl mb-6" src={celebrety.photo} alt="" />
                            <div className="flex justify-center itemc-center gap-x-2">
                                <a href="#">
                                    <img src={instagram} alt="instagram" />
                                </a>
                                <a href="#">
                                    <img src={twitter} alt="twitter" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl text-center uppercase font-semibold mb-4">{celebrety.first_name} {celebrety.last_name}</h1>
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
                        <h3 className="uppercase font-bold text-center mb-4">Tags</h3>
                        <div className="flex justify-center gap-x-4">
                            {
                                celebrety.tags.map(item => {
                                    return <div className="bg-gradient-to-l from-500 to-500/75 py-1.5 px-3 rounded-xl">#{item}</div>
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <h3 className="uppercase font-bold text-center mb-4">Filmograpfy</h3>
                        <Swiper
                            ref={swiperRef}
                            spaceBetween={100}
                            slidesPerView={5}
                            loop={true}
                            className="mb-6"
                        >
                            {
                                celebrety.movies.map(item => {
                                    return (
                                        <SwiperSlide>
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
                </div>
            </div>
        </section>
    )
}

export default Profile;