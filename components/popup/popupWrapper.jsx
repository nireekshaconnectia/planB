import React, { useEffect, useRef, useState } from 'react';
import styles from './popupwrapper.module.css';

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

  // Close when clicking on the overlay; keep clicks inside content open
  const handleOverlayMouseDown = () => {
    onClose?.();
  };

  if (!shouldRender) return null;

  return (
    <div className={styles['popup-overlay']} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={popupRef}
        className={`${styles['popup-content']} ${isClosing ? styles['popup-exit'] : styles['popup-enter']}`}
        onMouseDown={(e) => e.stopPropagation()}
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