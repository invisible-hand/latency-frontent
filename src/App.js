// src/App.js
import React from 'react';
import './App.css';
import LatencyDashboard from './LatencyDashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <a href="/" className="logo">
          <img src="/favicon.ico" alt="LLM Vitals Logo" />
          <p className='headertext'>LLM Vitals</p>
        </a>

        <nav class="header-nav">
          <ul>
            <li><a href="#openai">OpenAI</a></li>
            <li><a href="#anthropic">Anthropic</a></li>
            <li><a href="#google">Google</a></li>
            <li><a href="#groq">Groq</a></li>
          </ul>
        </nav>
      </header>
      <LatencyDashboard />
    </div>
  );
}

export default App;