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
    floatPanelWith: 300,
    qryTemplate: "",
    adjust: 12,
    highlightSymbol: null,
    EmptyGraphicLayer: null, //空白图层
    handleMapOnClickHandle: null,
    constructor: function (param) {
		dojo.require("esri/symbols/PictureMarkerSymbol");
        dojo.require("esri/symbols/CartographicLineSymbol");				
		dojo.require("dojo.io.iframe");
				
        this.map = getMap();
        this.ConfigTool = getConfigTool();
        this.qryTemplate = this.CreateQryTemplate();
        this.EmptyGraphicLayer = getLayerCtlGraphicLayer();
    },
    CreateQryTemplate: function () {
        var arrHTML = [];
        var dataHTML = this.dataTemplate();
        arrHTML.push('<form id="fileForm" enctype="multipart/form-data" method="post"> ');        
        arrHTML.push('<div style="display:block; text-align:center;  width:100%; height:90%;  ">');
        arrHTML.push(' <table  cellpadding="0px" cellspacing="0px" style="width:90%;  height:100%; border:0px;margin:auto;margin-top:10px;" >');
        arrHTML.push('<tr style=" width:100%; height:20%; ">');
        if (dataHTML.length < 1) {
            arrHTML.push(' <td class="titleSHAPE">');
            arrHTML.push('   <span style="vertical-align:top">上传文件类型：Shape文件</span>');
            arrHTML.push('</td> ');
        } else if (dataHTML.length == 1) {
            arrHTML.push(' <td class="title' + dataHTML[0].ID + '">');
            arrHTML.push('   <span style="vertical-align:top">上传文件类型：' + dataHTML[0].CONTENT + '文件</span>');
            arrHTML.push('</td> ');
        } else if (dataHTML.length > 1) {
            for (var i = 0; i < dataHTML.length; i++) {
                arrHTML.push(' <td class="title' + dataHTML[i].ID + '">');
                arrHTML.push('   <input type="radio" value="' + dataHTML[i].ID + '"  name="' + dataHTML[i].CONTENT + '" class="radio' + dataHTML[i].CONTENT + '">');
                arrHTML.push('   <span type="txt" style="vertical-align:top;cursor:pointer"  name="' + dataHTML[i].CONTENT + '" class="txt' + dataHTML[i].CONTENT + '">' + dataHTML[i].CONTENT + '文件</span>');
                arrHTML.push('</td> ');
            }
        }
        arrHTML.push('</tr>');
        arrHTML.push('<tr  style=" width:100%; height:20%; ">');
        if(dataHTML.length>1){
            arrHTML.push(' <td colspan="' + (dataHTML.length-1) + '">');
        }else{
            arrHTML.push(' <td colspan="1">');
        }
        arrHTML.push('  <span id ="spanFileLoad" style="color:#827f7f;">未选择任何文件</span>');								
        arrHTML.push(' </td> ');
        arrHTML.push(' <td>');
        arrHTML.push('   <div style=" height:100%;  width:100%; text-align:right ;">');			
        arrHTML.push('  <a class="l-button" id="addfile"  style="position: relative;display:inline-block;margin:0 auto;line-height: 24px;text-align: center"><span>选择文件</span><input type="file" name="fileUp" id ="btnLoadFile"  style="position: absolute;right: 0;top: 0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0; opacity: 0; width: 100%;cursor: pointer;text-indent: -20em;height:24px;"/></a>');      
        arrHTML.push('  </div>');				
        arrHTML.push(' </td> ');        
        arrHTML.push('</tr>');
        arrHTML.push('<tr  style=" width:100%; height:20%; ">');
        if(dataHTML.length>1){
            arrHTML.push(' <td colspan="' + (dataHTML.length-1) + '">');
        }else{
            arrHTML.push(' <td colspan="1">');
        }
        
        if (dataHTML.length < 1) {
            arrHTML.push('  <p style="color:red;text-align:left;">shape文件需要上传包含.shp、.dbf和.shx这三种格式的ZIP压缩包<br/></p>');
        } else if (dataHTML.length == 1) {
            arrHTML.push('   <p style="color:red;text-align:left;">' + dataHTML[0].TIP + '<br/></p>');
        } else if (dataHTML.length > 1) {
            for (var i = 0; i < dataHTML.length; i++) {
                arrHTML.push('   <span class="tip' + dataHTML[i].CONTENT + '" style="display:none;color:red;text-align:left;">' + dataHTML[i].TIP + '<br/></span>');
            }
        }        							        								
        arrHTML.push(' </td> ');              
        arrHTML.push(' <td>');
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
    checkFileType: function () {
        if (this.map && this.opened) {
            var fileType = "";
            var TempText = ""; 
            var dataHTML = this.dataTemplate();
            var fileTypeL = dataHTML.length;
            if (fileTypeL == 0) {
                fileType = "SHAPE";
            } else if (fileTypeL == 1) {
                fileType = dataHTML[0].ID;
            } else if (fileTypeL > 1) {
                fileType = dojo.query("input[type='radio']::checked").attr("value");
            }
            if (fileType.length > 0) {
                fileType = fileType.toString();
                var fileObj = dojo.byId(this.btnFileLoad);
                
                if (fileObj.value.length > 0) {
                    var fileName =this.getFileName(fileObj.value);
                    
                    this.addFile(fileType, fileName);
                } else {
                    TempText = "必须要选择一个文件";
                }
            } else {
                TempText = "必须要选择一个文件类型";
            }

            if(TempText.length>0){
                showMessage(TempText);
            }
        }

    },
    dataTemplate: function () {
        var jsonHTML =
                [
                    { ID: 'SHAPE', 'CONTENT': 'Shape',TIP:'shape文件需要上传包含.shp、.dbf和.shx这三种格式的ZIP压缩包' },
                    { ID: 'CAD', 'CONTENT': 'CAD',TIP:'CAD文件需要上传一个.dwg格式的文件'  },
                    { ID: 'TXT', 'CONTENT': 'TXT',TIP:'txt文件需要上传一个.txt格式的文件'  }
                ];
        return jsonHTML;
    },    
    checkRadio: function (obj) {
        var type = obj.srcElement.name;
        
        //保证单选按钮的唯一性
        dojo.query(".radio" + type).parent().siblings().children().attr("checked", false);

        dojo.query(".tip" + type).parent().children("span").style("display","none");
        dojo.query(".tip" + type).style("display","block");
        if(this.EmptyGraphicLayer.graphics.length>0){
            this.changeFile("init");
        }
    },
    checkTxt: function (obj) {
        var type = obj.currentTarget.getAttribute("name");//兼容ie低版本
        dojo.query(".radio" + type).attr("checked", true);
        //保证单选按钮的唯一性        
        dojo.query(".radio" + type).parent().siblings().children().attr("checked", false);
        
        dojo.query(".tip" + type).parent().children("span").style("display","none");
        dojo.query(".tip" + type).style("display","block");
    }, 
    changeFile:function(type){
        var fileObj = dojo.byId(this.btnFileLoad);
        var nameObj = dojo.byId(this.spanFileLoad);
        if(type=="change"){
            if(fileObj.value.length>0){
                var fileName =this.getFileName(fileObj.value);
                if(nameObj.style.color!="rgb(0, 0, 0)"){
                    nameObj.style.color="#000";
                }
                nameObj.innerHTML = fileName;
            }else{
                if(nameObj.style.color!="rgb(130, 127, 127)"){
                    nameObj.style.color="rgb(130, 127, 127)";
                }
                nameObj.innerHTML="未选择任何文件";			
            }
        }else if(type=="init"){
            fileObj.value ="";
            if(nameObj.style.color!="rgb(130, 127, 127)"){
                nameObj.style.color="rgb(130, 127, 127)";
            }
            nameObj.innerHTML="未选择任何文件";	
        }

    },	       
    addFile: function (fileType, fileName) {
        var TempText = ""; 
        fileName = fileName.toLowerCase(); 
        switch (fileType) {
            case "SHAPE":
                if (fileName.indexOf(".zip") == -1) {
                    TempText = "请只上传一个格式是zip的文件，请重新选择！";
                }//判断Shape文件
                break;
            case "CAD":
                if (fileName.indexOf(".dwg") == -1) {
                    TempText = "请只上传一个格式是dwg的文件，请重新选择！";
                }//判断CAD文件
                break;
            case "TXT":
                if (fileName.indexOf(".txt") == -1) {
                    TempText = "请只上传一个格式是txt的文件，请重新选择！";
                }//判断TXT文件
                break;
            default:
                if (fileName.indexOf(".txt") == -1) {
                    TempText = "请只上传一个格式是txt的文件，请重新选择！";
                }//判断TXT文件
                break;
        }
        if(TempText.length==0){
            this.setSubmit(fileType);
        }else{
            showMessage(TempText);
        }
    },
    initArcJson:function(data){
        var starttime =new Date();
        var getAttr = data;
        getAttr.spatialReference= this.map.spatialReference;
        var demo ={
            "geometry": {},
            "attributes": {
                "generated": Number(starttime),
                "title": "中天吉奥信息技术股份有限公司",
                "status": 200
            }
        };
        demo.geometry =	getAttr;			
        return demo;      
    },
    getFileName:function(path){
        var patt=/([\u4e00-\u9fa5]|[^\x00-\xff]|[\w]|-|\(|\))+\.+[\w]{3}/;
        path =path.replace(/\\/g,"\/");
        path =path.match(patt)[0];
        path =path.toString();
        path =path.toLowerCase();
        return path;
    },
    readFile: function (data) {
        for(var i=0;i<data.length;i++){
            var tempType = data[i].type;
            var tempData = this.initArcJson(data[i]);
            switch (tempType)
            {
                case "point":
                    this.loadPoint(tempData);      //加载point信息
                    break;
                case "line":
                    this.loadLine(tempData);      //加载line信息
                    break;
                case "polygon":
                    this.loadPolyon(tempData);    //加载polygon信息
                    break;
                default:
                    this.loadPoint(tempData);    //加载point信息
                    break;
            }				
            
        }
    },    
    loadPoint: function (data) {
        try {
            
            if(!!data){         
                var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
                markerSymbol.setColor(new esri.Color([192, 64, 223,0.5]));
                var labelPoint = data.geometry.points;
                var labelSr =data.geometry.spatialReference;
                var labelAttr =data.attributes;
                
                for(var item in labelPoint){   
                        var point = new esri.geometry.Point([Number(labelPoint[item][0]), Number(labelPoint[item][1])], labelSr);
                        var wmpoint = esri.geometry.webMercatorUtils.geographicToWebMercator(point);
                        var textSymbol = new esri.symbols.TextSymbol("item: " + item );
    
                        if (!this.EmptyGraphicLayer){
                                this.EmptyGraphicLayer = getLayerCtlGraphicLayer();
                        }               
                        var grPp = new esri.Graphic(point, markerSymbol);
                        var grPt = new esri.Graphic(point, textSymbol);
                        
                        if (grPp) {
                                grPp.visible = true;
                                grPp.attributes = labelAttr;
                                grPt.visible = true;
                                grPt.attributes = labelAttr;								
                                this.EmptyGraphicLayer.add(grPp);                    
                                // this.EmptyGraphicLayer.add(grPt);
                                this.EmptyGraphicLayer.visible = true;
                        }              
                        if(item==labelPoint.length-1){
                            this.map.centerAndZoom(point,18);
                        }
                }

            }else{
                showMessage("数据为空");
            }
        }
        catch (e) {
                showMessage("加载点信息错误，错误原因是" + e.message);
        } 					
    },
    loadLine: function (data) {
        try {

            var LineSymbol = new esri.symbols.CartographicLineSymbol();
            LineSymbol.setWidth(5);
            var labelAttr =data.attributes;		
            if(!!data){
                data.visible = true;
                var t_graphic =new esri.Graphic(data);
                t_graphic.symbol=LineSymbol;
                t_graphic.attributes = labelAttr;
                if (!this.EmptyGraphicLayer){
                    this.EmptyGraphicLayer = getLayerCtlGraphicLayer();
                } 
                this.EmptyGraphicLayer.add(t_graphic);
                var centerPoint =t_graphic.geometry.getExtent().getCenter();
                console.log(centerPoint);
                this.map.centerAndZoom(centerPoint,18); 
                this.EmptyGraphicLayer.visible = true;
                this.EmptyGraphicLayer.opacity=0.75;
            }else{
                showMessage("数据为空");
            }
        }
        catch (e) {
                showMessage("加载线信息错误，错误原因是" + e.message);
        } 			
    },
    loadPolyon: function (data) {
        try {
            var labelAttr =data.attributes;	
            var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,new esri.symbol.SimpleLineSymbol("solid", new esri.Color([82, 158, 229, 0.7]), 5),null);
            if (!!data) {
                data.visible = true;
                var t_graphic =new esri.Graphic(data);
                t_graphic.symbol=fillSymbol;
                t_graphic.attributes = labelAttr;
                if (!this.EmptyGraphicLayer){
                    this.EmptyGraphicLayer = getLayerCtlGraphicLayer();
                } 
                this.EmptyGraphicLayer.add(t_graphic);
          
                var centerPoint = t_graphic.geometry.getExtent().getCenter();
                this.map.setExtent(t_graphic.geometry.getExtent().expand(1.5));
                this.map.centerAt(centerPoint); 

                this.EmptyGraphicLayer.visible = true;
                this.EmptyGraphicLayer.opacity=0.75;
            }else{
                showMessage("数据为空");
            }
        }
        catch (e) {
                showMessage("加载面信息错误，错误原因是" + e.message);
        }  			
        
    }, 
    setSubmit:function(fileType){
        setCursorWait();
        dojo.byId(this.btnLoad).value="正在叠加";
        dojo.byId(this.btnLoad).disabled=true;
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
                dojo.byId(this.btnLoad).value="文件叠加";
                dojo.byId(this.btnLoad).disabled=false;
                setCursorDefault();
                showMessage("查找文件实际路径出错，错误原因是" + e.message);
            }            
         
        }else{
            dojo.byId(this.btnLoad).value="文件叠加";
            dojo.byId(this.btnLoad).disabled=false;
            setCursorDefault();
            showMessage("读取配置失败，请检查配置");
        }
                
    },
    onSubmitted:function(response, ioArgs){
        var _this =this;
        var res = response.childNodes[0].innerText;
        dojo.byId(_this.content.global.btnLoad).value="文件叠加";
        dojo.byId(_this.content.global.btnLoad).disabled=false;
        setCursorDefault();

        if(!!res){
            res = JSON.parse(res);
            if(res.success!="false"){
                var fileType = _this.content.dir;                
                _this.content.global.readFile(res.msg);                
            }else{
                showMessage(res.msg);
            }
        }
    },
    onSubmitError:function(response, ioArgs){
        dojo.byId(this.content.global.btnLoad).value="文件叠加";
        dojo.byId(this.content.global.btnLoad).disabled=false;
        setCursorDefault();
        showMessage(response);
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
        var arrTxtItem = dojo.query("span[type='txt']");
        dojo.forEach(arrTxtItem, function (item) {
            dojo.connect(item, "onclick", item, _this.checkTxt);
        });        		
        dojo.connect(dojo.byId(this.btnFileLoad), "onchange",dojo.hitch(this, "changeFile", "change"));
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
        if (this.EmptyGraphicLayer){
            this.changeFile("init");
        }
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