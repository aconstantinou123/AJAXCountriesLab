var makeRequest = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', callback);
    request.send();
}

var populateList = function (countries) {
    var countryList = document.getElementById('country-list');
    countries.forEach(function (country) {
        var option = document.createElement('option');
        option.innerText = country.name;
        countryList.appendChild(option);
    })
}

var displayCountryInfo = function(country){
    var div = document.getElementById('border-countries');
    div.innerText = '';
    country[0].borders.forEach(function (borderCountry) {
        var url = 'https://restcountries.eu/rest/v2/alpha/' + borderCountry;
        makeRequest(url, findBorderCountry);
    })
    var ul = document.getElementById('selected-country');
    var liName = document.createElement('li');
    var liCapital = document.createElement('li');
    var liPopulation = document.createElement('li');
    liName.innerText = 'Country: ' + country[0].name;
    liCapital.innerText = 'Capital: ' + country[0].capital;
    liPopulation.innerText = 'Population: ' + country[0].population;
    ul.innerText = '';
    ul.appendChild(liName);
    ul.appendChild(liCapital);
    ul.appendChild(liPopulation);

    var jsonString = JSON.stringify(country);
    localStorage.setItem('country', jsonString);
}

var displayBorderCountryInfo = function(country){
    console.log(country);
    var div = document.getElementById('border-countries');
    var ul = document.createElement('ul')
    var liName = document.createElement('li');
    var liCapital = document.createElement('li');
    var liPopulation = document.createElement('li');
    liName.innerText = 'Country: ' + country.name;
    liCapital.innerText = 'Capital: ' + country.capital;
    liPopulation.innerText = 'Population: ' + country.population;
    ul.innerText = '';
    ul.appendChild(liName);
    ul.appendChild(liCapital);
    ul.appendChild(liPopulation);
    div.appendChild(ul);
}

var handleElementSelected = function () {
    var url = 'https://restcountries.eu/rest/v2/name/' + this.value;
    makeRequest(url, findCountry)
}

var findCountry = function () {
    if (this.status !== 200){
        return;
    }
    var jsonString = this.responseText;
    var country = JSON.parse(jsonString);
    displayCountryInfo(country);
}

var findBorderCountry = function () {
    if (this.status !== 200){
        return;
    }
    var jsonString = this.responseText;
    var country = JSON.parse(jsonString);
    displayBorderCountryInfo(country);
}


var requestComplete = function () {
    if (this.status !== 200){
        return;
    }
    var jsonString = this.responseText;
    var countries = JSON.parse(jsonString);
    populateList(countries);
}

var app = function(){
    var url = 'https://restcountries.eu/rest/v2'
    makeRequest(url, requestComplete);
    var select = document.querySelector('select');
    select.addEventListener('change', handleElementSelected);

    var jsonString = localStorage.getItem('country');
    var savedCountry = JSON.parse(jsonString);
    if(!savedCountry) return;
    displayCountryInfo(savedCountry);

}

window.addEventListener('load', app);