import "./App.css";
import React, {useState} from "react";

import PdfUploader from "./components/PdfUploader";
import DashboardAppBar from "./components/DashboardAppBar";
import CourseTab from "./components/CourseTab";
import Box from '@mui/material/Box';
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';

export const App = () => {
  const [view, setView] = useState(2);
  const [loggedIn, setLoggedIn] = useState(true);

  const handleSetView = (number) => {
    setView(number);
  }
  
  const handleSetLogin = (result) => {
    setLoggedIn(result);
  }

  return (
    <Box>
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
    </Box>
  );
}

export default App;
