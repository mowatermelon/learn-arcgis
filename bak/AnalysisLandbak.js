dojo.declare("Widget.AnalysisLand", null, {
    title: "地类分析",
    divID: "analysisDiv",
    btnQuery:"btnAnalysis",
    btnLoadA: "btnLoadFileByAN",
    btnFileALoad: "btnLoadAFile",
    spanFileALoad:"spanFileLoadA",
    formAFile:"fileAForm",    
    ConfigTool: null,
    map: null,
    opened: false,
    titleBtn: null,
    graphicLayer: null,
    floatUpload:null,
    floatPanel: null,
    floatPanelHeight: 600,
    floatPanelWith:350,
    divUploadID: "uploadDiv",
    uploadTemplate: "",
    divResultID: "resultDiv",
    resultTemplate: "",
    qryTemplate: "",
    adjust: 12,
    UpType:'',
    EmptyGraphicLayer: null, //空白图层
    DrawToolbar: null,
    handleMapOnClickHandle: null,
    ResXml:null,
    ResRings:[],
    AnalysisType:null,
    floatResult:null,
    fillSymbol:null,
    allVisibleLayer:null,
    resTable:[],
    /**-----------------------------------------------------原始数据部分 */
    /**---------------------------json数据部分 */        
    dataTemplate: function () {
        var jsonHTML =
                [
                    { ID: 'SHAPE', 'CONTENT': 'Shape',TIP:'shape文件需要上传包含.shp、.dbf和.shx这三种格式的ZIP压缩包' },
                    { ID: 'CAD', 'CONTENT': 'CAD',TIP:'CAD文件需要上传一个.dwg格式的文件'  },
                    { ID: 'TXT', 'CONTENT': 'TXT',TIP:'txt文件需要上传一个.txt格式的文件'  }
                ];
        return jsonHTML;
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
    Analysis:function(){
        var temp_part = getConfigTool().getDLAnalysisMethod();
        var oInit = [
                    {
                      "index":"一",
                      "alias":"A",
                      "tip":"选择分析类型",
                      "btn":"",
                      "btnId":"",
                      "isInput":false,
                      "types":[]
                    },
                    {
                      "index":"二",
                      "alias":"B",
                      "tip":"选择分析范围",
                      "btn":"清除选择",
                      "btnId":"chearBtn",
                      "isInput":false,
                      "types":[
                        {
                          "index":"1",
                          "title":"点",
                          "type":"point",
                          "visible":false
                        },
                        {
                          "index":"2",
                          "title":"矩形形状",
                          "type":"rectangle",
                          "visible":true
                        },
                        {
                          "index":"3",
                          "title":"圆形形状",
                          "type":"circle",
                          "visible":true
                        },
                        {
                          "index":"4",
                          "title":"不规则形状",
                          "type":"offbeat",
                          "visible":true
                        },
                        {
                          "index":"5",
                          "title":"点标注",
                          "type":"pmark",
                          "visible":false
                        },
                        {
                          "index":"6",
                          "title":"shape文件",
                          "type":"shape",
                          "visible":true
                        },      
                        {
                          "index":"7",
                          "title":"cad文件",
                          "type":"cad",
                          "visible":true
                        },      
                        {
                          "index":"8",
                          "title":"TXT文件",
                          "type":"txt",
                          "visible":true
                        }
                      ]
                    },
                    {
                      "index":"三",
                      "alias":"C",
                      "tip":"选择分析方式",
                      "btn":"",
                      "btnId":"",
                      "isInput":true,
                      "types":[
                        {
                          "title":"权属性质",
                          "alias":"qsxz",
                          "type":"select",
                          "option":[
                            "国有","集体","国有和集体"
                          ]
                        },
                        {
                          "title":"计算方式",
                          "alias":"jsfs",
                          "type":"select",
                          "option":[
                            "平面面积","椭球面积"
                          ]
                        }, 
                        {
                          "title":"扣除模式",
                          "alias":"kcms",
                          "type":"select",
                          "option":[
                            "二次调查模式","点线全扣模式"
                          ]
                        },
                        {
                          "title":"输出单位",
                          "alias":"scdw",
                          "type":"select",
                          "option":[
                            "平方米","亩","公顷"
                          ]
                        }, 
                        {
                          "title":"小数单位",
                          "alias":"xsw",
                          "type":"change",
                          "option":2,
                          "min":0,
                          "max":10,
                          "count":1,
                          "fix":0
                        },  
                        {
                          "title":"缓冲距离",
                          "alias":"hcjl",
                          "type":"text",
                          "option":"",
                          "unit":"米"
                        }, 
                        {
                          "title":"拆迁比例",
                          "alias":"cqbl",
                          "type":"change",
                          "option":0.9,
                          "min":0,
                          "max":1,
                          "count":0.1,
                          "fix":1
                        }, 
                        {
                          "title":"分析结果",
                          "alias":"fxjg",
                          "type":"select",
                          "option":[
                            "导出为HTML","导出为Excel"
                          ]
                        }
                      ]
                    }
                  ];
        
        oInit[0].types = temp_part;
        this.text= oInit;
      }, 
    initResXml:function(data){
        //data 需要传入的是ArcGISJson中的rings
        this.header ="<?xml version='1.0' encoding='gb2312' ?>";
        var tempBody ="<htsm>";
        tempBody +="<pts num='1' type='polygon'>";
        for(var i=0;i<data.length;i++){
            tempBody +="<pts num='"+(i+1)+"' type='polygon'>";
            for(var n=0;n<data[i].length;n++){
                tempBody +="<pt num='"+(n+1)+"' x='"+data[i][n][0]+"' y='"+data[i][n][1]+"' />";
            }
            tempBody +="</pts>";
        }
        tempBody +="</pts>";
        this.body =tempBody;
        this.footer="</htsm>";
        this.text = this.header + this.body + this.footer;
    }, 
    initVisibleLayer:function(){
        var arrUrl = [];
        dojo.forEach(this.allVisibleLayer, function (item) {
            value = dojo.string.substitute("${0}/${1}", [item.pLayer.url, item.childLayer.id]);
            arrUrl.push({ name: item.childLayer.name, url: value });
        });
        return arrUrl;        
    },     
    /**---------------------------模版数据部分 */            
    CreateQryTemplate:function(){
        var data = new this.Analysis().text;
        var tempTxt =''; 
        for(var i=0;i<data.length;i++){
          tempTxt += "    <div class='part part"+data[i].alias+"'>\n";
          tempTxt += "      <ul>\n";          
          tempTxt += "      <li>\n";
          tempTxt += "          <span class='num num_"+data[i].alias+"'>第"+data[i].index+"步</span>\n";
          tempTxt += "          <span class='title'>"+data[i].tip+"</span>\n";
          if(!!data[i].btn){
            tempTxt += "          <p class='l-button' id='"+data[i].btnId+"'>"+data[i].btn+"</p>\n";
            this.titleBtn = data[i].btnId;
          }
          tempTxt += "      </li>\n";
          if(!data[i].isInput){
            tempTxt += "      <li class='box'>\n";
            var temp,type;
            for(var m=0;m<data[i].types.length;m++){
              if(data[i].types[m].visible){
                type = data[i].types[m];
                if(data[i].alias=="A"){
                    temp = "a_type a_"+type.type;
                }else if(data[i].alias=="B"){
                    temp = "b_type b_"+type.type;
                }
                tempTxt += "              <span index='"+type.index+"' type='"+type.type.toUpperCase()+"' class='"+temp+"' title='"+type.title+"'>"+type.title+"</span>\n"; 
              }
            }  
            tempTxt += "          </li>\n";    
  
          }else{
            tempTxt += this.loadForm(data[i].types);
          }
  
          tempTxt += "      </ul>\n";
          tempTxt += "    </div>\n";        
        }
  
        if(!tempTxt){
          tempTxt="没有找到相关配置";
        }
        tempTxt+="<input  type='button' id ='btnAnalysis'  value='开始分析' class='l-button btn_analysis'  />";
        return tempTxt;
    },  
    loadForm:function(data){
        var tempTxt='';
        for(var i=0;i<data.length;i++){       
          tempTxt += "      <li class='action li_"+data[i].alias+"' type='"+data[i].alias.toUpperCase()+"'>\n";
          tempTxt += "          <label for='"+data[i].type+data[i].alias+"' class='label_"+data[i].alias+"' title='"+data[i].title+"'>"+data[i].title+"：</label>\n";         
          switch(data[i].type){
            case "select":
              tempTxt += this.loadSelect(data[i]);
              break;
            case "text":
              tempTxt += this.loadInput(data[i]);
              break;
            case "change":
              tempTxt += this.loadChange(data[i]);
              break;                  
          }
          tempTxt += "      </li>\n";
        }
        return tempTxt;
    },
    loadSelect:function(data){
        var tempTxt=''; 
        tempTxt += "          <select id='select"+data.alias+"' >\n"; 
        for(var i=0;i<data.option.length;i++){
          tempTxt += "              <option index='"+i+"' name='"+data.option[i]+"'>"+data.option[i]+"</option>\n";           
        }         
        tempTxt += "          </select>\n"; 
        return tempTxt;
    },
    loadInput:function(data){
        var tempTxt=''; 
        tempTxt += "          <input type='text' id='text"+data.alias+"' value='"+data.option+"'/>\n"; 
        tempTxt += "          <label>"+data.unit+"</label>\n"; 
        return tempTxt;
    },
    loadChange:function(data){
        var tempTxt='';
        tempTxt += "          <label class='change_btn reduce_btn' alias='"+data.alias+"' min='"+data.min+"' count='"+data.count+"' fix='"+data.fix+"' >-</label>\n";          
        tempTxt += "          <input type='text' id='change"+data.alias+"'  value='"+data.option+"'/>\n"; 
        tempTxt += "          <label class='change_btn add_btn' alias='"+data.alias+"' max='"+data.max+"' count='"+data.count+"' fix='"+data.fix+"' >+</label>\n"; 
        return tempTxt;
    }, 
    showUploadTemplate: function () {
        var arrHTML = '';
        var dataHTML = this.dataTemplate(); 
        arrHTML +='<form id="fileAForm" enctype="multipart/form-data" method="post"> ';        
        arrHTML +='  <div id="UploadContent" class="UpContent">';
        for (var i = 0; i < dataHTML.length; i++) {
            arrHTML +='      <span class="alert hide tips tip' + dataHTML[i].ID + '">' + dataHTML[i].TIP + '<br/></span>';
        }
        arrHTML +='      <span class="tips tipTitle">选择文件:</span>';
        arrHTML +='      <a class="UpContanier"><span id ="spanFileLoadA" class="UpName">上传文件</span><input type="file" name="fileAUp" id ="btnLoadAFile"/></a>';      
        arrHTML +='      <input  type="button" id ="btnLoadFileByAN"  value="文件叠加" class="l-button"  />';			
        arrHTML +='  </div>';
        arrHTML +='</form>';
        return arrHTML;
    }, 
    showResultTemplate: function (table) {
        var _this = this; 
        var searchStr = '</table>';
        var arrHTML = '';
        arrHTML +='  <div id="ResultContent">';        
        if(table.indexOf(searchStr)>-1){
            _this.resTable = _this.indexCountStrChar(table,searchStr,searchStr.length);			
            arrHTML += '<div class="tab-head">'+_this.LoadTabHead(_this.resTable.length)+'</div>';
            arrHTML += '<div class="tab-body">'+_this.LoadTabBody(0)+'</div>';
        }else{
            arrHTML += '导出文件路径'+table;  
        }
        arrHTML +='  </div>';
        return arrHTML;
    },
    LoadTabHead:function(len){
        var tempTxt = '<ul>';
        for(var i=0;i<len;i++){
            tempTxt += '<li><a class="tab-title">分析表'+(i+1)+'</a></li>';
        }
        tempTxt += '</ul>';
        return tempTxt;			
    },	
    LoadTabBody:function(index){
        var tempTxt = this.resTable[index].text;	
        return tempTxt;			
    },            
    /**-----------------------------------------------------构造体部分 */
    constructor: function (param) {
		dojo.require("esri/symbols/PictureMarkerSymbol");
        dojo.require("esri/symbols/CartographicLineSymbol");				
		dojo.require("dojo.io.iframe");
				
        this.map = getMap();
        this.ConfigTool = getConfigTool();
        this.qryTemplate = this.CreateQryTemplate();
        this.EmptyGraphicLayer = getEmptyGraphicLayer();
        this.uploadTemplate = this.showUploadTemplate();
        // this.DrawToolbar = getDrawToolBar();
        this.fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,new esri.symbol.SimpleLineSymbol("solid", new esri.Color([82, 158, 229, 0.7]), 5),null);
    },
    /**---------------------------面板部分 */    
    /**---------------------------主面板部分 */
    adjustFloatPanelTitle: function (adjust) {
        if (this.floatPanel && this.floatPanel.domNode.style.width) {
            this.floatPanel.focusNode.style.width = (parseInt(this.floatPanel.domNode.style.width.replace("px", "")) - adjust) + "px";
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
        this.floatPanel.close = dojo.hitch(this, "hide");
        this.adjustFloatPanelTitle(this.adjust);
        this.initBtnBind();                          
    },
    startup:function(){
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
            this.opened = true;
        }
    },
    hide: function () {
        if (!!this.floatPanel){
            this.floatPanel.hide();
        }
        if (!!this.floatResult){
            this.floatResult.hide();
        }
        this.EmptyGraphicLayer.clear(); 
        this.DrawToolbar = null;
        this.ResXml = null;
        this.ResRings = [];
        this.AnalysisType = null;
        this.resTable = [];
        // if (this.handleMapOnClickHandle) {
        //     dojo.disconnect(this.handleMapOnClickHandle);
        //     this.handleMapOnClickHandle = null;
        // }
        this.operateDraw(false);
        this.opened = false;
        
    },
    clear: function () {
    },
    /**---------------------------上传文件弹窗部分 */
    adjustUploadFloatPanelTitle: function (adjust) {
        if (this.floatUpload && this.floatUpload.domNode.style.width) {
            this.floatUpload.focusNode.style.width = (parseInt(this.floatUpload.domNode.style.width.replace("px", "")) - adjust) + "px";
        }
    },
    //弹出上传文件面板
    initalUploadFloatPanel: function (type) {
        var uploadType = type;
        this.UpType = uploadType;
        if (!this.floatUpload) {
            var floatUploadDiv = dojo.byId(this.divUploadID);
            if (!floatUploadDiv) {
                floatUploadDiv = dojo.create("div", { id: this.divUploadID }, dojo.body());
                floatUploadDiv.innerHTML = this.uploadTemplate;
            }
            var mapStyle = getMapStyle();
            var panelStyle = {};
            panelStyle.width = 350;
            panelStyle.height = 130;
            panelStyle.left = (mapStyle.width-panelStyle.width)/2;
            panelStyle.top = (mapStyle.height-panelStyle.height)/2;         

            var style = dojo.string.substitute("position:absolute;top:${top}px;left:${left}px;width:${width}px;height:${height}px; z-index:999;visibility:visible;   margin:0px;padding:0px;  ", panelStyle);
            this.floatUpload = new ConstrainedFloatingPane({
                title: uploadType + "文件上传",
                id: this.divUploadID,
                resizable: false,
                closable: true,
                dockable: false,
                draggable:true,
                constrainToContainer: true,
                style: style
            }, floatUploadDiv);
            this.floatUpload.startup();
            this.floatUpload.close = dojo.hitch(this, "hideQueryUpload");
            this.adjustUploadFloatPanelTitle(this.adjust);
            dojo.connect(dojo.byId(this.btnLoadA), "onclick", this, "checkFileType");
            dojo.connect(dojo.byId(this.btnFileALoad), "onchange",dojo.hitch(this, "changeFile", "change"));
        }else{
            this.floatUpload.titleNode.innerHTML = uploadType + "文件上传";          
            dijit.byId(this.divUploadID).show();
            if(this.EmptyGraphicLayer.graphics.length>0){
                this.changeFile("init");
            }
        }
        dojo.query(".tip" + type).parent().children("span").removeClass("show").addClass("hide");
        dojo.query(".tip" + type).removeClass("hide").addClass("show");

    },
    //查询结果的面板关闭
    hideQueryUpload: function () {
        this.floatUpload.hide();
    },
    /**---------------------------分析结果弹窗部分 */
    adjustResultFloatPanelTitle: function (adjust) {
        if (this.floatResult && this.floatResult.domNode.style.width) {
            this.floatResult.focusNode.style.width = (parseInt(this.floatResult.domNode.style.width.replace("px", "")) - adjust) + "px";
        }
    },
    //弹出结果面板
    initalResultFloatPanel: function (table) {
        var _this = this; 
        var mapStyle = {};
        var panelStyle = {};
        var style ='';       
        var resType = dojo.query("span[index='" + _this.AnalysisType +"']").attr("title")[0];
        if (!_this.floatResult) {
            var floatResultDiv = dojo.byId(_this.divResultID);
            if (!floatResultDiv) {
                floatResultDiv = dojo.create("div", { id: _this.divResultID }, dojo.body());
                floatResultDiv.innerHTML = _this.showResultTemplate(table);
            }
            mapStyle = getMapStyle();
            panelStyle = {};
            panelStyle.width = mapStyle.width*0.8;
            panelStyle.height = mapStyle.height*0.6;
            panelStyle.left = (mapStyle.width-panelStyle.width)/2;
            panelStyle.top = (mapStyle.height-panelStyle.height)/2;         
            
            style = dojo.string.substitute("position:absolute;top:${top}px;left:${left}px;width:${width}px;height:${height}px; z-index:999;visibility:visible;   margin:0px;padding:0px;  ", panelStyle);
           
            _this.floatResult = new ConstrainedFloatingPane({
                title: resType + "结果",
                id: _this.divResultID,
                resizable: false,
                closable: true,
                dockable: false,
                draggable:true,
                constrainToContainer: true,
                style: style
            }, floatResultDiv);
            _this.floatResult.startup();
            _this.floatResult.close = dojo.hitch(_this, "hideQueryResult");
            // this.initalGrid();
            _this.adjustResultFloatPanelTitle(_this.adjust);
        }else{
            mapStyle = getMapStyle();
            if(panelStyle.width!=mapStyle.width*0.8||panelStyle.height!=mapStyle.height*0.8){
                panelStyle = {};
                panelStyle.width = mapStyle.width*0.8;
                panelStyle.height = mapStyle.height*0.8;
                panelStyle.left = (mapStyle.width-panelStyle.width)/2;
                panelStyle.top = (mapStyle.height-panelStyle.height)/2;         
                
                style = dojo.string.substitute("position:absolute;top:${top}px;left:${left}px;width:${width}px;height:${height}px; z-index:999;visibility:visible;   margin:0px;padding:0px;  ", panelStyle);
     
                dojo.query('#resultDiv')[0].style.cssText = style;
            }
            dojo.byId("ResultContent").innerHTML = _this.showResultTemplate(table);
            _this.floatResult.titleNode.innerHTML = resType + "结果"; 
            dijit.byId(_this.divResultID).show();
        }
        if(_this.resTable.length>0){
            var titleItem = dojo.query(".tab-title");
            dojo.forEach(titleItem, function (item,index) {
                dojo.connect(item, "onclick", dojo.hitch(_this, "changeTab", item,index));
            });
            titleItem.first().parent().addClass("active");               
        }
    },
    changeTab:function(obj,index){
        var _this = this;
        dojo.query(".tab-body")[0].innerHTML =_this.LoadTabBody(index);
        dojo.query(obj).parent("li").addClass('active').siblings("li").removeClass('active');
    },
    //查询结果的面板关闭
    hideQueryResult: function () {
        this.floatResult.hide();
    },                        
    /**-----------------------------------------------------分析数据部分 */
    /**---------------------------协助数据处理工具部分 */    
    getFileName:function(path){
        var patt=/([\u4e00-\u9fa5]|[^\x00-\xff]|[\w]|-|\(|\))+\.+[\w]{3}/;
        path =path.replace(/\\/g,"\/");
        path =path.match(patt)[0];
        path =path.toString();
        path =path.toLowerCase();
        return path;
    },
    ArrayUnique:function (arr) {
        arr.sort(); //先排序
        var res = [arr[0]];
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] !== res[res.length - 1]) {
                res.push(arr[i]);
            }
        }
        return res;
    },      
    addNum:function(){
        var curObj = arguments[0].currentTarget;
        var alias=curObj.attributes["alias"].value;
        var max=curObj.attributes["max"].value;
        var count=curObj.attributes["count"].value;
        var fix=curObj.attributes["fix"].value;

        var obj = dojo.byId("change"+alias);
        if(Number(obj.value)<Number(max)){
            obj.value =(Number(obj.value) + Number(count)).toFixed(Number(fix));
        }
    },
    reduceNum:function(){
        var curObj = arguments[0].currentTarget;
        var alias=curObj.attributes["alias"].value;
        var min=curObj.attributes["min"].value;
        var count=curObj.attributes["count"].value;
        var fix=curObj.attributes["fix"].value;     
        var obj = dojo.byId("change"+alias);
        if(Number(obj.value)>Number(min)){
            obj.value =(Number(obj.value)-  Number(count)).toFixed(Number(fix));
        }
    },
    clearDraw:function(){
        if (this.EmptyGraphicLayer){
            this.EmptyGraphicLayer.clear();
        }
        this.ResXml = null;
        this.ResRings = [];       
    },
    initBtnBind:function(){
        var _this = this;
        var reduceItem = dojo.query(".reduce_btn");
        dojo.forEach(reduceItem, function (item) {
            dojo.connect(item, "onclick", item, _this.reduceNum);
        });
        var addItem = dojo.query(".add_btn");
        dojo.forEach(addItem, function (item) {
            dojo.connect(item, "onclick", item, _this.addNum);
        }); 
        var atypeItem = dojo.query(".a_type");
        dojo.forEach(atypeItem, function (item) {
            dojo.connect(item, "onclick", dojo.hitch(_this, "selectTypeItem", item.attributes["type"].value));
        });
        //默认选中第一个分析类型
        atypeItem[0].click();

        var btypeItem = dojo.query(".b_type");
        dojo.forEach(btypeItem, function (item) {
            dojo.connect(item, "onclick", dojo.hitch(_this, "selectScopeItem", item.attributes["type"].value));
        }); 
        dojo.connect(dojo.byId(this.btnQuery), "onclick", _this, "addAnalysis");
        if(!!_this.titleBtn){
            dojo.connect(dojo.byId(this.titleBtn), "onclick", _this, "clearDraw");
        }
        var arrLayer = geometryVisibleLayers();
        this.allVisibleLayer = arrLayer;
    },
    getParam: function (method) {
        var params = {};
        var control = null;
        var controlID = null;
        var strXml = this.ResXml;
        var strKey = "";
        var strValue = "";        
        var arrControlID = new this.Analysis().text[2].types;
        var strtype =this.AnalysisType;
        var strTable = this.ConfigTool.getTableMethod();
        params["TYPE"] = strtype;                
        params["XML"] = strXml;
        params["method"] = method;
        if(strtype==5){
             //拆迁改造
            params["TABLE"] = strTable[0].CDATA.nodeValue;  
        }else if(strtype==6){
             //缓冲分析
            params["TABLE"] = strTable[1].CDATA.nodeValue;  
        }else{
            params["TABLE"] = "";  
        } 
        for(var i in arrControlID){   
            controlID =  arrControlID[i].type+ arrControlID[i].alias;
            strKey =  arrControlID[i].alias.toUpperCase();
            if(arrControlID[i].type =="select"){
                strValue = dojo.query('#'+controlID)[0].selectedIndex;
            }else{
                strValue = dojo.byId(controlID).value;
            }

            // if (!!strValue) {
                params[strKey] = strValue;
            // }
        }
        return params;
    }, 
    indexCountStrChar: function (str,char,gapLength){
        /**
         * @param str String 被检索的字符串
         * @param char String 需要检索的内容
         * @param gapLength int 分割字符串的时候的默认补充长度
         */
        var res =[];
        var count = 0;
        var pos = str.indexOf(char);
        while (pos !== -1) {
            if(res.length==0){
                res.push({index:count,pos:pos,text:str.substring(0,(pos+gapLength))});
            }else{
                res.push({index:count,pos:pos,text:str.substring((res[count-1].pos+gapLength),(pos+gapLength))});
            }
            count++;
            pos = str.indexOf(char, pos + 1);
        }
        return res;
    },           
    /**---------------------------上传文件部分 */    
    checkFileType: function () {
        if (this.map && this.opened) {
            var fileType = '';
            if(!this.UpType){
                fileType = 'SHAPE';
            }else{
                fileType = this.UpType;
            }
            var TempText = ""; 
            if (fileType.length > 0) {
                fileType = fileType.toString();
                var fileObj = dojo.byId(this.btnFileALoad);
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
    changeFile:function(type){
        var fileObj = dojo.byId(this.btnFileALoad);
        var nameObj = dojo.byId(this.spanFileALoad);
        if(type=="change"){
            if(fileObj.value.length>0){
                var fileName =this.getFileName(fileObj.value);
                nameObj.innerHTML = fileName;
            }else{
                nameObj.innerHTML="上传文件";			
            }
        }else if(type=="init"){
            fileObj.value ="";
            nameObj.innerHTML="上传文件";			
        }

    },	       
    addFile: function (fileType, fileName) {
        var isRight = false;
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
    addAnalysis:function(){
        var _this =this;
        if (!!_this.floatResult) {
            _this.floatResult.hide();
        }
        if (!!_this.floatUpload) {
            _this.floatUpload.hide();
        }        
        setCursorWait();
        dojo.byId(_this.btnQuery).value="正在分析";
        dojo.byId(_this.btnQuery).disabled=true;
        var strRings = _this.ResRings;
        
        if(strRings.length>0){
            if(!!_this.drawToolbar){
                _this.drawToolbar.deactivate();
            }
            dojo.query(".b_type").removeClass("select"); 
            strRings = _this.ArrayUnique(strRings);
            _this.ResXml = new _this.initResXml(strRings).text;

            try {
                var method = _this.ConfigTool.getDLFXQueryMethod();
                if (!!method){ 
                    var url = method.url;
                    var params = _this.getParam(method.name);                
                    executeErrSvr(url, params, function (res) {
                        try{
                            if (!!res) {            
                                res = JSON.parse(res);
                                if(res.success!="false"){
                                    _this.initalResultFloatPanel(res.msg);          
                                                
                                }else{
                                    showMessage(res.msg);
                                }
                            }
                            else {
                                showMessage("未查询到有关数据格式");
                            }  
                        }
                        catch(e){
                            showMessage("查询出错:" + e.message);
                        }
                        dojo.byId(_this.btnQuery).value="开始分析";
                        dojo.byId(_this.btnQuery).disabled = false; 
                        setCursorDefault();                                 
                    },function(err){
                        showMessage("查询出错:" + err);
                        dojo.byId(_this.btnQuery).value="开始分析";
                        dojo.byId(_this.btnQuery).disabled = false; 
                        setCursorDefault();                       
                    });

                }else{
                    showMessage("读取配置失败，请检查配置");
                    dojo.byId(_this.btnQuery).value="开始分析";
                    dojo.byId(_this.btnQuery).disabled = false; 
                    setCursorDefault();   
                }
            }
            catch (e) {
                showMessage("查询出错:" + e.message);
                dojo.byId(_this.btnQuery).value="开始分析";
                dojo.byId(_this.btnQuery).disabled = false; 
                setCursorDefault();     
            }                         
        }else{
            dojo.byId(_this.btnQuery).value="开始分析";
            dojo.byId(_this.btnQuery).disabled = false;
            setCursorDefault();
            showMessage("必须要先选择一个分析范围");
        }      
    },
    /**---------------------------文件处理部分 */ 
    readFile: function (data) {
        for(var i=0;i<data.length;i++){
            var tempType = data[i].type;
            var tempData = this.initArcJson(data[i]);
            switch (tempType)
            {
                case "point":
                    this.loadPoint(tempData);      //加载point信息
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
                                this.EmptyGraphicLayer = getEmptyGraphicLayer();
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
    loadPolyon: function (data) {
        try {
            var labelAttr =data.attributes;	
            if (!!data) {
                data.visible = true;
                var t_graphic =new esri.Graphic(data);
                t_graphic.symbol=this.fillSymbol;
                t_graphic.attributes = labelAttr;
                if (!this.EmptyGraphicLayer){
                    this.EmptyGraphicLayer = getEmptyGraphicLayer();
                } 
                this.EmptyGraphicLayer.add(t_graphic);
                for(var i=0;i<t_graphic.geometry.rings.length;i++){
                        this.ResRings.push(t_graphic.geometry.rings[i]);
                } 

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
    selectTypeItem:function(type){
        dojo.query("span[type='" + type +"']").addClass("select").siblings().removeClass("select");              
         //all type ".li_qsxz,.li_jsfs,.li_kcms,.li_scdw,.li_xsw,.li_hcjl,.li_cqbl,.li_fxjg"
        var hideDom ="";
        var showDom ="";
        switch (type) {
            case "DLFX":
                hideDom = ".li_cqbl,.li_hcjl,.li_fxjg";
                showDom = ".li_qsxz,.li_jsfs,.li_kcms,.li_scdw,.li_xsw";
                break;            
            case "YDFX":
            case "KCFG":
                hideDom = ".li_qsxz,.li_jsfs,.li_kcms,.li_scdw,.li_xsw,.li_hcjl,.li_cqb,.li_fxjg";
                showDom = "";
                break;  
            case "DJFX":
                hideDom = ".li_qsxz,.li_jsfs,.li_kcms,.li_scdw,.li_xsw,.li_cqbl,.li_fxjg";
                showDom = ".li_hcjl";                                      
                break;
            case "GHYS":
                hideDom = ".li_qsxz,.li_jsfs,.li_kcms,.li_scdw,.li_xsw,.li_cqbl,.li_fxjg";
                showDom = ".li_scdw,.li_xsw";                                      
                break;
            case "HCFX":
                hideDom =".li_qsxz,.li_kcms,.li_scdw,.li_xsw,.li_cqbl,.li_fxjg";
                showDom = ".li_jsfs,.li_hcjl";
                break;
            case "CQGZ":
                hideDom =".li_qsxz,.li_kcms,.li_scdw,.li_xsw,.li_fxjg";
                showDom = ".li_jsfs,.li_hcjl,.li_cqbl";
                break;
        }      
        // "sjy jsfs kcms scdw xsw hcjl cqbl"    
        // "DLFX  GHYS YDFX DJFX CQGZ HCFX KCFG"
        dojo.query(hideDom).removeClass("show").addClass("hide");
        if(!!showDom){
            dojo.query(showDom).removeClass("hide").addClass("show");
        }
        this.AnalysisType = parseInt(dojo.query("span[type='" + type +"']").attr("index")) ;

    },
    selectScopeItem:function(type){
        dojo.query("span[type='" + type +"']").addClass("select").siblings().removeClass("select");       
        switch (type) {
            case "POINT":
            case "RECTANGLE":
            case "CIRCLE":
            case "OFFBEAT":
            case "PMARK":{
                type = this.getPOLYGONType(type);
                this.operateDraw(type);
                break;
            }
            case "SHAPE":
            case "CAD":
            case "TXT":
                {
                    if(!!this.drawToolbar){
                        this.drawToolbar.deactivate();
                    }
                    this.initalUploadFloatPanel(type);
                }
                break;
        }        
    },
    setSubmit:function(fileType){
        var _this = this;
        setCursorWait();
        dojo.byId(_this.btnLoadA).value="正在叠加";
        dojo.byId(_this.btnLoadA).disabled=true;
        var method = _this.ConfigTool.getFXWJLJQueryMethod();
        if (method) {
            var uploadUrl = method.url;
            var uploadMethod = method.name;
            try {
                dojo.io.iframe.send({
                    form:_this.formAFile, //某个form元素包含本地文件路径
                    method: "GET",
                    handleAs: "html", //服务器将返回html页面
                    url: uploadUrl,
                    content:{
                        dir:fileType,
                        method:uploadMethod,
                        global:_this
                    },
                    load: _this.onSubmitted, //提交成功
                    error: _this.onSubmitError //提交失败
                });
            }
            catch (e) {
                dojo.byId(this.btnLoadA).value="文件叠加";
                dojo.byId(this.btnLoadA).disabled=false;
                setCursorDefault();
                showMessage("加载分析信息错误，错误原因是" + e.message);
            }            
         
        }else{
            dojo.byId(this.btnLoadA).value="文件叠加";
            dojo.byId(this.btnLoadA).disabled=false;
            setCursorDefault();
            showMessage("读取配置失败，请检查配置");
        }
                
    },   
    onSubmitted:function(response, ioArgs){
        var _this =this;
        var res = response.childNodes[0].innerText;
        dojo.byId(_this.content.global.btnLoadA).value="文件叠加";
        dojo.byId(_this.content.global.btnLoadA).disabled=false;
        setCursorDefault();
        try
        {
            if(!!res){              
                res = JSON.parse(res);
                if(res.success!="false"){
                    var fileType = _this.content.dir;                
                    _this.content.global.readFile(res.msg);                
                }else{
                    showMessage(res.msg);
                }
            }else{
                showMessage("加载分析信息错误");
            }
        }
        catch (e)
        {
            showMessage("加载分析信息错误，错误原因是" + e.message);
        }

    },
    onSubmitError:function(response, ioArgs){
        dojo.byId(this.content.global.btnLoadA).value="文件叠加";
        dojo.byId(this.content.global.btnLoadA).disabled=false;
        setCursorDefault();
        showMessage(response);
    },
    /**---------------------------形状处理部分 */ 
    //开启绘画
    draw: function (type) {
        var _this =this;
        if(typeof(type) !='boolean'){
            if (!_this.drawToolbar) {
                _this.drawToolbar = drawToolbar = new esri.toolbars.Draw(map);
            }
    
            // esri.bundle.toolbars.draw.addPoint = "按下后开始并直到完成";
            drawToolbar.activate(type);
            drawToolbar.on("draw-complete", function(evtObj){
                _this.addToMap(evtObj,_this);
            });
        }else{
            if(!!this.drawToolbar){
                this.drawToolbar.deactivate();
            }
        }

    },
    operateDraw: function (type) {
        if (!editorWidget) {
            disablePopups(); //disable map popups otherwise they interfere with measure clicks
        } else {
            showMessage("没有可以操作的按钮");
        }
        this.draw(type);
    },     
    getPOLYGONType:function(type){
        switch (type) {
            case "POINT":
                type = esri.toolbars.Draw.POINT;
                break;            
            case "RECTANGLE":
                type = esri.toolbars.Draw.RECTANGLE;
                break;            
            case "CIRCLE":
                type = esri.toolbars.Draw.CIRCLE;
                break;            
            case "OFFBEAT":
                type = esri.toolbars.Draw.FREEHAND_POLYGON;
                break;
            default:
                type = esri.toolbars.Draw.FREEHAND_POLYGON;
                break;
        } 
        return type; 
    },
    addToMap: function (evtObj,obj) {
        var _this =this;
        try {
            var data = evtObj.geometry;
            if (!!data) {
                data.visible = true;
                var t_graphic =new esri.Graphic(data);
                t_graphic.symbol = obj.fillSymbol;
                if (!obj.EmptyGraphicLayer){
                    obj.EmptyGraphicLayer = getEmptyGraphicLayer();
                } 

                obj.EmptyGraphicLayer.add(t_graphic);
                for(var i=0;i<t_graphic.geometry.rings.length;i++){
                        obj.ResRings.push(t_graphic.geometry.rings[i]);
                }
                obj.EmptyGraphicLayer.visible = true;
                obj.EmptyGraphicLayer.opacity=0.75;
            }else{
                showMessage("数据为空");
            }
        }
        catch (e) {
                showMessage("加载面信息错误，错误原因是" + e.message);
        } 
        
        
    }   
});