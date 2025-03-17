import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalonList from './components/salonList/SalonList';
import SalonDetails from './components/salonDetails/SalonDetails';
import Register from './components/register/Register';
import Login from './components/login/Login';
import UserReservation from "./components/userReservation/UserReservation";
import MySalonsPage from "./components/mySalons/MySalonsPage";
import SalonDetailsPage from "./components/mySalons/SalonDetailsPage";
import CreateSalon from "./components/createSalon/CreateSalon";
import AddOpeningHours from "./components/addOpeningHours/AddOpeningHours";
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
                    <Route path="/owner/salons" element={<MySalonsPage/>}/>
                    <Route path="/owner/salon/:salonId" element={<SalonDetailsPage/>} />
                    <Route path="/create-salon" element={<CreateSalon />} />
                    <Route path="/add-opening-hours/:salonId" element={<AddOpeningHours />} />
                </Routes>
            </div>
        </Router>
);
}

export default App;