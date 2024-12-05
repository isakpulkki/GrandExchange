import { createTheme } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainPage from './pages/Main';
import { ThemeProvider } from '@mui/material/styles';
import NewListingPage from './pages/NewListing';
import MessagesPage from './pages/Messages';
import LoginPage from './pages/Login';
import LogoutPage from './pages/Logout';
import RegisterPage from './pages/Register';
import Layout from './layouts/Layout';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="newlisting" element={<NewListingPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
