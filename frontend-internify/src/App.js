// src/index.js or src/App.js (depending on where the router is set up)
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
import EmployerDashboard from "./pages/Employer/Dashboard";
import InternshipForm from "./pages/Employer/InternshipForm";
import Articles from "./pages/User/Articles";
import ArticleForm from "./pages/User/ArticleForm";
import Companies from "./pages/User/Companies";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Resume from "./pages/User/ResumePage";
import SubmitResume from "./pages/User/SubmitResume";
import MyApplications from "./pages/User/Applications";
import MyArticles from "./pages/User/MyArticles";
import AdminPanel from "./pages/AdminPanel";

const userRoutes = [
  {
    path: '/',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>
  },
  {
    path: '/internships',
    element: <ProtectedRoute><Internships /></ProtectedRoute>
  },
  {
    path: '/signup',
    element: <ProtectedRoute><Signup /></ProtectedRoute>
  },
  {
    path: '/login',
    element: <ProtectedRoute><Login /></ProtectedRoute>
  },
  {
    path: '/articles',
    element: <ProtectedRoute><Articles /></ProtectedRoute>
  },
  {
    path: '/articleform',
    element: <ProtectedRoute><ArticleForm /></ProtectedRoute>
  },
  {
    path: '/articleform/:id',
    element: <ProtectedRoute><ArticleForm /></ProtectedRoute>
  },
  {
    path: '/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/resume",
    element: <ProtectedRoute><Resume /></ProtectedRoute>
  },
  {
    path: "/submittedresume",
    element: <ProtectedRoute><SubmitResume /></ProtectedRoute>
  },
  {
    path: '/myapplications',
    element: <ProtectedRoute><MyApplications /></ProtectedRoute>
  },
  {
    path: '/myarticles',
    element: <ProtectedRoute><MyArticles /></ProtectedRoute>
  },
  {
    path: '/adminpanel',
    element: <ProtectedRoute><AdminPanel /></ProtectedRoute>
  }
];

const employerRoutes = [
  {
    path: '/esignup',
    element: <ProtectedRoute><EmployerSignup /></ProtectedRoute>
  },
  {
    path: '/login',
    element: <ProtectedRoute><Login /></ProtectedRoute>
  },
  {
    path: '/employer',
    element: <ProtectedRoute><EmployerDashboard /></ProtectedRoute>
  },
  {
    path: '/internshipform',
    element: <ProtectedRoute><InternshipForm /></ProtectedRoute>
  },
  {
    path: "/internshipform/:id",
    element: <ProtectedRoute><InternshipForm /></ProtectedRoute>
  }
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
