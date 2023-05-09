import Notiflix from "notiflix";

const API_URL = "https://restcountries.com/v3.1/name/";
const FILTERS = "?fields=name,capital,population,flags,languages";

export function fetchCountries(countryName) {
  return fetch(`${API_URL}${countryName}${FILTERS}`).then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        Notiflix.Notify.failure("Oops, there is no country with that name.");
      } else {
        throw new Error(response.status);
      }
    }
    return response.json();
  });
}