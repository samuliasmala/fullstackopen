import { useState, useRef } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const timer = useRef(null);

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const displayNotification = (message, type = 'notification') => {
    if (timer.current) clearInterval(timer.current);
    setNotification(message);
    setNotificationType(type);
    timer.current = setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, 5000);
  };

  const Notification = () => {
    if (notification === null) return null;

    const notificationColor = notificationType === 'error' ? 'red' : 'green';

    return (
      <div style={{ ...notificationStyle, color: notificationColor }}>
        {notification}
      </div>
    );
  };

  return { displayNotification, Notification };
};
