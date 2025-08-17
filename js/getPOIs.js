// 获取POI数据
// 主要分为3种方法，分别为读取本地csv/json数据、在线爬取高德POI、读取后台数据库的POI数据
// 目前的框架采用的是第三种方式

// 所有POI数据
allPOI = [];
// 存储x种缩放方案(影像金字塔)
poisPyramid = [];


// 读取本地json文件
function readJson(jsonFile) {
    // // 读取本地json文件（方法一）
    // $.ajax({
    //     url: "wuhan.json",//同文件夹下的json文件路径
    //     type: "GET",//请求方式为get
    //     dataType: "json", //返回数据格式为json
    //     success: function (data) {//请求成功完成后要执行的方法 
    //         console.log(data);
    //     }
    // })


    // // 读取本地json文件（方法二）
    // $.getJSON("wuhan.json", function (data) {
    //     console.log(data)
    // });


    // // 读取本地json文件（方法三）
    // var url = "wuhan3.json"
    // // 申明一个XMLHttpRequest
    // var request = new XMLHttpRequest();
    // // 设置请求方法与路径
    // request.open("get", url);
    // // 不发送数据到服务器
    // request.send(null);
    // //XHR对象获取到返回信息后执行
    // request.onload = function () {
    //     // 解析获取到的数据
    //     var myJson = JSON.parse(request.responseText);
    //     console.log(myJson);
    // }



    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", "../json/chinapoi.csv", false);
    // xhr.overrideMimeType("text/plain; charset=gb2312");
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         var csvData = xhr.responseText;
    //         var lines = csvData.split("\n");
    //         allPOI = [];
    //         var headers = lines[0].split(",");
    //         for (var i = 1; i < lines.length; i++) {
    //             var obj = {};
    //             var currentLine = lines[i].split(",");
    //             for (var j = 0; j < headers.length; j++) {
    //                 obj[headers[j]] = currentLine[j];
    //             }
    //             allPOI.push(obj);
    //         }
    //         console.log(allPOI); // 输出 JSON 数组
    //         // 更新总数
    //         allPOILength = allPOI.length;
    //         // 在高德地图展示POI点
    //         showPOI();
    //     }
    // };
    // xhr.send();





    // 读取本地json文件（方法四）（同步读取）
    const xhr = new XMLHttpRequest();
    xhr.open('GET', jsonFile, false); // 同步请求
    xhr.overrideMimeType("text/plain; charset=gb2312");
    xhr.send();
    var csvData = xhr.responseText;
    var lines = csvData.split("\r\n");
    allPOI = [];
    heatmapData = [];
    for (var i = 1; i < lines.length - 1; i++) {
        var currentLine = lines[i].split(",");
        var pname = currentLine[0];
        var X_gcj02 = parseFloat(currentLine[1]);
        var Y_gcj02 = parseFloat(currentLine[2]);
        var city = currentLine[3];
        var location = [X_gcj02, Y_gcj02];
        var rankInCity = parseInt(currentLine[4]);
        var rankInChina = parseInt(currentLine[5]);
        var onePOI = {
            "pid": i - 1,
            "pname": pname,
            "X_gcj02": X_gcj02,
            "Y_gcj02": Y_gcj02,
            "lnglat": location,
            "rankInCity": rankInCity,
            "rankInChina": rankInChina,
            "city": city,
            "selected": "",
            "checked": false,
            "deleted": false,
        }
        allPOI.push(onePOI);

        if (i % 10 == 0) {
            // 由于数据量太大，因此对数据进行随机抽稀
            var onedata = {
                "lng": X_gcj02,
                "lat": Y_gcj02,
                "count": 41960 - rankInChina
            }
            // 存放到热力图的数据中
            heatmapData.push(onedata);
        }

    }
    console.log(allPOI);
    console.log(heatmapData);

    // 更新总数
    allPOILength = allPOI.length;
    // 在高德地图展示POI点
    // changeSelected();

    // 初始化热力图
    heatmap = new AMap.HeatMap(map, {
        radius: 15,
        opacity: [0, 0.3],
    });
    heatmap.setDataSet({ data: heatmapData });



    // //==========================================================================

    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', jsonFile, false); // 同步请求
    // xhr.send();
    // var jsonPOI = JSON.parse(xhr.responseText);

    // var iinum = 0;
    // // 格式化数据
    // var jsonPOILength = Object.keys(jsonPOI).length;
    // for (var i = 0; i < jsonPOILength; i++) {

    //     // // 只筛选广东省的数据
    //     // var sheng = jsonPOI[i].sheng;
    //     // if (sheng != "广东省" && sheng != "香港特别行政区" && sheng != "澳门特别行政区" && sheng != "福建省" && sheng != "江西省" && sheng != "湖南省" && sheng != "广西壮族自治区" && sheng != "海南省" && sheng != "贵州省" && sheng != "台湾省") continue;

    //     // 只筛选10000条数据
    //     // if (iinum == 10000) break;

    //     // var city = jsonPOI[i].city;
    //     // if(city!="武汉") continue;

    //     // var rankIncity = jsonPOI[i].rankInCity
    //     // if(rankIncity>100) continue;


    //     var pname = jsonPOI[i].pname;
    //     var X_gcj02 = jsonPOI[i].X_gcj02;
    //     var Y_gcj02 = jsonPOI[i].Y_gcj02;
    //     // var X_wgs84 = jsonPOI[i].X_wgs84;
    //     // var Y_wgs84 = jsonPOI[i].Y_wgs84;
    //     var location = [X_gcj02, Y_gcj02];
    //     var rankInCity = jsonPOI[i].rankInCity;
    //     var rankInChina = jsonPOI[i].rankInChina;
    //     var city = jsonPOI[i].city;
    //     // console.log(pname,X,Y);
    //     var onePOI = {
    //         "pid": i,
    //         "pname": pname,
    //         "X_gcj02": X_gcj02,
    //         "Y_gcj02": Y_gcj02,
    //         // "X_wgs84": X_wgs84,
    //         // "Y_wgs84": Y_wgs84,
    //         "lnglat": location,
    //         "rankInCity": rankInCity,
    //         "rankInChina": rankInChina,
    //         "city": city,
    //         "selected": "",
    //         "checked": false,
    //         "deleted": false,
    //     }
    //     allPOI.push(onePOI);
    //     iinum++;
    // }
    // console.log(allPOI);
    // // 更新POI总数
    // allPOILength = allPOI.length;

    // //=============================================================================

    // // 在高德地图展示POI点
    // showPOI();

}


// 获取数据库的POI数据(输入坐标系?)
function getDBPOIs(locationX, locationY, radius) {
    //=======================================================
    // 开始向后台请求数据（将中心经纬度与半径传输给后台）
    $.ajax({
        url: "http://localhost:3333/ajaxGet_main2",
        type: "get",
        data: { X: locationX, Y: locationY, radius: radius },
        success: function (db_pois) {
            console.log(db_pois);
            myJson = db_pois;

            // 开始生成中心型标签云
            getTagCloud();
        }
    });
}


// 获取数据库所有的POI
function getDBPOIs2() {
    $.ajax({
        url: "http://localhost:3333/ajaxGet_allPOI",
        type: "get",
        // data: { X: mainLongitude, Y: mainLatitude },
        // data: { X: 114.333507, Y: 30.577343 },
        success: function (db_pois) {
            console.log(db_pois);
            allPOI = db_pois;
            // 在高德地图展示POI点
            showPOI();
        }
    });
}



//构造路线导航类
var driving = new AMap.Driving({
    policy: "AMap.DrivingPolicy.LEAST_TIME",  // 最便捷的驾车策略
    // map: map,
    // panel: "panel"
});

// 输入中心经纬度与当前POI点
function searchDriving(lnglat, poi) {
    return new Promise((resolve, reject) => {
        // 高德驾车路径查询，一天只有5000配额
        driving.search(new AMap.LngLat(lnglat[0], lnglat[1]), new AMap.LngLat(poi.X, poi.Y), (status, result) => {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
                resolve(result)
            } else {
                console.log("error", result)
            }
        });
    });
}




// 按距离升序排列
function upDis(a, b) {
    return a.distance - b.distance
}
// 按排名升序排列
function upRank(a, b) {
    return a.rankInChina - b.rankInChina
}


// 初始化标签大小
function initTagSize(data) {
    // 先按排名升序
    data.sort(upRank);
    // POI数量
    var dataLength = Object.keys(data).length;
    // 标签类别
    var taglevelNum = document.getElementById("select-typeface-levelNum").value;
    for (var i = 0; i < dataLength; i++) {

        // 统一字体
        data[i].typeface = g_typeface;
        // 统一字重
        var theFontWeight = document.getElementById("fontWeight").value;
        data[i].fontWeight = theFontWeight;


        // 设置字体大小
        var classIndex = Math.floor(i / (data.length / taglevelNum));
        data[i].fontSize = g_fontSize[classIndex];
    }
    return data;
}

// 初始化标签颜色
function initTagColor(data) {
    // 按距离升序
    data.sort(upDis);
    // 设置标签颜色（此时已经按照距离升序了）
    var dataLength = Object.keys(data).length;

    // 获取当前的配色方案
    var colorItems = document.getElementById("peise-current-color-bar").getElementsByClassName("item");
    var colors = [];
    // 遍历每个元素并提取背景颜色
    for (var i = 0; i < colorItems.length; i++) {
        var bgColor = window.getComputedStyle(colorItems[i]).getPropertyValue("background-color");
        colors.push(bgColor);
    }
    // console.log(colors);

    // 颜色类别
    var colorNum = document.getElementById("select-color-levelNum").value;
    // 颜色离散方式
    var colorDispersed = document.getElementById("select-color-dispersed").value;
    for (var i = 0; i < dataLength; i++) {
        // 计算颜色类别索引
        var classIndex = calculateClassIndex(data, i, data.length, colorNum, colorDispersed);
        // console.log(classIndex);
        // 对POI进行字体颜色赋值
        data[i].fontColor = colors[classIndex];
    }

    return data;
}


// 计算颜色类别索引的函数，数据data, 当前索引index、数量总数total、颜色数量colorNum、颜色离散方式colorDispersed
function calculateClassIndex(data, index, total, colorNum, colorDispersed) {
    var classIndex;
    // console.log(data);

    // 根据选择的颜色离散方式计算颜色类别索引
    switch (colorDispersed) {
        case '相等间隔':
            // 将distance的取值范围均分为colorNum类，使得每一类内的取值范围相等
            var minValue = Math.min.apply(null, data.map(item => item.distance)); // 获取最小值
            var maxValue = Math.max.apply(null, data.map(item => item.distance)); // 获取最大值
            var range = maxValue - minValue; // 计算数值范围
            // console.log(range);
            var interval = range / colorNum; // 计算每个间隔的大小
            classIndex = Math.floor((data[index].distance - minValue) / interval); // 根据间隔确定颜色类别索引
            break;
        case '分位数':
            // 每一类内有相等数量的要素
            var percentile = (index + 1) / total;
            classIndex = Math.ceil(colorNum * percentile) - 1;
            break;
        case '自然间断点(Jenks)':
            // 将对分类间隔加以识别，可对相似值进行最恰当地分组，并可使各个类之间的差异最大化
            var values = data.map(item => item.distance); // 获取所有数据值
            var jenksBreaks = calculateNaturalBreaks(values, colorNum);
            for (var i = 0; i < jenksBreaks.length; i++) {
                if (data[index].distance <= jenksBreaks[i]) {
                    classIndex = i;
                    break;
                }
            }
            break;
        case '几何间隔':
            // 使每个类的元素数的平方和最小。这可确保每个类范围与每个类所拥有的值的数量大致相同，且间隔之间的变化非常一致
            var minValue = Math.min.apply(null, data.map(item => item.distance)); // 获取最小值
            var maxValue = Math.max.apply(null, data.map(item => item.distance)); // 获取最大值
            var ratio = Math.pow(maxValue / minValue, 1 / colorNum);
            classIndex = Math.floor(Math.log(data[index].distance / minValue) / Math.log(ratio));
            break;
        case '标准差':
            // 计算标准差方式的颜色类别索引
            var values = data.map(item => item.distance); // 获取所有数据值
            var mean = values.reduce((acc, curr) => acc + curr, 0) / values.length; // 计算平均值
            var stdDev = Math.sqrt(values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / values.length); // 计算标准差
            var deviation = data[index].distance - mean; // 计算数据点与平均值的偏差
            var stdDevInterval = stdDev / colorNum; // 使用1倍标准差作为间隔
            classIndex = Math.floor(deviation / stdDevInterval) + Math.floor(colorNum / 2);
            // 调整 classIndex 范围，确保在 [0, colorNum - 1] 内
            if (classIndex < 0) {
                classIndex = 0;
            } else if (classIndex >= colorNum) {
                classIndex = colorNum - 1;
            }
            break;
        default:
            classIndex = 0;
            break;
    }

    return classIndex;
}


// 计算自然间断点（Jenks）的主要函数
function calculateNaturalBreaks(data, numClasses) {
    var sortedData = data.slice().sort((a, b) => a - b);
    var jenksBreaks = calculateJenks(sortedData, numClasses);
    return jenksBreaks;
}

// 计算自然间断点
function calculateJenks(data, numClasses) {
    var n = data.length;
    var mat1 = [];
    var mat2 = [];
    var classIndex = [];
    var jenksBreaks = [];
    var k = 0;

    for (var i = 0; i <= n; i++) {
        var temp = [];
        for (var j = 0; j <= numClasses; j++) {
            temp.push(0);
        }
        mat1.push(temp);
        mat2.push(temp.slice());
        classIndex.push([]);
    }

    for (var i = 1; i <= numClasses; i++) {
        mat1[1][i] = 1;
        mat2[1][i] = 0;
        for (var j = 2; j <= n; j++) {
            mat2[j][i] = Infinity;
        }
    }

    for (var l = 2; l <= n; l++) {
        var s1 = 0;
        var s2 = 0;
        var w = 0;

        for (var m = 1; m <= l; m++) {
            var i3 = l - m + 1;
            var val = data[i3 - 1];

            s2 += val * val;
            s1 += val;
            w++;
            var g = s2 - (s1 * s1) / w;
            var i4 = i3 - 1;

            if (i4 !== 0) {
                for (var j = 2; j <= numClasses; j++) {
                    if (mat2[l][j] >= g + mat2[i4][j - 1]) {
                        mat1[l][j] = i3;
                        mat2[l][j] = g + mat2[i4][j - 1];
                    }
                }
            }
        }

        mat1[l][1] = 1;
        mat2[l][1] = 99999999999999;
    }

    while (k <= numClasses) {
        classIndex[k] = [];
        k++;
    }

    k = numClasses;
    var kclass = n;

    while (k >= 2) {
        var id = mat1[kclass][k] - 2;
        classIndex[k - 1].unshift(...data.slice(id + 1, kclass + 1));
        kclass = id + 1;
        k--;
    }

    classIndex[0].unshift(...data.slice(0, kclass));

    for (var i = 0; i < classIndex.length; i++) {
        jenksBreaks.push(Math.max(...classIndex[i]));
    }

    return jenksBreaks;
}


// 更新影像金字塔
// function initpoisPyramid(data) {
//     // 按排名升序（之后便于划分影像金字塔）
//     data.sort(upRank);
//     var dataLength = Object.keys(data).length;
//     // 划分影像金字塔
//     poisPyramid[0] = data.slice(0, Math.round(dataLength / 64));
//     poisPyramid[1] = data.slice(0, Math.round(dataLength / 32));
//     poisPyramid[2] = data.slice(0, Math.round(dataLength / 16));
//     poisPyramid[3] = data.slice(0, Math.round(dataLength / 8));
//     poisPyramid[4] = data.slice(0, Math.round(dataLength / 4));
//     poisPyramid[5] = data.slice(0, Math.round(dataLength / 2));
//     poisPyramid[6] = data;

//     // 划分完影像金字塔之后，各副影像再按照距离升序排列
//     poisPyramid[0].sort(upDis);
//     poisPyramid[1].sort(upDis);
//     poisPyramid[2].sort(upDis);
//     poisPyramid[3].sort(upDis);
//     poisPyramid[4].sort(upDis);
//     poisPyramid[5].sort(upDis);
//     poisPyramid[6].sort(upDis);

//     console.log(poisPyramid);
// }


function initpoisPyramid(data) {
    // 总数量
    var dataLength = Object.keys(data).length;
    // 将用于第一次初始化标签云的scale
    tagCloudScale = 0;

    data.sort(upDis);
    poisPyramid[0] = data;

    data.sort(upRank);

    // 定义函数用于判断是否达到了数据量小于10的条件
    function shouldStopSplitting(length) {
        return length <= 10;
    }
    // 自定义划分分层数据
    function splitData() {
        scale = 0;
        while (!shouldStopSplitting(dataLength)) {
            // 当数据量还大于10的时候，进入while循环
            if (tagCloudScale==0 && dataLength <= 100) {
                // 当数据量已经小于100的时候，继续其tagCloudScale
                tagCloudScale = scale;
            }
            scale ++;
            // 进行数据划分
            data = data.slice(0, Math.round(dataLength / 2));
            // 更新 poisPyramid
            poisPyramid[scale] = data;
            // 更新数据长度
            dataLength = Object.keys(data).length;
        }
        MaxtagCloudScale = scale;
    }
    // 对影像金字塔里面的数据进行排序
    function sortData(){
        var poisPyramidLength = poisPyramid.length;
        for(var i=0;i<poisPyramidLength;i++){
            poisPyramid[i].sort(upDis);
        }
    }
    // 分割数据
    splitData();
    // 排序数据
    sortData();

    console.log(poisPyramid);
}
