
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Overview from './pages/Overview';
import Alerts from './pages/Alerts';
import Incidents from './pages/Incidents';
import SecurityEvents from './pages/SecurityEvents';
import Analytics from './pages/Analytics';
import Analysts from './pages/Analysts';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/security-events" element={<SecurityEvents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analysts" element={<Analysts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
