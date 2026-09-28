
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./App.css";


async function registerServiceWorker() {

    if ("serviceWorker" in navigator) {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "/service-worker.js"
                );

            console.log(
                "TaskFlow Service Worker registered:",
                registration
            );

        } catch (error) {

            console.error(
                "TaskFlow Service Worker registration failed:",
                error
            );

        }
    }
}


createRoot(
    document.getElementById("root")
).render(

    <StrictMode>
        <App />
    </StrictMode>

);


registerServiceWorker();
