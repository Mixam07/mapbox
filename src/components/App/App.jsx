import { Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Login from '../Login/Login';
import { useEffect, useState } from 'react';
import Register from '../Register/Register';
import HomeContainer from '../Home/HomeContainer';
import Paymant from '../Payment/Payment';
import ProfileContainer from '../Profile/ProfileContainer';
import AboutContainer from '../About/AboutContainer';
import RankingContainer from '../Ranking/RankingContainer';
import Buy from '../Buy/Buy';

const plans = [
    {
        title: "starting plan",
        description: "Starter plan offers basic access to exclusive content.",
        value: "starting",
        price: 0
    },
    {
        title: "MONTHLY UNLIMITED",
        description: "Starter plan offers basic access to exclusive content.",
        value: "basic",
        price: 14
    },
    {
        title: "6-MONTH UNLIMITED",
        description: "Starter plan offers basic access to exclusive content.",
        value: "standard",
        price: 12.95
    },
    {
        title: "ANNUAL PRO PLAN",
        description: "Starter plan offers basic access to exclusive content.",
        value: "premium",
        price: 10.95
    },
]

const App = (props) => {
    const [isMapActive, setIsMapActive] = useState(true);
    const [isCreateCelebretyActive, setIsCreateCelebretyActive] = useState(false);
    const [isReportActive, setIsReportActive] = useState(false);

    useEffect(() => {
        props.getCelebretiesThunkCreator();
    }, []);
    return (
        <>
            <Routes>
                <Route path="/" element={<Header isMapActive={isMapActive} setIsMapActive={setIsMapActive} isHomePage={true}
                    isReportActive={isReportActive} setIsReportActive={setIsReportActive}/>} />
                <Route path="*" element={<Header />} isReportActive={isReportActive} setIsReportActive={setIsReportActive} />
            </Routes>
            <main className="pt-[5.75rem]">
                <Routes>
                    <Route path="/" element={<HomeContainer setIsMapActive={setIsMapActive} isMapActive={isMapActive}
                        isReportActive={isReportActive} setIsReportActive={setIsReportActive}
                        isCreateCelebretyActive={isCreateCelebretyActive} setIsCreateCelebretyActive={setIsCreateCelebretyActive}/>} />
                    <Route path="/ranking" element={<RankingContainer />} />
                    <Route path="/about" element={<AboutContainer />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:userId" element={<ProfileContainer />} />
                    <Route path="/buy" element={<Buy plans={plans} />} />
                    <Route path="/payment/:plan" element={<Paymant plans={plans} />} />
                </Routes>
            </main>
        </>
    );
}

export default App;