import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter basename="/attenda/">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
