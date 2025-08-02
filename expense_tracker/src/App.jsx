// src/App.jsx
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes"; // We’ll create this next

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
