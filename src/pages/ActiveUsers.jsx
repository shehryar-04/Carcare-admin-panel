import React, { useState, useEffect } from "react";    
import { Bar } from "react-chartjs-2";    
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";    
import Modal from 'react-modal'; // Import the Modal component  
import { Video } from "lucide-react";
import Loading from '../assets/Loading.gif' // Import the loading video
  
// Register Chart.js components    
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);    
  
const App = () => {    
    const [users, setUsers] = useState([]);    
    const [services, setServices] = useState([]);    
    const [activeUsers, setActiveUsers] = useState([]);    
    const [inactiveUsers, setInactiveUsers] = useState([]);    
    const [chartData, setChartData] = useState(null);    
    const [loading, setLoading] = useState(true);    
    const [userRequestCount, setUserRequestCount] = useState({});    
    const [topUser, setTopUser] = useState({ name: "", count: 0, userData: {} });    
    const [notification, setNotification] = useState({ title: "", body: "" });    
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility    
  
    useEffect(() => {    
        const fetchData = async () => {    
            try {    
                const usersResponse = await fetch("https://backend.neurodude.co/api/users");    
                const usersData = await usersResponse.json();    
                const servicesResponse = await fetch("https://backend.neurodude.co/api/service-request");    
                const servicesData = await servicesResponse.json();    
                setUsers(usersData || []);    
                setServices(servicesData || []);    
                setLoading(false);    
            } catch (error) {    
                console.error("Error fetching data:", error);    
                setLoading(false);    
            }    
        };    
        fetchData();    
    }, []);    
  
    useEffect(() => {    
        if (users.length > 0 && services.length > 0) {    
            const thresholdSeconds = 30 * 24 * 60 * 60;    
            const currentTime = Math.floor(Date.now() / 1000);    
            const userActivity = {};    
            services.forEach((service) => {    
                const userId = service.userId;    
                const serviceTime = service.createdAt?._seconds;    
                if (!userActivity[userId]) {    
                    userActivity[userId] = { totalServices: 0, lastServiceDate: serviceTime || 0 };    
                }    
                userActivity[userId].totalServices += 1;    
                userActivity[userId].lastServiceDate = Math.max(userActivity[userId].lastServiceDate, serviceTime || 0);    
            });    
  
            const activeSet = new Set();    
            const inactiveSet = new Set();    
            let maxRequests = 0;    
            let topUserId = "";    
            let topUserData = {};    
  
            users.forEach((user) => {    
                const userId = user.id;    
                if (userActivity[userId]) {    
                    const lastActive = userActivity[userId].lastServiceDate;    
                    const totalRequests = userActivity[userId].totalServices;    
                    if (currentTime - lastActive <= thresholdSeconds) {    
                        activeSet.add(user.displayName || "Unknown User");    
                        userRequestCount[user.displayName || "Unknown User"] = totalRequests;    
                        if (totalRequests > maxRequests) {    
                            maxRequests = totalRequests;    
                            topUserId = user.displayName || "Unknown User";    
                            topUserData = user;    
                        }    
                    } else {    
                        inactiveSet.add(user.displayName || "Unknown User");    
                    }    
                } else {    
                    inactiveSet.add(user.displayName || "Unknown User");    
                }    
            });    
  
            setActiveUsers(Array.from(activeSet));    
            setInactiveUsers(Array.from(inactiveSet));    
            setUserRequestCount(userRequestCount);    
            setTopUser({ name: topUserId, count: maxRequests, userData: topUserData });    
            setChartData({    
                labels: ["Active Users", "Inactive Users"],    
                datasets: [{    
                    label: "User Activity",    
                    data: [activeSet.size, inactiveSet.size],    
                    backgroundColor: ["#4CAF50", "#FF5252"],    
                },],    
            });    
        }    
    }, [users, services]);    
  
    const sendNotification = async () => {    
        const response = await fetch("https://backend.neurodude.co/api/send-notification-token", {    
            method: "POST",    
            headers: {    
                "Content-Type": "application/json",    
            },    
            body: JSON.stringify({    
                body: notification.body,    
                title: notification.title,    
                recipients: topUser.userData.fcmToken,    
            }),    
        });    
        if (response.ok) {    
            alert("Notification sent successfully!");    
        } else {    
            alert("Failed to send notification.");    
        }    
    };    
  
    const openModal = () => setIsModalOpen(true); // Function to open modal    
    const closeModal = () => setIsModalOpen(false); // Function to close modal    
  
    if (loading) {    
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <video src={Loading} autoPlay loop muted style={{ width: '50%' }} />
            </div>
        );    
    }    
    if (!chartData) {    
        return <div>Preparing chart data...</div>;    
    }    
    return (    
        <div style={{ width: "600px", margin: "0 auto", textAlign: "center" }}>    
            <h1>User Activity Analysis</h1>    
            <Bar    
                data={chartData}    
                options={{    
                    responsive: true,    
                    plugins: {    
                        legend: { position: "top" },    
                        title: { display: true, text: "Active vs Inactive Users" },    
                    },    
                }}    
            />    
            <div style={{ marginTop: "20px" }}>    
                <h2>Details</h2>    
                <p>    
                    <strong>Active Users:</strong> {activeUsers.join(", ") || "None"}    
                </p>    
                <p>    
                    <strong>Inactive Users:</strong> {inactiveUsers.join(", ") || "None"}    
                </p>    
                <h3>Requests per Active User</h3>    
                <ul>    
                    {activeUsers.map((user) => (    
                        <li key={user}>    
                            {user}: {userRequestCount[user] || 0} requests    
                        </li>    
                    ))}    
                </ul>    
                <h3>User with Most Requests</h3>    
                <p>    
                    <strong>{topUser.name || "None"}</strong> with {topUser.count || 0} requests    
                </p>    
                <button onClick={openModal} style={{background:'#255B82', color:'white'}}>View Profile</button> {/* Button to open modal */}    
                <Modal    
                    isOpen={isModalOpen}    
                    onRequestClose={closeModal}    
                    contentLabel="Top User Profile"    
                    style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', padding: '20px' } }}    
                >    
                    <h4 style={{ textAlign: 'center' }}>Top User Profile</h4>    
                    {topUser.userData && (    
                        <div style={{ textAlign: 'center' }}>    
                            <img src={topUser.userData.image} alt={`${topUser.userData.displayName}'s profile`} style={{ width: '100px', borderRadius: '50%' }} />    
                            <p><strong>uid:</strong> {topUser.userData.id}</p>    
                            <p><strong>Name:</strong> {topUser.userData.displayName}</p>    
                            <p><strong>Email:</strong> {topUser.userData.email}</p>    
                            <p><strong>Location:</strong> {topUser.userData.locations[0]?.completeAddress || "N/A"}</p>    
                            <p><strong>Phone Number:</strong> {topUser.userData.phoneNumber || "N/A"}</p>    
                            <h3 style={{ alignContent: 'center' }}>Send Notification</h3>    
                            <input    
                                type="text"    
                                placeholder="Notification Title"    
                                value={notification.title}    
                                onChange={(e) => setNotification({ ...notification, title: e.target.value })}    
                            />    
                            <input    
                                type="text"    
                                placeholder="Notification Body"    
                                value={notification.body}    
                                onChange={(e) => setNotification({ ...notification, body: e.target.value })}    
                            />    
                            <button onClick={sendNotification}>Send Notification</button>    
                        </div>    
                    )}    
                    <button onClick={closeModal} style={{ marginTop: '10px' }}>Close</button> {/* Button to close modal */}    
                </Modal>    
            </div>    
        </div>    
    );    
};    
  
export default App;