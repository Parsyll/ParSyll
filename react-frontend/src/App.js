import "./App.css";
import React, {useState} from "react";

import PdfUploader from "./components/PdfUploader";
import DashboardAppBar from "./components/DashboardAppBar";
import CourseTab from "./components/CourseTab";
import Box from '@mui/material/Box';
import LoginPage from './pages/LoginPage'

export const App = () => {
  const [view, setView] = useState(2);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSetView = (number) => {
    setView(number);
  }
  
  const handleSetLogin = (result) => {
    setLoggedIn(result);
  }

  const project = () => {
    switch(view) {

      case 0:   return <CourseTab />;
      case 1:   return <PdfUploader />;
      case 2:   return <LoginPage handleSetLogin={handleSetLogin}/>
      default:  return <LoginPage handleSetLogin={handleSetLogin}/>
    }
  }

  return (
    <Box>
      <DashboardAppBar setView={handleSetView} loggedIn={loggedIn} handleSetLogin={handleSetLogin}/>
      { project() }
    </Box>
  );
}

export default App;
