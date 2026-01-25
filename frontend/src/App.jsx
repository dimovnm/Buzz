import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import ThemeSelectedPage from "./pages/ThemeSelectedPage";


export default function App() {
  return (
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<LandingPage />} />
        {/* LobbyCode */}
        <Route path="/:code" element={<CreatePage />} />
        {/*<Route path="/CreatePage"
        element={
          <ProtectedRoute>
            <HowToPlay />
          </ProtectedRoute>
        }
      />*/}
      <Route path="/:code/:themeId" element={<ThemeSelectedPage />} />

      {/* Catch all 
      <Route path="*" element={<Navigate to="/" replace />} />
      */}
      
      </Routes>
  );
}
