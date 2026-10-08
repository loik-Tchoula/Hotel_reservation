import React, { useState } from 'react';
import './App.css';

const ROOMS_DATA = [
  { id: 1, name: 'Deluxe Ocean Suite', price: 250, type: 'Suite', rating: 4.9, image: 'https://unsplash.com', available: true, features: ['Ocean View', 'King Bed', 'Balcony', 'Free Wi-Fi'] },
  { id: 2, name: 'Executive Luxury Room', price: 180, type: 'Executive', rating: 4.7, image: 'https://unsplash.com', available: true, features: ['City View', 'Queen Bed', 'Work Desk', 'Mini Bar'] },
  { id: 3, name: 'Standard Comfort Twin', price: 120, type: 'Standard', rating: 4.5, image: 'https://unsplash.com', available: false, features: ['Twin Beds', 'Smart TV', 'Coffee Maker'] },
  { id: 4, name: 'Family Grand Suite', price: 320, type: 'Suite', rating: 5.0, image: 'https://unsplash.com', available: true, features: ['2 Bedrooms', 'Kitchenette', 'Living Area', 'Free Breakfast'] }
];

export default function App() {
  const [rooms, setRooms] = useState(ROOMS_DATA);
  const [filter, setFilter] = useState('All');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', date: '' });
  const [reservations, setReservations] = useState([]);

  const filteredRooms = rooms.filter(room => {
    const matchesType = filter === 'All' || room.type === filter;
    const matchesAvailability = !showOnlyAvailable || room.available;
    return matchesType && matchesAvailability;
  });

  const handleBookClick = (room) => {
    setSelectedRoom(room);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.date) return;

    // Update reservations local state
    const newReservation = {
      id: Date.now(),
      roomName: selectedRoom.name,
      ...bookingDetails
    };
    setReservations([...reservations, newReservation]);

    // Set room to unavailable locally for visual feedback
    setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, available: false } : r));
    
    alert(`Success! Reservation confirmed for ${selectedRoom.name}.`);
    setSelectedRoom(null);
    setBookingDetails({ name: '', email: '', date: '' });
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">✨ Grand Horizon Resort</div>
        <nav className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#reservations">My Bookings ({reservations.length})</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Find Your Perfect Stay</h1>
        <p>Experience luxury, comfort, and world-class hospitality.</p>
      </section>

      <main className="content" id="rooms">
        <div className="controls">
          <div className="filter-group">
            <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All Rooms</button>
            <button className={filter === 'Suite' ? 'active' : ''} onClick={() => setFilter('Suite')}>Suites</button>
            <button className={filter === 'Executive' ? 'active' : ''} onClick={() => setFilter('Executive')}>Executive</button>
            <button className={filter === 'Standard' ? 'active' : ''} onClick={() => setFilter('Standard')}>Standard</button>
          </div>
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={showOnlyAvailable} 
              onChange={(e) => setShowOnlyAvailable(e.target.checked)} 
            />
            Show Available Only
          </label>
        </div>

        <div className="room-grid">
          {filteredRooms.map(room => (
            <div key={room.id} className={`room-card ${!room.available ? 'sold-out' : ''}`}>
              <div className="image-wrapper">
                <img src={room.image} alt={room.name} />
                <span className={`badge ${room.available ? 'avail' : 'unavail'}`}>
                  {room.available ? 'Available' : 'Booked Out'}
                </span>
              </div>
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="rating">⭐ {room.rating}</p>
                <div className="features">
                  {room.features.map((f, i) => <span key={i} className="tag">{f}</span>)}
                </div>
                <div className="card-footer">
                  <span className="price">\${room.price} <span>/ night</span></span>
                  <button 
                    disabled={!room.available} 
                    onClick={() => handleBookClick(room)}
                    className="book-btn"
                  >
                    {room.available ? 'Reserve Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Reservation</h2>
            <p>Booking: <strong>{selectedRoom.name}</strong> at \${selectedRoom.price}/night</p>
            <form onSubmit={handleFormSubmit}>
              <input 
                type="text" 
                placeholder="Your Full Name" 
                required 
                value={bookingDetails.name}
                onChange={e => setBookingDetails({...bookingDetails, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={bookingDetails.email}
                onChange={e => setBookingDetails({...bookingDetails, email: e.target.value})}
              />
              <input 
                type="date" 
                required 
                value={bookingDetails.date}
                onChange={e => setBookingDetails({...bookingDetails, date: e.target.value})}
              />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setSelectedRoom(null)}>Cancel</button>
                <button type="submit" className="confirm-btn">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
