import { atom } from "jotai";
import { atomWithLocation } from "jotai-location";
import {
  DEFAULT_LANGUAGE,
  isValidLanguage,
  type SupportedLanguage,
} from "../constants/languages";

const locationAtom = atomWithLocation();

export const selectedLanguageAtom = atom(
  (get) => {
    const location = get(locationAtom);
    const langParam = location.searchParams?.get("lang");
    return isValidLanguage(langParam) ? langParam : DEFAULT_LANGUAGE;
  },
  (get, set, newLang: SupportedLanguage) => {
    const location = get(locationAtom);
    const newSearchParams = new URLSearchParams(location.searchParams);
    newSearchParams.set("lang", newLang);
    set(locationAtom, {
      ...location,
      searchParams: newSearchParams,
    });
  }
);
