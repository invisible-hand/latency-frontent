// src/App.js
import React from 'react';
import './App.css';
import LatencyDashboard from './LatencyDashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>LLM Vitals</h1>
        <nav>
          <ul>
            <li><a href="#openai">OpenAI</a></li>
            <li><a href="#anthropic">Anthropic</a></li>
            <li><a href="#google">Google</a></li>
          </ul>
        </nav>
      </header>
      <LatencyDashboard />
    </div>
  );
}

export default App;