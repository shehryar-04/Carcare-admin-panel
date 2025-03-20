import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiLogIn } from "react-icons/fi";

const AccessDenied = () => {
    const navigate = useNavigate();
  
    return (
      <div style={styles.container} role="alert" aria-live="assertive">
        <div style={styles.content}>
          <FiAlertCircle style={styles.icon} aria-hidden="true" />
          <h1 style={styles.heading}>Access Denied</h1>
          <div style={styles.textContainer}>
            <p style={styles.text}>
              You don't have permission to view this page. Please authenticate to continue.
            </p>
            <p style={styles.secondaryText}>
              If you believe this is an error, please contact support.
            </p>
          </div>
          <div style={styles.buttonGroup}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/login")}
              aria-label="Navigate to login page"
            >
              <FiLogIn style={styles.buttonIcon} />
              Sign In with Different Account
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/login")}  // Changed from navigate(-1)
              aria-label="Go to login page"
            >
              <FiLogIn style={styles.buttonIcon} />
              Return to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  };

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fef2f2",
    padding: "2rem",
  },
  content: {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    padding: "2.5rem",
    borderRadius: "1rem",
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "4rem",
    color: "#ef4444",
    marginBottom: "1.5rem",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "1rem",
  },
  textContainer: {
    marginBottom: "2rem",
  },
  text: {
    fontSize: "1.125rem",
    color: "#4a5568",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },
  secondaryText: {
    fontSize: "1rem",
    color: "#718096",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "320px",
    margin: "0 auto",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "1rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#dc2626",
      transform: "translateY(-1px)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "1rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    backgroundColor: "transparent",
    color: "#4a5568",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
    },
  },
  buttonIcon: {
    fontSize: "1.25rem",
  },
};

export default AccessDenied;