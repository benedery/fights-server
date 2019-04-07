'use strict';
let flightObjectsArray = [];
let imageSrc = 'sort-down.png';

class Flight {
    constructor(flightId, from, to, departure, arrival, by) {
        this.flightId = flightId;
        this.from = from;
        this.to = to;
        this.departure = departure;
        this.arrival = arrival;
        this.by = by;
    }
}

const createFlightObject = (flight) => {
    return new Flight(flight.id, flight.from, flight.to, flight.departure, flight.arrival, flight.by);
};

const createFlightsObjectsArray = (flights) => {
    flights.forEach(flight => flightObjectsArray = [...flightObjectsArray, createFlightObject(flight)]);
};

const compareByHeadName = (headName) => {
    return function (a, b) {
        let headNameA = a[headName];
        let headNameB = b[headName];
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

const createTableHead = (flight) => {
    let TableHead = ``;
    let numOfHeadNames = Object.getOwnPropertyNames(flight).length;
    Object.getOwnPropertyNames(flight).forEach((name, index) => {
        TableHead +=
            `<th scope="col" width: "${100 / numOfHeadNames}%";>
                ${name.toUpperCase()}
                <button id=${index} class="headBtn" onClick="sortByHead(this)">
                    <img src=${imageSrc}>
                </button>
            </th>`;
    });
    document.querySelector('thead').innerHTML = `<tr>${TableHead}<tr>`;
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

    let headName = Object.getOwnPropertyNames(flightObjectsArray[0])[elemnt.id];
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
    document.querySelector('thead').innerHTML = ``;
    flightObjectsArray = [];

    fetch('flights.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            createFlightsObjectsArray(myJson);
            createTableHead(flightObjectsArray[0]);
            createTableBody(flightObjectsArray);

        });
};

document.getElementById('showAll').addEventListener('click', showAllflights);

showAllflights();

