import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Contacts from "./Pages/Contacts";
import Events from "./Pages/Events";
import Organisations from "./Pages/Organisations";
import Tags from "./Pages/Tags";
import Integrations from "./Pages/Integrations";
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
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
