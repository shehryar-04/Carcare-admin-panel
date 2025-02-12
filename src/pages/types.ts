export interface ServiceDate {
  date: string;
  status: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface VendorResponse {
  status: string;
}

export interface ServiceRequest {
  area: string;
  createdAt: any;
  currentLocation: string;
  dates: ServiceDate[];
  expiryTime: number;
  location: Location;
  packages: number;
  price: number;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  state: string;
  step: string;
  time: string;
  userId: string;
  vehicleNumber: string;
  vehicleType: string;
  vendorId: string;
  vendorResponses: Record<string, VendorResponse>;
}