import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OfferSelector from "./OfferSelector";
import EmployeeSelector from "./EmployeeSelector";
import TermList from "./TermList";
import ReservationPopup from "./ReservationPopup";
import { getOffersBySalonId } from "../../Services/offerService";
import {
  getEmployeeToOffer,
  getAvailableDates,
} from "../../Services/employeeService";
import { createReservation } from "../../Services/reservationService";
import { Offer } from "../../models/Offer";
import { Employee } from "../../models/Employee";
import { Term } from "../../models/Term";
import "./SalonDetailsCSS.css";
import header from "../header/Header";

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch offers for the salon
  useEffect(() => {
    setLoadingOffers(true);
    getOffersBySalonId(id!)
      .then((response) => {
        setOffers(response.data);
        setLoadingOffers(false);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setLoadingOffers(false);
      });
  }, [id]);

  // Fetch employees for selected offer
  const fetchEmployees = (offerId: number) => {
    setLoadingEmployees(true);
    getEmployeeToOffer(offerId)
      .then((response) => {
        setEmployees(response.data);
        setLoadingEmployees(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoadingEmployees(false);
      });
  };

  // Fetch available terms based on selections
  const fetchAvailableTerms = () => {
    if (!selectedOfferId || !selectedEmployeeId || !selectedDate) {
      alert("Please select an offer, an employee, and a date.");
      return;
    }

    setLoadingTerms(true);
    getAvailableDates(selectedEmployeeId, selectedDate, selectedOfferId)
      .then((response) => {
        setAvailableTerms(response.data);
        setLoadingTerms(false);
      })
      .catch((error) => {
        console.error("Error fetching available terms:", error);
        setLoadingTerms(false);
      });
  };

  const handleConfirmReservation = (reservationData: {
    salonId: number;
    offerId: number;
    employeeId: number;
    reservationDateTime: string;
    userEmail: string;
  }) => {
    createReservation(reservationData)
      .then(() => {
        alert("Reservation successful!");
        setShowPopup(false);
        setSelectedTerm(null);
      })
      .catch(() => {
        alert("Failed to create reservation.");
      });
  };

  return (
    <div className="salon-details">
      <h2>Salon Details - Offers and Reservations</h2>

      {/* Offer Selector */}
      {loadingOffers ? (
        <div>Loading offers...</div>
      ) : (
        <OfferSelector
          offers={offers}
          selectedOfferId={selectedOfferId}
          onOfferSelect={(offerId) => {
            setSelectedOfferId(offerId);
            fetchEmployees(offerId);
          }}
        />
      )}

      {/* Employee Selector */}
      {selectedOfferId && (
        <EmployeeSelector
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          loading={loadingEmployees}
          onEmployeeSelect={(employeeId) => setSelectedEmployeeId(employeeId)}
        />
      )}

      {/* Date Picker */}
      <div>
        <h3>Select a Date</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Fetch Terms Button */}
      <button onClick={fetchAvailableTerms} disabled={loadingTerms}>
        {loadingTerms ? "Fetching terms..." : "Fetch Available Terms"}
      </button>

      {/* Term List */}
      <TermList
        terms={availableTerms}
        onTermSelect={(term) => {
          setSelectedTerm(term);
          setShowPopup(true);
        }}
      />

      {/* Reservation Popup */}
      {showPopup && selectedTerm && selectedOfferId && selectedEmployeeId && (
        <ReservationPopup
          term={selectedTerm}
          salonId={Number(id)}
          offerId={selectedOfferId}
          employeeId={selectedEmployeeId}
          date={selectedDate}
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  );
};

export default header(SalonDetails, "SalonDetails");
