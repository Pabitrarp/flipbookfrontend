import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import {Dashboard} from './components/Dashboard';
import Fileviewer from './components/Fileviewer';
import { Header } from './components/Header';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/create" element={<Homepage />} />
      <Route path="/flipbook/:id" element={<Fileviewer />} />
    </Routes>
  );
}

export default App;
