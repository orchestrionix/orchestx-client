import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Library from './pages/Library';
import Layout from './Layout';
import { PlayerProvider } from './playerProvider';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="library" element={<Library initialLists={[]} />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
};
export default App;  // Make sure to use default export here