import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ListingsPage from './pages/ListingsPage';
import NewListingPage from './pages/NewListingPage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import NotExistPage from './pages/NotExistPage';
import MessagePage from './pages/MessagePage';
import AccountPage from './pages/AccountPage';
import Listing from './pages/ListingPage';
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
      light: '#666666',
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ListingsPage />} />
            <Route path="newlisting" element={<NewListingPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="notexist" element={<NotExistPage />} />
            <Route path="/messages/:participant" element={<MessagePage />} />
            <Route path="/listings/:id" element={<Listing />} />
            <Route path="*" element={<Navigate to="/notexist" />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
