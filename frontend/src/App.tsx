import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainPage from './pages/Main';
import NewListingPage from './pages/NewListing';
import MessagesPage from './pages/Messages';
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import RegisterPage from './pages/Register';
import NotExistPage from './pages/NotExist';
import Layout from './layouts/Layout';

// Extending Material UI Theme to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// Create the Material UI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Custom hook to check for authentication (e.g., from localStorage)
const useAuth = () => {
  // Replace this with actual token-checking logic
  const token = localStorage.getItem('token');
  return token;
};

const App = () => {
  const token = useAuth(); // Check if token exists

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            {/* Redirect to Login if no token for new listing */}
            <Route
              path="newlisting"
              element={token ? <NewListingPage /> : <Navigate to="/login" />}
            />
            {/* Redirect to Login if no token for messages */}
            <Route
              path="messages"
              element={token ? <MessagesPage /> : <Navigate to="/login" />}
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="notexist" element={<NotExistPage />} />
            <Route path="*" element={<Navigate to="/notexist" />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
