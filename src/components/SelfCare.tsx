import { useState, useEffect } from 'react';
import { SelfCareTip } from '../types/selfCare';
import { Plus, X, Play, Pause, RotateCcw, Edit } from 'lucide-react';
import { addSharedTip, getSharedTips, SharedTip, testFirebaseConnection, deleteSharedTip } from '../lib/firebase';
import { StudyFlowLogo } from './StudyFlowLogo';

export const SelfCare = () => {
  const [tips, setTips] = useState<SelfCareTip[]>([]);
  const [userTips, setUserTips] = useState<SelfCareTip[]>([]);
  const [sharedTips, setSharedTips] = useState<SelfCareTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTip, setNewTip] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAddingTip, setIsAddingTip] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [editingTipId, setEditingTipId] = useState<string | null>(null);
  const [editingTipText, setEditingTipText] = useState('');
  const [editingTipShared, setEditingTipShared] = useState(false);
  
  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [pomodoroSession, setPomodoroSession] = useState(0);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}self-care-tips.json`);
        if (!response.ok) {
          throw new Error('Failed to load self care tips');
        }
        const data = await response.json();
        setTips(data.filter((tip: SelfCareTip) => tip.active));
      } catch (err) {
        // Fallback to default tips if fetch fails
        console.warn('Using fallback self care tips due to:', err);
        setTips([
          { id: '1', text: 'Sleep 9 Hours', active: true },
          { id: '2', text: 'Eat Healthy', active: true },
          { id: '3', text: 'Exercise', active: true },
          { id: '4', text: 'Go Outside', active: true }
        ]);
      }

      // Test Firebase connection and load shared tips
      try {
        const isConnected = await testFirebaseConnection();
        setFirebaseConnected(isConnected);
        
        if (isConnected) {
          const firebaseSharedTips = await getSharedTips();
          setSharedTips(firebaseSharedTips.map(tip => ({
            id: tip.id,
            text: tip.text,
            author: tip.author,
            active: tip.active,
            isShared: true,
            createdAt: tip.createdAt.toDate().toISOString()
          })));
        }
      } catch (err) {
        console.warn('Could not connect to Firebase:', err);
        setFirebaseConnected(false);
      }
    };

    loadTips();
    
    // Load user tips from localStorage
    const savedUserTips = localStorage.getItem('userSelfCareTips');
    if (savedUserTips) {
      try {
        setUserTips(JSON.parse(savedUserTips));
      } catch (err) {
        console.error('Error loading user tips:', err);
      }
    }

    // Load author name from localStorage
    const savedAuthorName = localStorage.getItem('authorName');
    if (savedAuthorName) {
      setAuthorName(savedAuthorName);
    }

    setLoading(false);
  }, []);

  const saveUserTips = (updatedTips: SelfCareTip[]) => {
    setUserTips(updatedTips);
    localStorage.setItem('userSelfCareTips', JSON.stringify(updatedTips));
  };

  const handleAddTip = async (shareWithOthers = false) => {
    console.log('handleAddTip called with shareWithOthers:', shareWithOthers);
    if (newTip.trim()) {
      const tip: SelfCareTip = {
        id: `user-${Date.now()}`,
        text: newTip.trim(),
        active: true,
        author: authorName || 'Anonymous',
        isShared: shareWithOthers,
        createdAt: new Date().toISOString()
      };
      
      console.log('Created tip:', tip);
      
      if (shareWithOthers) {
        if (!firebaseConnected) {
          alert('Firebase is not connected. Sharing is currently unavailable. Please check your Firestore rules.');
          return;
        }

        try {
          console.log('Attempting to share tip with Firebase...');
          // Add to Firebase
          const docRef = await addSharedTip({
            text: tip.text,
            author: tip.author || 'Anonymous',
            active: true
          });

          console.log('Successfully added to Firebase with ID:', docRef);
          tip.firebaseId = docRef;

          console.log('Successfully added to Firebase, refreshing shared tips...');
          // Refresh shared tips
          const firebaseSharedTips = await getSharedTips();
          setSharedTips(firebaseSharedTips.map(tip => ({
            id: tip.id,
            text: tip.text,
            author: tip.author,
            active: tip.active,
            isShared: true,
            createdAt: tip.createdAt.toDate().toISOString()
          })));
          console.log('Shared tips updated:', sharedTips);
        } catch (error) {
          console.error('Error sharing tip:', error);
          alert('Failed to share tip: ' + (error as Error).message);
          return; // Don't save locally if Firebase failed
        }
      }

      saveUserTips([...userTips, tip]);
      setNewTip('');
      setIsAddingTip(false);
    }
  };

  const handleShareTip = async (tipId: string) => {
    const tip = userTips.find(t => t.id === tipId);
    if (tip && !tip.isShared) {
      try {
        // Add to Firebase
        const docRef = await addSharedTip({
          text: tip.text,
          author: tip.author || 'Anonymous',
          active: true
        });

        const updatedTip = { ...tip, isShared: true, firebaseId: docRef };
        const updatedTips = userTips.map(t => t.id === tipId ? updatedTip : t);
        saveUserTips(updatedTips);

        // Refresh shared tips
        const firebaseSharedTips = await getSharedTips();
        setSharedTips(firebaseSharedTips.map(tip => ({
          id: tip.id,
          text: tip.text,
          author: tip.author,
          active: tip.active,
          isShared: true,
          createdAt: tip.createdAt.toDate().toISOString()
        })));
      } catch (error) {
        console.error('Error sharing tip:', error);
      }
    }
  };

  const handleDeleteTip = async (id: string) => {
    const tip = userTips.find(t => t.id === id);
    if (tip && tip.firebaseId) {
      try {
        await deleteSharedTip(tip.firebaseId);
        // Remove from shared tips display using firebaseId
        setSharedTips(sharedTips.filter(t => t.id !== tip.firebaseId));
      } catch (error) {
        console.error('Error deleting tip from Firebase:', error);
      }
    }
    const updatedTips = userTips.filter(tip => tip.id !== id);
    saveUserTips(updatedTips);
  };

  const handleEditTip = (tipId: string) => {
    const tip = userTips.find(t => t.id === tipId);
    if (tip) {
      setEditingTipId(tipId);
      setEditingTipText(tip.text);
      setEditingTipShared(tip.isShared || false);
    }
  };

  const handleSaveEdit = async () => {
    if (editingTipId && editingTipText.trim()) {
      const tip = userTips.find(t => t.id === editingTipId);
      if (!tip) return;

      const wasShared = tip.isShared || false;
      const willBeShared = editingTipShared;
      const hasFirebaseId = !!tip.firebaseId;

      // If trying to share while Firebase is offline
      if (!wasShared && willBeShared && !firebaseConnected) {
        alert('Firebase is offline. Cannot share tips at this time. Please keep the tip private.');
        return;
      }

      // If switching from shared to private, delete from Firebase
      if (wasShared && !willBeShared && hasFirebaseId) {
        try {
          await deleteSharedTip(tip.firebaseId!);
          // Remove from shared tips display
          setSharedTips(sharedTips.filter(t => t.id !== tip.firebaseId));
          // Clear the firebaseId
          tip.firebaseId = undefined;
        } catch (error) {
          console.error('Error deleting tip from Firebase:', error);
          alert('Failed to unshare tip: ' + (error as Error).message);
          return;
        }
      }

      // If switching from private to shared and doesn't have firebaseId, add to Firebase
      if (!wasShared && willBeShared && firebaseConnected && !hasFirebaseId) {
        try {
          const docRef = await addSharedTip({
            text: editingTipText.trim(),
            author: tip.author || 'Anonymous',
            active: true
          });
          // Store the firebaseId
          tip.firebaseId = docRef;
          // Refresh shared tips
          const firebaseSharedTips = await getSharedTips();
          setSharedTips(firebaseSharedTips.map(tip => ({
            id: tip.id,
            text: tip.text,
            author: tip.author,
            active: tip.active,
            isShared: true,
            createdAt: tip.createdAt.toDate().toISOString()
          })));
        } catch (error) {
          console.error('Error sharing tip:', error);
          alert('Failed to share tip: ' + (error as Error).message);
          return;
        }
      }

      const updatedTips = userTips.map(tip =>
        tip.id === editingTipId ? {
          ...tip,
          text: editingTipText.trim(),
          isShared: willBeShared
        } : tip
      );
      saveUserTips(updatedTips);
      setEditingTipId(null);
      setEditingTipText('');
      setEditingTipShared(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTipId(null);
    setEditingTipText('');
    setEditingTipShared(false);
  };

  const handleAuthorNameChange = (name: string) => {
    setAuthorName(name);
    localStorage.setItem('authorName', name);
  };

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroActive) {
      // Timer finished
      setPomodoroActive(false);
      if (pomodoroMode === 'work') {
        // Switch to break after work session
        setPomodoroMode('break');
        setPomodoroTime(5 * 60); // 5 minute break
        setPomodoroSession(prev => prev + 1);
        // Play sound or show notification here
        alert('Work session complete! Time for a break.');
      } else {
        // Switch back to work after break
        setPomodoroMode('work');
        setPomodoroTime(25 * 60); // 25 minute work session
        alert('Break over! Time to focus again.');
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime, pomodoroMode]);

  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePomodoro = () => {
    setPomodoroActive(!pomodoroActive);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroMode('work');
    setPomodoroTime(25 * 60);
  };

  if (loading) {
    return (
      <div className="pb-8">
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl min-h-[400px] flex flex-col items-center justify-center">
          <StudyFlowLogo size={64} className="mb-4" />
          <span className="font-display text-cream-text text-xl">Loading self care tips...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-8">
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl min-h-[400px] flex flex-col items-center justify-center">
          <StudyFlowLogo size={64} className="mb-4" />
          <span className="font-display text-cream-text text-xl">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 space-y-6">
      {/* Pomodoro Timer Section */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <StudyFlowLogo size={48} />
          <div>
            <p className="text-cream-text/40 text-[10px] tracking-widest">STUDYFLOW</p>
            <h2 className="font-display text-cream-text text-2xl">Pomodoro Timer</h2>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          {/* Timer Display */}
          <div className={`text-7xl md:text-8xl font-display font-bold tracking-wider ${
            pomodoroMode === 'work' ? 'text-cream-text' : 'text-green-400'
          }`}>
            {formatPomodoroTime(pomodoroTime)}
          </div>
          
          {/* Mode Indicator */}
          <div className={`px-6 py-2 rounded-full font-display text-lg tracking-wide ${
            pomodoroMode === 'work' 
              ? 'bg-cream-text/20 text-cream-text' 
              : 'bg-green-400/20 text-green-400'
          }`}>
            {pomodoroMode === 'work' ? 'FOCUS TIME' : 'BREAK TIME'}
          </div>

          {/* Session Counter */}
          <div className="text-center">
            <span className="font-display text-cream-text/60 text-sm">
              Sessions completed: {pomodoroSession}
            </span>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={togglePomodoro}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                pomodoroActive 
                  ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-400/50 hover:bg-yellow-500/30' 
                  : 'bg-green-500/20 text-green-400 border-2 border-green-400/50 hover:bg-green-500/30'
              }`}
            >
              {pomodoroActive ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button
              onClick={resetPomodoro}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-navy-light text-cream-text border-2 border-navy-light hover:bg-navy-light/80 transition-all"
            >
              <RotateCcw size={32} />
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center max-w-md">
            <p className="font-display text-cream-text/60 text-sm">
              {pomodoroMode === 'work' 
                ? 'Stay focused for 25 minutes, then take a 5-minute break.' 
                : 'Relax and recharge. Your next work session starts after the break.'}
            </p>
          </div>
        </div>
      </div>

      {/* Default Tips Section */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl">
        <h2 className="font-display text-cream-text text-2xl mb-6 tracking-wide">Default Self Care Tips</h2>
        <ul className="space-y-4">
          {tips.map(tip => (
            <li key={tip.id} className="flex items-center gap-4">
              <span className="w-3 h-3 bg-cream-text rounded-full flex-shrink-0" />
              <span className="font-display text-cream-text text-xl md:text-2xl tracking-wide">
                {tip.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shared Tips Section */}
      {sharedTips.length > 0 && (
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl">
          <h2 className="font-display text-cream-text text-2xl mb-6 tracking-wide">Community Tips</h2>
          <ul className="space-y-4">
            {sharedTips.map(tip => (
              <li key={tip.id} className="flex items-center gap-4">
                <span className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-display text-cream-text text-xl md:text-2xl tracking-wide block">
                    {tip.text}
                  </span>
                  {tip.author && (
                    <span className="font-display text-cream-text/60 text-sm">
                      by {tip.author}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Tips Section */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-cream-text text-2xl tracking-wide">Your Personal Tips</h2>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              firebaseConnected 
                ? 'bg-green-900/30 text-green-400 border border-green-400/30' 
                : 'bg-red-900/30 text-red-400 border border-red-400/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                firebaseConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {firebaseConnected ? 'Connected' : 'Offline'}
            </div>
            <button
              onClick={() => setIsAddingTip(true)}
              className="bg-cream-text text-navy px-4 py-2 rounded-lg font-display hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Tip
            </button>
          </div>
        </div>

        {/* Add Tip Form */}
        {isAddingTip && (
          <div className="mb-6 p-4 bg-navy-light rounded-lg border border-navy-light">
            <div className="space-y-3">
              <input
                type="text"
                value={authorName}
                onChange={(e) => handleAuthorNameChange(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 bg-cream-text text-navy rounded-lg font-display placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-cream-text"
              />
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTip(false)}
                placeholder="Enter your self care tip..."
                className="w-full px-4 py-2 bg-cream-text text-navy rounded-lg font-display placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-cream-text"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddTip(false)}
                  className="bg-cream-text text-navy px-4 py-2 rounded-lg font-display hover:bg-opacity-90 transition-colors"
                >
                  Keep Private
                </button>
                <button
                  onClick={() => handleAddTip(true)}
                  className="bg-cream-text text-navy px-4 py-2 rounded-lg font-display hover:bg-opacity-90 transition-colors border-2 border-cream-text"
                >
                  Share with Others
                </button>
                <button
                  onClick={() => {
                    setIsAddingTip(false);
                    setNewTip('');
                  }}
                  className="bg-navy-light text-cream-text px-4 py-2 rounded-lg font-display hover:bg-navy transition-colors border border-navy-light"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Tips List */}
        {userTips.length > 0 ? (
          <ul className="space-y-4">
            {userTips.map(tip => (
              <li key={tip.id} className="flex items-center gap-4 group">
                <span className="w-3 h-3 bg-cream-text rounded-full flex-shrink-0" />
                <div className="flex-1">
                  {editingTipId === tip.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingTipText}
                        onChange={(e) => setEditingTipText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="w-full px-4 py-2 bg-cream-text text-navy rounded-lg font-display focus:outline-none focus:ring-2 focus:ring-cream-text"
                        autoFocus
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTipShared}
                          onChange={(e) => setEditingTipShared(e.target.checked)}
                          className="w-4 h-4 accent-cream-text"
                        />
                        <span className="font-display text-cream-text text-sm">
                          Share with others {editingTipShared && !firebaseConnected && '(Firebase offline)'}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-display hover:bg-opacity-90 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-navy-light text-cream-text px-4 py-2 rounded-lg font-display hover:bg-navy transition-colors border border-navy-light"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="font-display text-cream-text text-xl md:text-2xl tracking-wide block">
                        {tip.text}
                      </span>
                      {tip.author && (
                        <span className="font-display text-cream-text/60 text-sm">
                          by {tip.author}
                          {tip.isShared && ' • Shared with others'}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {editingTipId !== tip.id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditTip(tip.id)}
                      className="text-cream-text/60 hover:text-cream-text transition-colors"
                      title="Edit tip"
                    >
                      <Edit size={20} />
                    </button>
                    {!tip.isShared && (
                      <button
                        onClick={() => handleShareTip(tip.id)}
                        className="text-cream-text/60 hover:text-cream-text transition-colors"
                        title="Share with others"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTip(tip.id)}
                      className="text-cream-text/60 hover:text-cream-text transition-colors"
                      title="Delete tip"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="font-display text-cream-text/60 text-lg">
              No personal tips yet. Click "Add Tip" to create your own self care ideas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
