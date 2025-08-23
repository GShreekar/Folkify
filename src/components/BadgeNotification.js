import React, { useEffect, useState } from 'react';

const BadgeNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsLeaving(false);
    } else {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [notification]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (notification?.type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      case 'warning':
        return 'bg-amber-500 border-amber-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-amber-500 border-amber-600';
    }
  };

  const getIcon = () => {
    switch (notification?.type) {
      case 'success':
        return '🎉';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '🔔';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${getNotificationStyles()} 
          text-white px-6 py-4 rounded-xl shadow-2xl border-2 
          transform transition-all duration-300 ease-out
          ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
          max-w-sm
        `}
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl flex-shrink-0">{getIcon()}</span>
          <div className="flex-1">
            {notification?.title && (
              <h4 className="font-bold text-lg mb-1">{notification.title}</h4>
            )}
            <p className="text-sm leading-relaxed">{notification?.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors ml-2 text-lg leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Progress bar for auto-close */}
        {notification?.duration && (
          <div className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all ease-linear"
              style={{
                animation: `shrink ${notification.duration}ms linear forwards`
              }}
            ></div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default BadgeNotification;
