import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UnitSelect from './pages/UnitSelect';
import UnitIntro from './pages/UnitIntro';
import LearnPage from './pages/LearnPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/units" element={<UnitSelect />} />
          <Route path="/unit/:unitId/intro" element={<UnitIntro />} />
          <Route path="/learn/:unitId" element={<LearnPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
