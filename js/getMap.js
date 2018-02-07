
var getWebJsonObj = function (map) {
    var obj = {};
    obj.mapOptions = {};
    obj.mapOptions.showAttribution = map.showAttribution;
    obj.mapOptions.extent = map.extent;
    obj.mapOptions.spatialReference = map.spatialReference;
    obj.scale = map.getScale();
    obj.exportOptions = {};
    obj.exportOptions.outputSize = [$(window).width(), $(window).height()];
    obj.exportOptions.dpi = 96;
    obj.layoutOptions = {};
    obj.layoutOptions.authorText = "";
    obj.layoutOptions.copyrightText = "";
    obj.layoutOptions.scaleBarOptions = {};
    obj.layoutOptions.legendOptions = {};
    obj.layoutOptions.legendOptions.operationalLayers = [];
    obj.operationalLayers = [];
    
    
    for (var i = 0; i < map.layerIds.length; i++) {
        var layer = map.getLayer(map.layerIds[i]);
    //  var urls = layer.url.split("/");
        // urls[2] = "localhost";
        var newUrl = layer.url;//.replace;
        
        var layerObj = {};
        layerObj.url = newUrl;
        layerObj.id = layer.id;
        layerObj.title = layer.id;
        layerObj.opacity = 1;
        layerObj.minScale = layer.minScale;
        layerObj.maxScale = layer.maxScale;
        obj.operationalLayers.push(layerObj);

        var ids = [];
        for (var k = 0; k < layer.layerInfos.length; k++) {
            ids.push(layer.layerInfos[k].id);
        }
        // var layerInfo = layer.layerInfos.subLayerIds;
        var subLayer = { id: layer.id, subLayerIds: ids };
        
        obj.layoutOptions.legendOptions.operationalLayers.push(subLayer);
                        // var httpIndex = layer.url.indexOf("http://");
        //var httpUrl = layer.url.substring(httpIndex, layer.url.length - layer.url);
    }

    for (var i = 0; i < map.graphicsLayerIds.length; i++) {
        var layer = map.getLayer(map.graphicsLayerIds[i]);
        var layerObj = {};
        layerObj.id = layer.id;
        layerObj.opacity = 1;
        layerObj.minScale = layer.minScale;
        layerObj.maxScale = layer.maxScale;
        layerObj.featureCollection = {};
        layerObj.featureCollection.layers = getFeatureCollection(layer);
        obj.operationalLayers.push(layerObj);

        var subLayer = { id: layer.id };
        obj.layoutOptions.legendOptions.operationalLayers.push(subLayer);
    }

    for (var i = 0; i < map.graphics.graphics.length; i++) {
        var layerObj = {};
        layerObj.id = "map_graphics";
        layerObj.opacity = 1;
        layerObj.minScale = 0;
        layerObj.maxScale = 0;
        layerObj.featureCollection = {};
        var g = map.graphics;
        layerObj.featureCollection.layers = getFeatureCollection(g);
        obj.operationalLayers.push(layerObj);
    }
    return obj;
}

function getFeatureCollection(layer) {
    var layers = [];
    var polygonObj = {};
    polygonObj.layerDefinition = {};

    polygonObj.layerDefinition.name = "polygonLayer";
    polygonObj.layerDefinition.geometryType = "esriGeometryPolygon";
    polygonObj.featureSet = {};
    polygonObj.featureSet.geometryType = "esriGeometryPolygon";
    polygonObj.featureSet.features = [];
    var polylineObj = {};
    polylineObj.layerDefinition = {};
    polylineObj.layerDefinition.name = "polylineLayer";
    polylineObj.layerDefinition.geometryType = "esriGeometryPolyline";
    polylineObj.featureSet = {};
    polylineObj.featureSet.geometryType = "esriGeometryPolyline";
    polylineObj.featureSet.features = [];

    var pointObj = {};
    pointObj.layerDefinition = {};
    pointObj.layerDefinition.name = "textLayer";
    pointObj.layerDefinition.geometryType = "esriGeometryPoint";
    pointObj.featureSet = {};
    pointObj.featureSet.geometryType = "esriGeometryPoint";
    pointObj.featureSet.features = [];

    var extentObj = {};
    extentObj.layerDefinition = {};
    extentObj.layerDefinition.name = "extentLayer";
    extentObj.layerDefinition.geometryType = "esriGeometryExtent";
    extentObj.featureSet = {};
    extentObj.featureSet.geometryType = "esriGeometryExtent";
    extentObj.featureSet.features = [];
    for (var i = 0; i < layer.graphics.length; i++) {
        var geometry = layer.graphics[i].geometry;

        var geometryObj = {};
        geometryObj.geometry = {};
        geometryObj.geometry.spatialReference = geometry.spatialReference;
        geometryObj.symbol = layer.graphics[i].symbol;
        var bgR = geometryObj.symbol.color.r == null ? geometryObj.symbol.color[0] : geometryObj.symbol.color.r;
        var bgG = geometryObj.symbol.color.g == null ? geometryObj.symbol.color[1] : geometryObj.symbol.color.g;
        var bgB = geometryObj.symbol.color.b == null ? geometryObj.symbol.color[2] : geometryObj.symbol.color.b;
        var bgA = geometryObj.symbol.color.a == null ? geometryObj.symbol.color[3] : geometryObj.symbol.color.a * 255;
        var styleType = "esriSLSSolid"; //geometryObj.symbol.style;
        if (geometryObj.symbol.style == "dot" || (geometryObj.symbol.outline != null && geometryObj.symbol.outline.style == "dot")) {
            styleType = "esriSLSDot";
        } 
        else if (geometryObj.symbol.style != null && (geometryObj.symbol.style.indexOf("dash") > -1 || (geometryObj.symbol.outline != null && geometryObj.symbol.outline.style.indexOf("dash") > -1))) {
            styleType = "esriSLSDash";
        }

        // styleType ="esriSLS" + styleType.charAt(0).toUpperCase() + styleType.slice(1);
        var color = [bgR, bgG, bgB, bgA]
        if (geometry.type == "polygon") {
            geometryObj.symbol.style = "esriSFSNull";
            geometryObj.symbol.type = "esriSFS";

            geometryObj.symbol.color = color;//[255, 0, 0, 255];
            geometryObj.symbol.outline.color = color;//[255, 0, 0, 255];
            geometryObj.symbol.outline.style = styleType;//"esriSLSSolid";
            geometryObj.symbol.outline.type = "esriSLS";
            if (layer.id == "bufferGraphics") {
                geometryObj.symbol.style = "esriSFSSolid";
                geometryObj.symbol.type = "esriSFS";
                geometryObj.symbol.color = color;//[255, 0, 0, 89];
            }
            geometryObj.geometry.attributes = { "buffer": true };
            geometryObj.geometry.rings = geometry.rings;
            polygonObj.featureSet.features.push(geometryObj);
        } else if (geometry.type == "polyline") {
            geometryObj.symbol.color = color;//[255, 0, 0, 255];
            geometryObj.symbol.style = styleType;//"esriSLSSolid";
            geometryObj.symbol.type = "esriSLS";
            geometryObj.geometry.attributes = { "buffer": true };
            geometryObj.geometry.paths = geometry.paths;
            polylineObj.featureSet.features.push(geometryObj);
        } else if (geometry.type == "point") {
            geometryObj.symbol.type = "esriTS";
            geometryObj.symbol.color = color;//[128, 0, 0, 255];
            geometryObj.symbol.font.size = geometryObj.symbol.font.size;
            geometryObj.symbol.font.style = "normal";
            geometryObj.symbol.font.variant = "normal";
            geometryObj.symbol.font.weight = "normal";
            geometryObj.symbol.font.family = "serif";
            geometryObj.geometry = { x: geometry.x ,y:geometry.y};
            pointObj.featureSet.features.push(geometryObj);
        } else if (geometry.type == "extent") {
            geometryObj.symbol.style = "esriSFSNull";
            geometryObj.symbol.type = "esriSFS";

            geometryObj.symbol.color = color; //[255, 0, 0, 255];
            geometryObj.symbol.outline.color = color;//[255, 0, 0, 255];
            geometryObj.symbol.outline.style = styleType;// "esriSLSSolid";
            geometryObj.symbol.outline.type = "esriSLS";

            geometryObj.geometry.attributes = { "buffer": true };
            geometryObj.geometry.rings = extentToPolygon(geometry);
            polygonObj.featureSet.features.push(geometryObj);
        }
    }
    if (polygonObj.featureSet.features.length > 0) {
        layers.push(polygonObj);
    }
    if (polylineObj.featureSet.features.length > 0) {
        layers.push(polylineObj);
    }
    if (pointObj.featureSet.features.length > 0) {
        layers.push(pointObj);
    }
    return layers;
}

function extentToPolygon(extent) {
    var rings = [];
    rings.push([extent.xmin, extent.ymin]);
    rings.push([extent.xmin, extent.ymax]);
    rings.push([extent.xmax, extent.ymax]);
    rings.push([extent.xmax, extent.ymin]);
    rings.push([extent.xmin, extent.ymin]);
    return [rings];
}