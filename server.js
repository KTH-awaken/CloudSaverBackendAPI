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
// Function to calculate power consumption
function calculatePowerConsumption(apiData) {
  // Logic to calculate power consumption based on apiData goes here
  // For now, it's just a placeholder
  return 'Calculated power consumption test';
}

// Define the 'usage' endpoint
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

  // Calculate the power consumption
  const powerConsumption = calculatePowerConsumption({statusData, capacitiesData, statsData, hostInfoData});

  // Respond with the calculated power consumption
  res.json({ powerConsumption });
  console.log(res.json({ powerConsumption }));
});

// app.get('/usage', async (req, res) => { //test get usage
//     res.json({ message: "Test response" });
//   });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});