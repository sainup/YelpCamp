


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11// starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({
        offset : 25
    })
    .setHTML(
        `<h2>${campground.title}</h2>
        <p>${campground.location}</p>`
    )
)
.addTo(map)