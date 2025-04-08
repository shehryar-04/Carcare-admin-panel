export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  SUB_ADMIN: 'sub-admin',
  SUPPORT: 'support'
};

// Define which routes each role can access
export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: [
    'dashboard',
    'serviceRequests',
    'maps',
    'Service',
    'vendors',
    'Forms',
    'Admins',
    'Products',
    'UsersByArea',
    'ActiveUsers',
    'ServiceRequestData',
    'Reports'
  ],
  [ROLES.ADMIN]: [
    'dashboard',
    'serviceRequests',
    'maps',
    'Service',
    'vendors',
    'Products',
    'UsersByArea',
    'ActiveUsers',
    'ServiceRequestData'
  ],
  [ROLES.SUB_ADMIN]: [
    'dashboard',
    'serviceRequests',
    'maps',
    'Service',
    'vendors',
    'Products'
  ],
  [ROLES.SUPPORT]: [
    'dashboard',
    'serviceRequests',
    'Service'
  ]
};

// Check if a role has permission to access a route
export const hasPermission = (role, route) => {
  if (!role || !route) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(route);
}; 