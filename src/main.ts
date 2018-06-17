import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");

const map = new EsriMap({
    basemap: "osm"
});

const view = new MapView({
  container: "viewDiv",
  map,
  scale: 50, // Sets the initial scale to 1:50,000,000
  center: [114.40845006666666, 30.456864444444443] // Sets the center point of view with lon/lat
});