
const requestNotificationPermission = async () => {

    if (!("Notification" in window)) {
        console.log("Browser notifications are not supported.");
        return false;
    }

    if (Notification.permission === "granted") {
        console.log("Notification permission already granted.");
        return true;
    }

    if (Notification.permission === "denied") {
        console.log("Notification permission was denied.");
        return false;
    }

    const permission =
        await Notification.requestPermission();

    if (permission === "granted") {

        console.log(
            "TaskFlow notification permission granted."
        );

        return true;
    }

    console.log(
        "TaskFlow notification permission denied."
    );

    return false;
};


export const initializeNotifications = async () => {

    if (!("serviceWorker" in navigator)) {
        console.log("Service Worker is not supported.");
        return false;
    }

    try {

        await navigator.serviceWorker.ready;

        const permission =
            await requestNotificationPermission();

        return permission;

    } catch (error) {

        console.error(
            "Notification initialization failed:",
            error
        );

        return false;
    }
};


export const showTaskNotification = async (
    title,
    message
) => {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission !== "granted") {
        return;
    }

    try {

        const registration =
            await navigator.serviceWorker.ready;

        await registration.showNotification(
            title,
            {
                body: message,
                icon: "/vite.svg",
                badge: "/vite.svg",
                data: {
                    url: "/dashboard"
                }
            }
        );

    } catch (error) {

        console.error(
            "Failed to show notification:",
            error
        );
    }
};

