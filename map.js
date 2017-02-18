var points = [
  {
    Title: 'Hartford',
    Description: 'The Insurance Capital of the World',
    County: 'Hartford',
    Latitude: 41.7637,
    Longitude: -72.6851,
    Population: 12124775,
  },
  {
    Title: 'Bridgeport',
    Description: 'The Park City',
    County: 'Fairfield',
    Latitude: 41.186389,
    Longitude: -73.195556,
    Population: 144229,
  },
  {
    Title: 'New Haven',
    Description: 'The Elm City',
    County: 'New Haven',
    Latitude: 41.31,
    Longitude: -72.923611,
    Population: 129779,
  },
  {
    Title: 'Stamford',
    Description: 'The City That Works',
    County: 'Fairfield',
    Latitude: 41.052778,
    Longitude: -73.538889,
    Population: 122643,
  },
  {
    Title: 'Waterbury',
    Description: 'The Brass City',
    County: 'New Haven',
    Latitude: 41.556111,
    Longitude: -73.041389,
    Population: 110366,
  },
  {
    Title: 'Norwalk',
    Description: 'Oyster Town',
    County: 'Fairfield',
    Latitude: 41.093889,
    Longitude: -73.419722,
    Population: 85603,
  },
  {
    Title: 'Danbury',
    Description: 'The Hat City',
    County: 'Fairfield',
    Latitude: 41.402222,
    Longitude: -73.471111,
    Population: 80893,
  }
];

var columns = ['Title', 'Description', 'County', 'Population', 'Latitude', 'Longitude'];

$(document).ready(function() {
  // Initialize map
  var map = L.map('map', {
    center: [41.79, -72.6],
    zoom: 9,
    scrollWheelZoom: false,
    attributionControl: false
  });

  // Add tile layer
  new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png')
    .addTo(map);

  // Set zoom control position
  map.zoomControl.setPosition('topright');

  // Arrays to store markers
  var markers = [];

  // Generate markers, add them to the array and to the map
  for (i in points) {
    var m = L.marker([points[i].Latitude, points[i].Longitude])
      .bindPopup(points[i].Title)
      .addTo(map);
    markers.push(m);
  }

  // Update table every time the map is moved/zoomed
  map.on('moveend', function(e) {
    updateTable();
  });

  // Clear table data and add only visible markers to it
  function updateTable() {
    var pointsVisible = [];
    for (i in points) {
      if (map.getBounds().contains(L.latLng(points[i].Latitude, points[i].Longitude))) {
        pointsVisible.push(points[i]);
      }
    }

    tableData = pointsToTableData(pointsVisible);

    table.clear();
    table.rows.add(tableData);
    table.draw();
  }

  // Convert Leaflet marker objects into DataTable array
  function pointsToTableData(ms) {
    var data = [];
    for (i in ms) {
      var a = [];
      for (j in columns) {
        a.push(ms[i][columns[j]]);
      }
      data.push(a);
    }
    return data;
  }

  // Transform columns array into array of title objects
  function generateColumnsArray() {
    var c = [];
    for (i in columns) {
      c.push({title: columns[i]});
    }
    return c;
  }

  // Initialize DataTable
  var table = $('#maptable').DataTable({
    paging: false,
    scrollCollapse: true,
    scrollY: 'calc(50vh - 40px)',
    info: false,
    searching: false,
    columns: generateColumnsArray(),
  });

  updateTable();

  // Add credit to the map
  var credit = L.control.attribution({
      prefix: 'View <a href="https://github.com/JackDougherty/leaflet-template-location-menu">code on GitHub</a>',
    })
    .addAttribution('<a href="https://github.com/JackDougherty/datavizforall">DataVizForAll</a>')
    .addAttribution('<a href="http://leafletjs.com">Leaflet</a>')
    .addTo(map);

});
