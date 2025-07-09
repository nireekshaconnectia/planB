import React, { useEffect, useRef, useState } from 'react';
import styles from './PopupWrapper.module.css';

const PopupWrapper = ({ isOpen, onClose, children, title }) => {
  const popupRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => setShouldRender(false), 300); // match CSS duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (shouldRender) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={styles['popup-overlay']}>
      <div
        ref={popupRef}
        className={`${styles['popup-content']} ${isClosing ? styles['popup-exit'] : styles['popup-enter']}`}
      >
        <div className={styles.popupHead}>
          <span className={styles.popupTitle}>{title}</span>
          <span className={styles.popupclose} onClick={onClose}>
            Cancel
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PopupWrapper;