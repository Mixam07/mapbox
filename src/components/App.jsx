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

const App = (props) => {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/directory" element={<Directory />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </main>
        </>
    );
}

export default App;