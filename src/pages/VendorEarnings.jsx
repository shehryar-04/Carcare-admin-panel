// VendorEarnings.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

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

const VendorEarnings = ({ vendorId }) => {
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const serviceRequestsQuery = query(
          collection(db, 'serviceRequests'),
          where('vendorId', '==', vendorId),
          where('state', '==', 'completed')
        );
        
        const snapshot = await getDocs(serviceRequestsQuery);
        const requests = [];
        
        for (const docRef of snapshot.docs) {
          const request = docRef.data();
          const serviceDoc = await getDoc(doc(db, 'services', request.serviceId));
          
          if (serviceDoc.exists()) {
            const serviceData = serviceDoc.data();
            const commission = serviceData.vendorCommission || 0;
            const credit = (request.price * commission) / 100;
            
            requests.push({
              credit,
              createdAt: request.createdAt?.toDate() || new Date(),
            });
          }
        }
        
        setEarningsData(requests);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch earnings data');
        setLoading(false);
      }
    };

    if (vendorId) fetchEarningsData();
  }, [vendorId]);

  const processChartData = () => {
    const groupedData = earningsData.reduce((acc, { credit, createdAt }) => {
      const dateKey = timeFilter === 'year' ? createdAt.getFullYear() :
        timeFilter === 'month' ? `${createdAt.getFullYear()}-${createdAt.getMonth()}` :
        `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDate()}`;
      
      acc[dateKey] = (acc[dateKey] || 0) + credit;
      return acc;
    }, {});

    const labels = Object.keys(groupedData).sort();
    const dataPoints = labels.map(label => groupedData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Vendor Earnings',
          data: dataPoints,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  if (loading) return <div>Loading earnings data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Earnings Overview</h4>
        <select 
          className="form-select w-25"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      
      <Line 
        data={processChartData()}
        options={{
          responsive: true,
          scales: {
            x: {
              type: timeFilter === 'year' ? 'time' : 'category',
              time: {
                unit: timeFilter
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Credits Earned'
              }
            }
          }
        }}
      />
    </div>
  );
};

export default VendorEarnings;