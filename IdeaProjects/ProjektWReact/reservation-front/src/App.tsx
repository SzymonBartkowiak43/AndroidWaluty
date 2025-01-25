import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalonList from './components/salonList/SalonList';
import SalonDetails from './components/salonDetails/SalonDetails';
import Register from './components/register/Register';
import Login from './components/login/Login';
import UserReservation from "./components/userReservation/UserReservation";
import index from './index.css';

function App() {
    return (
        <Router>
            <div className="app-content">
                <Routes>
                    <Route path="/" element={<SalonList/>}/>
                    <Route path="/salons/:id" element={<SalonDetails/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/reservations" element={<UserReservation/>}/>
                </Routes>
            </div>
        </Router>
);
}

export default App;