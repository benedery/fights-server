'use strict';

// flights array that are display on the table (change during run time)
let flightsArray = [];

// the origin flights array that was taken from flights.json (doesn't change)
let flightsArrayOrigin = [];

let imageSrc = 'sort-down.png';
const HEAD_NAMES = ['id', 'from', 'to', 'departure', 'arrival', 'by'];

// a function that are send as a parameter to the sort function that defines the sort order
const compareByHeadName = (headName) => {
    return function (a, b) {
        let headNameA = a[headName].toUpperCase();
        let headNameB = b[headName].toUpperCase();
        let comparison = 0;
        if (imageSrc === 'sort-down.png') {
            if (headNameA > headNameB) {
                comparison = 1;
            } else if (headNameA < headNameB) {
                comparison = -1;
            }
        } else if (imageSrc === 'sort-up.png') {
            if (headNameA < headNameB) {
                comparison = 1;
            } else if (headNameA > headNameB) {
                comparison = -1;
            }
        }
        return comparison;
    };
};

const changeImageSource = () => {
    if (imageSrc === 'sort-down.png')
        return 'sort-up.png';
    else if (imageSrc === 'sort-up.png')
        return 'sort-down.png';
};

const setHeadImageSource = () => {
    document.querySelectorAll('img').forEach(img => img.src = imageSrc);
};

const setTableColumnSize = () => {
    let columnSize = 100 / HEAD_NAMES.length;
    columnSize += '%';
    document.querySelectorAll('th').forEach(head => {
        head.style.width = columnSize;
    });
};

const createTableRow = (flight) => {
    let TableRow = ``;
    Object.values(flight).forEach(value => TableRow += `<td>${value}</td>`);
    return `<tr>${TableRow}<tr>`;
};

const createTableBody = (flights) => {
    let TableBody = ``;
    flights.forEach(flight => TableBody += createTableRow(flight));
    document.querySelector('tbody').innerHTML = TableBody;
};

// show all flights that departure between the two dates that the user insert
// the flights data is taken from the origin json file and not necessarily from the table that are currently display
const showFlightsBetweenDates = (from, until) => {
    document.querySelector('tbody').innerHTML = ``;
    let flightsBetweenDates = [];
    flightsArray = [...flightsArrayOrigin];
    flightsArray.forEach(flight => {
        if (flight.departure >= from && flight.departure <= until) {
            flightsBetweenDates = [...flightsBetweenDates, flight];
        }
    });
    flightsArray = [...flightsBetweenDates];
    document.querySelector('tbody').innerHTML = ``;
    createTableBody(flightsBetweenDates);
};

// sort a table Column in ascending or descending order by the table haed name that was clicked
// the sorting is execute on the flights that are currently display on the table
function sortByHead(elemnt) {
    if (flightsArray.length === 0)
        return;

    let headName = HEAD_NAMES[elemnt.id];
    flightsArray.sort(compareByHeadName(headName));
    imageSrc = changeImageSource();
    setHeadImageSource();
    document.querySelector('tbody').innerHTML = ``;
    createTableBody(flightsArray);
}

const showAllflights = () => {
    flightsArray = [];

    fetch('flights.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            flightsArrayOrigin = [...myJson];
            flightsArray = [...myJson];
            setTableColumnSize();
            createTableBody(flightsArray);
        });
};

// show all flights that are from or to, of the searched city
// the flights data is taken from the origin json file and not necessarily from the table that are currently display
const searchFlightByCity = () => {
    let cityName = document.getElementById('searchInput').value;
    cityName = cityName.replace(' ', '-');
    let query = `?search=${cityName}`;
    flightsArray = [];

    fetch('flights.json' + query)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            flightsArray = [...myJson];
            createTableBody(flightsArray);
        });
};

document.getElementById('datesBtn').addEventListener('click', () => {
    let fromDete = document.getElementById('from').value;
    let untilDate = document.getElementById('until').value;
    showFlightsBetweenDates(fromDete, untilDate);
});

document.getElementById('showAllBtn').addEventListener('click', showAllflights);
document.getElementById('searchBtn').addEventListener('click', searchFlightByCity);

showAllflights();