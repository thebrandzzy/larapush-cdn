var swVersion = "5.0.0";
const firebaseVersion = '8.9.1';

importScripts("https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-messaging.js");

firebase.initializeApp({ ...options.firebaseConfig });

self.addEventListener('activate', function (a) {
    a.waitUntil(clients.claim())

    if (options.one_time_collect != 1) {
        onMessageReceivedSubscribe(self.location.href);
    }
});

self.addEventListener("install", function (i) {
    self.skipWaiting()
})

/**
 * Receives push notification.
 *
 * Shows the notification to the user.
 */
self.addEventListener("push", (event) => {
    const payload = JSON.parse(event.data.json().data.notification);

    let isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    if (payload.requireInteraction == null) {
        payload.requireInteraction = false;
    }
    let requireInteraction = isMac ? false : payload.requireInteraction;

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            ...payload,
            data: payload,
            requireInteraction: requireInteraction,
        })
    );

    if (event.data.json().data.swVersion != swVersion) {
        console.log("SW Version is different, Updating SW");
        self.registration.update();
    }
});

/**
 * Gets called when notification is clicked.
 *
 * Opens a new tab in browser.
 */
self.addEventListener("notificationclick", (event) => {
    let targetUrl = event.notification.data.url;
    let apiUrl = event.notification.data.api_url;

    if (event.action && event.notification.data.actions[event.action]) {
        targetUrl = event.notification.data.actions[event.action].click_action;
        apiUrl = event.notification.data.actions[event.action].api_url;
    }

    clients.openWindow(targetUrl);
    fetch(apiUrl);
    event.notification.close();
});

/** ================= FOR AMP ================ */

/** @enum {string} */
const WorkerMessengerCommand = {
    /**
     * Used to ping the service worker to check if it is alive
     */
    PING: "larapush-ping",
    /*
      Used to request the current subscription state.
     */
    AMP_SUBSCRIPTION_STATE: "amp-web-push-subscription-state",
    /*
      Used to request the service worker to subscribe the user to push.
      Notification permissions are already granted at this point.
     */
    AMP_SUBSCRIBE: "amp-web-push-subscribe",
    /*
      Used to unsusbcribe the user from push.
     */
    AMP_UNSUBSCRIBE: "amp-web-push-unsubscribe",
    AMP_UPDATE_SUBSCRIPTION: "amp-web-push-update-subscription",
};

self.addEventListener("message", (event) => {
    /*
      Messages sent from amp-web-push have the format:
    
      - command: A string describing the message topic (e.g.
      'amp-web-push-subscribe')
    
      - payload: An optional JavaScript object containing extra data relevant to
      the command.
     */
    const { command, url } = event.data;

    switch (command) {
        case WorkerMessengerCommand.PING:
            event.source.postMessage("larapush-pong");
            break;
        case WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE:
            onMessageReceivedSubscriptionState();
            break;
        case WorkerMessengerCommand.AMP_SUBSCRIBE:
            onMessageReceivedSubscribe(url);
            break;
        case WorkerMessengerCommand.AMP_UNSUBSCRIBE:
            onMessageReceivedUnsubscribe();
            break;
        case WorkerMessengerCommand.AMP_UPDATE_SUBSCRIPTION:
            onMessageReceivedUpdateSubscription();
            break;
    }
});

/**
 * Broadcasts a single boolean describing whether the user is subscribed.
 */
function onMessageReceivedSubscriptionState() {
    let retrievedPushSubscription = null;
    self.registration.pushManager
        .getSubscription()
        .then((pushSubscription) => {
            retrievedPushSubscription = pushSubscription;
            if (!pushSubscription) {
                return null;
            } else {
                return self.registration.pushManager.permissionState(pushSubscription.options);
            }
        })
        .then((permissionStateOrNull) => {
            if (permissionStateOrNull == null) {
                broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, false);
            } else {
                const isSubscribed = !!retrievedPushSubscription && permissionStateOrNull === "granted";
                broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, isSubscribed);
            }
        });
}

/**
 * Subscribes the visitor to push.
 *
 * The broadcast value is null (not used in the AMP page).
 */
async function onMessageReceivedSubscribe(url) {
    try {
        await subscribePushManager(url);
    } catch (error) {
        console.log("Error in onMessageReceivedSubscribe: ", error);
        // Unsubscribe the old service worker subscription
        const subscription = await self.registration.pushManager.getSubscription();
        if (subscription) {
            const successful = await subscription.unsubscribe();
            if (successful) {
                console.log("Unsubscribed successfully");
                // Retry the subscription
                await subscribePushManager(url);
            } else {
                console.log("Unsubscribe failed");
            }
        }
    }
}

/**
 * Updates the subscription.
 */
async function onMessageReceivedUpdateSubscription() {
    await updateSubscription();
}

let promiseChain = Promise.resolve();
async function subscribePushManager(url) {
    promiseChain = promiseChain
        .then(async () => {
            await self.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: options.vapid_public_key,
            });

            broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIBE, null);
            var newSubscription = await self.registration.pushManager.getSubscription();
            newSubscription = newSubscription.toJSON();

            if (firebase.messaging().vapidKey == null) {
                firebase.messaging().usePublicVapidKey(options.vapid_public_key);
            }

            const messaging = firebase.messaging();
            const token = await messaging.getToken({
                serviceWorkerRegistration: self.registration,
            });

            if ((await this.readData("notification_token")) != token) {
                domain = options.domain;
                if (http) {
                    domain = getDomainAndHostname(url).hostname;
                }

                const subscriptionData = await getEntireSubscriptionData();

                await fetch(options.api_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        domain,
                        token,
                        url: url,
                        endpoint: newSubscription.endpoint,
                        auth: newSubscription.keys.auth,
                        p256dh: newSubscription.keys.p256dh,
                        ...subscriptionData,
                    }),
                }).then(async (res) => {
                    if (res.status == 200) {
                        // get response data
                        const responseData = await res.json();
                        console.log("Response Data: ", responseData);

                        // store response data
                        await this.writeData("notification_token", token);
                        await this.writeData("is_subscribed", true);

                        if (responseData.id) {
                            await this.writeData("subscriber_id", responseData.id);
                        }

                        await this.writeData("sent_tags", subscriptionData.tags);
                        await this.writeData("sent_name", subscriptionData.name);
                        await this.writeData("sent_email", subscriptionData.email);
                        await this.writeData("sent_extra_data", subscriptionData.extra_data);
                        await writeData("tags_to_remove", []);

                        console.log("Notification Token Sent.");

                        await updateSubscription();

                        return true;
                    }
                    console.log("Notification Token Send Error ", res.status);
                });
            }
        })
        .catch((err) => {
            console.log("Error:", err);
        });
}

async function getEntireSubscriptionData() {
    // Get data from indexedDB
    const selected_tags = await readData("selected_tags") || [];
    const developer_tags = await readData("developer_tags") || [];
    const tags_to_remove = await readData("tags_to_remove") || [];
    const client_user_id = await readData("client_user_id") || "";
    const client_name = await readData("client_name") || "";
    const client_email = await readData("client_email") || "";
    const client_extra_data = await readData("client_extra_data") || "";

    // Calculate final tags
    const final_tags = [...new Set([...selected_tags, ...developer_tags])];

    // Create the response object first to ensure we have captured tags_to_remove
    const responseData = {
        client_user_id,
        name: client_name,
        email: client_email,
        extra_data: client_extra_data,
        tags: final_tags,
        remove_tags: tags_to_remove
    };

    return responseData;
}

async function updateSubscription() {
    const is_subscribed = await readData("is_subscribed") || false;

    if (!is_subscribed) {
        return;
    }

    // Get data from indexedDB
    const notification_token = await readData("notification_token") || "";
    const subscriber_id = await readData("subscriber_id") || "";
    const selected_tags = await readData("selected_tags") || [];
    const developer_tags = await readData("developer_tags") || [];
    const tags_to_remove = await readData("tags_to_remove") || [];
    const client_user_id = await readData("client_user_id") || "";
    const client_name = await readData("client_name") || "";
    const client_email = await readData("client_email") || "";
    const client_extra_data = await readData("client_extra_data") || "";

    // Get sent data from indexedDB
    const sent_tags = await readData("sent_tags") || [];
    const sent_user_id = await readData("sent_user_id") || "";
    const sent_name = await readData("sent_name") || "";
    const sent_email = await readData("sent_email") || "";
    const sent_extra_data = await readData("sent_extra_data") || "";

    // Calculate final tags
    const final_tags = [...new Set([...selected_tags, ...developer_tags])];

    // Check final tags and sent tags are same
    let is_tags_same = false;
    if (final_tags.length === sent_tags.length && final_tags.sort().join(",") === sent_tags.sort().join(",")) {
        is_tags_same = true;
    }

    // Check if client_user_id, client name, email and extra data are same
    let is_client_same = false;
    if (client_user_id === sent_user_id && client_name === sent_name && client_email === sent_email && client_extra_data === sent_extra_data) {
        is_client_same = true;
    }

    // if everything is same and there are no tags to remove, then return
    if (is_tags_same && is_client_same && tags_to_remove.length === 0) {
        return;
    }

    // Get domain to send data to server
    domain = options.domain;
    if (http) {
        domain = getDomainAndHostname(url).hostname;
    }

    await fetch(options.api_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            domain,
            id: subscriber_id,
            token: notification_token,
            tags: final_tags,
            remove_tags: tags_to_remove,
            client_user_id: client_user_id,
            name: client_name,
            email: client_email,
            extra_data: client_extra_data,
        }),
    }).then(async (res) => {
        if (res.status == 200) {
            await writeData("tags_to_remove", []);
            await writeData("sent_tags", final_tags);
            await writeData("sent_user_id", client_user_id);
            await writeData("sent_name", client_name);
            await writeData("sent_email", client_email);
            await writeData("sent_extra_data", client_extra_data);
        }
    }).catch((err) => {
        console.log("Error in updateSubscription: ", err);
    });
}

/**
 * Get Hostname from URL
 */
function getDomainAndHostname(url) {
    const urlObj = new URL(url);
    return {
        hostname: urlObj.hostname,
    };
}

/**
 * Unsubscribes the subscriber from push.
 *
 * The broadcast value is null (not used in the AMP page).
 */
function onMessageReceivedUnsubscribe() {
    self.registration.pushManager
        .getSubscription()
        .then((subscription) => subscription.unsubscribe())
        .then(() => {
            // OPTIONALLY IMPLEMENT: Forward the unsubscription to your server here
            broadcastReply(WorkerMessengerCommand.AMP_UNSUBSCRIBE, null);
        });
}

/**
 * Sends a postMessage() to all window frames the service worker controls.
 * @param  {string} command
 * @param  {!JsonObject} payload
 */
function broadcastReply(command, payload) {
    self.clients.matchAll().then((clients) => {
        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            client./*OK*/ postMessage({
                command,
                payload,
            });
        }
    });
}

/**
 * IndexedDB Helper
 */
openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("larapushDataBase", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("myObjectStore", { keyPath: "id" });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

/**
 * IndexedDB Write Helper
 */
writeData = async (key, value) => {
    const db = await this.openDatabase();
    const transaction = db.transaction("myObjectStore", "readwrite");
    const objectStore = transaction.objectStore("myObjectStore");
    const request = objectStore.put({ id: key, data: value });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
};

/**
 * IndexedDB Read Helper
 */
readData = async (key) => {
    const db = await this.openDatabase();
    const transaction = db.transaction("myObjectStore", "readonly");
    const objectStore = transaction.objectStore("myObjectStore");
    const request = objectStore.get(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result ? request.result.data : null);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};
