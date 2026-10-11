import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Router/AppRouter";
import "./styles/theme.css";
import "./styles/pages-shared.css";
import "./components/pages/Home/all.css";

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
