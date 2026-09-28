
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import TodoDashboard from "./TodoDashboard";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Login + Register Page */}
                <Route
                    path="/"
                    element={<Auth />}
                />

                {/* Existing Todo Dashboard */}
                <Route
                    path="/dashboard"
                    element={<TodoDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;

