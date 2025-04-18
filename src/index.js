import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.css';
import {App} from './app/App.jsx';
import {BrowserRouter, Routes, Route} from "react-router";
import Publication from "./app/components/Publication.jsx";
import DocumentSearchForm from "./app/components/DocumentSearchForm.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <App>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<DocumentSearchForm />} />
            <Route path="/publication/:id" element={<Publication />} />
        </Routes>
     </BrowserRouter>
   </App>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
