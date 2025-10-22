import React, { useState } from 'react';
import { User, Song, LoyaltyInfo } from '../types';
import { LogOutIcon, MusicIcon, MessageSquareIcon, CrownIcon, StarIcon } from './Icons';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
}

const allSongs: Song[] = [
    { id: 's101', title: 'Bohemian Rhapsody', artist: 'Queen' },
    { id: 's102', title: 'Don\'t Stop Believin\'', artist: 'Journey' },
    { id: 's103', title: 'I Will Always Love You', artist: 'Whitney Houston' },
    { id: 's104', title: 'Hotel California', artist: 'Eagles' },
    { id: 's105', title: 'Billie Jean', artist: 'Michael Jackson' },
    { id: 's106', title: 'Livin\' on a Prayer', artist: 'Bon Jovi' },
    { id: 's107', title: 'Sweet Caroline', artist: 'Neil Diamond' },
    { id: 's108', title: 'Wonderwall', artist: 'Oasis' },
];

const mockLoyalty: LoyaltyInfo = {
    visits: 12,
    points: 850,
    tier: 'Gold',
    history: [
        { date: '2023-10-25', spent: 150, points_earned: 150 },
        { date: '2023-09-12', spent: 80, points_earned: 80 },
        { date: '2023-08-01', spent: 220, points_earned: 220 },
    ]
};

const SongQueue: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [queue, setQueue] = useState<Song[]>([]);
    const filteredSongs = allSongs.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToQueue = (song: Song) => {
        if (!queue.find(s => s.id === song.id)) {
            setQueue([...queue, song]);
        }
    };

    return (
        <div className="bg-brand-surface rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-display text-brand-primary mb-4 flex items-center"><MusicIcon className="mr-2 w-6 h-6"/> Digital Song Queue</h3>
            <input 
                type="text"
                placeholder="Search for a song or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-bg border border-brand-primary/30 rounded-md px-3 py-2 mb-4"
            />
            <div className="flex-grow overflow-y-auto pr-2">
                <h4 className="font-semibold text-brand-text-secondary mb-2">Your Queue ({queue.length})</h4>
                <ul className="space-y-2 mb-4">
                    {queue.length > 0 ? queue.map((song, i) => (
                        <li key={song.id} className="bg-brand-bg p-3 rounded-md flex justify-between items-center">
                            <span>{i+1}. {song.title} - <span className="text-brand-text-secondary">{song.artist}</span></span>
                        </li>
                    )) : <p className="text-brand-text-secondary text-sm">Add songs from the list below!</p>}
                </ul>

                <h4 className="font-semibold text-brand-text-secondary mb-2">Available Songs</h4>
                <ul className="space-y-2">
                    {filteredSongs.map(song => (
                        <li key={song.id} className="bg-brand-bg p-3 rounded-md flex justify-between items-center">
                           <span>{song.title} - <span className="text-brand-text-secondary">{song.artist}</span></span>
                           <button onClick={() => addToQueue(song)} className="text-brand-accent text-sm font-bold hover:underline">ADD</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const FeedbackForm: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="bg-brand-surface rounded-lg p-6 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-display text-brand-primary mb-4">Thank you!</h3>
                <p className="text-brand-text-secondary">Your feedback helps us improve.</p>
            </div>
        )
    }

    return (
        <div className="bg-brand-surface rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-display text-brand-primary mb-4 flex items-center"><MessageSquareIcon className="mr-2 w-6 h-6"/> Guest Feedback</h3>
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="mb-4">
                    <p className="text-brand-text-secondary mb-2">How was your experience?</p>
                    <div className="flex space-x-1 text-brand-primary">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <StarIcon className="w-8 h-8 transition-colors" filled={(hoverRating || rating) >= star} />
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    placeholder="Any comments or suggestions?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full flex-grow bg-brand-bg border border-brand-primary/30 rounded-md px-3 py-2 mb-4 resize-none"
                    rows={4}
                />
                <button type="submit" className="w-full bg-brand-secondary text-brand-bg font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-neon-secondary">
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

const LoyaltyTracker: React.FC = () => {
    return (
        <div className="bg-brand-surface rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-display text-brand-primary mb-4 flex items-center"><CrownIcon className="mr-2 w-6 h-6"/> Loyalty Rewards</h3>
            <div className="text-center bg-brand-bg rounded-lg p-4 mb-4">
                <p className="text-brand-text-secondary">Current Tier</p>
                <p className={`text-2xl font-bold ${mockLoyalty.tier === 'Gold' ? 'text-yellow-400' : 'text-brand-primary'}`}>{mockLoyalty.tier}</p>
                <p className="text-4xl font-bold mt-2">{mockLoyalty.points} <span className="text-lg text-brand-text-secondary">points</span></p>
                <p className="text-sm text-brand-text-secondary">{1000 - mockLoyalty.points} points to next tier</p>
            </div>
            <h4 className="font-semibold text-brand-text-secondary mb-2">Visit History</h4>
            <ul className="space-y-2 flex-grow overflow-y-auto pr-2">
                {mockLoyalty.history.map((visit, i) => (
                    <li key={i} className="bg-brand-bg p-3 rounded-md flex justify-between text-sm">
                        <span>{visit.date}</span>
                        <span className="text-brand-text-secondary">Spent ${visit.spent}</span>
                        <span className="text-green-400">+{visit.points_earned} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display text-brand-text">Room Control Panel: <span className="text-brand-primary">{user.currentRoom}</span></h1>
        <div className="flex items-center space-x-4">
            <span className="text-brand-text-secondary">Welcome, {user.name}</span>
            <button onClick={onLogout} className="flex items-center space-x-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
                <LogOutIcon className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{minHeight: '75vh'}}>
        <div className="lg:col-span-1">
          <SongQueue />
        </div>
        <div className="lg:col-span-1">
          <FeedbackForm />
        </div>
        <div className="lg:col-span-1">
          <LoyaltyTracker />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;