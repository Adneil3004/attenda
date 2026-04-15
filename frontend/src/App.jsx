import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RsvpPage from './pages/RsvpPage';

import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Guests from './pages/dashboard/Guests';
import Settings from './pages/dashboard/Settings';
import Tasks from './pages/dashboard/Tasks';
import CreateEvent from './pages/dashboard/CreateEvent';
import MyEvents from './pages/dashboard/MyEvents';
import EditEvent from './pages/dashboard/EditEvent';
import TableLayout from './pages/dashboard/TableLayout';
import RsvpDesigner from './pages/dashboard/RsvpDesigner';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter basename="/attenda/">
      <Routes>
        {/* Public Marketing & Auth Pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Public RSVP Page - No authentication required */}
          <Route path="/rsvp/:eventId" element={<RsvpPage />} />
        </Route>

        {/* Protected Dashboard Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path=":eventId" element={<Overview />} />
          <Route path="guests/:eventId" element={<Guests />} />
          <Route path="tasks/:eventId" element={<Tasks />} />
          <Route path="settings/:eventId" element={<Settings />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="table-layout/:eventId" element={<TableLayout />} />
          <Route path="rsvp-designer/:eventId" element={<RsvpDesigner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
