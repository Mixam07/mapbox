import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Report from './Report';
import Directory from './Directory';
import Ranking from './Ranking';
import About from './About';
import Profile from './Profile';
import Page404 from './Page404';
import { useState } from 'react';
import Register from './Register';

const App = (props) => {
    const [searchCelebrety, setSearchCelebrety] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    const [isMapActive, setIsMapActive] = useState(true);
    return (
        <>
            <Routes>
                <Route path="/" element={<Header isMapActive={isMapActive} setIsMapActive={setIsMapActive} isHomePage={true}
                    searchCelebrety={searchCelebrety} setSearchCelebrety={setSearchCelebrety} setIsFocus={setIsFocus} />} />
                <Route path="*" element={<Header />} />
            </Routes>
            <main className="pt-[5.75rem]">
                <Routes>
                    <Route path="/" element={<Home setIsMapActive={setIsMapActive} searchCelebrety={searchCelebrety}
                        setSearchCelebrety={setSearchCelebrety} isFocus={isFocus} setIsFocus={setIsFocus} />} />
                    <Route path="/directory" element={<Directory />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </main>
        </>
    );
}

export default App;