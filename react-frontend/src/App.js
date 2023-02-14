import "./App.css";
import React, {useState, useEffect} from "react";
import axios from 'axios'
import PdfUploader from "./components/PdfUploader";
import DashboardAppBar from "./components/DashboardAppBar";
import CourseTab from "./components/CourseTab";
import Box from '@mui/material/Box';
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';

export const App = () => {
  const [view, setView] = useState(2);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    try{
      if(token) {
        axios.get('http://localhost:8000/users/token/verify').then((res) => {
            const data = res;
            if (data.status == 200) {
              setLoggedIn(true);
            }
        })
      }
    } catch {
      localStorage.removeItem("jwt-token")
    }
  }, [])

  const handleSetView = (number) => {
    setView(number);
  }
  
  const handleSetLogin = (result) => {
    setLoggedIn(result);
  }

  return (
    <div className="w-full">
      <BrowserRouter>
        <DashboardAppBar setView={handleSetView} loggedIn={loggedIn} handleSetLogin={handleSetLogin}/>
        <Routes>
          <Route path='/' element={
            loggedIn ? <PdfUploader/> 
                  : <LoginPage loggedin={loggedIn} handleSetLogin={setLoggedIn} />
          } />
          <Route
            path='/login' element={
                loggedIn ? <Navigate to='/' />
                  : <LoginPage loggedin={loggedIn} handleSetLogin={setLoggedIn} />
          } />
          <Route
            path='/courses' element={
                loggedIn ? <CourseTab />
                  : <Navigate to='/login' />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
