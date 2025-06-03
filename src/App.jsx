import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LinksPage from './pages/LinksPage.jsx';
import ViewerPage from './pages/ViewerPage.jsx';

const App = () => (
  <Router>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Routes>
        <Route path="/" element={<LinksPage />} />
        <Route path="/viewer/:type/:id" element={<ViewerPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
