import React, { useState, useEffect } from 'react';
import { UserRole, RoomStatus } from '../types';
import { MicIcon, XIcon } from './Icons';

interface LandingPageProps {
  onLogin: (name: string, role: UserRole, roomName?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showCustomerAccess, setShowCustomerAccess] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);

  const handleSelectRoomForBooking = (roomName: string) => {
    setSelectedRoomName(roomName);
    setShowBookingModal(false);
    setShowCustomerAccess(true);
  };

  const BookingModal: React.FC<{ onSelectRoom: (roomName: string) => void; onClose: () => void; }> = ({ onSelectRoom, onClose }) => {
    const bookableRooms = [
      { name: 'The Velvet Lounge', capacity: 8, price: '$40 / hour', imgId: '101', status: RoomStatus.Available },
      { name: 'Neon Cityscape', capacity: 12, price: '$50 / hour', imgId: '102', status: RoomStatus.InUse },
      { name: 'The Golden Record', capacity: 6, price: '$200 flat rate', imgId: '103', status: RoomStatus.Cleaning },
      { name: 'Retro Rewind', capacity: 10, price: '$45 / hour', imgId: '104', status: RoomStatus.Available },
      { name: 'Galaxy Suite', capacity: 20, price: '$400 flat rate', imgId: '105', status: RoomStatus.Available },
      { name: 'The Speakeasy', capacity: 8, price: '$40 / hour', imgId: '106', status: RoomStatus.InUse },
    ];
    
    const getStatusStyles = (status: RoomStatus) => {
        switch (status) {
            case RoomStatus.InUse: return 'bg-brand-secondary text-brand-bg';
            case RoomStatus.Cleaning: return 'bg-yellow-500 text-brand-bg';
            default: return 'bg-green-500 text-brand-bg';
        }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-brand-surface p-8 rounded-lg shadow-lg w-full max-w-4xl relative transform scale-95 hover:scale-100 transition-transform duration-300">
          <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text z-10">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-display text-brand-primary mb-8 text-center">Select Your Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto pr-4">
            {bookableRooms.map(room => (
              <div key={room.name} className={`bg-brand-bg rounded-lg overflow-hidden group border border-brand-primary/20 ${room.status !== RoomStatus.Available ? 'opacity-60' : ''}`}>
                 <div className="relative">
                    <img src={`https://picsum.photos/400/300?random=${room.imgId}`} alt={room.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"/>
                    <span className={`absolute top-2 right-2 text-xs font-bold py-1 px-2 rounded-full ${getStatusStyles(room.status)}`}>{room.status}</span>
                 </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-brand-text">{room.name}</h3>
                  <p className="text-sm text-brand-text-secondary">Capacity: {room.capacity}</p>
                  <p className="text-md font-semibold text-brand-accent mt-1">{room.price}</p>
                  <button 
                    onClick={() => onSelectRoom(room.name)}
                    disabled={room.status !== RoomStatus.Available}
                    className="w-full mt-4 bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-neon-primary disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CustomerAccessModal: React.FC = () => {
    const [customerName, setCustomerName] = useState('');

    const handleCustomerLogin = () => {
      if (customerName && selectedRoomName) {
        onLogin(customerName, UserRole.Customer, selectedRoomName);
      }
    };
    
    const handleClose = () => {
        setShowCustomerAccess(false);
        setSelectedRoomName(null);
        setCustomerName('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-brand-surface p-8 rounded-lg shadow-lg w-full max-w-sm relative transform scale-95 hover:scale-100 transition-transform duration-300">
          <button onClick={handleClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-display text-brand-primary mb-2 text-center">Confirm Booking</h2>
          <p className="text-center text-brand-text-secondary mb-6">You are booking: <span className="font-bold text-brand-accent">{selectedRoomName}</span></p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-brand-bg border border-brand-primary/50 rounded-md px-4 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button 
              onClick={handleCustomerLogin} 
              className="w-full bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-neon-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!customerName}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StaffLoginModal: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleStaffLogin = () => {
        if (password === 'admin123') {
            onLogin('Admin', UserRole.Admin);
        } else {
            setError('Invalid password');
        }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-brand-surface p-8 rounded-lg shadow-lg w-full max-w-sm relative transform scale-95 hover:scale-100 transition-transform duration-300">
          <button onClick={() => setShowStaffLogin(false)} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-display text-brand-secondary mb-6 text-center">Staff Login</h2>
          <div className="space-y-4">
             <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`w-full bg-brand-bg border rounded-md px-4 py-2 text-brand-text focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-brand-secondary/50 focus:ring-brand-secondary'}`}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              onClick={handleStaffLogin} 
              className="w-full bg-brand-secondary text-brand-bg font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-neon-secondary"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-brand-text">
      {showBookingModal && <BookingModal onClose={() => setShowBookingModal(false)} onSelectRoom={handleSelectRoomForBooking} />}
      {showCustomerAccess && <CustomerAccessModal />}
      {showStaffLogin && <StaffLoginModal />}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MicIcon className="w-8 h-8 text-brand-secondary" />
            <h1 className="text-2xl font-display tracking-wider">Rosalina's & Marie's</h1>
          </div>
          <div className="flex items-center">
            <button
                onClick={() => setShowStaffLogin(true)}
                className="border-2 border-brand-secondary text-brand-secondary font-bold py-2 px-6 rounded-full hover:bg-brand-secondary hover:text-brand-bg transition-all duration-300 hover:shadow-neon-secondary"
            >
                Staff Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1598488581890-a6a4de4f42a7?q=80&w=1920&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 p-4">
          <h2 className="text-4xl md:text-5xl font-display mb-4 leading-tight tracking-tighter max-w-4xl mx-auto" style={{textShadow: '0 0 15px #f0f, 0 0 20px #f0f'}}>
            Web-Based KTV Management Platform with Customer Engagement Tools for Rosalina's and Marie's Restaurant
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-secondary mb-8 max-w-3xl mx-auto">
            Sing your heart out in our luxurious private rooms, complete with state-of-the-art sound systems and a delectable dining menu.
          </p>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="bg-brand-primary text-brand-bg font-bold py-4 px-10 rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-neon-primary"
          >
            Book a Room
          </button>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-brand-bg/80">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-display mb-2 text-brand-primary">Our Rooms</h3>
          <p className="text-brand-text-secondary mb-12">Each designed for a unique vibe and unforgettable night.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['The Velvet Lounge', 'Neon Cityscape', 'The Golden Record', 'Retro Rewind'].map((name, i) => (
              <div key={name} className="group relative overflow-hidden rounded-lg shadow-lg">
                <img src={`https://picsum.photos/400/500?random=${i}`} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-left">
                  <h4 className="text-2xl font-bold text-white">{name}</h4>
                  <p className="text-brand-accent">Up to {6 + i * 2} guests</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Promotions */}
      <section className="py-20 bg-brand-surface/80">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-display mb-2 text-brand-secondary">Pricing Packages</h3>
            <p className="text-brand-text-secondary mb-8">Choose the perfect package for your party.</p>
            <div className="space-y-6">
              <div className="bg-brand-bg p-6 rounded-lg border-l-4 border-brand-secondary">
                <h4 className="text-xl font-bold">Happy Hour Special</h4>
                <p className="text-brand-text-secondary">Mon-Fri, 4-7 PM</p>
                <p className="text-2xl font-bold text-brand-secondary mt-2">$25 / hour</p>
              </div>
              <div className="bg-brand-bg p-6 rounded-lg border-l-4 border-brand-secondary">
                <h4 className="text-xl font-bold">Weekend Warrior</h4>
                <p className="text-brand-text-secondary">Fri-Sun, All Day</p>
                <p className="text-2xl font-bold text-brand-secondary mt-2">$40 / hour</p>
              </div>
              <div className="bg-brand-bg p-6 rounded-lg border-l-4 border-brand-secondary">
                <h4 className="text-xl font-bold">The Headliner Package</h4>
                <p className="text-brand-text-secondary">4 hours + 2 food platters</p>
                <p className="text-2xl font-bold text-brand-secondary mt-2">$200 flat rate</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-display mb-2 text-brand-accent">Ongoing Promotions</h3>
            <p className="text-brand-text-secondary mb-8">Amazing deals to make your night even better.</p>
            <div className="relative border-2 border-brand-accent p-8 rounded-lg shadow-neon-accent">
                <h4 className="text-2xl font-bold mb-4">Student Discount Night</h4>
                <p className="text-brand-text-secondary">Every Wednesday, show your student ID for 20% off your total bill! Plus, get a free pitcher of soda.</p>
                <div className="absolute -top-4 -left-4 bg-brand-accent text-brand-bg font-bold py-1 px-3 rounded-md transform -rotate-6">HOT DEAL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <footer className="py-20 bg-brand-bg/80">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-display mb-4 text-brand-primary">Find Us</h3>
            <p className="text-brand-text-secondary mb-4">123 Karaoke Ave, Music City, 12345</p>
            <p className="text-brand-text-secondary mb-4">Email: contact@rm-ktv.com</p>
            <p className="text-brand-text-secondary">Phone: (123) 456-7890</p>
          </div>
          <div className="h-64 md:h-full rounded-lg overflow-hidden border-2 border-brand-primary/50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086431108298!2d-122.41941548468155!3d37.77492927975952!2m3!1f0!2f0!3f0!3m2!1i1024!i768!4f13.1!3m3!1m2!1s0x8085808c1b3f7f2b%3A0x2f2e5a4a5b4f0b8!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1618493488889!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{border:0}}
              allowFullScreen={false}
              loading="lazy"
              title="Restaurant Location"
              className="grayscale invert-[90%] contrast-[1.2]"
            ></iframe>
          </div>
        </div>
        <div className="text-center mt-16 text-brand-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Rosalina’s & Marie’s Restaurant. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;