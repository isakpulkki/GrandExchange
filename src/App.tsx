import { createTheme } from '@mui/material/styles';
import {
  BrowserRouter as Router, Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainPage from './pages/Main';
import { ThemeProvider } from '@mui/material/styles';
import NewListingPage from './pages/NewListing';
import MessagesPage from './pages/Messages';
import LoginPage from './pages/Login';
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
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#3B3B3B' },
        secondary: { main: '#3B3B3B' },
      },
    },
  },
  typography: {
    allVariants: {
      color: 'black',
    },
    fontFamily: 'DM Sans, sans-serif',
    button: {
      textTransform: 'none',
      fontFamily: 'DM Sans, sans-serif',
      letterSpacing: '.1rem',
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
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
