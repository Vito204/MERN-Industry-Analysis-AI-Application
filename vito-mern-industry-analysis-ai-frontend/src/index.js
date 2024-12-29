import React from "react";
import ReactDOM from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
const stripePromise = loadStripe(
  "pk_test_51Pvq9KP6yynav1aCq8OfUUkMLBJqLc5VZ4UhqcQ2jxPbHYSdwIawUJPGkIdSPqI3bLMrssOXFAu4beJWMqvb9P5h00APgVwO6v"
);
const options = {
  mode: "payment",
  currency: "usd",
  amount: 2024,
};

// Create a client
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}>
          <App />
        </Elements>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
