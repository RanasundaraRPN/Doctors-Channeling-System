import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindDoctors from './pages/FindDoctors';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import BookAppointment from './pages/BookAppointment';
import Settings from './pages/Settings';
import AppointmentDetails from './pages/AppointmentDetails';
import CancelAppointment from './pages/CancelAppointment';
import AdminDoctors from './pages/AdminDoctors';
import AdminAppointments from './pages/AdminAppointments';
import AdminManagement from './pages/AdminManagement';
import Manage from './pages/Manage';
import AdminPatients from './pages/AdminPatients';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<FindDoctors />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/appointments/:id/cancel" element={<CancelAppointment />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        <Route path="/admin/manage" element={<Manage />} />
        <Route path="/admin/patients" element={<AdminPatients />} />


      </Routes>
    </Router>
  );
}

export default App;
