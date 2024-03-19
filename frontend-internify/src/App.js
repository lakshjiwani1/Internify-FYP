import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./pages/User/Root";
import HomePage from "./pages/User/Home";
import Internships from "./pages/User/Internships";
import ErrorPage from "./pages/Error";
import Signup from "./pages/User/Signup";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { CssBaseline } from "@mui/material";
import Login from "./pages/User/Login";
import EmployerSignup from "./pages/Employer/EmployerSignup";
import Eroot from "./pages/Employer/Eroot";
import EmpLogin from "./pages/Employer/EmpLogin";
import EmployerDashboard from "./pages/Employer/Dashboard"
import InternshipForm from "./pages/Employer/InternshipForm"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/internships', element: <Internships /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/esignup', element: <EmployerSignup /> },
      { path: '/elogin', element: <EmpLogin /> },
      { path: '/employer', element: <EmployerDashboard/>},
      { path: '/internshipform', element: <InternshipForm/>}
    ],
  },
]);

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;


  // {
  //   path: '/esignup',
  //   element: <Eroot />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     { path: '/esignup', element: <EmployerSignup /> },
  //     { path: '/elogin', element: <EmpLogin /> },
  //   ],
  // },