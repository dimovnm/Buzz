import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/CreatePage" element={<CreatePage />} />
        {/*<Route path="/CreatePage"
        element={
          <ProtectedRoute>
            <HowToPlay />
          </ProtectedRoute>
        }
      />*/}
      </Routes>
    </Router>
  );
}
