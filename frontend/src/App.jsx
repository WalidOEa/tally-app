import {useEffect, useState, useRef} from 'react';
import './App.css';
import {Increment, Decrement, GetInitialCount} from "../wailsjs/go/main/App";
import hamburger from './assets/animations/hamburger.json';
import gear from './assets/animations/gear.json';
import {Player} from '@lottiefiles/react-lottie-player';

function App() {
    const [count, setCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [limitOpen, setLimitOpen] = useState(false)
    const hamburgerRef = useRef(null);
    const gearRef = useRef(null);

    useEffect(() => {
        GetInitialCount().then(result => {
            setCount(result);
        });
    }, []);

    function increment() {
        Increment().then(setCount)
    }

    function decrement() {
        Decrement().then(setCount)
    }

    function toggleSidebar() {
        setSidebarOpen(o => !o);
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
                            <div className="gear-menu-item">
                                <span className="gear-menu-label">Limit</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="count">{count}</div>
                <div className="btns">
                    <button className="btn" onClick={increment}>+1</button>
                    <button className="btn" onClick={decrement}>-1</button>
                </div>
            </main>
        </div>
    )
}

export default App
