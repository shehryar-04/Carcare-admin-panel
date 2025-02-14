import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ServiceRequestsChart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service requests and users data
        const serviceRequestsResponse = await axios.get('https://backend.neurodude.co/api/service-request');
        const usersResponse = await axios.get('https://backend.neurodude.co/api/users');
        
        setServiceRequests(serviceRequestsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {  
    const monthData = months.reduce((acc, month) => {  
        acc[month] = {  
            paidUsers: 0,  
            cancelledBySystem: 0,  
            cancelledByUser: 0,  
            totalRequests: 0,  
        };  
        return acc;  
    }, {});  
  
    // Track paid users' IDs  
    const paidUsersSet = new Set();  
  
    serviceRequests.forEach(req => {  
        // Convert Firebase timestamp to JavaScript Date  
        const reqDate = new Date(req.createdAt._seconds * 1000);  
        if (isNaN(reqDate.getTime())) return; // Skip if invalid date  
  
        const reqYear = reqDate.getFullYear();  
        const reqMonth = format(reqDate, 'MMMM');  
  
        if (reqYear === selectedYear) {  
            monthData[reqMonth].totalRequests += 1;  
  
            // Check if the request was paid  
            if (req.price > 0) {  
                monthData[reqMonth].paidUsers += 1;  
                paidUsersSet.add(req.userId); // Add userId to paid users set  
            }  
  
            // Count cancelled requests  
            if (req.state === 'cancelled') monthData[reqMonth].cancelledBySystem += 1;  
            if (req.state === 'cancelled by user') monthData[reqMonth].cancelledByUser += 1;  
        }  
    });  
  
    return {  
        labels: months,  
        datasets: [  
            {  
                label: 'Paid Users',  
                data: months.map(month => monthData[month].paidUsers),  
                backgroundColor: 'rgba(76, 175, 80, 0.5)',  
                borderColor: 'rgb(76, 175, 80)',  
                borderWidth: 1,  
            },  
            {  
                label: 'Cancelled by System',  
                data: months.map(month => monthData[month].cancelledBySystem),  
                backgroundColor: 'rgba(244, 67, 54, 0.5)',  
                borderColor: 'rgb(244, 67, 54)',  
                borderWidth: 1,  
            },  
            {  
                label: 'Cancelled by User',  
                data: months.map(month => monthData[month].cancelledByUser),  
                backgroundColor: 'rgba(156, 39, 176, 0.5)',  
                borderColor: 'rgb(156, 39, 176)',  
                borderWidth: 1,  
            },  
            {  
                label: 'Total Requests',  
                data: months.map(month => monthData[month].totalRequests),  
                backgroundColor: 'rgba(33, 150, 243, 0.5)',  
                borderColor: 'rgb(33, 150, 243)',  
                borderWidth: 1,  
            },  
        ],  
    };  
};  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Service Requests Analytics - ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-md p-2"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[500px]">
        <Bar options={options} data={getChartData()} />
      </div>
    </div>
  );
};

export default ServiceRequestsChart;
