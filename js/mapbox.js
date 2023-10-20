mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxoYW5uYW5mYXJvb3EiLCJhIjoiY2tmNWR0N3E1MDBsNzJ6cjRrZGJoOWUyYyJ9.OIZQYenguF7IXxdLTuaLuw';

/**
* Add the map to the page
*/
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-77.034084142948, 38.909671288923],
    zoom: 13,
    scrollZoom: false
});

const stores = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-77.034084142948, 38.909671288923]
            },
            'properties': {
                'id': '1',
                'image': './assets/images/team/1.jpg',
                'fullname': 'Abdul hannan',
                'address': 'Washington DC',
            }
        }
    ]
};

/**
* Assign a unique id to each store. You'll use this `id`
* later to associate each point on the map with a listing
* in the sidebar.
*/
stores.features.forEach((store, i) => {
    store.properties.id = i;
});

/**
* Wait until the map loads to make changes to the map.
*/
map.on('load', () => {
    /**
    * This is where your '.addLayer()' used to be, instead
    * add only the source without styling a layer
    */
    map.addSource('places', {
        'type': 'geojson',
        'data': stores
    });

    /**
    * Add all the things to the page:
    * - The location listings on the side of the page
    * - The markers onto the map
    */
    buildLocationList(stores);
    addMarkers();
});

/**
* Add a marker to the map for every store listing.
**/
function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stores.features) {
        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker.properties.id}`;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
        * Create a marker using the div element
        * defined above and add it to the map.
        **/
        new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        /**
        * Listen to the element and when it is clicked, do three things:
        * 1. Fly to the point
        * 2. Close all other popups and display popup for clicked store
        * 3. Highlight listing in sidebar (and remove highlight for all other listings)
        **/
        el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker.properties.id}`
            );
            listing.classList.add('active');
        });
    }
}

/**
* Add a listing for each store to the sidebar.
**/
function buildLocationList(stores) {
    for (const store of stores.features) {
        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');

        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = `listing-${store.properties.id}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${store.properties.id}`;
        link.innerHTML = `${store.properties.address}`;

        /* Add details to the individual listing. */
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${store.properties.city}`;
        if (store.properties.phone) {
            details.innerHTML += ` &middot; ${store.properties.phoneFormatted}`;
        }

        /**
        * Listen to the element and when it is clicked, do four things:
        * 1. Update the `currentFeature` to the store associated with the clicked link
        * 2. Fly to the point
        * 3. Close all other popups and display popup for clicked store
        * 4. Highlight listing in sidebar (and remove highlight for all other listings)
        **/
        link.addEventListener('click', function () {
            for (const feature of stores.features) {
                if (this.id === `link-${feature.properties.id}`) {
                    flyToStore(feature);
                    createPopUp(feature);
                }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });
    }
}


/**
* Use Mapbox GL JS's `flyTo` to move the camera smoothly
* a given center point.
**/
function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
    });
}

/**
* Create a Mapbox GL JS `Popup`.
**/

function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(`
        <div class="map-card">
        <a class="card-header">
            <div class="author-image">
                <img src="${currentFeature.properties.image}" alt="" class="image">
            </div>
            <h4 class="author-name">${currentFeature.properties.fullname}</h4>
            <p class="author-address">
                <span class="icon bx bx-map"></span>
                <span class="text">${currentFeature.properties.address}</span>
            </p>
        </a>
        <div class="card-body">
            <a href="" class="btn btn-profile"><span class="icon bx bx-show"></span> Visit</a>
            <a href="" class="btn btn-location"><span class="icon bx bx-map"></span>Location</a>
        </div>
    </div>
        `
        )
        .addTo(map);
}