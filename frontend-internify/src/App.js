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
// import EmpLogin from "./pages/Employer/EmpLogin";
import EmployerDashboard from "./pages/Employer/Dashboard";
import InternshipForm from "./pages/Employer/InternshipForm";
import Articles from "./pages/User/Articles";
import ArticleForm from "./pages/User/ArticleForm";
import Companies from "./pages/User/Companies";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const userRoutes = [
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/internships">
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/internships',
    element: <Internships />
  },
  {
    path: '/signup',
    element: (
      <ProtectedRoute redirectTo="/internships">
        <Signup />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute redirectTo="/internships">
        <Login />
      </ProtectedRoute>
    )
  },
  { path: '/articles', element: <Articles /> },
  { path: '/articleform', element: <ArticleForm /> },
  { path: '/companies', element: <Companies /> },
];

const employerRoutes = [
  {
    path: '/esignup',
    element: (
      <ProtectedRoute redirectTo="/employer">
        <EmployerSignup />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: (
      <ProtectedRoute redirectTo="/employer">
        <Login />
      </ProtectedRoute>
    )
  },
  { path: '/employer', element: <EmployerDashboard /> },
  { path: '/internshipform', element: <InternshipForm /> }
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: userRoutes,
  },
  {
    path: '/',
    element: <Eroot />,
    children: employerRoutes
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
