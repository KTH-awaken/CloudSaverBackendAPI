//samma projekt som CloudSaverBackend men nu på Marcus privata repo
//Kör projektet med: node server.js
//Nå endpoint från browser: http://localhost:3000/usage
const express = require('express');

const app = express();

app.use(express.json());

async function fetchData(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Constants for power consumption estimates (in watts)
const avgPowerCPU = 95;  // Average power for CPU under full load
const avgPowerGPU = 200; // Average power for GPU under full load
const avgPowerRAM = 5;   // Average power for RAM under full load
const idlePowerCPU = 10;
const idlePowerGPU = 10;
const idlePowerRAM = 2;

function fetchWithTimeout(url, timeout = 7000) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  }
  
  async function fetchData(url) {
    try {
      const response = await fetchWithTimeout(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  function calculatePowerConsumption(apiData) {
    const { statusData, capacitiesData } = apiData;

    let totalPowerConsumption = 0;
  
    // Assuming statusData and capacitiesData are arrays with one element each
    const statusHosts = statusData[0].status.hosts;
    const capacityHosts = capacitiesData[0].capacities.hosts;

    statusHosts.forEach(host => {
        const cpuLoadPercentage = host.cpu.load.main / 100; // Convert to fraction
        const matchingHost = capacityHosts.find(h => h.id === host.id);
        const gpuCount = matchingHost ? matchingHost.gpu.count : 0;

        const powerCPU = cpuLoadPercentage * avgPowerCPU;
        const powerGPU = gpuCount * avgPowerGPU; // Assuming full load for GPUs

        totalPowerConsumption += powerCPU + powerGPU;
    });

    // Convert power consumption in Watts to kilowatt-hours (assuming 1 hour of operation)
    const totalEnergyConsumptionKWh = totalPowerConsumption / 1000;
    return totalEnergyConsumptionKWh.toFixed(2); // Round to 2 decimal places
}


app.get('/usage', async (req, res) => {
  console.log("Request received at /usage endpoint");
  const statusUrl = 'https://api.cloud.cbh.kth.se/landing/v2/status?n=1';
  const capacitiesUrl = 'https://api.cloud.cbh.kth.se/landing/v2/capacities';
  const statsUrl = 'https://api.cloud.cbh.kth.se/landing/v2/stats';
  const hostInfoUrl = 'https://api.cloud.cbh.kth.se/landing/v2/hostInfo';

  // Fetch data from each API
  const statusData = await fetchData(statusUrl);
  const capacitiesData = await fetchData(capacitiesUrl);
  const statsData = await fetchData(statsUrl);
  const hostInfoData = await fetchData(hostInfoUrl);

  if (!statusData || !capacitiesData || !statsData || !hostInfoData) {
    // If any fetch fails, respond with an error message
  console.log("Failed to fetch data from one or more APIs");
    return res.status(500).json({ error: "Failed to fetch data from one or more APIs" });
  }
  console.log(capacitiesData);

  // Calculate the power consumption
  const powerConsumption = calculatePowerConsumption({statusData, capacitiesData, statsData, hostInfoData});

  // Respond with the calculated power consumption
  res.json({ powerConsumption });
});

app.get('/test', async (req, res) => {
  console.log("Request received at /test endpoint Hello world!");
  res.json({ message: "Hello world!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});