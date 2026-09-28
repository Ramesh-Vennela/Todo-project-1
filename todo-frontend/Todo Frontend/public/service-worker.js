
self.addEventListener("install", () => {
    console.log("TaskFlow Service Worker installed");
});

self.addEventListener("activate", () => {
    console.log("TaskFlow Service Worker activated");
});

self.addEventListener("push", (event) => {

    if (!event.data) {
        return;
    }

    let data;

    try {
        data = event.data.json();
    } catch (error) {
        data = {
            title: "TaskFlow",
            message: event.data.text()
        };
    }

    const title = data.title || "TaskFlow";

    const options = {
        body: data.message || "You have a task reminder.",
        icon: "/vite.svg",
        badge: "/vite.svg",
        data: {
            url: "/dashboard"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {

            for (const client of clientList) {

                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("/dashboard");
            }
        })
    );
});

