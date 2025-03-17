import { useEffect, useState } from 'react';
import api from '../../services/api';
import "./OfferList.css";

enum SourceSystem {
    AKMF = "AKMF",
    THE_PROTOCOL = "THE_PROTOCOL",
    JUST_JOIN = "JUST_JOIN"
}

interface OfferDto {
    id: string;
    title: string;
    offerUrl: string;
    location: string;
    workMode: string;
    salary: string;
    company: string;
    skills: string[];
    source: SourceSystem;
    fetchDate: string;
}

// Nowy typ definiujący kategorię oferty
enum OfferCategory {
    TODAY = "TODAY",
    THIS_WEEK = "THIS_WEEK",
    OLDER = "OLDER"
}

const OfferList = () => {
    const [offers, setOffers] = useState<OfferDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 30;

    // Funkcja określająca kategorię oferty
    const getOfferCategory = (fetchDate: string): OfferCategory => {
        const offerDate = new Date(fetchDate);
        const nowDate = new Date();

        // Resetujemy godziny, minuty, sekundy i milisekundy dla porównania dni
        const today = new Date(nowDate);
        today.setHours(0, 0, 0, 0);

        // Ustawiamy datę na początek tygodnia (poniedziałek)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

        // Sprawdzamy czy oferta jest z ostatnich 24h
        const isLastDay = (nowDate.getTime() - offerDate.getTime()) <= 24 * 60 * 60 * 1000;

        // Sprawdzamy czy oferta jest z bieżącego tygodnia (bez dzisiaj)
        const isThisWeek = offerDate >= startOfWeek && offerDate < today;

        if (isLastDay) {
            return OfferCategory.TODAY;
        } else if (isThisWeek) {
            return OfferCategory.THIS_WEEK;
        } else {
            return OfferCategory.OLDER;
        }
    };

    // Funkcja do sortowania ofert według kategorii i daty
    const sortOffers = (offers: OfferDto[]): OfferDto[] => {
        return [...offers].sort((a, b) => {
            const categoryA = getOfferCategory(a.fetchDate);
            const categoryB = getOfferCategory(b.fetchDate);

            // Najpierw sortujemy według kategorii
            if (categoryA !== categoryB) {
                if (categoryA === OfferCategory.TODAY) return -1;
                if (categoryB === OfferCategory.TODAY) return 1;
                if (categoryA === OfferCategory.THIS_WEEK) return -1;
                if (categoryB === OfferCategory.THIS_WEEK) return 1;
            }

            // W ramach tej samej kategorii sortujemy według daty (najnowsze pierwsze)
            return new Date(b.fetchDate).getTime() - new Date(a.fetchDate).getTime();
        });
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await api.get('/offers');
                // Sortowanie ofert według kategorii i daty
                const sortedOffers = sortOffers(response.data);
                setOffers(sortedOffers);
            } catch (error) {
                console.error('Błąd podczas pobierania ofert:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    // Obliczamy indeksy ofert do wyświetlenia na bieżącej stronie
    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

    // Obliczamy całkowitą liczbę stron
    const totalPages = Math.ceil(offers.length / offersPerPage);

    // Funkcja do zmiany strony
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Funkcja do przejścia do następnej strony
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Funkcja do przejścia do poprzedniej strony
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <div className="loading-spinner">Ładowanie...</div>;

    return (
        <div className="offer-container">
            <h1>Oferty Pracy</h1>
            <div className="offer-legend">
                <div className="legend-item">
                    <span className="new-offer-dot"></span>
                    <span>Nowe oferty (ostatnie 24h)</span>
                </div>
                <div className="legend-item">
                    <span className="week-offer-dot"></span>
                    <span>Oferty z tego tygodnia</span>
                </div>
            </div>

            <div className="offer-grid">
                {currentOffers.map((offer) => {
                    const category = getOfferCategory(offer.fetchDate);
                    return (
                        <div
                            key={offer.id}
                            className={`offer-card ${category === OfferCategory.TODAY ? 'new-offer' :
                                category === OfferCategory.THIS_WEEK ? 'week-offer' : ''}`}
                        >
                            <h2>
                                {offer.title}
                                {category === OfferCategory.TODAY && <span className="new-badge">NOWA</span>}
                                {category === OfferCategory.THIS_WEEK && <span className="week-badge">W TYM TYGODNIU</span>}
                            </h2>
                            <div className="offer-details">
                                <p><strong>Firma:</strong> {offer.company}</p>
                                <p><strong>Lokalizacja:</strong> {offer.location}</p>
                                <p><strong>Tryb pracy:</strong> {offer.workMode}</p>
                                <p><strong>Wynagrodzenie:</strong> {offer.salary}</p>
                                <p><strong>Link:</strong>
                                    <a href={offer.offerUrl} target="_blank" rel="noopener noreferrer">
                                        Zobacz ofertę
                                    </a>
                                </p>
                                <p><strong>Źródło:</strong> {offer.source}</p>
                                <p><strong>Data publikacji:</strong> {new Date(offer.fetchDate).toLocaleString('pl-PL')}</p>
                                <div className="skills-section">
                                    <strong>Wymagane umiejętności:</strong>
                                    <ul>
                                        {offer.skills.map((skill, index) => (
                                            <li key={index}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Paginacja */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        &laquo; Poprzednia
                    </button>

                    <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Następna &raquo;
                    </button>
                </div>
            )}

            <div className="offer-count">
                Wyświetlanie {indexOfFirstOffer + 1}-{Math.min(indexOfLastOffer, offers.length)} z {offers.length} ofert
            </div>
        </div>
    );
};

export default OfferList;