// frontend/src/LatencyDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const LatencyDashboard = () => {
  const [latencies, setLatencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://llmvitals.com/api/historical-latencies');

        //const response = await axios.get('http://localhost:5001/api/historical-latencies');
        setLatencies(response.data);
      } catch (error) {
        console.error('Error fetching latencies:', error);
      }
    };
    fetchData();
  }, []);

  const openaiModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'];
  const anthropicModels = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
  const geminiModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];

  const openaiData = {
    datasets: openaiModels.map((model, index) => ({
      label: model,
      data: latencies
        .filter(latency => latency.provider === 'openai' && latency.model === model)
        .map(latency => ({ x: new Date(latency.createdAt), y: latency.latency })),
      borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };
  
  const anthropicData = {
    datasets: anthropicModels.map((model, index) => ({
      label: model,
      data: latencies
        .filter(latency => latency.provider === 'anthropic' && latency.model === model)
        .map(latency => ({ x: new Date(latency.createdAt), y: latency.latency })),
      borderColor: `hsl(${(index * 120) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };
  
  const geminiData = {
    datasets: geminiModels.map((model, index) => ({
      label: model,
      data: latencies
        .filter(latency => latency.provider === 'google' && latency.model === model)
        .map(latency => ({ x: new Date(latency.createdAt), y: latency.latency })),
      borderColor: `hsl(${(index * 90) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Latency (ms)',
        },
      },
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>OpenAI, Anthropic and Google Gemini APIs Response Time Tracker</h1>
      <div style={{ textAlign: 'left', margin: 'auto', width: '80%' }}>
        <p>
          The 3 charts below track the response times of the main large language model APIs:
        </p>
        <ul>
          <li>OpenAI (GPT-4, GPT-3.5-turbo, GPT-4o and GPT-4-turbo)</li>
          <li>Anthropic (Opus, Sonnet, Haiku)</li>
          <li>Google Gemini (1.5 Pro, 1.5 Flash, 1.0 Pro)</li>
        </ul>
        <p>
          The response times are measured by generating a maximum of 30 tokens at a temperature of 0.7 every 5 minutes.
        </p>
      </div>
      <div className="graph-container">
  <h3>OpenAI Latency</h3>
  <Line data={openaiData} options={options} className="latency-chart" />
</div>
<br />
<div className="graph-container">
  <h3>Anthropic Latency</h3>
  <Line data={anthropicData} options={options} className="latency-chart" />
</div>
<br />
<div className="graph-container">
  <h3>Google Gemini Latency</h3>
  <Line data={geminiData} options={options} className="latency-chart" />
</div>
      <p>
        <br></br>
        <strong>Disclaimer:</strong> We are not affiliated with OpenAI, Google, or Anthropic. This is an independent project to track and compare the response times of their respective language model APIs.
      </p>
    </div>
  );
};

export default LatencyDashboard;