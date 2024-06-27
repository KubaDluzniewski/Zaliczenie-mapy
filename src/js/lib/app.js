import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster';

export default () => {
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    return;
  }

  const DEFAULT_LATLNG = [54.461917, 17.0476896];
  const DEFAULT_ZOOM = 13;

  const map = L.map(mapEl);
  map.setView(DEFAULT_LATLNG, DEFAULT_ZOOM);

  const layer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
  });
  layer.addTo(map);

  const markers = L.markerClusterGroup();

  const points = Array(10).fill().map((_, i) => `Punkt ${i + 1}`);
  let selectedPoint = null;

  function addPoint(name) {
    points.push(name);
    updatePointsList();
  }

  function updatePointsList() {
    const list = document.getElementById('points-list');
    list.innerHTML = '';
    points.forEach((point, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = point;
      listItem.addEventListener('click', () => {
        selectedPoint = index;
        document.body.style.cursor = 'crosshair';
      });
      list.appendChild(listItem);
    });
  }

  map.on('click', function(e) {
    if (selectedPoint !== null) {
      const marker = L.marker(e.latlng).addTo(map);
      marker.bindPopup(points[selectedPoint]);
      markers.addLayer(marker);
      document.body.style.cursor = '';
      selectedPoint = null;
    }
  });

  map.addLayer(markers);

  const addPointButton = document.getElementById('add-point-button');
  const pointInput = document.getElementById('point-input');
  addPointButton.addEventListener('click', () => {
    const pointName = pointInput.value;
    if (pointName) {
      addPoint(pointName);
      pointInput.value = '';
    }
  });

  updatePointsList();
};