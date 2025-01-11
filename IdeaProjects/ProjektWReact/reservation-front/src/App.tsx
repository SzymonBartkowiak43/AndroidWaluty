import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalonList from './components/SalonList';
import SalonDetails from './components/SalonDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SalonList />} />
                <Route path="/salons/:id" element={<SalonDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
