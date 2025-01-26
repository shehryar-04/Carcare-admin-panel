import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const UserProfileModal = ({ open, onClose, userProfile }) => {
  // Default profile picture URL
  const defaultProfilePicture = "https://via.placeholder.com/96";

  // Styled components
  const StyledAvatar = styled(Avatar)({
    width: "96px",
    height: "96px",
    marginBottom: "10px",
    border: "2px solid #255B82",
  });

  const SectionTitle = styled(Typography)({
    color: "#255B82",
    fontWeight: "bold",
    marginBottom: "10px",
  });

  const InfoBox = styled(Box)({
    marginBottom: "15px",
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Dialog Header */}
      <DialogTitle style={{ backgroundColor: "#255B82", color: "#ffffff" }}>
        User Profile
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        {userProfile ? (
          <Box>
            {/* Profile Picture and Name */}
            <Grid container direction="column" alignItems="center">
              <StyledAvatar
                src={userProfile.image || defaultProfilePicture}
                alt={userProfile.displayName}
              />
              <Typography variant="h5" fontWeight="bold">
                {userProfile.displayName}
              </Typography>
            </Grid>

            <Divider style={{ margin: "20px 0" }} />

            {/* User Details */}
            <InfoBox>
              <SectionTitle variant="subtitle1">Account Information</SectionTitle>
              <Typography variant="body2" color="text.secondary">
                <strong>User ID:</strong> {userProfile.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {userProfile.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong>{" "}
                {userProfile.phoneNumber || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email Verified:</strong>{" "}
                {userProfile.emailVerified ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Vendor Status:</strong>{" "}
                {userProfile.isVendor ? "Yes" : "No"}
              </Typography>
            </InfoBox>

            {/* Location Details */}
            <InfoBox>
              <SectionTitle variant="subtitle1">Locations</SectionTitle>
              {userProfile.locations && userProfile.locations.length > 0 ? (
                userProfile.locations.map((location, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location Name:</strong>{" "}
                      {location.locationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Area Name:</strong> {location.areaName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Complete Address:</strong>{" "}
                      {location.completeAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Coordinates:</strong>{" "}
                      {`(${location.latitude}, ${location.longitude})`}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No locations available.
                </Typography>
              )}
            </InfoBox>
          </Box>
        ) : (
          <Typography>No user data available.</Typography>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          style={{
            backgroundColor: "#255B82",
            color: "#ffffff",
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileModal;
