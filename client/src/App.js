import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Navbar from './components/Navbar';
import AddClass from './pages/AddClass';
import UserReviews from './pages/UserReviews';
import Footer from './components/Footer';
import Alert from './components/Alert';
import { useState } from 'react';


function App() {
  const [ alertOpen, setAlertOpen ] = useState(false)
  const [ alertMessage, setAlertMessage ] = useState('')

  return (
    <div className="App">
      {alertOpen && <Alert alertOpen={alertOpen} setAlertOpen={setAlertOpen} alertMessage={alertMessage}/>}
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage}/>} />
          <Route path='/auth' element={<Auth alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage}/>} />
          <Route path='/add-class' element={<AddClass alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage}/>} />
          <Route path='/user-reviews' element={<UserReviews />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
