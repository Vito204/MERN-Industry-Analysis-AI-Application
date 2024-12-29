import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Users/Register";
import Login from "./components/Users/Login";
import Dashboard from "./components/Users/Dashboard";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import Home from "./components/Home/Home";
import { useAuth } from "./AuthContext/AuthContext";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import IndustryAnalysisAIAssistant from "./components/ContentGeneration/GenerateContent";
import PaymentPlan from "./components/PaymentPlans/PaymentPlan";
import FreePlanSignup from "./components/Stripe/FreePlanSignup";
import CheckoutForm from "./components/Stripe/CheckoutForm";
import PaymentSuccess from "./components/Stripe/PaymentSuccess";
import ContentGenerationHistory from "./components/ContentGeneration/ContentGenerationHistory";
import AppFeatures from "./components/AppFeatures/AppFeatures";
import AboutUs from "./components/About/About";

export default function App() {
  //Custom auth hook
  const { isAuthenticated } = useAuth();
  return (
    <>
      <BrowserRouter>
        {/*Navbar*/}
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/generate-content"
            element={
              <AuthRoute>
                <IndustryAnalysisAIAssistant />
              </AuthRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PaymentPlan />} />
          <Route path="/free-plan" element={<FreePlanSignup />} />
          <Route path="/checkout/:plan" element={<CheckoutForm />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/features" element={<AppFeatures />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
