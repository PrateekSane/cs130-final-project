import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './containers/LandingPage';
import LoginPage from './containers/Login';
import Navbar from './containers/Navbar';
import SignupPage from './containers/Signup';
import Stock from './containers/Stock';

function App() {
  return (
    <div className="App">
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/stocks' element={<Stock />} />
            </Routes>
          </div>
        </Router>

    </div>
  );
}

export default App;

/*
<Route path='/protected' element={<ProtectedLayout />}>
<Route path='settings' element={<Settings />} />
</Route>

*/
