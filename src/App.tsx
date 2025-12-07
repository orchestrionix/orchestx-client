import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import { PlayerProvider } from './playerProvider';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Library from './pages/library';
import Search from './pages/search';

import PlaylistDetail from './pages/library/name';
import { ModalProvider } from './contexts/ModalContext';
import Settings from './pages/settings';
import Volume from './pages/volume';
import Views from './pages/views';
import Home from './pages/home';

const App: React.FC = () => {
  return (
    <ModalProvider>
      <PlayerProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="library" element={<Library />} />
              <Route path="library/:name" element={<PlaylistDetail />} />
              <Route path="settings" element={<Settings />} />
              <Route path="volume" element={<Volume />} />
              <Route path="views" element={<Views />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </ModalProvider>
  );
};
export default App;  // Make sure to use default export here