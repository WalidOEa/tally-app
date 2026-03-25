import {useEffect, useState} from 'react';
import './App.css';
import {Tally, GetInitialCount} from "../wailsjs/go/main/App";

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        GetInitialCount().then(result => {
            setCount(result);
        });
    }, []);

    function tally() {
        Tally().then(setCount)
    }

    return (
        <div id="App">
            <div>{count}</div>
            <button className="btn" onClick={tally}>Tally</button>
        </div>
    )
}

export default App
