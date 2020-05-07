/*
 *  Description:  
 *  Author: LuckRain7
 *  Date: 2020-05-07 17:22:53
 */
var map;
var toolbar, symbol, geomTask;
var left_top;
var right_bottom;
var visible = [], setLayerVisibility; // layer_Control

var tb, statesTask, riversTask, citiesTask, query;
var statesInfoTemplate, riversInfoTemplate, citiesInfoTemplate;
var pointSym, lineSym, polygonSym;
var mapIdentifyOnOff;

var PINGraphics;//空间查询标注图层
var PINsymbol;//空间查询标注图标
var measurement;//测量工具


require([
        "dojo/parser",
        "dijit/registry",
        "esri/basemaps",
        "esri/map", "esri/geometry/Extent", "esri/SpatialReference",
        "tdlib/SDTDTLayer", "tdlib/SDRasterLayer", "tdlib/SDRSAnnoLayer", "js/SDRasterAnnoLayer",
        "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer",
        "esri/geometry/Point",//点
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol",
        "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
        "esri/toolbars/draw",
        "esri/tasks/query", "esri/tasks/QueryTask",
        "esri/graphic",
        "esri/dijit/Scalebar",
        "esri/dijit/HomeButton", "esri/dijit/LocateButton", "esri/dijit/BasemapToggle", "esri/dijit/OverviewMap", "esri/dijit/Search",
        "esri/geometry/webMercatorUtils",
        "esri/tasks/FindTask", "esri/tasks/FindParameters",
        "esri/InfoTemplate", "esri/dijit/Popup",
        "dojo/dom",
        "dojo/on",
        "esri/Color",
        "dojo/keys",
        "esri/units",
        "dojo/query",
        "dojo/dom-attr",
        "esri/dijit/Legend", "esri/tasks/LegendLayer",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button",
        "dijit/WidgetSet",
        "dojo/_base/array",
        "dojo/dom-construct",//......
        "dojo/domReady!assets/map/zhongzhi/shuilisheshi"
    ],
    function (
        Parser,
        registry,
        esriBasemaps, Map, Extent, SpatialReference,
        SDTDTLayer, SDRasterLayer, SDRSAnnoLayer, SDRasterAnnoLayer,
        Tiled, ArcGISDynamicMapServiceLayer, FeatureLayer, GraphicsLayer,
        Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol,
        IdentifyTask, IdentifyParameters,
        Draw, Query, QueryTask,
        Graphic,
        Scalebar,
        HomeButton, LocateButton, BasemapToggle, OverviewMap, Search,
        webMercatorUtils,
        FindTask, FindParameters, InfoTemplate, Popup,
        dom, on, Color, keys, Units, query, domAttr, Legend, LegendLayer,
        BorderContainer, ContentPane, Button, WidgetSet,
        arrayUtils, domConstruct
    ) {

        var SpatialQueryHtml;//打印空间查询字符串

        var vectormap = new SDTDTLayer();//矢量
        var rastermap = new SDRasterLayer();//影像
        var rasterannomap = new SDRSAnnoLayer();//影像注记

        var markerTDT = rain_mark_symbol_qurey_red();//属性查询标记样式

        dojo.parser.parse();

        //初始化地图
        map = rain_newmap(null, null, null);
        map.addLayer(vectormap, 0);




        window.MapChance = function (id) {
            if (id === 1) {
                //切换影像地图
                map.addLayer(rastermap, 0);//增加影像
                map.addLayer(rasterannomap, 1);//增加影像注记
                map.removeLayer(vectormap);//去除矢量
                basemapFUN();
            } else if (id === 2) {
                //切换影像地图
                map.addLayer(vectormap, 0);//添加矢量
                map.removeLayer(rasterannomap);//去除影像注记
                map.removeLayer(rastermap);//去除影像
                basemapFUN();
            }
        };

        //  主页按钮
        var home = new HomeButton({map: map}, "HomeButton");
        home.startup();

        // 测量工具
        measurement = rain_Measurement(map, null);
        measurement.startup();


        // 比例尺
        var scalebar = rain_scalebar(map);


        //******************构造绘制工具
        var DrawGraphics = new esri.layers.GraphicsLayer({id: "drawLayer"});
        DrawGraphics.SpatialReference = new SpatialReference({wkid: 4490});
        map.addLayer(DrawGraphics, 7);
        var draw = new Draw(map);
        //定义图形样式
        draw.markerSymbol = new SimpleMarkerSymbol();
        draw.lineSymbol = new SimpleLineSymbol();
        draw.fillSymbol = new SimpleFillSymbol();
        //激活绘制工具
        $(".drawTool button").click(function () {
            var tool = null;
            switch (this.id) {
                case "point":
                    tool = "POINT";
                    break;
                case "line":
                    tool = "POLYLINE";
                    break;
                case "polygon":
                    tool = "POLYGON";
                    break;
                case "circle":
                    tool = "CIRCLE";
                    break;
                case "rectangle":
                    tool = "RECTANGLE";
                    break;
                case "quxiao":
                    draw.deactivate();
                    break;
                case "remove":
                    DrawGraphics.clear();
                    break;
            }
            if (tool !== null) {
                draw.activate(Draw[tool]); //激活对应的绘制工具
            }
        });
        draw.on("draw-complete", drawEndEvent);

        function drawEndEvent(evt) {
            //添加图形到地图
            var symbol;
            if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                symbol = draw.markerSymbol;
            } else if (
                evt.geometry.type === "line" || evt.geometry.type === "polyline"
            ) {
                symbol = draw.lineSymbol;
            } else {
                symbol = draw.fillSymbol;
            }
            var Tx = new Graphic(evt.geometry, symbol);
            DrawGraphics.add(Tx);
        }

        //主要图层
        var ADDurl = MapServerurl + "arcgis/rest/services/huinong/zhongzhiBuffer/MapServer";
        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(ADDurl);
        // dynamicMapServiceLayer.setVisibleLayers([-1,-1,-1,-1,4]);
        dynamicMapServiceLayer.setVisibleLayers([4]);
        map.addLayer(dynamicMapServiceLayer, 3);


        window.shuilisheshi = function () {
            rain_LayerControl_single(dynamicMapServiceLayer, "#shuilisheshi")
        };


        //添加诸城边界线
        var bianjie = new ArcGISDynamicMapServiceLayer(MapServerurl + "arcgis/rest/services/bianjie/MapServer");
        map.addLayer(bianjie, 2);

        //社区边界
        var bianjie_shequ_url = MapServerurl + "arcgis/rest/services/shequbianjie/MapServer";
        var bianjie_shequ = new ArcGISDynamicMapServiceLayer(bianjie_shequ_url);
        // 社区边界图层控制
        window.shequjiexian = function () {
            rain_LayerControl_single(bianjie_shequ, "#shequbianjie")
        };

        //乡镇边界
        var bianjie_xiangzhen_url = MapServerurl + "arcgis/rest/services/newxzbj/MapServer";
        var bianjie_xiangzhen = new ArcGISDynamicMapServiceLayer(bianjie_xiangzhen_url);
        //乡镇边界图层控制
        window.xiangcunjiexian = function () {
            rain_LayerControl_single(bianjie_xiangzhen, "#xiangzhenbianjie")
        };

        map.addLayer(bianjie_xiangzhen, 7);
        bianjie_xiangzhen.setVisibility(false);
        map.addLayer(bianjie_shequ, 8);
        bianjie_shequ.setVisibility(false);


        on(dynamicMapServiceLayer, "load", mapReady_Spatialquery);
        on(dynamicMapServiceLayer, "load", loadLayerList);


        //图层控制
        function loadLayerList() {
            var title = "<div id='gouxuanbiaoti'>图层选择" + "<span id='stopBtn1' class='glyphicon glyphicon-remove'  style='color: #fff;top:8px'onclick=\"$('#tool_LayerControl').hide('slow');\"> </span>" + "</div>";
            var html = "<div id='div_gouxuan' class='form-control'><input id='shuilisheshi' name='layerList' class='listCss' type='checkbox' value='checkbox' onclick='shuilisheshi()' checked='true' />水利设施"+huinongIzhongzhibuffer(4)+"</div>";

            rainControlLayerListBySingle(title, html);
        }


        //图例
        var legend = rain_dijit_legend(map, dynamicMapServiceLayer, null);
        legend.startup();

        //空间查询
        PINsymbol = rain_mark_symbol_pin();
        PINGraphics = new esri.layers.GraphicsLayer({id: "customGraphics"});
        map.addLayer(PINGraphics, 6);

        var hideorblockone = document.getElementById('oneTC').style.display;//读取第一个弹窗的状态
        var hideorblocktwo = document.getElementById('twoTC').style.display;//读取第二个弹窗的状态

        var defineIdentifyParams;


        function mapReady_Spatialquery() {


            defineIdentifyParams = {
                tolerance: 5,
                returnGeometry: "true",
                layerIds: [4],
                layerOption: "LAYER_OPTION_ALL",
                width: map.width,
                height: map.height
            };
            mapIdentifyOnOff = rain_mapReady_Spatialquery(map, ADDurl, defineIdentifyParams);

        }


        window.rain_mapReady_Spatialquery_callback = function (vaule) {

            SpatialQueryHtml = "";

            //对弹窗进行判断
            if (dojo.query("#shuilisheshi")[0].checked) {

                if (hideorblockone === 'none' && hideorblocktwo === 'none') {
                    $("#oneTC").slideDown("slow");
                } else if (hideorblockone === 'block' && hideorblocktwo === 'block') {
                    document.getElementById('twoTC').style.display = 'none';
                }
            }
            else {
                alert("请您勾选你要查询的图层");
            }


            var lengtrh = vaule.length;

            if (lengtrh == 0) {
                SpatialQueryHtml = "<br><br>请准确点击信息点";
            } else {

                var responseSZ;
                for (var fori = 0; fori < lengtrh; fori++) {
                    responseSZ = vaule[fori];
                    var feature = responseSZ.feature;
                    var layerName = responseSZ.layerName;
                    if (layerName === '水利设施') {
                        SpatialQueryHtml += "<p style='font-size: 15px;margin-top: 15px;margin-bottom: 2px;font-weight: bolder;' >水利设施</p>";
                        SpatialQueryHtml += panduan('水利设施名称', feature.attributes.name, "");
                        SpatialQueryHtml += panduan('水利设施类型', feature.attributes.category, "");
                        SpatialQueryHtml += panduan('设计总库容', feature.attributes.tstorage, "万方");
                        SpatialQueryHtml += panduan('兴利水位', feature.attributes.ewl, "米");
                        SpatialQueryHtml += panduan('兴利相应蓄水量', feature.attributes.cstorage, "万方");
                        SpatialQueryHtml += panduan('汛限水位', feature.attributes.fcl, "米");
                        SpatialQueryHtml += panduan('现水位', feature.attributes.ewl1, "米");
                        SpatialQueryHtml += panduan('现蓄水量', feature.attributes.exisitingstorage, "万方");
                        SpatialQueryHtml += panduan('所在社区', feature.attributes.mc, "");
                    }
                }//for
            }//else
            dom.byId("agriculture").innerHTML = SpatialQueryHtml;

        };


        //属性查询


        /**
         * 使用qurey进行查询 保留
         */
        // on(document.getElementById("findBtn"), "click", function () {
        //
        //     var queryTask = new QueryTask(ADDurl + "/4");
        //     var Aquery = new Query();
        //
        //     Aquery.where = "objectid >=0";
        //     Aquery.outFields = ["*"];
        //     Aquery.returnGeometry = true;
        //
        //     queryTask.execute(Aquery, function (date) {
        //         console.log(date);
        //
        //         var features = date.features;
        //         var ainnerHtml="";
        //         for (var a = 0; a < features.length; a++) {
        //             var contents = features[a];
        //
        //             // var graphic = contents.geometry;
        //             // // graphic.setSymbol(markerTDT);
        //             // map.graphics.add(graphic);
        //             // wnihao(contents.geometry, markerTDT);
        //
        //
        //             var pointx = contents.geometry.x;
        //             var pointy = contents.geometry.y;
        //
        //
        //             ainnerHtml += "<a href='javascript:rain_mapMovethePointa("+pointx+","+pointy+",13)' style='font-size:14px;'>" + contents.attributes.name + "</a><br>";
        //             ainnerHtml += panduan("总库容", contents.attributes.tstorage, "");
        //             ainnerHtml += panduan("现水位", contents.attributes.ewl, "");
        //             ainnerHtml += panduan("现蓄水量", contents.attributes.exisitingstorage, "立方米");
        //
        //
        //         }
        //         document.getElementById("contentsContainer").innerHTML = ainnerHtml;
        //     });
        //
        //     $("#downTC").slideDown("slow");
        //     document.getElementById('oneTC').style.display = 'none';
        //     document.getElementById('twoTC').style.display = 'none';
        //
        //
        // });


       

        //定义显示3种高亮现实
        var ptSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));
        var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
        var polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
        var markerTDT = new PictureMarkerSymbol({
            "angle": 0,
            "xoffset": 0,
            "yoffset": 15,
            "type": "esriPMS",
            "url": "../../map/img/marker/marker_red.png",
            "contentType": "image/png",
            "width": 30,
            "height":30
        });
        
     //*****属性查询******
     var findTask = new FindTask(ADDurl);
     var findParams = new FindParameters();
     findParams.returnGeometry = true;
     findParams.layerIds = [4];//与上面显示的对应起来
     findParams.searchFields = ["mc"];

        // 根据输入的关键字进行findTask操作
        wexecute = function (searchText) {
            findParams.searchText = searchText;
            findTask.execute(findParams, showResultsSXCX);
        };


        function showResultsSXCX(results) {
            map.graphics.clear();
            var innerHtml = "";
            innerHtml += "查询到&nbsp<a style='font-weight: bold;width: 20px;'>" + results.length + "</a>&nbsp处相关的结果";
            for (var i = 0; i < results.length; i++) {
                var curFeature = results[i];
                var graphic = curFeature.feature;
                var infoTemplate = null;
                graphic.setSymbol(markerTDT);
                map.graphics.add(graphic);
                var name = curFeature.layerName;
                if (name === "水利设施") {
                    innerHtml += "<p style='font-size: 15px;margin-top: 15px;margin-bottom: 2px;font-weight: bolder;' >水利设施</p>" ;
                    innerHtml += panduan('水利设施类型', graphic.attributes.category, "");
                    innerHtml += panduan('设计总库容', graphic.attributes.tstorage, "万方");
                    innerHtml += panduan('兴利水位', graphic.attributes.ewl, "米");
                    innerHtml += panduan('兴利相应蓄水量', graphic.attributes.cstorage, "万方");
                    innerHtml += panduan('汛限水位', graphic.attributes.fcl, "米");
                    innerHtml += panduan('现水位', graphic.attributes.ewl1, "米");
                    innerHtml += panduan('现蓄水量', graphic.attributes.exisitingstorage, "万方");
                    innerHtml += panduan('所在社区', graphic.attributes.mc, "");
                }

            }
            document.getElementById("contentsContainer").innerHTML = innerHtml;
        }


        window.openIdentify = function () {
            mapIdentifyOnOff = rain_mapReady_Spatialquery(map, ADDurl, defineIdentifyParams);

        };

        window.closeIdentify = function () {
            mapIdentifyOnOff.remove();
        };

        window.biaohuiclear = function () {
            DrawGraphics.clear();
            draw.deactivate();
        };


        /*@rain
         * 2019/1/10 10:29
          * local move function
          * */
        var lOCALGraphics = new esri.layers.GraphicsLayer({id: "LocalLayer"});
        map.addLayer(lOCALGraphics, 12);

        var FLocal = rain_mark_symbol_local_blue();

        window.localMove = function (mapLocation) {
            var LocalGraphic = new Graphic(mapLocation, FLocal, null, null);
            lOCALGraphics.add(LocalGraphic);
        };

        /*2019/1/10
        *@rain
        *手机端：定位显示自己所在位置，并不进行跳转
        * update:2019/1/11 0:11
        * */

        var latlocal, lonlocal;
        window.mapMove = function (latitude, longitude) {
            latlocal = latitude;
            lonlocal = longitude;
            var mapLocation = new esri.geometry.Point({
                "x": longitude,
                "y": latitude,
                "spatialReference": {"wkid": 4490}
            });
            localMove(mapLocation);
        };
        window.dingwei = function () {
            var mapLocationmove = new esri.geometry.Point({
                "x": lonlocal,
                "y": latlocal,
                "spatialReference": {"wkid": 4490}
            });
            map.centerAndZoom(mapLocationmove, 18);
        };
        /*local move function end*/


        //清除
        window.mapclear = function (num) {
            if (num == 0) {
                map.graphics.clear();
            } else if (num == 1) {
                PINGraphics.clear();
                map.graphics.clear();
            } else {
                console.log("你这点的啥？？");
            }

        }
        /*清除*/


    });