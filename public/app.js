'use strict';
let flightObjectsArray = [];
let imageSrc = 'sort-down.png';
const HEAD_NAMES = ['id', 'from', 'to', 'departure', 'arrival', 'by'];

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
        }
        else if (imageSrc === 'sort-up.png') {
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

const setFlightsBetweenDates = (from, until) => {
    document.querySelector('tbody').innerHTML = ``;
    let flightsBetweenDates = [];
    flightObjectsArray.forEach(flight => {
        if (flight.departure >= from && flight.departure <= until) {
            flightsBetweenDates = [...flightsBetweenDates, flight];
        }
    });
    flightObjectsArray = [...flightsBetweenDates];
    document.querySelector('tbody').innerHTML = ``;
    createTableBody(flightsBetweenDates);
};

function sortByHead(elemnt) {
    if (flightObjectsArray.length === 0)
        return;

    let headName = HEAD_NAMES[elemnt.id];
    flightObjectsArray.sort(compareByHeadName(headName));
    imageSrc = changeImageSource();
    setHeadImageSource();
    document.querySelector('tbody').innerHTML = ``;
    createTableBody(flightObjectsArray);
}

document.getElementById('datesBtn').addEventListener('click', () => {
    let fromDete = document.getElementById('from').value;
    let untilDate = document.getElementById('until').value;
    setFlightsBetweenDates(fromDete, untilDate);
});

const showAllflights = () => {
    flightObjectsArray = [];

    fetch('flights.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            flightObjectsArray = [...myJson];
            setTableColumnSize();
            createTableBody(flightObjectsArray);

        });
};

const searchByCity = () => {
    let cityName = document.getElementById('searchInput').value;
    cityName = cityName.replace(' ', '-');
    let query = `/?search=${cityName}`;
    flightObjectsArray = [];

    fetch('flights.json' + query)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            flightObjectsArray = [...myJson];
            createTableBody(flightObjectsArray);

        });
};

document.getElementById('showAllBtn').addEventListener('click', showAllflights);
document.getElementById('searchBtn').addEventListener('click', searchByCity);

showAllflights();

