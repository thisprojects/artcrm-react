import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Contacts from './Pages/Contacts';
import Events from './Pages/Events';
import Organisations from './Pages/Organisations';
import Tags from './Pages/Tags';
import Integrations from './Pages/Integrations';
import Dashboard from './Pages/Dashboard';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="events" element={<Events />} />
    <Route path="organisations" element={<Organisations />} />
    <Route path="tags" element={<Tags />} />
    <Route path="integrations" element={<Integrations />} />
    <Route path="dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
