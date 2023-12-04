import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./containers/LandingPage";
import LoginPage from "./containers/Login";
import Navbar from "./containers/Navbar";
import Scoreboard from "./containers/Scoreboard";
import SignupPage from "./containers/Signup";
import Stock from "./containers/Stock";
import { AuthProvider } from "./containers/AuthContext";
import UserGames from "./containers/UserGames";
import CreateGame from "./containers/CreateGame";
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/stocks" element={<Stock />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/games" element={<UserGames />} />
            <Route path="/create-game" element = {<CreateGame />} />
          </Routes>
        </div>
        </AuthProvider>
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
