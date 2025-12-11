import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;