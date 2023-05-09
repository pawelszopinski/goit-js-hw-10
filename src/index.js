import "./css/styles.css";
import Notiflix from "notiflix";
import debounce from "lodash.debounce";
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;
const searchEl = document.querySelector("#search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

const displayCountry = country => {
  const { name, capital, population, languages, flags } = country;
  const languagesList = Object.values(languages)
    .map(language => language)
    .join(", ");
  const countryInfo = `
    <div class="country-info__flag">
      <img src="${flags.png}" alt="${flags.alt}" title="${flags.alt}" width="300">
    </div>
    <div class="country-info__text">
      <h2 class="country-info__name">${name.common}</h2>
      <p class="country-info__capital"><b>Capital:</b> ${capital}</p>
      <p class="country-info__population"><b>Population:</b> ${population}</p>
      <p class="country-info__languages"><b>Languages:</b> ${languagesList}</p>
    </div>
  `;
  countryInfoEl.innerHTML = countryInfo;
};

searchEl.addEventListener(
  "input",
  debounce(event => {
    const searchQuery = event.target.value.trim();
    if (searchQuery.length === 0) {
      countryListEl.innerHTML = "";
      countryInfoEl.innerHTML = "";
      return;
    }
    fetchCountries(searchQuery)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            "Too many matches found. Please enter a more specific name."
          );
          countryListEl.innerHTML = "";
          countryInfoEl.innerHTML = "";
          return;
        }
        if (countries.length > 1) {
          const countriesList = countries
            .map(
              country =>
                `<li class="country-list-item"><img src="${country.flags.png}" title="${country.flags.alt}" alt="${country.flags.alt}" width="40"> ${country.name.common}</li>`
            )
            .join("");
          countryListEl.innerHTML = countriesList;
          countryInfoEl.innerHTML = "";
          return;
        }
        if (countries.length === 1) {
          displayCountry(countries[0]);
          countryListEl.innerHTML = "";
          return;
        }
      })
      .catch(error => {
        Notiflix.Notify.failure("Oops, there is no country with that name.");
        countryListEl.innerHTML = "";
        countryInfoEl.innerHTML = "";
      });
  }, DEBOUNCE_DELAY)
);