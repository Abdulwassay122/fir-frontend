import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ComplainantLogin from "./components/login/ComplainantLogin";
import OfficierLogin from "./components/login/OfficierLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import ComplainantDashboard from "./components/caomplainants/ComplainantDashboard";
import OfficerDashboard from "./components/officer/OfficerDashboard";
import CreateComplaiant from "./components/login/CreateComplaiant";
interface AppProps {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
}
function App({ isDark, toggleTheme  }: AppProps) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/officer/login" element={<OfficierLogin />} />
          <Route path="/" element={<ComplainantLogin />} />
          <Route path="/register-complainant" element={<CreateComplaiant />} />

          {/* Protected Officer */}
          <Route
            path="/officer/dashboard/*"
            element={
              <ProtectedRoute role="officer">
                <OfficerDashboard isDark={isDark} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Protected Complainant */}
          <Route
            path="/complainant/dashboard/*"
            element={
              <ProtectedRoute role="complainant">
                <ComplainantDashboard isDark={isDark} toggleTheme={toggleTheme}/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
