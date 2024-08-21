import { Box, styled } from '@mui/system';
import { NavLink } from 'react-router-dom';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';

const NavItem = styled(({ isActive, ...rest }) => <NavLink {...rest} />)(
  ({ theme, isActive }) => ({
    fontWeight: 500,
    fontSize: "1rem",
    color: isActive ? "#F53855" : "#4F5665",
    textDecoration: 'none',
    wordWrap: "break-word",
    '&:hover': {
      color: "#F53855",
    },
  })
);


const Flexbox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledField = styled(TextField)({
  width: "25rem"
});

const EStyledField = styled(TextField)({
  width: "35rem"
});

// const StyledFieldWithIcon = ({ icon: IconComponent, width, ...props }) => {
//   return (
//     <TextField
//       {...props}
//       sx={{ width: '25rem' }}  // Set width here
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <IconButton size="small">
//               {IconComponent && <IconComponent />}
//             </IconButton>
//           </InputAdornment>
//         ),
//         ...props.InputProps,
//       }}
//     />
//   );
// };

export { NavItem, Flexbox, StyledField, EStyledField };

