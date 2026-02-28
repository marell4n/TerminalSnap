import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing-pages.jsx';
// import TakePicturePage from './pages/booth.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container py-5">
        <Routes>
          {/* Rute Landing Page */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}