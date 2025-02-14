import React, { useEffect, useState } from "react";  
import { collection, getDocs } from "firebase/firestore";  
import { db } from "../config/firebase";  
import { DollarSign, FileDown, Search } from "lucide-react";  
import { format, getYear } from "date-fns";  
import {  
  Document,  
  Page,  
  Text,  
  View,  
  StyleSheet,  
  PDFDownloadLink,  
} from "@react-pdf/renderer";  
  
// Create styles for PDF  
const styles = StyleSheet.create({  
  page: {  
    padding: 30,  
  },  
  title: {  
    fontSize: 24,  
    marginBottom: 20,  
  },  
  subtitle: {  
    fontSize: 14,  
    marginBottom: 20,  
  },  
  summarySection: {  
    marginBottom: 30,  
  },  
  summaryTitle: {  
    fontSize: 16,  
    marginBottom: 10,  
  },  
  summaryRow: {  
    flexDirection: "row",  
    marginBottom: 5,  
  },  
  summaryLabel: {  
    width: 120,  
  },  
  tableHeader: {  
    flexDirection: "row",  
    borderBottomWidth: 1,  
    borderBottomColor: "#000",  
    paddingBottom: 5,  
    marginBottom: 10,  
    backgroundColor: "#f3f4f6",  
    padding: 8,  
  },  
  tableRow: {  
    flexDirection: "row",  
    borderBottomWidth: 1,  
    borderBottomColor: "#eee",  
    paddingVertical: 8,  
  },  
  col1: { width: "15%" },  
  col2: { width: "20%" },  
  col3: { width: "15%" },  
  col4: { width: "15%" },  
  col5: { width: "12%", textAlign: "right" },  
  col6: { width: "12%", textAlign: "right" },  
  col7: { width: "11%", textAlign: "right" },  
  footer: {  
    position: "absolute",  
    bottom: 30,  
    left: 30,  
    right: 30,  
    fontSize: 8,  
    textAlign: "center",  
  },  
});  
  
// Utility function for calculating earnings  
const calculateEarnings = (price, vendorCommission = 70) => {  
  const vendorEarning = (price * vendorCommission) / 100;  
  const adminEarning = price - vendorEarning;  
  return { vendorEarning, adminEarning };  
};  
  
// PDF Document Component  
const ServiceStatementPDF = ({ data, year }) => (  
  <Document>  
    <Page size="A4" style={styles.page}>  
      <Text style={styles.title}>CarCare Service Statement</Text>  
      <Text style={styles.subtitle}>Statement Period: {year}</Text>  
      <View style={styles.summarySection}>  
        <Text style={styles.summaryTitle}>Summary</Text>  
        <View style={styles.summaryRow}>  
          <Text style={styles.summaryLabel}>Total Revenue:</Text>  
          <Text>${data.totalAmount.toFixed(2)}</Text>  
        </View>  
        <View style={styles.summaryRow}>  
          <Text style={styles.summaryLabel}>Vendor Earnings:</Text>  
          <Text>${data.vendorEarnings.toFixed(2)}</Text>  
        </View>  
        <View style={styles.summaryRow}>  
          <Text style={styles.summaryLabel}>CarCare Earnings:</Text>  
          <Text>${data.adminEarnings.toFixed(2)}</Text>  
        </View>  
      </View>  
      <View style={styles.tableHeader}>  
        <Text style={styles.col1}>Date</Text>  
        <Text style={styles.col2}>Service</Text>  
        <Text style={styles.col3}>Vehicle</Text>  
        <Text style={styles.col4}>Area</Text>  
        <Text style={styles.col5}>Total</Text>  
        <Text style={styles.col6}>Vendor</Text>  
        <Text style={styles.col7}>CarCare</Text>  
      </View>  
      {data.requests.map((request) => {  
        const { vendorEarning, adminEarning } = calculateEarnings(request.price);  
        return (  
          <View key={request.id} style={styles.tableRow}>  
            <Text style={styles.col1}>{format(request.createdAt.toDate(), "dd/MM/yyyy")}</Text>  
            <Text style={styles.col2}>{request.serviceName}</Text>  
            <Text style={styles.col3}>{request.vehicleNumber}</Text>  
            <Text style={styles.col4}>{request.area}</Text>  
            <Text style={styles.col5}>${request.price.toFixed(2)}</Text>  
            <Text style={styles.col6}>${vendorEarning.toFixed(2)}</Text>  
            <Text style={styles.col7}>${adminEarning.toFixed(2)}</Text>  
          </View>  
        );  
      })}  
    </Page>  
  </Document>  
);  
  
export const ServiceReports = () => {  
  const [serviceRequests, setServiceRequests] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [earningsData, setEarningsData] = useState({});  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  
  const [searchTerm, setSearchTerm] = useState("");  
  
  useEffect(() => {  
    const fetchServiceRequests = async () => {  
      try {  
        const querySnapshot = await getDocs(collection(db, "serviceRequests"));  
        const requests = [];  
        querySnapshot.forEach((doc) => {  
          requests.push({ ...doc.data(), id: doc.id });  
        });  
        setServiceRequests(requests);  
        organizeEarnings(requests, selectedYear); // Organize earnings based on the selected year  
      } catch (error) {  
        console.error("Error fetching service requests:", error);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    fetchServiceRequests();  
  }, []);  
  
  const organizeEarnings = (requests, year) => {  
    const earnings = {  
      totalAmount: 0,  
      vendorEarnings: 0,  
      adminEarnings: 0,  
      requests: [],  
    };  
  
    requests.forEach((request) => {  
      const date = request.createdAt.toDate();  
      const requestYear = getYear(date);  
  
      if (requestYear === year) {  
        const { vendorEarning, adminEarning } = calculateEarnings(request.price);  
          
        earnings.totalAmount += request.price;  
        earnings.vendorEarnings += vendorEarning;  
        earnings.adminEarnings += adminEarning;  
        earnings.requests.push(request);  
      }  
    });  
  
    setEarningsData(earnings);  
  };  
  
  const handleYearChange = (year) => {  
    setSelectedYear(year);  
    organizeEarnings(serviceRequests, year); // Update earnings when the year changes  
  };  
  
  const generateUniqueKey = (request) => {  
    return `${request.serviceId}-${request.vehicleNumber}-${request.createdAt.toDate().getTime()}`;  
  };  
  
  if (loading) {  
    return (  
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>  
        <div style={{ animation: "spin 1s linear infinite", borderRadius: "50%", height: "32px", width: "32px", border: "2px solid transparent", borderBottomColor: "blue" }} />  
      </div>  
    );  
  }  
  
  const years = Array.from(new Set(serviceRequests.map(req => getYear(req.createdAt.toDate())))).sort((a, b) => b - a);  
    
  // Handle case where there are no requests for the selected year  
  const hasRequestsForSelectedYear = earningsData.requests.length > 0;  
  
  return (  
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>  
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>  
        <div style={{ backgroundColor: "#ffffff", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>  
          {/* Header */}  
          <div style={{ backgroundColor: "#255B82", padding: "1rem 1.5rem" }}>  
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>  
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ffffff" }}>Service Statement</h1>  
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>  
                <select  
                  value={selectedYear}  
                  onChange={(e) => handleYearChange(Number(e.target.value))}  
                  style={{  
                    borderRadius: "0.375rem",  
                    border: "none",  
                    padding: "0.375rem 0.75rem",  
                    color: "#1F2937",  
                    backgroundColor: "#ffffff",  
                    cursor: "pointer"  
                  }}  
                >  
                  {years.map((year) => (  
                    <option style={{ color: "#255B82", backgroundColor: "#fff" }} key={year} value={year}>{year}</option>  
                  ))}  
                </select>  
                {hasRequestsForSelectedYear && (  
                  <PDFDownloadLink  
                    document={<ServiceStatementPDF data={earningsData} year={selectedYear} />}  
                    fileName={`service-statement-${selectedYear}.pdf`}  
                    style={{  
                      display: "flex",  
                      alignItems: "center",  
                      gap: "0.5rem",  
                      padding: "0.5rem 1rem",  
                      backgroundColor: "#ffffff",  
                      color: "#3B82F6",  
                      borderRadius: "0.375rem",  
                      transition: "background-color 0.3s",  
                      textDecoration: "none"  
                    }}  
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}  
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}  
                  >  
                    <FileDown style={{ width: "1rem", height: "1rem" }} />  
                    <span style={{ color: "#255B82" }}>Download Statement</span>  
                  </PDFDownloadLink>  
                )}  
              </div>  
            </div>  
          </div>  
          {/* Summary Cards */}  
          {hasRequestsForSelectedYear && (  
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", padding: "1.5rem", backgroundColor: "#f9fafb", borderBottom: "1px solid #E5E7EB" }}>  
              <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #E5E7EB" }}>  
                <div style={{ display: "flex", justifyContent: "space-between" }}>  
                  <div>  
                    <p style={{ fontSize: "0.875rem", fontWeight: "medium", color: "#6B7280" }}>Total Revenue</p>  
                    <p style={{ fontSize: "1.5rem", fontWeight: "semibold", color: "#1F2937" }}>${earningsData.totalAmount.toFixed(2)}</p>  
                  </div>  
                  <DollarSign style={{ width: "2rem", height: "2rem", color: "#22C55E" }} />  
                </div>  
              </div>  
              <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #E5E7EB" }}>  
                <div style={{ display: "flex", justifyContent: "space-between" }}>  
                  <div>  
                    <p style={{ fontSize: "0.875rem", fontWeight: "medium", color: "#6B7280" }}>Vendor Earnings</p>  
                    <p style={{ fontSize: "1.5rem", fontWeight: "semibold", color: "#1F2937" }}>${earningsData.vendorEarnings.toFixed(2)}</p>  
                  </div>  
                  <DollarSign style={{ width: "2rem", height: "2rem", color: "#3B82F6" }} />  
                </div>  
              </div>  
              <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #E5E7EB" }}>  
                <div style={{ display: "flex", justifyContent: "space-between" }}>  
                  <div>  
                    <p style={{ fontSize: "0.875rem", fontWeight: "medium", color: "#6B7280" }}>CarCare Earnings</p>  
                    <p style={{ fontSize: "1.5rem", fontWeight: "semibold", color: "#1F2937" }}>${earningsData.adminEarnings.toFixed(2)}</p>  
                  </div>  
                  <DollarSign style={{ width: "2rem", height: "2rem", color: "#A855F7" }} />  
                </div>  
              </div>  
            </div>  
          )}  
          {/* Search Bar */}  
          <div style={{ padding: "1.5rem", backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB" }}>  
            <div style={{ position: "relative" }}>  
              <div style={{ position: "absolute", top: "50%", left: "0.75rem", transform: "translateY(-50%)", pointerEvents: "none" }}>  
                <Search style={{ height: "1.25rem", width: "1.25rem", color: "#9CA3AF" }} />  
              </div>  
              <input  
                type="text"  
                value={searchTerm}  
                onChange={(e) => setSearchTerm(e.target.value)}  
                placeholder="Search by service name, vehicle number, or area..."  
                style={{  
                  width: "100%",  
                  padding: "0.5rem 2rem",  
                  border: "1px solid #D1D5DB",  
                  borderRadius: "0.375rem",  
                  backgroundColor: "#ffffff",  
                  outline: "none"  
                }}  
              />  
            </div>  
          </div>  
          {/* Transactions Table */}  
          {hasRequestsForSelectedYear && (  
            <div style={{ overflowX: "auto" }}>  
              <table style={{ width: "100%", borderCollapse: "collapse" }}>  
                <thead style={{ backgroundColor: "#f9fafb" }}>  
                  <tr>  
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Date</th>  
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Service</th>  
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Vehicle</th>  
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Area</th>  
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Total Amount</th>  
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>Vendor Earnings</th>  
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: "medium", color: "#6B7280" }}>CarCare Earnings</th>  
                  </tr>  
                </thead>  
                <tbody style={{ backgroundColor: "#ffffff", borderCollapse: "collapse" }}>  
                  {earningsData.requests  
                    .filter(request =>  
                      searchTerm === "" ||  
                      request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||  
                      request.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||  
                      request.area.toLowerCase().includes(searchTerm.toLowerCase())  
                    )  
                    .map((request) => {  
                      const { vendorEarning, adminEarning } = calculateEarnings(request.price);  
                      return (  
                        <tr key={generateUniqueKey(request)} style={{ cursor: "pointer", transition: "background-color 0.2s", "&:hover": { backgroundColor: "#f3f4f6" } }}>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", fontSize: "0.875rem", color: "#1F2937" }}>  
                            {format(request.createdAt.toDate(), "dd/MM/yyyy")}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", fontSize: "0.875rem", color: "#1F2937" }}>  
                            {request.serviceName}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", fontSize: "0.875rem", color: "#1F2937" }}>  
                            {request.vehicleNumber}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", fontSize: "0.875rem", color: "#1F2937" }}>  
                            {request.area}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", textAlign: "right", fontSize: "0.875rem", color: "#1F2937" }}>  
                            ${request.price.toFixed(2)}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", textAlign: "right", fontSize: "0.875rem", color: "#3B82F6", fontWeight: "500" }}>  
                            ${vendorEarning.toFixed(2)}  
                          </td>  
                          <td style={{ padding: "1rem", whiteSpace: "nowrap", textAlign: "right", fontSize: "0.875rem", color: "#A855F7", fontWeight: "500" }}>  
                            ${adminEarning.toFixed(2)}  
                          </td>  
                        </tr>  
                      );  
                    })}  
                </tbody>  
              </table>  
            </div>  
          )}  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default ServiceReports;  