import { AuthProvider } from './context/AuthContext';
import { TradeProvider } from './context/TradeContext';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <TradeProvider>
        <AppRoutes />
        <ToastContainer position='bottom-right' autoClose={3000} theme='dark' />
      </TradeProvider>
    </AuthProvider>
  );
}

export default App;
