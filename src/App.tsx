import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Library from './pages/Library';
import Layout from './Layout';
import { PlayerProvider } from './playerProvider';

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/about" element={<Library initialLists={[]} />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;  // Make sure to use default export here