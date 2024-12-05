import { BALANCE_STORAGE_KEY } from "./consts";
import { balance } from "./stores";
import { get } from "svelte/store";

export const setBalance = () => {
  const storedBalance = localStorage.getItem(BALANCE_STORAGE_KEY);
  const parsedBalance = parseFloat(storedBalance ?? "");
  if (!isNaN(parsedBalance)) balance.set(parsedBalance);
};

export const saveBalance = () => {
  const balanceValue = get(balance);
  if (!isNaN(balanceValue))
    localStorage.setItem(BALANCE_STORAGE_KEY, balanceValue.toFixed(2));
};
