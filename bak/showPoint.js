//直接通过data.geojson中的coordinates值获取点信息，一个一个点的手动加载-----------start
  function showByPoint(data){

      var starttime =new Date();
      console.log("starttime"+starttime);
      console.log(data);
      var s_geometry = data.geojson.features[0].geometry;
      var s_labelPoint = Terraformer.ArcGIS.convert(data.geojson, {sr:this.map.graphics.wkid})[0];
      var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,new esri.symbol.SimpleLineSymbol("solid", new esri.Color([82, 158, 229, 0.7]), 5),null);            
      var labelPoint = s_geometry.coordinates[0];
      var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
      
      debugger;
      for(var item in labelPoint){
          console.log(labelPoint[item][0], labelPoint[item][1]);                
          var point = new esri.geometry.Point([labelPoint[item][0].toFixed(3), labelPoint[item][1].toFixed(3)], this.map.spatialReference);
          var wmpoint = esri.geometry.webMercatorUtils.geographicToWebMercator(point);
          console.log(point);
          console.log(wmpoint);
          var textSymbol = new esri.symbols.TextSymbol("item: " + item );

          if (!this.EmptyGraphicLayer){
              this.EmptyGraphicLayer = getEmptyGraphicLayer();
          }               
          var grPp = new esri.Graphic(point, markerSymbol);
          var grPt = new esri.Graphic(point, textSymbol);
          
          if (grPp) {
              grPp.visible = true;
              grPt.visible = true;
              this.EmptyGraphicLayer.add(grPp);                    
              this.EmptyGraphicLayer.add(grPt);
              
              this.EmptyGraphicLayer.visible = true;
          }              

      }
      console.log("took", new Date - starttime, "milliseconds")
      console.log(data);

  }
//直接通过data.geojson中的coordinates值获取点信息，一个一个点的手动加载-----------end


//将data.geojson转成arcgis json，添加到一个featureLayer中，再进行加载-----------start
function showByFeature(data){
  // var starttime =new Date();
  // console.log("starttime"+starttime);
  // console.log(data);
  var s_labelPoint = Terraformer.ArcGIS.convert(data.geojson, {sr:this.map.spatialReference.wkid})[0];
  // var fillSymbol = new esri.symbol.SimpleFillSymbol(); 
  // fillSymbol.setColor(new esri.Color([82, 158, 229, 0]));
  // fillSymbol.setOutline(new esri.symbols.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([82, 158, 229, 0.7]), 5)); 
  
  var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,new esri.symbol.SimpleLineSymbol("solid", new esri.Color([82, 158, 229, 0.7]), 5),null);
  if (s_labelPoint) {
      s_labelPoint.visible = true;
      s_labelPoint.type="polygon";
      var t_graphic =new esri.Graphic(s_labelPoint);
      t_graphic.symbol=fillSymbol;
      this.EmptyGraphicLayer.add(t_graphic);
      var centerPoint =t_graphic.geometry.getExtent().getCenter();
      this.map.centerAndZoom(centerPoint,18); 
      var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
      var textSymbol = new esri.symbols.TextSymbol("中心点");
      var grPt = new esri.Graphic(centerPoint, textSymbol);
      var grPm = new esri.Graphic(centerPoint, markerSymbol);							
      
      this.EmptyGraphicLayer.add(grPt); 
      this.EmptyGraphicLayer.add(grPm); 							
      
      this.EmptyGraphicLayer.visible = true;
      this.EmptyGraphicLayer.opacity=0.75;
  }
  // console.log("took", new Date - starttime, "milliseconds");
}
//将data.geojson转成arcgis json，添加到一个featureLayer中，再进行加载-----------end

//混合版，先添加点信息，然后利用data.geojson转成的arcgis json中的rings，添加填充效果-----------start
function showByHybird(data){

    // var starttime =new Date();
    // console.log("starttime"+starttime);
    // console.log(data);
    var s_geometry = data.geojson.features[0].geometry;
    var s_labelPoint = Terraformer.ArcGIS.convert(data.geojson, {sr:this.map.spatialReference.wkid})[0];
    // var fillSymbol = new esri.symbol.SimpleFillSymbol(); 
    // fillSymbol.setColor(new esri.Color([82, 158, 229, 0]));
    // fillSymbol.setOutline(new esri.symbols.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([82, 158, 229, 0.7]), 5));   
    
    var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,new esri.symbol.SimpleLineSymbol("solid", new esri.Color([82, 158, 229, 0.7]), 5),null);    
    var labelPoint = s_geometry.coordinates[0];
    var markerSymbol = new esri.symbol.SimpleMarkerSymbol();

    if (!this.EmptyGraphicLayer){
        this.EmptyGraphicLayer = getEmptyGraphicLayer();
    } else{
        this.EmptyGraphicLayer.clear();							
    } 
    // debugger;            
    for(var item in labelPoint){
        console.log(labelPoint[item][0], labelPoint[item][1]);                
        var point = new esri.geometry.Point([labelPoint[item][0].toFixed(3), labelPoint[item][1].toFixed(3)], this.map.spatialReference);
        var wmpoint = esri.geometry.webMercatorUtils.geographicToWebMercator(point);
        console.log(point);
        console.log(wmpoint);
        var textSymbol = new esri.symbols.TextSymbol("item: " + item );
        
        var grPp = new esri.Graphic(point, markerSymbol);
        var grPt = new esri.Graphic(point, textSymbol);
        
        if (grPp) {
            grPp.visible = true;
            grPt.visible = true;
            this.EmptyGraphicLayer.add(grPp);                    
            this.EmptyGraphicLayer.add(grPt);
            this.EmptyGraphicLayer.visible = true;
        }              

    }
    if (s_labelPoint) {
      s_labelPoint.visible = true;
      s_labelPoint.type="polygon";
      var t_graphic =new esri.Graphic(s_labelPoint);
      t_graphic.symbol=fillSymbol;
      this.EmptyGraphicLayer.add(t_graphic);
      var centerPoint =t_graphic.geometry.getExtent().getCenter();
      this.map.centerAndZoom(centerPoint,18); 
      var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
      var textSymbol = new esri.symbols.TextSymbol("中心点");
      var grPt = new esri.Graphic(centerPoint, textSymbol);
      var grPm = new esri.Graphic(centerPoint, markerSymbol);							
      
      this.EmptyGraphicLayer.add(grPt); 
      this.EmptyGraphicLayer.add(grPm); 							
      
      this.EmptyGraphicLayer.visible = true;
      this.EmptyGraphicLayer.opacity=0.75;
  }
    // console.log("took", new Date - starttime, "milliseconds");
}
//混合版，先添加点信息，然后利用data.geojson转成的arcgis json中的rings，添加填充效果-----------end

function bak(){
      var renderer = new esri.renderers.SimpleRenderer(markerSymbol);            
      this.EmptyGraphicLayer.setRenderer(renderer); 


      var labelPoint = data.geojson.features[0].geometry.coordinates[0];
      var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
      
      debugger;
      for(var item in labelPoint){
        if(item==labelPoint.length-2){
          var tempExtent ={xmin:  labelPoint[0][0], ymin:labelPoint[0][1], xmax:labelPoint[item][0], ymax:  labelPoint[item][1], spatialReference: this.map.spatialReference };
          setMapExtent(tempExtent);  
        }

      }
                                
      this.map.centerAt(point);
      this.map.centerAndZoom(point,10); 
      
      this.map.graphics.spatialReference.wkid
      this.map.spatialReference
}

