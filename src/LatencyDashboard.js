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
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.llmvitals.com/api/historical-latencies');
        setLatencies(response.data);
      } catch (error) {
        console.error('Error fetching latencies:', error);
      }
    };
    fetchData();
  }, []);

  const openaiModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'];
  const anthropicModels = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20240620'];
  const geminiModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];
  const groqModels = ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'];

  const getFilteredLatencies = (provider, model) => {
    const now = new Date();
    const startTime = new Date(now);

    switch (timeRange) {
      case '3d':
        startTime.setDate(now.getDate() - 3);
        break;
      case '1w':
        startTime.setDate(now.getDate() - 7);
        break;
      case '1m':
        startTime.setMonth(now.getMonth() - 1);
        break;
      default:
        startTime.setDate(now.getDate() - 1);
    }

    return latencies
      .filter(latency => latency.provider === provider && latency.model === model && new Date(latency.createdAt) >= startTime)
      .map(latency => ({ x: new Date(latency.createdAt), y: latency.latency }));
  };

  const openaiData = {
    datasets: openaiModels.map((model) => ({
      label: model,
      data: getFilteredLatencies('openai', model),
      borderColor: model === 'gpt-3.5-turbo' ? 'blue' : model === 'gpt-4' ? 'orange' : model === 'gpt-4-turbo' ? 'red' : 'lime',
      backgroundColor: model === 'gpt-3.5-turbo' ? 'blue' : model === 'gpt-4' ? 'orange' : model === 'gpt-4-turbo' ? 'red' : 'lime',
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };
  
  const anthropicData = {
    datasets: anthropicModels.map((model, index) => ({
      label: model,
      data: getFilteredLatencies('anthropic', model),
      borderColor: `hsl(${(index * 120) % 360}, 100%, 50%)`,
      backgroundColor: `hsl(${(index * 120) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };
  
  const geminiData = {
    datasets: geminiModels.map((model, index) => ({
      label: model,
      data: getFilteredLatencies('google', model),
      borderColor: `hsl(${(index * 90) % 360}, 100%, 50%)`,
      backgroundColor: `hsl(${(index * 90) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };


  const groqData = {
    datasets: groqModels.map((model, index) => ({
      label: model,
      data: getFilteredLatencies('groq', model),
      borderColor: `hsl(${(index * 120) % 360}, 100%, 50%)`,
      backgroundColor: `hsl(${(index * 120) % 360}, 100%, 50%)`,
      tension: 0.3,
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
    })),
  };


  const options = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM D, HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          major: {
            enabled: true
          },
          align: 'start',
          maxTicksLimit: 8
        }
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
          The 4 charts below track the response times of the main large language model APIs:
        </p>
        <ul>
          <li>OpenAI (GPT-4, GPT-3.5-turbo, GPT-4o and GPT-4-turbo)</li>
          <li>Anthropic (Opus, Sonnet, Haiku, Claude 3.5 Sonnet)</li>
          <li>Google Gemini (1.5 Pro, 1.5 Flash, 1.0 Pro)</li>
          <li>Groq (LLaMA3 8b-8192, LLaMA3 70b-8192, Mixtral 8x7b-32768)</li>
        </ul>
        <p>
          The response times are measured by generating a maximum of 100 tokens at a temperature of 0.7 every 10 minutes.
        </p>
  
      </div>
      <div style={{ marginTop: '20px'}}>
        <h2>OpenAI</h2>
        <div>
          <label htmlFor="time-range">Time Range:</label>
          <select id="time-range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="24h">Last 24 Hours</option>
            <option value="3d">Last 3 Days</option>
            <option value="1w">Last 1 Week</option>
            <option value="1m">Last 1 Month</option>
          </select>
        </div>
        <br></br>
        <div className="graph-container" id="openai">
          
          <h3>OpenAI Latency</h3>
          <Line data={openaiData} options={options} />
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Anthropic</h2>
        <div className="graph-container" id="anthropic">
          <h3>Anthropic Latency</h3>
          <Line data={anthropicData} options={options} />
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Google Gemini</h2>
        <div className="graph-container" id="google">
          <h3>Google Gemini Latency</h3>
          <Line data={geminiData} options={options} />
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Groq</h2>
        <div className="graph-container" id="groq">
          <h3>Groq Latency</h3>
          <Line data={groqData} options={options} />
        </div>
      </div>
<br>
</br>
<div className='main-bottom'>
<h2>Why Monitor Response Times?</h2>
<p>Understanding the average response times for APIs of major LLM providers like OpenAI, Google, Anthropic, and Groq is crucial for several technical reasons:</p>

<ul>
<li><strong>Performance and User Experience</strong>: Response time directly impacts the performance and user experience of LLM-powered applications. Faster response times ensure a smooth and efficient user interaction, while slower times can lead to frustration and decreased engagement.</li>
<li><strong>Issue Identification and Optimization</strong>: Monitoring response times helps identify performance bottlenecks and areas for improvement. Providers can optimize their infrastructure and algorithms to ensure reliable and efficient service.</li>
<li><strong>Cost Optimization and Resource Allocation</strong>: Faster response times enable more efficient resource utilization, potentially reducing costs. Comparing response times allows businesses to select providers that offer the best balance between performance and cost-effectiveness.</li>
<li><strong>Scalability Planning</strong>: Understanding expected response times is essential for designing scalable applications. It helps in planning infrastructure growth and ensuring long-term performance as demand increases.</li>
<li><strong>Competitive Advantage</strong>: Staying informed about response times of major LLM providers helps businesses make data-driven decisions and partner with the most reliable and performant providers, maintaining a competitive edge in the market.</li>
</ul>
<p>
In summary, monitoring and comparing average response times of LLM APIs is vital for ensuring optimal performance, cost-effectiveness, scalability, and staying competitive in the rapidly evolving LLM landscape.
</p>   
</div>
      <footer className="App-footer">
        <ul>
          <li><a href="staff-engineers-guide-to-large-language-models.html">• Staff Engineer's Guide to Large Language Model</a></li><br></br>
          <li><a href="large-language-models-for-product-managers.html">• Large Language Models for Product Managers</a></li><br></br>
          <li><a href="ctos-guide-to-large-language-models.html">• CTO's Guide to Large Language Models</a></li>

        </ul>
      </footer>
    </div>
  );
};

export default LatencyDashboard;