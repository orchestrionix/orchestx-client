import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import { PlayerProvider } from './playerProvider';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Library from './pages/library';
import Search from './pages/search';
import Home from './pages/home';
import PlaylistDetail from './pages/library/name';

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:name" element={<PlaylistDetail />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
};
export default App;  // Make sure to use default export here