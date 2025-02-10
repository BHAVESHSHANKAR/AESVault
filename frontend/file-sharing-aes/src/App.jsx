import {BrowserRouter,Routes ,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserHome from './pages/userHome';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
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
      </Routes>
    </BrowserRouter>
  );
}
export default App;