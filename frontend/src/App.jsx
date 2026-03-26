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

    function reset() {

    }

    return (
        <div id="App">
            <div className="count">{count}</div>
            <div className="btns">
                <button className="btn" onClick={tally}>+1</button>
                <button className="btn" onClick={reset}>0</button>
            </div>
        </div>
    )
}

export default App
