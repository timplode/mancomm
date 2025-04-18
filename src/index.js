import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.css';
import {App} from './app/App.jsx';
import reportWebVitals from './app/reportWebVitals.js';
import {BrowserRouter, Routes, Route} from "react-router";
import Publication from "./app/components/Publication.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/publication/:id" element={<Publication />} />
        </Routes>
    <App />
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
