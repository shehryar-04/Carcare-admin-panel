import React, { useEffect, useState } from 'react';    
import { db } from '../config/firebase';    
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';    
import { Card, CardContent, Typography, Grid, CardHeader, CardActions, Button } from '@mui/material';    
import { styled } from '@mui/material/styles';    
import UserProfileModal from './UserProfile';    
import VendorProfileModal from './VendorProfile';      
  
const NotificationComponent = () => {      
  const [notifications, setNotifications] = useState([]);      
  const [loading, setLoading] = useState(true);      
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);      
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(null);      
  const [isUserModalOpen, setUserModalOpen] = useState(false);      
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);        
  
  useEffect(() => {          
    const fetchNotifications = async () => {            
      const notificationsCollection = collection(db, 'logs');            
      const notificationSnapshot = await getDocs(notificationsCollection);            
      const notificationsList = notificationSnapshot.docs.map((doc) => ({              
        id: doc.id,              
        ...doc.data(),            
      }));            
  
      // Store the notifications that are valid (i.e., have user and vendor profiles)  
      const validNotifications = [];    
  
      await Promise.all(            
        notificationsList.map(async (notification) => {              
          const userProfile = await fetchOrCreateProfile('users', notification.userId);              
          const vendorProfile = await fetchOrCreateProfile('vendors', notification.vendorId);                        
  
          // Check if profiles exist  
          if (userProfile && vendorProfile) {  
            validNotifications.push({                
              ...notification,                
              userProfile,                
              vendorProfile,              
            });  
          } else {  
            // If either profile does not exist, delete the notification log  
            await deleteDoc(doc(db, 'logs', notification.id));  
          }  
        })        
      );            
        
      // Update state only with valid notifications  
      setNotifications(validNotifications);          
      setLoading(false);        
    };          
  
    fetchNotifications();      
  }, []);        
  
  const fetchOrCreateProfile = async (collectionName, id) => {        
    const docRef = doc(db, collectionName, id);        
    const docSnap = await getDoc(docRef);          
  
    if (docSnap.exists()) {          
      return docSnap.data();        
    } else {          
      const newProfile = {            
        id,            
        name: `Profile ${id}`,          
      };          
      await setDoc(docRef, newProfile);          
      return newProfile;        
    }      
  };        
  
  const handleUserProfileClick = (userProfile) => {        
    setSelectedUserProfile(userProfile);        
    setUserModalOpen(true);      
  };        
  
  const handleVendorProfileClick = (vendorProfile) => {        
    setSelectedVendorProfile(vendorProfile);        
    setVendorModalOpen(true);      
  };        
  
  const handleCloseUserModal = () => {        
    setUserModalOpen(false);      
  };        
  
  const handleCloseVendorModal = () => {        
    setVendorModalOpen(false);      
  };        
  
  if (loading) {        
    return <div>Loading notifications...</div>;      
  }        
  
  const StyledCard = styled(Card)(({ theme }) => ({        
    backgroundColor: '#ffffff',        
    border: `1px solid #255B82`,        
    borderRadius: '8px',        
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',        
    '&:hover': {          
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',        
    },      
  }));        
  
  const StyledCardHeader = styled(CardHeader)({        
    backgroundColor: '#255B82',        
    color: '#ffffff',        
    borderTopLeftRadius: '8px',        
    borderTopRightRadius: '8px',        
    padding: '10px',        
    fontWeight: 'bold',      
  });        
  
  return (        
    <div style={{ padding: '20px' }}>          
      <Typography variant="h4" style={{ color: '#255B82', marginBottom: '20px' }}>            
        Notifications          
      </Typography>          
      <Grid container spacing={3}>            
        {notifications.map((notification) => (              
          <Grid item xs={12} sm={6} md={4} key={notification.id}>                
            <StyledCard>                  
              <StyledCardHeader title={`Service Name: ${notification.serviceName}`} />                  
              <CardContent>                    
                <Typography variant="body1" color="text.secondary" gutterBottom>                      
                  <strong>Service Request ID:</strong> {notification.serviceRequestId}                    
                </Typography>                    
                <Typography variant="body2" color="text.secondary">                      
                  <strong>Service Price:</strong> {notification.servicePrice}                      
                  <br />                      
                  <strong>User:</strong> {notification.userProfile.name}                      
                  <Button onClick={() => handleUserProfileClick(notification.userProfile)} size="small" style={{ color: '#255B82', marginLeft: '10px' }}>                        
                    View Profile                      
                  </Button>                      
                  <br />                      
                  <strong>Vendor:</strong> {notification.vendorProfile.name}                      
                  <Button onClick={() => handleVendorProfileClick(notification.vendorProfile)} size="small" style={{ color: '#255B82', marginLeft: '10px' }}>                        
                    View Profile                      
                  </Button>                      
                  <br />                      
                  <strong>Vendor Earnings:</strong> {notification.vendorEarnings}                      
                  <br />                      
                  <strong>Vendor Commission:</strong> {notification.vendorCommission}                    
                </Typography>                  
              </CardContent>              
            </StyledCard>              
          </Grid>            
        ))}          
      </Grid>            
      {/* Modals */}          
      <UserProfileModal             
        open={isUserModalOpen}             
        onClose={handleCloseUserModal}             
        userProfile={selectedUserProfile}           
      />          
      <VendorProfileModal             
        open={isVendorModalOpen}             
        onClose={handleCloseVendorModal}             
        vendorProfile={selectedVendorProfile}           
      />        
    </div>      
  );    
};      
  
export default NotificationComponent;    