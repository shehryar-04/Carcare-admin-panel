import React, { useEffect, useState } from 'react';  
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';  
import { Bar } from 'react-chartjs-2';  
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);  
  
const options = {  
  responsive: true,  
  plugins: {  
    legend: {  
      position: 'top',  
    },  
    title: {  
      display: true,  
      text: 'Number of Users and Vendors by Area',  
    },  
  },  
};  
  
const App = () => {  
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });  
  
  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        // Fetch users and vendors data  
        const usersResponse = await fetch('https://backend.neurodude.co/api/users');  
        const usersData = await usersResponse.json();  
  
        const vendorsResponse = await fetch('https://backend.neurodude.co/api/vendors');  
        const vendorsData = await vendorsResponse.json();  
  
        // Group users and vendors by area  
        const areaCounts = {};  
  
        // Count users by area  
        usersData.forEach(user => {  
          if (user.locations && user.locations.length > 0) {  
            const area = user.locations[0].areaName; // Get the areaName from the first location  
            if (!areaCounts[area]) {  
              areaCounts[area] = { users: 0, vendors: 0 };  
            }  
            areaCounts[area].users += 1;  
          }  
        });  
  
        // Count vendors by area  
        vendorsData.forEach(vendor => {  
          const area = vendor.area; // Assuming vendor object has an 'area' property  
          if (!areaCounts[area]) {  
            areaCounts[area] = { users: 0, vendors: 0 };  
          }  
          areaCounts[area].vendors += 1;  
        });  
  
        // Prepare data for chart  
        const labels = Object.keys(areaCounts);  
        const userCounts = labels.map(area => areaCounts[area].users);  
        const vendorCounts = labels.map(area => areaCounts[area].vendors);  
  
        setChartData({  
          labels,  
          datasets: [  
            {  
              label: 'Number of Users',  
              data: userCounts,  
              backgroundColor: 'rgba(255, 99, 132, 0.5)',  
            },  
            {  
              label: 'Number of Vendors',  
              data: vendorCounts,  
              backgroundColor: 'rgba(53, 162, 235, 0.5)',  
            },  
          ],  
        });  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  
  
    fetchData();  
  }, []);  
  
  return <Bar options={options} data={chartData} />;  
};  
  
export default App;  