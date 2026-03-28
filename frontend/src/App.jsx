import {useEffect, useState} from 'react';
import './App.css';
import {Increment, Decrement, GetInitialCount} from "../wailsjs/go/main/App";
import hamburger from './assets/animations/hamburger.json';
import {Player} from '@lottiefiles/react-lottie-player';

function App() {
    const [count, setCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

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

    return (
        <div id="App" className="app-container">
            <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
                    <Player
                        autoplay={false}
                        src={hamburger}
                        style={{ height: '24px', width: '24px' }}
                    />
                </button>
                {sidebarOpen && (
                    <div className="sidebar-header">History</div>
                )}
            </aside>

            <main className="main-content">
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
