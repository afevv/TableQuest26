import { useNotifications } from "../hooks/useNotifications";

const NOTIFICATION_TEXT = {
  water: {
    title: "Time to drink water!",
    body: "Your desk reminds you to have a glass of water.",
  },
};

function NotificationToast() {
  const { notification, dismiss } = useNotifications();

  if (!notification) return null;

  const text = NOTIFICATION_TEXT[notification.type] ?? {
    title: "New notification",
    body: notification.type,
  };

  return (
    <div className="toast toast-top toast-end z-50">
      <div role="alert" className="alert alert-info shadow-lg">
        <div>
          <h2 className="font-bold">{text.title}</h2>
          <p className="text-sm">{text.body}</p>
          <p className="text-xs opacity-70">Desk: {notification.desk_id}</p>
        </div>
        <button type="button" className="btn btn-sm" onClick={dismiss}>
          OK
        </button>
      </div>
    </div>
  );
}

export default NotificationToast;
