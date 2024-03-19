import { ListItemText, ListItem, List } from '@mui/material';
import React from 'react'
import tickIcon from "../assets/tick icon.png";

const TickListItem = ({ text }) => (
    <ListItem>
      <img src={tickIcon} alt="Tick Icon" style={{ marginRight: '8px' }} />
      <ListItemText primary={text} />
    </ListItem>
  );

const FeatureList = () => (
    <List>
      <TickListItem text="Access to a wide range of internship opportunities." />
      <TickListItem text="Guidance and resources for skill development." />
      <TickListItem text="Networking opportunities with industry professionals." />
    </List>
);

export default FeatureList;