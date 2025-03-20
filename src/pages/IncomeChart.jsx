import React, { useEffect, useState } from 'react';  
import { Line } from 'react-chartjs-2';  
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Input, Button } from 'reactstrap';  
import {  
  Chart as ChartJS,  
  CategoryScale,  
  LinearScale,  
  PointElement,  
  LineElement,  
  Filler,  
  Tooltip,  
  Legend,  
} from 'chart.js';  
  
// Register the necessary components  
ChartJS.register(  
  CategoryScale,  
  LinearScale,  
  PointElement,  
  LineElement,  
  Filler,  
  Tooltip,  
  Legend  
);  
  
const IncomeChart = ({ labelColor, gridLineColor }) => {  
  const [chartData, setChartData] = useState(null);  
  const [serviceRequestsData, setServiceRequestsData] = useState([]);  
  const [startDate, setStartDate] = useState('');  
  const [endDate, setEndDate] = useState('');  
  
  useEffect(() => {  
    const fetchServiceRequests = async () => {  
      try {  
        const response = await fetch('https://backend.neurodude.co/api/service-request');  
        const data = await response.json();  
        setServiceRequestsData(data);  
      } catch (error) {  
        console.error('Error fetching service requests:', error);  
      }  
    };  
  
    fetchServiceRequests();  
  }, []);  
  
  const handleGenerateChart = () => {  
    const monthData = {};  
  
    serviceRequestsData.forEach(request => {  
      if (request.state === 'completed' && request.price && request.createdAt) {  
        const price = parseFloat(request.price);  
        const createdAtDate = new Date(request.createdAt._seconds * 1000); // Convert seconds to milliseconds  
  
        // Check if the request date is within the selected range  
        if (createdAtDate >= new Date(startDate) && createdAtDate <= new Date(endDate)) {  
          const month = createdAtDate.toLocaleString('default', { month: 'long', year: 'numeric' }); // Get month and year  
  
          // Initialize month entry if it doesn't exist  
          if (!monthData[month]) {  
            monthData[month] = { total: 0, count: 0 };  
          }  
  
          // Accumulate the earnings data  
          if (!isNaN(price)) {  
            monthData[month].total += price;  
            monthData[month].count += 1;  
          }  
        }  
      }  
    });  
  
    // Prepare data for chart  
    const labels = Object.keys(monthData);  
    const totalEarnings = labels.map(month => monthData[month].total);  
    const adminPrices = totalEarnings.map(total => total * 0.3);  
    const vendorPrices = totalEarnings.map(total => total * 0.7);  
  
    setChartData({  
      labels,  
      datasets: [  
        {  
          label: 'Total Earnings',  
          data: totalEarnings,  
          borderColor: 'rgb(39, 38, 38)',  
          backgroundColor: 'rgb(39, 38, 38)',  
          pointRadius: 5,  
          tension: 0.5,  
          fill: false,  
        },  
        {  
          label: 'Admin Earnings',  
          data: adminPrices,  
          borderColor: 'rgba(0, 255, 0, 1)',  
          backgroundColor: 'rgba(0, 255, 0, 1)',  
          pointRadius: 5,  
          tension: 0.5,  
          fill: false,  
        },  
        {  
          label: 'Vendor Earnings',  
          data: vendorPrices,  
          borderColor: 'rgb(151, 221, 243)',  
          backgroundColor: 'rgb(151, 221, 243)',  
          pointRadius: 5,  
          tension: 0.5,  
          fill: false,  
        },  
      ],  
    });  
  };  
  
  const options = {  
    responsive: true,  
    maintainAspectRatio: false,  
    scales: {  
      x: {  
        ticks: {  
          color: labelColor || 'grey',  
        },  
        grid: {  
          color: gridLineColor || 'rgba(228, 146, 146, 0.7)',  
        },  
      },  
      y: {  
        min: 0,  
        display: true,  
        ticks: {  
          stepSize: 100,  
          color: labelColor || 'grey',  
        },  
        grid: {  
          color: gridLineColor || 'rgba(228, 146, 146, 0.7)',  
        },  
      },  
    },  
    plugins: {  
      legend: {  
        align: 'start',  
        position: 'top',  
        labels: {  
          boxWidth: 10,  
          color: labelColor || 'black',  
          usePointStyle: true,  
        },  
      },  
    },  
  };  
  
  return (  
    <Card>  
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">  
        <div>  
          <CardTitle className="mb-75" tag="h4">Statistics</CardTitle>  
          <CardSubtitle>Commercial networks and enterprises</CardSubtitle>  
        </div>  
      </CardHeader>  
      <CardBody>  
        <div className="mb-3">  
          <Input  
            type="date"  
            value={startDate}  
            onChange={e => setStartDate(e.target.value)}  
            placeholder="Start Date"  
          />  
          <Input  
            type="date"  
            value={endDate}  
            onChange={e => setEndDate(e.target.value)}  
            placeholder="End Date"  
            className="mt-2"  
          />  
          <Button style={{ backgroundColor: '#255B82', color: 'white' }} className="mt-2" onClick={handleGenerateChart}>  
            Generate Chart  
          </Button>  
        </div>  
        <div style={{ height: '450px' }}>  
          {chartData ? <Line data={chartData} options={options} height={450} /> : <p>Kindly Select a date range to know carcare earnings</p>}  
        </div>  
      </CardBody>  
    </Card>  
  );  
};  
  
export default IncomeChart;  