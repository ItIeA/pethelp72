const listingsContainer = document.getElementById('listingsContainer');
const searchInput = document.getElementById('searchInput');
const speciesSelect = document.getElementById('speciesSelect');
const searchBtn = document.getElementById('searchBtn');
const datePicker = document.getElementById('datePicker');

const addListingForm = document.getElementById('addListingForm');
const imageUploadInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeBtn = document.querySelector('.close');

let listings = [
    {
        id: 1,
        title: "Пропала Кошка - Пушинка",
        species: "cat",
        breed: "Персидская",
        description: "Пушинка - белая персидская кошка с голубыми глазами. Пропала в районе улицы Главной 26 октября 2023 года.",
        image: "https://placekitten.com/200/200",
        location: [40.7128, -74.0060],
        date: '2023-10-26'
    },
    {
        id: 2,
        title: "Найдена Собака - Дружок",
        species: "dog",
        breed: "Лабрадор",
        description: "Дружелюбный желтый лабрадор был найден возле парка. На нем красный ошейник.",
        image: "https://placedog.net/200/200",
        location: [34.0522, -118.2437],
        date: '2023-10-27'
    },
    {
        id: 3,
        title: "Пропала Птица - Твити",
        species: "bird",
        breed: "Канарейка",
        description: "Твити - ярко-желтая канарейка. Вылетела из клетки 1 ноября 2023 года.",
        image: "https://placebird.com/200/200",
        location: [51.5074, -0.1278],
        date: '2023-11-01'
    },
    {
        id: 4,
        title: "Найдена Кошка - Тень",
        species: "cat",
        breed: "Домашняя короткошерстная",
        description: "Найдена черная домашняя короткошерстная кошка. Очень ласковая, возможно, потерялась",
        image: "https://placekitten.com/201/200",
        location: [50.5074, -0.2278],
        date: '2023-11-03'
    }
];

let map;

function initMap() {
    map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    updateMarkers();
}

initMap();

function updateMarkers() {
    listings.forEach(listing => {
        let marker = L.marker(listing.location).addTo(map);
        marker.bindPopup(`<b>${listing.title}</b><br><button class="marker-btn" data-id="${listing.id}">Смотреть Подробнее</button>`);
    });
     if (listings.length > 0) {
        map.setView([listings[0].location[0], listings[0].location[1]], 10);
    }
}


function renderListings(list) {
    listingsContainer.innerHTML = '';
    list.forEach(listing => {
        const card = document.createElement('div');
        card.classList.add('listing-card');
        let imageContent = `<img src="" alt="${listing.title}">`;

        if (typeof listing.image === 'string' && listing.image.startsWith('data:image')) {
            imageContent = `<img src="" alt="${listing.title}">`;
        } else {
            imageContent = `<img src="" alt="${listing.title}">`;
        }
        card.innerHTML = `
                 ${imageContent}
                    <div class="content">
                        <h3>${listing.title}</h3>
                        <p>Вид: ${listing.species} | Порода: ${listing.breed}</p>
                    </div>
                    <div class="action-buttons">
                     <button data-id="${listing.id}" class="show-modal-btn"><i class="fa-solid fa-eye"></i></button>
                 </div>
                `;
        listingsContainer.appendChild(card);
    });
}

function filterListings() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSpecies = speciesSelect.value;
    const selectedDate = datePicker.value
    let filteredListings = listings.filter(listing => {
        let searchMatch = true;
        if (searchTerm) {
            searchMatch = listing.title.toLowerCase().includes(searchTerm) ||
                listing.description.toLowerCase().includes(searchTerm) ||
                listing.breed.toLowerCase().includes(searchTerm);
        }
        let speciesMatch = !selectedSpecies || listing.species === selectedSpecies;
        let dateMatch = !selectedDate || listing.date === selectedDate;
        return searchMatch && speciesMatch && dateMatch;
    });
    renderListings(filteredListings);
}

function showListingDetails(id) {
    const listing = listings.find(list => list.id === id);

    if (listing) {
        modalContent.innerHTML = `
                <h3>${listing.title}</h3>
                 <img src="" alt="${listing.title}" style="width: 100%; height: auto;">
                 <p>Вид: ${listing.species}</p>
                  <p>Порода: ${listing.breed}</p>
                   <p>Описание: ${listing.description}</p>
              `;
        modal.style.display = 'block';
    }
}

imageUploadInput.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
        previewImage.src = '';
    }
});

addListingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const species = document.getElementById('species').value;
    const breed = document.getElementById('breed').value;
    const description = document.getElementById('description').value;
    const locationStr = document.getElementById('location').value;
     const date = document.getElementById('date').value

    let imageValue = imageUploadInput.files[0];
    if (previewImage.src && previewImage.src.startsWith('data:image')) {
        imageValue = previewImage.src;
    }
        //Geocoding logic
     let geocodedLocation = [0,0]
        if (locationStr) {
          // We can add a geocoding logic here to convert location string into coordinates
              // For now lets just use deault values
            geocodedLocation = [0,0]
        }

    const newListing = {
        id: listings.length + 1,
        title: title,
        species: species,
        breed: breed,
        description: description,
        image: imageValue,
         location: geocodedLocation,
        date: date
    };

    listings.push(newListing);
    renderListings(listings);


   let marker = L.marker(geocodedLocation).addTo(map)
    marker.bindPopup(`<b>${newListing.title}</b><br><button class="marker-btn" data-id="${newListing.id}">Смотреть Подробнее</button>`)
    map.setView([geocodedLocation[0],geocodedLocation[1]],10)


    imageUploadInput.value = '';
    previewImage.src = '';
    previewImage.style.display = 'none';
});

listingsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('show-modal-btn')) {
        const card = e.target.closest('.listing-card');
        const id = parseInt(e.target.getAttribute('data-id'));

        showListingDetails(id);
    }
});

map.on('popupopen', function(e){
    const popup = e.popup
     const container = popup.getElement()
    container.addEventListener('click', function(e){
        if(e.target.classList.contains('marker-btn')){
             const id = parseInt(e.target.getAttribute('data-id'))
             showListingDetails(id)
         }
    })
});


searchBtn.addEventListener('click', filterListings);
searchInput.addEventListener('input', filterListings);
speciesSelect.addEventListener('change', filterListings);
 datePicker.addEventListener('input', filterListings)

closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

window.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

renderListings(listings);