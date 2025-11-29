import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Publish from "./pages/Publish";
import Manage from "./pages/Manage";
import VideoDetail from "./pages/VideoDetail";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="publish" element={<Publish />} />
          <Route path="manage" element={<Manage />} />
          <Route path="video/:id" element={<VideoDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
