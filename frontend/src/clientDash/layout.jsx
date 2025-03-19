import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../clientDash/sidebar';

const DashboardLayout = ({ children, menuItems }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;