import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Login from './Login';

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;