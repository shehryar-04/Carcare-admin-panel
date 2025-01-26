import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const VendorProfileModal = ({ open, onClose, vendorProfile }) => {
  // Default vendor image placeholder
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
      {/* Dialog Title */}
      <DialogTitle style={{ backgroundColor: "#255B82", color: "#ffffff" }}>
        Vendor Profile
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        {vendorProfile ? (
          <Box>
            {/* Profile Image and Name */}
            <Grid container direction="column" alignItems="center">
              <StyledAvatar
                src={vendorProfile.imageUrl || defaultProfilePicture}
                alt={vendorProfile.displayName}
              />
              <Typography variant="h5" fontWeight="bold">
                {vendorProfile.displayName}
              </Typography>
            </Grid>

            <Divider style={{ margin: "20px 0" }} />

            {/* Vendor Details */}
            <InfoBox>
              <SectionTitle variant="subtitle1">Vendor Details</SectionTitle>
              <Typography variant="body2" color="text.secondary">
                <strong>Vendor ID:</strong> {vendorProfile.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong> {vendorProfile.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone Number:</strong> {vendorProfile.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Area:</strong> {vendorProfile.area}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Rating:</strong> {vendorProfile.rating} / 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Credits:</strong> {vendorProfile.credits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Verification Status:</strong>{" "}
                {vendorProfile.verification ? "Verified" : "Not Verified"}
              </Typography>
            </InfoBox>

            {/* CNIC Details */}
            <InfoBox>
              <SectionTitle variant="subtitle1">CNIC Details</SectionTitle>
              <Typography variant="body2" color="text.secondary">
                <strong>CNIC:</strong> {vendorProfile.CNIC}
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>CNIC Front:</strong>
                </Typography>
                <img
                  src={vendorProfile.CNIC_front}
                  alt="CNIC Front"
                  style={{ width: "100%", maxWidth: "300px", marginTop: "5px" }}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>CNIC Back:</strong>
                </Typography>
                <img
                  src={vendorProfile.CNIC_back}
                  alt="CNIC Back"
                  style={{ width: "100%", maxWidth: "300px", marginTop: "5px" }}
                />
              </Box>
            </InfoBox>

            {/* Location Details */}
            <InfoBox>
              <SectionTitle variant="subtitle1">Location</SectionTitle>
              <Typography variant="body2" color="text.secondary">
                <strong>Latitude:</strong> {vendorProfile.location.latitude}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Longitude:</strong> {vendorProfile.location.longitude}
              </Typography>
            </InfoBox>

            {/* Services */}
            <InfoBox>
              <SectionTitle variant="subtitle1">Services</SectionTitle>
              {vendorProfile.services && vendorProfile.services.length > 0 ? (
                vendorProfile.services.map((service, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                  >
                    - {service}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No services available.
                </Typography>
              )}
            </InfoBox>
          </Box>
        ) : (
          <Typography>No vendor data available.</Typography>
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

export default VendorProfileModal;
