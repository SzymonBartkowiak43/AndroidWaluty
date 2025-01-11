import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SalonListCSS.css";

const SalonList = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:8080/salons")
            .then((response) => {
                setSalons(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching salons:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="salon-list">
            {salons.length === 0 ? (
                <p>No salons available.</p>
            ) : (
                salons.map((salon: any) => (
                    <div key={salon.id} className="salon-card">
                        <h3>{salon.salonName}</h3>
                        <p>{salon.city}</p>
                        <Link to={`/salons/${salon.id}`}>See Details</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default SalonList;
