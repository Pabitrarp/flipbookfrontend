import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import {Dashboard} from './components/Dashboard';
import Fileviewer from './components/Fileviewer';
import { Header } from './components/Header';
import { Templets } from './components/Templets';
import  Login  from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/create" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path="/flipbook/:name/:id" element={<Fileviewer />} />
      <Route path="/templets" element={<ProtectedRoute><Templets/></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;
