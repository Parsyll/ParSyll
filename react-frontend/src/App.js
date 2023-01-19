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

  const project = () => {
    switch(view) {

      case 0:   return <CourseTab />;
      case 1:   return <PdfUploader />;
      case 2:   return <LoginPage />
      default:  return <LoginPage />
    }
  }

  const handleSetView = (number) => {
    setView(number);
  }

  return (
    <Box>
      <DashboardAppBar setView={handleSetView} loggedIn={loggedIn}/>
      { project() }
    </Box>
  );
}

export default App;
