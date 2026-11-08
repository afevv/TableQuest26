import { useEffect, useState } from "react";
import mqtt from "mqtt";

const BROKER_URL = import.meta.env.VITE_MQTT_URL ?? "ws://localhost:9001";
const NOTIFICATION_TOPIC = "tablequest/+/notification";
const SHOW_MS = 60 * 1000;

function isNotification(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.type === "string" &&
    value.type.length > 0 &&
    typeof value.desk_id === "string" &&
    value.desk_id.length > 0
  );
}
export function useNotifications() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(BROKER_URL);

    client.on("connect", () => {
      client.subscribe(NOTIFICATION_TOPIC, { qos: 1 }, (error) => {
        if (error) console.error("Could not subscribe to notifications", error);
      });
    });
    client.on("error", (error) => console.error("MQTT error", error));
    client.on("message", (_topic, payload) => {
      try {
        const value = JSON.parse(payload.toString());
        if (!isNotification(value)) {
          console.warn("Ignoring invalid notification payload", value);
          return;
        }
        setNotification({ ...value, receivedAt: Date.now() });
      } catch {
        console.warn("Ignoring notification that is not valid JSON");
      }
    });

    return () => {
      client.end(true);
    };
  }, []);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [notification]);

  return { notification, dismiss: () => setNotification(null) };
}
