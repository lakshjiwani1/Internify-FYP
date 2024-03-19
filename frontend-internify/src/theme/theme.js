import { createTheme } from "@mui/material/styles";


const theme = createTheme({
    palette: {
        primary: {
            main: "#F53855",
        },
    },
    typography: {
        fontFamily: 'Rubik, sans-serif',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },  
});


export default theme;