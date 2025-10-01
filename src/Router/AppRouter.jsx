import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/login/Login";
import Home from "../components/pages/Home/Home";
import Ads from "../components/pages/Home/Ads";
import Category from "../components/pages/Home/Category";
import Role from "../components/pages/Home/Role";
import Persons from "../components/pages/Home/Persons";
import Businesses from "../components/pages/Home/Businesses";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/loginedpage" element={<Home/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/ads" element={<Ads/>} />
      <Route path="/category" element={<Category/>} />
      <Route path="/roles" element={<Role/>} />
        <Route path="/persons" element={<Persons/>} />
        <Route path="/businesses" element={<Businesses/>} />
    </Routes>
  );
};

export default AppRouter;
