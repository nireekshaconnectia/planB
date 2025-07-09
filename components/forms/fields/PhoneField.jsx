import { useEffect } from "react";
import { countryCodeMap } from "@/lib/countryCodeMap"; // same structure as you used
import { usePhoneField } from "@/lib/form/usePhoneField";
import styles from "../field.module.css";

export const PhoneField = ({
  value,
  countryCode: initialCode = "+974",
  onChange,
  error,
}) => {
  const { countryCode, setCountryCode, phoneNumber, setPhoneNumber } =
    usePhoneField(initialCode);

  const CurrentFlag =
    countryCodeMap[countryCode]?.flag || (() => <span>🌍</span>);

  useEffect(() => {
    if (onChange) {
      onChange({ countryCode, phoneNumber });
    }
  }, [countryCode, phoneNumber, onChange]);

  return (
    <div className={styles.inputGroup}>
      <div className={styles.countrySelector}>
        <CurrentFlag className="w-6 h-4 mr-2" />
        <input
          type="text"
          value={countryCode}
          onChange={(e) => {
            let code = e.target.value.replace(/[^0-9+]/g, "");
            if (!code.startsWith("+")) code = "+" + code;
            setCountryCode(code);
          }}
          className={styles.countryCode}
          maxLength="4"
        />
      </div>

      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />

      {error && <div className="error-text">{error}</div>}
    </div>
  );
};
