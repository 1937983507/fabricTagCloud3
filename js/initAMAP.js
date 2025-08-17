// 获取本地IP地址
// 使用IP地址获得本机的经纬度
// 显示当前经纬度下的高德地图
// 添加POI点覆盖物
// 支持用户绘制圆形范围


// 筛选所得圆形范围内的POI点
// circlePOIs = [];
// 存储用户绘制的覆盖物
userDrawObj = null;
// 编辑器对象
userDrawEditor = null;


// 加载高德地图（用户所在地理位置的高德地图）
function initAMAP() {
    //初始化地图对象，加载地图
    map = new AMap.Map("mid-map", {
        // center: [120.585301, 31.301078],  //苏州
        // center: [114.057939,23.143527],  //深圳
        zoom: 9,
        viewMode: '2D',
    });

    // 遥感影像
    satelliteLayer = new AMap.TileLayer.Satellite();
    map.addLayer(satelliteLayer);
    satelliteLayer.hide();
    // 路网图层
    roadNetLayer = new AMap.TileLayer.RoadNet();
    map.addLayer(roadNetLayer);
    roadNetLayer.hide();
    // 实时交通图层
    trafficLayer = new AMap.TileLayer.Traffic();
    map.addLayer(trafficLayer);
    trafficLayer.hide();




    // 设置拖拽时的鼠标样式
    map.on('dragstart', function () {
        map.setDefaultCursor('grabbing'); // 设置拖拽时的鼠标样式为手状
    });
    // 设置拖拽结束时的鼠标样式
    map.on('dragend', function () {
        map.setDefaultCursor('auto'); // 设置拖拽结束时的鼠标样式为默认箭头
    });

    // 搜索定位
    // 输入提示(每日100配额)
    var auto = new AMap.AutoComplete({ input: "searchPosText" });
    //构造地点查询类
    var placeSearch = new AMap.PlaceSearch({
        map: map
    });
    //注册监听，当选中某条记录时会触发
    auto.on("select", select);
    function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
        closeModell2Fun();
    }





    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
    map.addControl(new AMap.ToolBar({
        position: {
            top: '60px',
            right: '15px'
        }
    }));

    // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
    map.addControl(new AMap.Scale());

    // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    // map.addControl(new AMap.MapType({
    //     position: {
    //         top: '15px',
    //         right: '15px'
    //     }
    // }));






    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();
    //右键放大
    contextMenu.addItem("放大一级", function () {
        map.zoomIn();
    }, 0);
    //右键缩小
    contextMenu.addItem("缩小一级", function () {
        map.zoomOut();
    }, 1);
    //右键显示全国范围
    contextMenu.addItem("缩放至全国范围", function (e) {
        map.setZoomAndCenter(4, [108.946609, 34.262324]);
    }, 2);
    //地图绑定鼠标右击事件——弹出右键菜单
    map.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat);
        contextMenuPositon = e.lnglat;
    });


    // 检索定位模态框的显示
    var searchPosBtn = document.getElementById("searchPosBtn");
    searchPosBtn.addEventListener("click", searchPosFun)
    // 检索定位模态框的关闭
    var closeModel2 = document.getElementById("closeModel2");
    closeModel2.addEventListener("click", closeModell2Fun);
    var searchPosButtom = document.getElementById("searchPosButtom");
    searchPosButtom.addEventListener("click", function() {
        var searchPosText = document.getElementById("searchPosText").value;
        if (searchPosText.trim() !== "") { // 确保搜索文本框不为空
            placeSearch.search(searchPosText); // 执行地点查询
            closeModell2Fun(); // 单击搜索按钮后隐藏搜索内容
        } else {
            alert("请输入搜索内容");
        }
    });

    // 地图切换选项控制显示隐藏
    var mapTypeDropdown = document.getElementById("mapTypeDropdown");
    mapTypeDropdown.addEventListener("mouseover", mapTypeDropdownShow);
    mapTypeDropdown.addEventListener("mouseout", mapTypeDropdownHide);
    // 数据筛选项控制显示隐藏
    var drawToFilterData = document.getElementById("drawToFilterData");
    drawToFilterData.addEventListener("mouseover", drawToFilterDataShow);
    drawToFilterData.addEventListener("mouseout", drawToFilterDataHide);
    // 清除所有选择
    var cleardrawBtn = document.getElementById("cleardrawBtn");
    cleardrawBtn.addEventListener("click", cleardraw);
    // 单击运行
    var runBtn = document.getElementById("runBtn");
    runBtn.addEventListener("click", run);
}


// 展示POI点覆盖物
function showPOI() {
    // console.log("showPOI");

    // 对地图的移动与缩放添加监听事件
    map.on('moveend', function () {
        // Update markers when the map is moved or zoomed
        addMarkersToMap(allPOI);
    });

    // 初始添加POI点数据
    addMarkersToMap(allPOI);

}

// 添加POI点覆盖物/使用热力图
function addMarkersToMap() {

    var boundPOIs = allPOI.filter(function (poi) {
        return map.getBounds().contains(poi.lnglat);
    });
    var boundPOIsLength = boundPOIs.length;

    // 清除所有的覆盖物
    map.clearMap();

    if (boundPOIsLength > 500) {
        // 若是当前视图的POI数量过多
        // 则使用热力图进行表示
        heatmap.show();
    }
    else {
        // 若是当前视图的POI数量较少
        // 则展示POI点

        heatmap.hide();

        // 选中的点
        var checkedMarkers = selectedPOI.filter(function (poi) {
            return map.getBounds().contains(poi.lnglat);
        });
        // 未选中的点
        var uncheckedMarkers = noselectedPOI.filter(function (poi) {
            return map.getBounds().contains(poi.lnglat);
        });

        var checkedMass = new AMap.MassMarks(checkedMarkers, {
            opacity: 0.8,
            zIndex: 111,
            cursor: 'pointer',
            style: {
                url: '../img/point2.png',
                anchor: new AMap.Pixel(3, 3),
                size: new AMap.Size(10, 10),
                zIndex: 1
            }
        });

        var uncheckedMass = new AMap.MassMarks(uncheckedMarkers, {
            opacity: 0.8,
            zIndex: 111,
            cursor: 'pointer',
            style: {
                url: '../img/point1.png',
                anchor: new AMap.Pixel(3, 3),
                size: new AMap.Size(10, 10),
                zIndex: 1
            }
        });


        // 地名标记
        var marker = new AMap.Marker({ content: ' ', map: map });
        // 鼠标悬浮，显示地名标记
        checkedMass.on('mouseover', function (e) {
            marker.show();
            marker.setPosition(e.data.lnglat);
            marker.setLabel({ content: e.data.pname })
        });
        checkedMass.on('mouseout', function () {
            marker.hide();
        });
        uncheckedMass.on('mouseover', function (e) {
            marker.show();
            marker.setPosition(e.data.lnglat);
            marker.setLabel({ content: e.data.pname })
        });
        uncheckedMass.on('mouseout', function () {
            marker.hide();
        });

        // POI圆点单击事件
        checkedMass.on('click', function (e) {
            handleMarkerClick(e);
        })
        uncheckedMass.on('click', function (e) {
            handleMarkerClick(e);
        })

        // 将点覆盖物添加到地图
        checkedMass.setMap(map);
        uncheckedMass.setMap(map);
    }




    // 处理点覆盖物单击事件
    function handleMarkerClick(e) {
        console.log(e.data);
        var poi = e.data;
        var pid = poi.pid;
        if (poi.checked) {
            // 若原本就已经被选中
            allPOI[pid].checked = false;
            allPOI[pid].selected = "";
        }
        else {
            // 若原本未被选中
            allPOI[pid].checked = true;
            allPOI[pid].selected = "selected-row";
        }
        // 更新当前选中项目数组
        changeSelected();
        // 更新页面
        if (showAllItem) changePage(currentPage, allPOI);
        else changePage(currentPage, selectedPOI);
        // 更新当前所选项目数量
        currentSelectedItem = selectedPOI.length;
        disabledClearDelete();
    }

    // 重新将用户绘制的圆形范围添加到地图上
    if (userDrawObj) userDrawObj.setMap(map);


}


// 检索定位的显示隐藏
function searchPosFun() {
    var searchPosModal = document.getElementById("searchPosModal");
    searchPosModal.style.display = "block";
}
function closeModell2Fun() {
    var searchPosModal = document.getElementById("searchPosModal");
    searchPosModal.style.display = "none";
}


// 控制显示隐藏地图切换
function mapTypeDropdownShow() {
    var mapTypeContent = document.getElementById("mapTypeContent");
    if (mapTypeContent.style.display != "block") mapTypeContent.style.display = "block";
}
function mapTypeDropdownHide() {
    var mapTypeContent = document.getElementById("mapTypeContent");
    if (mapTypeContent.style.display != "none") mapTypeContent.style.display = "none";
}

// 控制显示绘制圆/矩形等
function drawToFilterDataShow() {
    var dropdownContent = document.getElementById("datafilterContent");
    if (dropdownContent.style.display != "block") dropdownContent.style.display = "block";
}
function drawToFilterDataHide() {
    var dropdownContent = document.getElementById("datafilterContent");
    if (dropdownContent.style.display != "none") dropdownContent.style.display = "none";
}


// 切换地图
function changeMapType(type) {
    switch (type) {
        case 'normal':
            satelliteLayer.hide();
            roadNetLayer.hide();
            trafficLayer.hide();
            break;
        case 'satellite':
            satelliteLayer.show();
            roadNetLayer.hide();
            trafficLayer.hide();
            break;
        case 'roadnet':
            trafficLayer.hide();
            roadNetLayer.show();
            break;
        case 'traffic':
            roadNetLayer.hide();
            trafficLayer.show();
            break;
        default:
            break;
    }
    // showPOI();
}


// 单击了某一绘制选项
function selectItem(value) {
    // 开始绘制圆/矩形/椭圆/多边形
    // console.log(value);

    // 获取所有的dropdown-item元素
    var dropdownItems = document.querySelectorAll(".dropdown-item");
    // 移除所有元素的选中样式
    dropdownItems.forEach(function (item) {
        item.classList.remove("selected");
        item.classList.add("disabled");
    });
    // 找到选中的元素，并为其添加选中样式
    // var selectedItem = document.getElementById(value + "Btn");
    // selectedItem.classList.add("selected");
    // selectedItem.classList.remove("disabled");

    // var selectedItem = document.getElementById("dropdownToggle");
    // selectedItem.classList.add("disabled");

    // 清除选项
    var selectedItem = document.getElementById("cleardrawBtn");
    selectedItem.classList.remove("disabled");


    // 开始绘制圆/矩形/椭圆/多边形
    switch (value) {
        case 'drawCircle':
            // 绘制圆形范围
            drawCircleFun();
            break;
        case 'drawRectangle':
            // 绘制矩形范围
            drawRectangleFun();
            break;
        case 'drawEllipse':
            // 绘制椭圆形范围
            drawEllipseFun();
            break;
        case 'drawPolygon':
            // 绘制多边形范围
            drawPolygonFun();
            break;
        default:
            break;
    }
}

// 清除绘制
function cleardraw() {
    // 获取所有的dropdown-item元素
    var dropdownItems = document.querySelectorAll(".dropdown-item");
    // 移除所有元素的选中样式
    dropdownItems.forEach(function (item) {
        item.classList.remove("disabled");
        item.classList.remove("selected");
    });

    // var selectedItem = document.getElementById("dropdownToggle");
    // selectedItem.classList.remove("disabled");

    // var selectedItem = document.getElementById("cleardrawBtn");
    // selectedItem.classList.add("disabled");


    clearSelected();
}


// 绘制圆形范围
function drawCircleFun() {
    // 鼠标工具
    var mouseTool = new AMap.MouseTool(map);

    //监听draw事件可获取画好的覆盖物
    mouseTool.on('draw', function (e) {
        // 更新存储圆形覆盖物
        userDrawObj = e.obj;

        // console.log(userDrawObj);

        //关闭绘制，保留覆盖物
        mouseTool.close(false);

        // 启动编辑
        userDrawEditor = new AMap.CircleEditor(map, userDrawObj);
        userDrawEditor.open();

        // 根据圆形范围筛选点覆盖物并更新selectedPOI
        updateSelectedPOI(userDrawObj);

        // 监听覆盖物编辑移动-改变-完成事件
        userDrawEditor.on('move', updateSelectedPOI);
        userDrawEditor.on('adjust', updateSelectedPOI);
        userDrawEditor.on('end', updateSelectedPOI);

    })

    // 绘制圆形范围的样式
    mouseTool.circle({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff'
    });
}
// 绘制矩形范围
function drawRectangleFun() {
    // 鼠标工具
    var mouseTool = new AMap.MouseTool(map);

    //监听draw事件可获取画好的覆盖物
    mouseTool.on('draw', function (e) {
        // 更新存储圆形覆盖物
        userDrawObj = e.obj;

        //关闭绘制，保留覆盖物
        mouseTool.close(false);

        // 启动编辑
        userDrawEditor = new AMap.RectangleEditor(map, userDrawObj);
        userDrawEditor.open();

        // 根据圆形范围筛选点覆盖物并更新selectedPOI
        updateSelectedPOI(userDrawObj);

        // 监听覆盖物编辑移动-改变-完成事件
        userDrawEditor.on('move', updateSelectedPOI);
        userDrawEditor.on('adjust', updateSelectedPOI);
        userDrawEditor.on('end', updateSelectedPOI);

    })

    // 绘制圆形范围的样式
    mouseTool.rectangle({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff'
    });
}
// 绘制椭圆形范围
function drawEllipseFun() {
    // 鼠标工具
    var mouseTool = new AMap.MouseTool(map);

    //监听draw事件可获取画好的覆盖物
    map.on('click', drawEllipseFunInit);

    function drawEllipseFunInit(e) {
        var lnglat = e.lnglat;

        //关闭绘制，保留覆盖物
        mouseTool.close(false);

        userDrawObj = new AMap.Ellipse({
            map: map,
            zIndex: 10,
            cursor: 'crosshair',
            strokeWeight: 2,
            strokeColor: '#f00',
            fillColor: '#00f',
            fillOpacity: 0.3,
            center: lnglat,
            radius: [10000, 5000]
        });
        map.add(userDrawObj);

        // 启动编辑
        userDrawEditor = new AMap.EllipseEditor(map, userDrawObj);
        userDrawEditor.open();

        // 根据圆形范围筛选点覆盖物并更新selectedPOI
        updateSelectedPOI(userDrawObj);

        // 监听覆盖物编辑移动-改变-完成事件
        userDrawEditor.on('move', updateSelectedPOI);
        userDrawEditor.on('adjust', updateSelectedPOI);
        userDrawEditor.on('end', updateSelectedPOI);

        // 移除地图点击事件监听器，避免再次绘制
        map.off('click', drawEllipseFunInit);
    }
}
// 绘制多边形范围
function drawPolygonFun() {
    // 鼠标工具
    var mouseTool = new AMap.MouseTool(map);

    //监听draw事件可获取画好的覆盖物
    mouseTool.on('draw', function (e) {
        // 更新存储圆形覆盖物
        userDrawObj = e.obj;

        //关闭绘制，保留覆盖物
        mouseTool.close(false);

        // 启动编辑
        userDrawEditor = new AMap.PolygonEditor(map, userDrawObj);
        userDrawEditor.open();

        // 根据圆形范围筛选点覆盖物并更新selectedPOI
        updateSelectedPOI(userDrawObj);

        // 监听覆盖物编辑移动-改变-完成事件
        userDrawEditor.on('move', updateSelectedPOI);
        userDrawEditor.on('adjust', updateSelectedPOI);
        userDrawEditor.on('end', updateSelectedPOI);

    })

    // 绘制圆形范围的样式
    mouseTool.polygon({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff'
    });
}



// 根据圆形范围筛选点覆盖物并更新selectedPOI
function updateSelectedPOI() {
    // // 获取用户绘制的范围
    // var userDrawObj = userDrawEditor.getTarget();
    // console.log(userDrawObj);
    // 获取该范围内的POI数据
    if (userDrawObj) {
        var containsPOI = allPOI.filter(function (poi) {
            return userDrawObj.contains(poi.lnglat);
        });
    }
    else {
        var containsPOI = [];
    }


    // console.log(containsPOI);

    // 清除目前的选择
    for (var i = 0; i < allPOILength; i++) {
        allPOI[i].checked = false;
        allPOI[i].selected = "";
    }
    // 重新进行选择
    for (var i = 0; i < containsPOI.length; i++) {
        // 遍历目前筛选到的所有POI
        var poi = containsPOI[i];
        var pid = poi.pid;
        allPOI[pid].checked = true;
        allPOI[pid].selected = "selected-row";
    }

    // 重新划分selectedPOI与unselectedPOI数据
    changeSelected();

    // console.log(selectedPOI);

    // 更新页面
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);
    // 更新当前所选项目数量
    currentSelectedItem = selectedPOI.length;
    disabledClearDelete();

    // 更新高德地图
    showPOI();
}



// 初始化参数
function initPara() {

    // 将绘制的区域范围
    minX = 999; minY = 999;
    maxX = -999; maxY = -999;

    // json格式的POI数据
    // myJson = [];

}


// 单击完成绘制圆形范围，准备生成标签云
function run() {

    // 若没有绘制圆形范围
    if (!userDrawObj) {
        // alert('请使用【数据筛选】功能对数据进行筛选');
        intro2.start();
        return;
    }

    // 计算中心经纬度
    if (userDrawObj.className == 'Overlay.Polygon') {
        // 若是多边形
        var bound = userDrawObj.getBounds();
        circleX = bound.getCenter().lng;  // 经度
        circleY = bound.getCenter().lat;  // 纬度
        circleLocation = [circleX, circleY];
    }
    else {
        // 若是圆/矩形/多边形
        circleX = userDrawObj.getCenter().lng;  // 经度
        circleY = userDrawObj.getCenter().lat;  // 纬度
        circleLocation = [circleX, circleY];
    }

    // 每一次完成绘制后，初始化参数
    initPara();


    // 计算距离圆心的距离
    for (var i = 0; i < selectedPOI.length; i++) {
        var tempDistance = AMap.GeometryUtil.distance(circleLocation, selectedPOI[i].lnglat);
        selectedPOI[i].distance = tempDistance;
    }



    // 初始化标签字体大小
    initTagSize(selectedPOI);
    // 初始化标签颜色
    initTagColor(selectedPOI);
    // 初始化影像金字塔
    initpoisPyramid(selectedPOI);

    console.log(selectedPOI);

    // 开始生成标签云
    getTagCloud(poisPyramid[tagCloudScale]);



}