import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const countrieList = document.querySelector('.country-list');
const countrieInfoEl = document.querySelector('.country-info');
const searchInput = document.querySelector('#search-box');
const bodyEl = document.querySelector('body');

bodyEl.style.backgroundImage = 'radial-gradient( circle 610px at 5.2% 51.6%,  rgba(3,4,90,1) 0%, rgba(2,3,45,1) 97.5% )';
countrieList.style.visibility = 'hidden';
countrieInfoEl.style.visibility = 'hidden';


searchInput.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
const inputValue = searchInput.value.trim();
console.log(inputValue);

if(!inputValue) {
    addClassHidden();
    clearInterface();
    return;
}
 fetchCountries(inputValue)
 .then(data => {
    if( data.length > 10 ) {
        Notify.info(
            'Too many matches found. Please enter a more specific name.'
        );
    }
    renderCountries(data);
 })
 .catch(error => {
    clearInterface();
    Notify.failure('Oops, there is no country with that name(')
 });
}

const createMarkupCountryInfo = data =>
  data.reduce(
    (acc, { flags: { svg }, name, capital, population, languages }) => {
      console.log(languages);
      languages = Object.values(languages).join(', ');
      console.log(name);
      return (
        acc +
        ` <img src="${svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`
      );
    },
    ''
  );

const generateMarkupCountryList = (data) => data.reduce((acc, { name: {official, common}, flags: {svg} }) => {
    return (
        acc +
        `<li>
        <img src="${svg}" alt="${common}" width="70">
        <span>${official}</span>
        </li>`
    );
}, '');


function renderCountries (result) {
    if ( result.length === 1 ) {
        countrieList.innerHTML = '';
        countrieList.style.visibility = 'hidden';
        countrieInfoEl.style.visibility = 'visible';
        countrieInfoEl.innerHTML = createMarkupCountryInfo(result);
    }
    if(result.length >= 2 && result.length <= 10) {
        countrieInfoEl.innerHTML = '';
        countrieInfoEl.style.visibility = 'hidden';
        countrieList.style.visibility = 'visible';
        countrieList.innerHTML = generateMarkupCountryList(result);
    }
}

function clearInterface () {
    countrieList.innerHTML = '';
    countrieInfoEl.innerHTML = '';
}

function addClassHidden () {
    countrieList.style.visibility = 'hidden';
    countrieInfoEl.style.visibility = 'hidden';

}