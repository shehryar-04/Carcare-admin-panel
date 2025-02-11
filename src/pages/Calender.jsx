import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust the path to your firebase config file
import './calender.css'; // Note: the file name is "calender.css" per your code

const ServiceRequestCalendar = ({ requestId }) => {
  const [datesData, setDatesData] = useState([]);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const docRef = doc(db, 'serviceRequests', requestId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
    
          // Ensure dates are parsed correctly and converted to JS Date objects
          const datesArray = data.dates.map((item) => {
            const parsedDate = new Date(item.date);
            
            if (isNaN(parsedDate)) {
              console.warn(`Invalid date format: ${item.date}`);
              return null; // Skip invalid entries
            }
    
            return {
              date: parsedDate,
              status: item.status.toLowerCase() === 'active' ? 'completed' : item.status.toLowerCase(),
            };
          }).filter(Boolean); // Remove null values
    
          setDatesData(datesArray);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    

    if (requestId) {
      fetchRequestData();
    }
  }, [requestId]);

  // Compare two dates ignoring the time part.
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Returns a CSS class based on the status for the given date tile.
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const found = datesData.find((item) => isSameDay(item.date, date));
  
      console.log(`Checking date: ${date.toDateString()}`, found); // Debugging
  
      if (found) {
        switch (found.status) {
          case 'pending': return 'pending';
          case 'user not available': return 'userNotAvailable';
          case 'vendor not available': return 'vendorNotAvailable';
          case 'completed': return 'completed';
          default: return '';
        }
      }
    }
    return '';
  };
  

  return (
    <div className="calendar-container">
      <h2>Service Request Calendar</h2>
      <Calendar tileClassName={tileClassName} />
      {/* Optional Legend */}
      <div className="legend">
        <h3>Legend</h3>
        <ul>
          <li>
            <span className="legend-color pending"></span> Pending
          </li>
          <li>
            <span className="legend-color userNotAvailable"></span> User Not
            Available
          </li>
          <li>
            <span className="legend-color vendorNotAvailable"></span> Vendor Not
            Available
          </li>
          <li>
            <span className="legend-color completed"></span> Completed (Active)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceRequestCalendar;
