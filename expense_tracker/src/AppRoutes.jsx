// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Analytics from "./pages/Analytics";

// function AppRoutes() {
//   const { user } = useAuth();

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/login"
//           element={!user ? <Login /> : <Navigate to="/dashboard" />}
//         />
//         <Route
//           path="/signup"
//           element={!user ? <Signup /> : <Navigate to="/dashboard" />}
//         />
//         <Route
//           path="/dashboard"
//           element={user ? <Dashboard /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="*"
//           element={<Navigate to={user ? "/dashboard" : "/login"} />}
//         />
//         <Route path="/analytics" element={<Analytics expenses={expenses} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default AppRoutes;

// AppRoutes.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../src/services/firebase"; // adjust path if needed

import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Dashboard from "../src/pages/Dashboard";
import Analytics from "../src/pages/Analytics";

function AppRoutes() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: doc.id,
            ...raw,
            date: raw?.date?.toDate ? raw.date.toDate() : raw?.date,
          };
        });
        setExpenses(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching expenses:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading && user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard expenses={expenses} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/analytics"
          element={
            user ? <Analytics expenses={expenses} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
