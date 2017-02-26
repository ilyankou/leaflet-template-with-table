$(document).ready(function() {

  $.get('data.csv', function(csv) {

    // Transform csv into an array of objects
    var points = $.csv.toObjects(csv, {
      onParseValue: function(value, state) {
        return value.trim();
      }
    });

    var columns = ['Title', 'Description', 'County', 'Population', 'Latitude', 'Longitude'];

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
    map.zoomControl.setPosition('topleft');

    // Arrays to store markers
    var markers = [];

    // Generate markers, add them to the array and to the map
    for (i in points) {
      var m = L.marker([parseFloat(points[i].Latitude), parseFloat(points[i].Longitude)]);

      if (points[i].Title) {
        m.bindPopup(makePopup(points[i]));
      }

      markers.push(m);
      m.addTo(map);
    }

    function makePopup(p) {
      popup = '<p><b>' + points[i].Title + '</b>'
      if (points[i].Description) {
        popup += '<br>' + points[i].Description + '</p>';
      } else {
        popup += '</p>';
      }
      return popup;
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

    // Add Mapzen search
    L.control.geocoder('mapzen-VBmxRzC', {
      position: 'topright',
      autocomplete: true,
      focus: true,  // prioritize results near center of map
      expanded: false,
    }).addTo(map);

  });
  
});
