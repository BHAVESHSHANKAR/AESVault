import {BrowserRouter,Routes ,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserHome from './pages/userHome';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import Forgotuniqueid from "./pages/forgotuniqueid.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/userhome" element={<UserHome/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/aboutus" element={<AboutUs/>}/>
        <Route path="/forgot"element={<Forgotuniqueid/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;