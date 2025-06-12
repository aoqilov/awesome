/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

/**
 * LocalStoragedan qiymat olish va saqlash uchun hook.
 *
 * @example
 * const [token, setToken] = useLocalStorage('token', '');
 * // token qiymati localStoragedan olinadi
 *
 * @example
 * const [token, setToken] = useLocalStorage('token', '');
 * setToken('newToken'); // yangi qiymat localStorageda saqlanadi
 *
 * @param {string} key - LocalStoragega saqlanadigan kalit
 * @param {any} initialValue - Dastlabki qiymat
 * @returns { array } [storedValue, setValue] - LocalStoragedan olingan qiymat va yangi qiymatni saqlash uchun funksiya
 */
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (_) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (_) {
      return null;
    }
  };

  return [storedValue, setValue];
};
