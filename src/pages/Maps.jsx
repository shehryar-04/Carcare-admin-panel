import React, { useState, useEffect } from 'react';  
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';  
import { Card, Table, Badge } from 'react-bootstrap';  
import { collection, getDocs } from 'firebase/firestore';  
import { db } from '../config/firebase';  
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css';  
  
const Transactions = () => {  
  const [vendors, setVendors] = useState([]);  
  const [usersByArea, setUsersByArea] = useState({});  
  const [areaBoundaries, setAreaBoundaries] = useState([]);  
  const [areaNames, setAreaNames] = useState([]);  
  const center = [31.5204, 74.3587]; // Lahore coordinates  
  
  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        // Fetch area names  
        const areasResponse = await fetch('https://carcarebaked.azurewebsites.net/api/areas');  
        const areasData = await areasResponse.json();  
        const names = areasData.map(area => area.name);  
        setAreaNames(names);  
  
        // Fetch vendors  
        const vendorsSnapshot = await getDocs(collection(db, 'vendors'));  
        const vendorsList = vendorsSnapshot.docs  
          .map(doc => ({  
            id: doc.id,  
            ...doc.data()  
          }))  
          .filter(vendor => vendor.location);  
        setVendors(vendorsList);  
  
        // Fetch users and count by area  
        const usersSnapshot = await getDocs(collection(db, 'users'));  
        const areaCount = {};  
        usersSnapshot.docs.forEach(doc => {  
          const userData = doc.data();  
          if (userData.location?.area) {  
            areaCount[userData.location.area] = (areaCount[userData.location.area] || 0) + 1;  
          }  
        });  
        setUsersByArea(areaCount);  
  
        // Fetch area boundaries (example using Overpass API)  
        // Adjust this part based on your requirements  
        const boundariesResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="Lahore"];rel(area)[name];out body;`);  
        const boundariesData = await boundariesResponse.json();  
        const boundaries = boundariesData.elements.map(element => {  
          return element.geometry.map(point => [point.lat, point.lon]);  
        });  
        setAreaBoundaries(boundaries);  
      } catch (error) {  
        console.error('Error fetching data:', error);  
      }  
    };  
  
    fetchData();  
  }, []);  
  
  return (  
    <div>  
      <h2 className="mb-4">Vendor Locations in Lahore</h2>  
      <div style={{ height: '70vh', width: '100%' }}>  
        <MapContainer  
          center={center}  
          zoom={11}  
          style={{ height: '100%', width: '100%' }}  
        >  
          <TileLayer  
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
          />  
  
          {/* Area boundaries */}  
          {areaBoundaries.map((boundary, index) => (  
            <Polygon key={index} positions={boundary} color="blue" fillOpacity={0.1}>  
              <Popup>{usersByArea[areaNames[index]] || 0} users in this area</Popup>  
            </Polygon>  
          ))}  
  
          {/* Vendor markers */}  
          {vendors.map((vendor) => (  
            <Marker  
              key={vendor.id}  
              position={[vendor.location.latitude, vendor.location.longitude]}  
            >  
              <Popup>  
                <Card style={{ border: 'none', minWidth: '200px' }}>  
                  <Card.Body>  
                    <h5>{vendor.displayName}</h5>  
                    <Table size="sm" borderless>  
                      <tbody>  
                        <tr>  
                          <td><strong>Type:</strong></td>  
                          <td>{vendor.type}</td>  
                        </tr>  
                        <tr>  
                          <td><strong>Area:</strong></td>  
                          <td>{vendor.area}</td>  
                        </tr>  
                        <tr>  
                          <td><strong>Phone:</strong></td>  
                          <td>{vendor.phoneNumber}</td>  
                        </tr>  
                        <tr>  
                          <td><strong>Rating:</strong></td>  
                          <td>{vendor.rating} ⭐</td>  
                        </tr>  
                        <tr>  
                          <td><strong>Services:</strong></td>  
                          <td>{vendor.services?.join(', ') || 'N/A'}</td>  
                        </tr>  
                        <tr>  
                          <td><strong>Status:</strong></td>  
                          <td>  
                            <Badge bg={vendor.verification ? 'success' : 'warning'}>  
                              {vendor.verification ? 'Verified' : 'Pending'}  
                            </Badge>  
                          </td>  
                        </tr>  
                        <tr>  
                          <td><strong>Users in Area:</strong></td>  
                          <td>{usersByArea[vendor.area] || 0}</td>  
                        </tr>  
                      </tbody>  
                    </Table>  
                  </Card.Body>  
                </Card>  
              </Popup>  
            </Marker>  
          ))}  
        </MapContainer>  
      </div>  
    </div>  
  );  
};  
  
export default Transactions;  