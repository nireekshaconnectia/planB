import { useTranslations } from "next-intl";
import { countryCodeMap } from "@/lib/countryCodeMap";
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

  const t = useTranslations();

  const CurrentFlag =
    countryCodeMap[countryCode]?.flag || (() => <span>🌍</span>);

  const handleCountryChange = (e) => {
    let code = e.target.value.replace(/[^0-9+]/g, "");
    if (!code.startsWith("+")) code = "+" + code;

    setCountryCode(code);

    onChange?.({
      countryCode: code,
      phoneNumber,
    });
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value;

    setPhoneNumber(number);

    onChange?.({
      countryCode,
      phoneNumber: number,
    });
  };

  return (
    <div className={styles.inputGroup}>
      <div className={styles.countrySelector}>
        <CurrentFlag className="w-6 h-4 mr-2" />
        <input
          type="text"
          value={countryCode}
          onChange={handleCountryChange}
          className={styles.countryCode}
          maxLength="4"
        />
      </div>

      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={t("phone-number")}
      />

      {error && <div className="error-text">{error}</div>}
    </div>
  );
};