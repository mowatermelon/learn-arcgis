dojo.declare("Widget.OverlayfileMsg", null, {
    title: "叠加外部数据",
    divID: "LoadDiv",
    btnLoad: "btnLoadFileByName",
    btnFileLoad: "btnLoadFile",
    spanFileLoad:"spanFileLoad",
    formFile:"fileForm",    
    ConfigTool: null,
    map: null,
    opened: false,
    graphicLayer: null,
    floatPanel: null,
    floatPanelHeight: 128,
    floatPanelWith: 288,
    qryTemplate: "",
    adjust: 12,
    highlightSymbol: null,
    EmptyGraphicLayer: null, //空白图层
    handleMapOnClickHandle: null,
    constructor: function (param) {
        dojo.require("esri/symbols/PictureMarkerSymbol");
        dojo.require("dojo.io.iframe");
        dojo.require("dojo/_base/json");

        this.map = getMap();
        this.ConfigTool = getConfigTool();
        this.qryTemplate = this.CreateQryTemplate();
        this.EmptyGraphicLayer = getEmptyGraphicLayer();
        highlightSymbol = new esri.symbol.PictureMarkerSymbol("images/img/shadow.png", 21, 25);
    },
    CreateQryTemplate: function () {
        var arrHTML = [];
        var dataHTML = this.dataTemplate();
        arrHTML.push('<form id="fileForm" enctype="multipart/form-data" method="post"> ');        
        arrHTML.push('<div style="display:block; text-align:center;  width:100%; height:90%;  ">');
        arrHTML.push(' <table  cellpadding="0px" cellspacing="0px" style="width:90%;  height:100%; border:0px;margin:auto;margin-top:10px;" >');
        arrHTML.push('<tr style=" width:100%; height:20%; ">');
        if (dataHTML.length < 1) {
            arrHTML.push(' <td class="titleSHARP">');
            arrHTML.push('   <span style="vertical-align:top">上传文件类型：Sharp文件</span>');
            arrHTML.push('</td> ');
        } else if (dataHTML.length == 1) {
            arrHTML.push(' <td class="title' + dataHTML[0].ID + '">');
            arrHTML.push('   <span style="vertical-align:top">上传文件类型：' + dataHTML[0].CONTENT + '文件</span>');
            arrHTML.push('</td> ');
        } else if (dataHTML.length > 1) {
            for (var i = 0; i < dataHTML.length; i++) {
                arrHTML.push(' <td class="title' + dataHTML[i].ID + '">');
                arrHTML.push('   <input type="radio" value="' + dataHTML[i].ID + '"  name="' + dataHTML[i].CONTENT + '" class="radio' + dataHTML[i].CONTENT + '"><span style="vertical-align:top">' + dataHTML[i].CONTENT + '文件</span>');
                arrHTML.push('</td> ');
            }
        }
        arrHTML.push('</tr>');
        arrHTML.push('<tr  style=" width:100%; height:20%; ">');
        arrHTML.push(' <td colspan="' + (dataHTML.length-1) + '">');
        arrHTML.push('  <span id ="spanFileLoad">未选择任何文件</span>');								
        arrHTML.push(' </td> ');
        arrHTML.push(' <td>');
        arrHTML.push('   <div style=" height:100%;  width:100%; text-align:right ;">');			
        arrHTML.push('  <a class="l-button" id="addfile"  style="position: relative;display:inline-block;margin:0 auto;line-height: 24px;text-align: center;"><span>选择文件</span><input type="file" name="fileUp" id ="btnLoadFile" style="position: absolute;right: 0;top: 0;opacity: 0;width: 100%;cursor: pointer;text-indent: -2em;"/></a>');      
        arrHTML.push('  </div>');				
        arrHTML.push(' </td> ');        
        arrHTML.push('</tr>');
        arrHTML.push('<tr  style=" width:100%; height:20%; ">');
        arrHTML.push(' <td   colspan="' + dataHTML.length + '">');
        arrHTML.push('   <div style=" height:100%;  width:100%; text-align:right ; margin-top: 1em;">');				
        arrHTML.push('  <input  type="button" id ="btnLoadFileByName"  value="文件叠加" class="l-button"  />');			
        arrHTML.push('  </div>');
        arrHTML.push(' </td> ');				
		arrHTML.push('</tr>');				
        arrHTML.push('</table>');
        arrHTML.push('</div>');
        arrHTML.push('</form>');
        
        return arrHTML.join("");
    },
    startup: function () {

    },
    adjustFloatPanelTitle: function (adjust) {
        if (this.floatPanel && this.floatPanel.domNode.style.width) {
            this.floatPanel.focusNode.style.width = (parseInt(this.floatPanel.domNode.style.width.replace("px", "")) - adjust) + "px";
        }
    },
    LocByXY: function () {
        if (this.map && this.opened) {
            var oX = dojo.query("a.odd");
            var oY = dojo.byId("txtYPos");
            if (oX && oY) {
                if (!this.EmptyGraphicLayer)
                    this.EmptyGraphicLayer = getEmptyGraphicLayer();
                else
                    this.EmptyGraphicLayer.clear();
                if (this.EmptyGraphicLayer) {
                    var ptSel = new esri.geometry.Point([oX.value, oY.value], this.map.spatialReference);
                    var grPt = new esri.Graphic(ptSel, highlightSymbol);
                    grPt.visible = true;
                    this.EmptyGraphicLayer.add(grPt);
                    this.EmptyGraphicLayer.visible = true;
                    this.map.centerAt(ptSel);
                }
            }
        }
    },
    checkFileType: function () {
        //debugger;
        if (this.map && this.opened) {
            var fileType;
            var dataHTML = this.dataTemplate();
            var fileTypeL = dataHTML.length;
            if (fileTypeL == 0) {
                fileType = "SHARP";
            } else if (fileTypeL == 1) {
                fileType = dataHTML[0].ID;
            } else if (fileTypeL > 1) {
                fileType = dojo.query("input[type='radio']::checked").attr("value");
            }
            if (fileType.length > 0) {
                fileType = fileType.toString();
                var fileObj = dojo.query("input[type='file']");
                var filePath = fileObj.attr("value");
                filePath = filePath.toString();
                if (filePath.length > 0) {
                    // debugger;
                    this.addFile(fileType, filePath);
                } else {
                    showMessage("必须要选择一个文件");
                }
            } else {
                showMessage("必须要选择一个文件类型");
            }

        }

    },
    dataTemplate: function () {
        var jsonHTML =
                [
                    { ID: 'SHARP', 'CONTENT': 'Shape' },
                    { ID: 'CAD', 'CONTENT': 'CAD' },
                    { ID: 'TXT', 'CONTENT': 'TXT' }
                ];
        return jsonHTML;
    },
    checkRadio: function (obj) {
        //保证单选按钮的唯一性
        dojo.query(".radio" + obj.srcElement.name).parent().siblings().children().attr("checked", false);
    },
    addFile: function (fileType, filePath) {
        //var filePath = dojo.byId(this.btnFileLoad).attr("value");
        var isRight = false;
        switch (fileType) {
            case "SHARP":
                if (filePath.toLowerCase().indexOf(".shp") == -1 && filePath.toLowerCase().indexOf(".dwg") == -1) {
                    showMessage("上传文件类型不属于Sharp文件！请重新选择");
                }else{
                    isRight = true;  
                }      //判断Shape文件
                break;
            case "CAD":
                if (filePath.toLowerCase().indexOf(".dwg") == -1 && filePath.toLowerCase().indexOf(".dwt") == -1) {
                    showMessage("上传文件类型不属于CAD文件！请重新选择");
                }else{
                    isRight = true;  
                }//判断CAD文件
                break;
            case "TXT":
                if (filePath.toLowerCase().indexOf(".txt") == -1) {
                    showMessage("上传文件类型不属于TXT文件！请重新选择");
                }else{
                    isRight = true;  
                }      //判断TXT文件
                break;
            default:
                if (filePath.toLowerCase().indexOf(".shp") == -1 && filePath.toLowerCase().indexOf(".dwg") == -1) {
                    showMessage("上传文件类型不属于Sharp文件！请重新选择");
                }else{
                    isRight = true;  
                }      //判断Shape文件
                break;
        }
        if(isRight){
            this.setSubmit(fileType);
        }
    },
    readFile: function (fileType, fileExt) {
        //var filePath = dojo.byId(this.btnFileLoad).attr("value");
        var isRight = false;
        debugger;
        switch (fileType) {
            case "SHARP":
                this.readSharp(fileExt);      //加载Shape文件
                break;
            case "CAD":
                this.readCAD(fileExt);      //加载CAD文件
                break;
            case "TXT":
                this.readTXT(fileExt);      //加载TXT文件
                break;
            default:
                this.readSharp(fileExt);      //加载Shape文件
                break;
        }
        if(isRight){
            this.setSubmit(fileType);
        }
    },    
    readSharp: function (fileExt) {
        // var base = 'UpLoad/demo1.zip';
        this.map.graphics.clear();
        var base = 'UpLoad/demo'+fileExt;
        debugger;    
        // shp(base).then(function (data) {
        //     console.log(data);
        //     this.map.addLayer(data);
        // });

        shapefile = new Shapefile({
            shp: base,
            jsRoot:'javascript/fileStream/'
        }, function (data) {
            var starttime =new Date();
            console.log("starttime"+starttime);
            console.log(data);

            // var features = data.geojson.features;
            // console.log(features);
            // if (features.length>0) {
            //     for (var i = 0; i < features.length; i++) {
            //         var symbol = new esri.symbol.PictureMarkerSymbol("images/img/shadow.png", 21, 25);
            //         var polygonSymbol = new esri.symbols.SimpleFillSymbol(
            //             "solid",  
            //             new esri.symbols.SimpleLineSymbol("solid", new esri.Color([232,104,80]), 2),
            //             new esri.Color([232,104,80,0.25])
            //         );
            //         console.log(this.map.spatialReference);
            //         debugger;
            //         var mappoint = new esri.geometry.Point(features[i].geometry.coordinates[0], features[i].geometry.coordinates[1], this.map.spatialReference);
            //         // var markerSymbol = new esri.symbol.SimpleMarkerSymbol();                     
            //         var baseGraphic = new esri.Graphic(mappoint,polygonSymbol);
            //         if (!this.EmptyGraphicLayer){
            //             this.EmptyGraphicLayer = getEmptyGraphicLayer();
            //         }               
            //         if (baseGraphic) {
            //             baseGraphic.visible = true;
            //             this.EmptyGraphicLayer.add(baseGraphic);
            //             this.EmptyGraphicLayer.visible = true;
            //         } 
            //         // this.map.graphics.add(baseGraphic);
            //         // this.map.centerAt(mappoint);
            //     }
            // }

            // var resJson = dojo.toJson(data.geojson, false);
            // resJson = JSON.parse(resJson);
            // console.log(resJson);
            var s_geometry = data.geojson.features[0].geometry;
            var s_labelPoint = Terraformer.ArcGIS.convert(data.geojson, {sr:this.map.spatialReference.wkid})[0];
            var polygonSymbol = new esri.symbols.SimpleFillSymbol(
                "solid",  
                new esri.symbols.SimpleLineSymbol("solid", new esri.Color([232,104,80]), 2),
                new esri.Color([232,104,80,0.25])
            ); 
            // s_labelPoint.visible = true;
            debugger;
            if (!this.EmptyGraphicLayer){
                this.EmptyGraphicLayer = getEmptyGraphicLayer();
            }               
            // var grPt = new esri.Graphic(s_labelPoint,polygonSymbol);
            if (s_labelPoint) {
                s_labelPoint.symbol =polygonSymbol;            
                s_labelPoint.visible = true;
                this.EmptyGraphicLayer.add(s_labelPoint);
                this.EmptyGraphicLayer.visible = true;
            } 
            // var orangeRed = new Color([238, 69, 0, 0.5]); // hex is #ff4500
            // var marker = new esri.symbols.SimpleMarkerSymbol("solid", 15, null, orangeRed);
            // var renderer = new esri.renderers.SimpleRenderer(marker);

            // var sls = new esri.symbols.SimpleLineSymbol("solid", new Color("#444444"), 3);
            // var sfs = new esri.symbols.SimpleFillSymbol("solid", sls, new Color([68, 68, 68, 0.25]));
            // debugger;
            // for(var i=0;i<s_labelPoint.rings.length;i++){  
            //     var feature = s_labelPoint.rings[i];  
            //     feature.symbol = {"color":[0,0,255,200],  
            //         "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSCircle",  
            //         "outline":{"color":[0,0,0,255],"width":1,"type":"esriSLS","style":"esriSLSSolid"}};  
            //     // var graphic  = new Graphic(feature);  
            //     if (!this.EmptyGraphicLayer){
            //         this.EmptyGraphicLayer = getEmptyGraphicLayer();
            //     }               
            //     var grPt = new esri.Graphic(feature);
            //     if (grPt) {
            //         grPt.visible = true;
            //         this.EmptyGraphicLayer.add(grPt);
            //         this.EmptyGraphicLayer.visible = true;
            //     } 

            //     // if(i==labelPoint.length-1){
            //     //     debugger;
            //     //     this.map.centerAt(wmpoint);
            //     //     // this.map.centerAndZoom(wmpoint,15);
            //     // }                  
            //     // gLayer.add(graphic);  
            // } 
            
            // for(var item in labelPoint){
            //     console.log(labelPoint[item][0], labelPoint[item][1]);                
            //     var point = new esri.geometry.Point([labelPoint[item][0].toFixed(3), labelPoint[item][1].toFixed(3)], this.map.spatialReference);
            //     var wmpoint = esri.geometry.geographicToWebMercator(point);
            //     // var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
            //     var polygonSymbol = new esri.symbols.SimpleFillSymbol(
            //         "solid",  
            //         new esri.symbols.SimpleLineSymbol("solid", new esri.Color([232,104,80]), 2),
            //         new esri.Color([232,104,80,0.25])
            //     ); 
            //     // var symbol = new esri.symbol.PictureMarkerSymbol("images/img/shadow.png", 21, 25);
            //     // var highlightSymbol = new esri.symbol.PictureMarkerSymbol("images/img/marker-green.png", 21, 25);
            //     // highlightSymbol
            //     if (!this.EmptyGraphicLayer){
            //         this.EmptyGraphicLayer = getEmptyGraphicLayer();
            //     }               
            //     var grPt = new esri.Graphic(wmpoint, polygonSymbol);
            //     if (grPt) {
            //         grPt.visible = true;
            //         this.EmptyGraphicLayer.add(grPt);
            //         this.EmptyGraphicLayer.visible = true;
            //     } 

            //     if(item==labelPoint.length-1){
            //         debugger;
            //         this.map.centerAt(wmpoint);
            //         // this.map.centerAndZoom(wmpoint,15);
            //     }                    
            //     // myMap.graphics.add(graphic);

            // }
            // var gLayer = new esri.layers.GraphicsLayer();
            // var jsonf = geoJsonConverter(); 
            // var jsonR = jsonf.toEsri(resJson);  
            // var features = jsonR.features; 
            // console.log(features);
            // for(var i=0;i<features.length;i++){  
            //     var feature = features[i];  
            //     // feature.symbol = {"color":[0,0,255,200],  
            //     //     "size":12,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSCircle",  
            //     //     "outline":{"color":[0,0,0,255],"width":1,"type":"esriSLS","style":"esriSLSSolid"}};  
            //     // var graphic  = new esri.Graphic(feature);  
            //     // gLayer.add(graphic);  

            //     var textSymbol = new esri.symbols.TextSymbol(
            //         "X: " + labelPoint.x + ", Y: " + labelPoint.y,
            //         font, new Color([0, 0, 0]));
      
            //       var labelPointGraphic = new esri.Graphic(labelPoint, textSymbol);
      
            //       // add the label point graphic to the map
            //     //   map.graphics.add(labelPointGraphic);                
            //     map.graphics.add(labelPointGraphic);
            // }                       
            // console.log(features);
            // map.addLayer(gLayer);
            // vector.addFeatures(features);
            // map.zoomToExtent(vector.getDataExtent());

  
            console.log("took", new Date - starttime, "milliseconds")
            console.log(data);
        })        
    },
    readCAD: function (filePath) {
        showMessage(filePath);
    },
    readTXT: function (filePath) {
        showMessage(filePath);
    }, 
    setSubmit:function(fileType){
        var method = this.ConfigTool.getFXWJLJQueryMethod();
        if (method) {
            var uploadUrl = method.url;
            var uploadMethod = method.name;
            var _this =this;
            try {
                dojo.io.iframe.send({
                    form:_this.formFile, //某个form元素包含本地文件路径
                    method: "GET",
                    handleAs: "html", //服务器将返回html页面
                    url: uploadUrl,
                    content:{
                        dir:fileType,
                        method:uploadMethod,
                        global:_this
                    },
                    load: this.onSubmitted, //提交成功
                    error: this.onSubmitError //提交失败
                });  
            }
            catch (e) {
                showMessage("查找文件实际路径出错，错误原因是" + e.message);
            }            
         
        }else{
            showMessage("读取配置失败，请检查配置");
        }
                
    },
    onSubmitted:function(response, ioArgs){
        var res = response.childNodes[0].innerText;
        debugger;
        var _this =this;
        if(!!res){
            res = JSON.parse(res);
            if(res.success){
                var fileType = _this.content.dir;
                // console.log(res.msg);                
                _this.content.global.readFile(fileType,res.msg);                
            }else{
                showMessage(res.msg);
            }
        }
    },
    onSubmitError:function(response, ioArgs){
        // debugger;
        showMessage(response);
    },
    changeFile:function(){
        // debugger;
        var fileObj = dojo.byId(this.btnFileLoad);
        var nameObj = dojo.byId(this.spanFileLoad);
        if(fileObj.value.length>0){
            nameObj.innerHTML=fileObj.files[0].name;
        }else{
            nameObj.innerHTML="未选择任何文件";			
        }
    },		
    clickMap: function () {
        var evt = arguments[0];
        if (evt && this.opened) {
            if (!this.EmptyGraphicLayer)
                this.EmptyGraphicLayer = getEmptyGraphicLayer();
            else{
                    this.EmptyGraphicLayer.clear();							
                }
            var oX = dojo.byId("txtXPos");
            var oY = dojo.byId("txtYPos");
            if (oX && oY) {
                oX.value = evt.mapPoint.x.toFixed(3);
                oY.value = evt.mapPoint.y.toFixed(3);
                var grPt = new esri.Graphic(evt.mapPoint, highlightSymbol);
                if (grPt) {
                    grPt.visible = true;
                    this.EmptyGraphicLayer.add(grPt);
                    this.EmptyGraphicLayer.visible = true;
                }
            }
        }
    },
    initalPanel: function () {
        //初始面板
        var oDiv = dojo.byId(this.divID);
        if (!oDiv) {
            oDiv = dojo.create("div", { id: this.divID }, dojo.body());
        }
        oDiv.innerHTML = this.qryTemplate;
        var mapStyle = getMapStyle();
        mapStyle.width = this.floatPanelWith;
        mapStyle.height = this.floatPanelHeight < mapStyle.height - 20 ? this.floatPanelHeight : mapStyle.height - 20;
        mapStyle.right = 20;
        this.floatPanel = new ConstrainedFloatingPane({
            title: this.title,
            id: this.divID,
            resizable: false,
            closable: true,
            dockable: false,
            constrainToContainer: true,
            style: dojo.string.substitute("position:absolute;visibility:visible;margin:0px;padding:0px; top:${top}px;right:${right}px; width:${width}px;height:${height}px;", mapStyle)
        }, oDiv);
        this.floatPanel.startup();
        this.floatPanel.close = dojo.hitch(this, "hide");
        this.adjustFloatPanelTitle(this.adjust);
        dojo.connect(dojo.byId(this.btnLoad), "onclick", this, "checkFileType");
        var _this = this;
        var arrRadioItem = dojo.query("input[type='radio']");
        dojo.forEach(arrRadioItem, function (item) {
            dojo.connect(item, "onclick", item, _this.checkRadio);
        });			
        dojo.connect(dojo.byId(this.btnFileLoad), "onchange", this, "changeFile");
    },
    show: function () {
        if (!this.opened) {
            closeAllOperate(this);
            if (this.floatPanel) {
                this.floatPanel.show();
                adjustFloatPanelTitle(this.floatPanel, this.adjust);
            } else {
                this.initalPanel();
            }
            //this.handleMapOnClickHandle = dojo.connect(this.map, "onClick", dojo.hitch(this, "clickMap"));
            this.opened = true;
        }
    },
    hide: function () {
        if (this.floatPanel)
            this.floatPanel.hide();
        if (this.EmptyGraphicLayer)
            //this.EmptyGraphicLayer.clear();
        if (this.handleMapOnClickHandle) {
            dojo.disconnect(this.handleMapOnClickHandle);
            this.handleMapOnClickHandle = null;
        }
        this.opened = false;
    },
    clear: function () {
    }
});