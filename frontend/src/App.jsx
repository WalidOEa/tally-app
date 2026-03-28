import {useEffect, useState, useRef} from 'react';
import './App.css';
import {Increment, Decrement, GetInitialCount, SetLimit, GetLimit} from "../wailsjs/go/main/App";
import hamburger from './assets/animations/hamburger.json';
import gear from './assets/animations/gear.json';
import {Player} from '@lottiefiles/react-lottie-player';

function App() {
    const [count, setCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [limitOpen, setLimitOpen] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [limit, setLimit] = useState(null);
    const [limitInput, setLimitInput] = useState('');
    const hamburgerRef = useRef(null);
    const gearRef = useRef(null);

    useEffect(() => {
        GetInitialCount().then(setCount);
        GetLimit().then(result => {
            if (result) setLimit(result);
        });
    }, []);

    function increment() {
        Increment().then(setCount);
    }

    function decrement() {
        Decrement().then(setCount);
    }

    function toggleSidebar() {
        setSidebarOpen(o => !o);
    }

    function handleApplyLimit() {
        const parsed = parseInt(limitInput);
        if (isNaN(parsed) || parsed <= 0) return;
        SetLimit(parsed).then(() => {
            setLimit(parsed);
            setLimitInput('');
            setLimitModalOpen(false);
        });
    }

    function handleClearLimit() {
        SetLimit(0).then(() => {
            setLimit(null);
            setLimitModalOpen(false);
        });
    }

    return (
        <div id="App" className="app-container">
            <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <button
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    onMouseEnter={() => {
                        const player = hamburgerRef.current;
                        if (player) {
                            player.setSeeker(0);
                            player.play();
                        }
                    }}>
                    <Player
                        ref={hamburgerRef}
                        autoplay={false}
                        loop={false}
                        src={hamburger}
                        style={{
                            height: '24px',
                            width: '24px',
                            transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                        }}
                    />
                </button>
                {sidebarOpen && (
                    <div className="sidebar-header">History</div>
                )}
            </aside>

            <main className="main-content">
                <div className="main-toolbar">
                    <button
                        className="limit-btn"
                        onClick={() => setLimitOpen(o => !o)}
                        onMouseEnter={() => {
                            const player = gearRef.current;
                            if (player) {
                                player.setSeeker(0);
                                player.play();
                            }
                        }}
                    >
                        <Player
                            ref={gearRef}
                            autoplay={false}
                            loop={false}
                            src={gear}
                            style={{ height: '24px', width: '24px' }}
                        />
                    </button>
                    {limitOpen && (
                        <div className="gear-menu">
                            <div className="gear-menu-item" onClick={() => {
                                setLimitModalOpen(true);
                                setLimitOpen(false);
                            }}>
                                <span className="gear-menu-label">
                                    Limit {limit !== null ? `(${limit})` : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {limitModalOpen && (
                    <div className="modal-overlay" onClick={() => setLimitModalOpen(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <span className="modal-title">
                                    {limit !== null ? `Current limit: ${limit}` : 'No limit set'}
                                </span>
                                <button className="modal-close" onClick={() => setLimitModalOpen(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <input
                                    className="modal-input"
                                    type="number"
                                    placeholder="Enter new limit..."
                                    value={limitInput}
                                    onChange={e => setLimitInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleApplyLimit()}
                                />
                                <div className="modal-actions">
                                    <button className="btn" onClick={handleApplyLimit}>
                                        Apply
                                    </button>
                                    {limit !== null && (
                                        <button className="btn" onClick={handleClearLimit}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="count" style={{
                    color: limit !== null && count >= limit ? '#ff6b6b' : 'var(--neon-ice)'
                }}>
                    {count}
                </div>
                <div className="btns">
                    <button className="btn" onClick={increment}>+1</button>
                    <button className="btn" onClick={decrement}>-1</button>
                </div>
            </main>
        </div>
    )
}

export default App