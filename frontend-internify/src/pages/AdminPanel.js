import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { styled } from '@mui/system';

const Sidebar = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: '#2c2c2c',
  color: '#fff',
  padding: theme.spacing(2),
}));

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(2),
}));

const AdminPanel = () => {
  return (
    <Box display="flex" height="100vh">
      <Sidebar>
        <Typography variant="h6" sx={{ color: '#ff0' }}>Django administration</Typography>
        <Typography variant="h6" gutterBottom>Site administration</Typography>

        <Paper sx={{ marginBottom: 2 }}>
          <Typography variant="h6" sx={{ backgroundColor: '#003A64', color: '#fff', padding: 1 }}>AUTHENTICATION</Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Company auths" />
              <Add sx={{ color: '#66bfff' }} />
              <Edit sx={{ color: '#66bfff' }} />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Custom users" />
              <Add sx={{ color: '#66bfff' }} />
              <Edit sx={{ color: '#66bfff' }} />
            </ListItem>
          </List>
        </Paper>

        <Paper>
          <Typography variant="h6" sx={{ backgroundColor: '#003A64', color: '#fff', padding: 1 }}>AUTHENTICATION AND AUTHORIZATION</Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Groups" />
              <Add sx={{ color: '#66bfff' }} />
              <Edit sx={{ color: '#66bfff' }} />
            </ListItem>
          </List>
        </Paper>
      </Sidebar>

      <Content>
        <Typography variant="h6">Recent actions</Typography>
        <Typography variant="subtitle1">My actions</Typography>
        <List>
          {['testing1', 'sameer', 'sameer', 'testing1', 'sameer', 'sameer', 'sameer', 'uber'].map((action, index) => (
            <React.Fragment key={index}>
              <ListItem button>
                <Edit sx={{ color: '#66bfff' }} />
                <ListItemText primary={action} secondary="Custom user" sx={{ marginLeft: 2 }} />
              </ListItem>
              <Divider sx={{ backgroundColor: '#003A64' }} />
            </React.Fragment>
          ))}
        </List>
      </Content>
    </Box>
  );
};

export default AdminPanel;
