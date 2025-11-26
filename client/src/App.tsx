import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Publish from "./pages/Publish";
import Manage from "./pages/Manage";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="publish" element={<Publish />} />
          <Route path="manage" element={<Manage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
