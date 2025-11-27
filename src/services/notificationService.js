// Request permission for notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    return notification;
  }
};

// Schedule a notification
export const scheduleNotification = (title, options, triggerTime) => {
  if (!('serviceWorker' in navigator) || !('showTrigger' in Notification.prototype)) {
    console.warn('Scheduled notifications not supported');
    return;
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      ...options,
      showTrigger: new TimestampTrigger(triggerTime.getTime()),
    });
  });
};

// Check if notifications are supported and enabled
export const isNotificationSupported = () => {
  return 'Notification' in window && 
         'serviceWorker' in navigator && 
         'showTrigger' in Notification.prototype;
};