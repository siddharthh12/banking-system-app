import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import BankerLogin from './pages/BankerLogin';
import BankerDashboard from './pages/BankerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect to customer login by default */}
        <Route path="/" element={<Navigate to="/customer/login" />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/login/banker" element={<BankerLogin />} />

        {/* Protected dashboards */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/banker/dashboard" element={<BankerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
