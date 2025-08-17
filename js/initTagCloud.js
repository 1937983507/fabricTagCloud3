// 绘制标签云

// 获取将要绘制的区域范围
function getRegion(nowJson) {
    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;
    var maxDis = 0;
    for (var i = 0; i < nowJsonLen; i++) {
        // 求绘制的范围
        var tempX = nowJson[i].X_gcj02;
        var tempY = nowJson[i].Y_gcj02;
        if (tempX < minX) minX = tempX;
        if (tempX > maxX) maxX = tempX;
        if (tempY < minY) minY = tempY;
        if (tempY > maxY) maxY = tempY;

        // 获取最远距离
        // if (maxDis < nowJson[i].distance) maxDis = nowJson[i].distance;
    }

    // var showmaxDis = document.getElementById("maxDis");
    // showmaxDis.innerHTML = Math.trunc(maxDis) + "m";
}

// 经纬度与屏幕坐标的转换
function Latlon2ScreenCoordinates(nowJson) {
    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLen; i++) {
        var X = nowJson[i].X_gcj02;
        var Y = nowJson[i].Y_gcj02;
        var tempX = (X - minX) / (maxX - minX) * canvas.width;
        var tempY = (1 - (Y - minY) / (maxY - minY)) * canvas.height;

        // 四周的点向内部偏移
        if (tempX > canvas.width - 10) tempX = tempX - 100;
        if (tempY < 10) tempY = tempY + 10;
        if (tempY > canvas.height - 10) tempY = tempY - 10;

        // 转成屏幕坐标进行存储
        nowJson[i].screenX = tempX;
        nowJson[i].screenY = tempY;
        // console.log(nowJson[i].pname, nowJson[i].X, nowJson[i].Y);
    }

    // 将用户绘制的最中心点 转为屏幕坐标
    originX = (circleX - minX) / (maxX - minX) * canvas.width;
    originY = (1 - (circleY - minY) / (maxY - minY)) * canvas.height;
}


// 绘制中心点 
function drawCenter() {
    // 获取中心点图像对象
    // fabric.Image.fromURL('../img/center2.png', function (oImg) {
    //     // 在添加到画布之前，缩小图像, 并使其翻转。
    //     oImg.scale(0.2).set({ "top": originY, "left": originX });
    //     canvas.add(oImg);
    // });

    // 初始化该标签
    var tempPOI = new fabric.Text("中心位置", {
        left: originX,
        top: originY,
        fill: 'rgb(255, 255, 255)',
        fontSize: 60,
        strokeWidth: 5,
        fontWeight: 1000,
        stroke: 'rgba(255,255,255,0.7)',
        fontFamily: 'Comic Sans',
        textAlign: 'center',
        selectable: false  // 不可选中，默认是可以选中的
    });
    canvas.add(tempPOI);


}

// RES = [];


// 多角度径向偏移策略-绘制标签云
async function initDraw(nowJson) {
    console.time('计时器');

    // 要绘制的文本总数
    var nowJsonLen = Object.keys(nowJson).length;

    // 偏移策略
    var strategy = 3;
    // // 1为原始方案，会造成标签的堆积对齐
    // // 2为随机数偏移方案，在保证不增加额外时间的前提下，优化堆积对齐现象
    // // 3是顺逆时针偏移15度方案，可解决堆积对齐现象，但是时间复杂度将会大幅增加
    // if (nowJsonLen < 300) {
    //     strategy = 3;
    // }
    // else {
    //     strategy = 2;
    // }


    // 是否加排名
    var isAddRank = document.getElementById('addRank').className;
    if (isAddRank == "show") isAddRank = true;
    else isAddRank = false;
    // 是否加通行时间
    var isAddTime = document.getElementById('addTime').className;
    if (isAddTime == "show") isAddTime = true;
    else isAddTime = false;


    // 短暂地暂停，使得画布能不断更新
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    // 逐一对每一文本进行判断
    for (var i = 0; i < nowJsonLen; i++) {

        // 要显示的标签名称
        var pName = nowJson[i].pname;
        if (isAddRank) {
            // 需要添加排名
            pName += nowJson[i].rankInCity;
        }
        if (isAddTime) {
            if (!nowJson[i].time) {
                // 当前POI没有获取与中心的通行时间，马上获取
                const res = await getTime([circleX, circleY], nowJson[i]);
                var res_distance = res.routes[0].distance;  //距离单位：m
                var res_time = res.routes[0].time;  //时间单位：s
                nowJson[i].distance2 = res_distance / 1000;  //距离单位：km
                nowJson[i].time = Math.round(res_time / 60);  // 距离单位：min

                // oneres = {
                //     "name": pName,
                //     "X": nowJson[i].X_gcj02,
                //     "Y": nowJson[i].Y_gcj02,
                //     "rank": nowJson[i].rankInChina, 
                //     "distance_km": res_distance / 1000,
                //     "time_min": Math.round(res_time / 60)
                // };
                // oneres = [nowJson[i].rankInChina, res_distance / 1000, Math.round(res_time / 60), pName];
                // RES.push(oneres);
            }
            pName += ("|" + nowJson[i].time);
        }
        else {
            await sleep(0.0000001);
        }

        

        if (strategy == 1) {
            // 初始位置为圆形中心
            var newX = originX;
            var newY = originY;
            // 初始化该标签
            var tempPOI = new fabric.Text(pName, {
                left: newX,
                top: newY,
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false  // 不可选中，默认是可以选中的
            });
            canvas.add(tempPOI);


            // 计算偏移量
            var xx = nowJson[i].screenX - originX;
            var yy = nowJson[i].screenY - originY;
            var xie = Math.sqrt(xx * xx + yy * yy);
            xx = 20 * xx / xie;
            yy = 20 * yy / xie;
            // var random1 = Math.random() * (1.3 - 0.7) + 0.7;
            // var random2 = Math.random() * (1.3 - 0.7) + 0.7;
            // // console.log(random1, random2);
            // xx = 20 * random1 * xx / xie;
            // yy = 20 * random2 * yy / xie;

            var k = 1;

            // 开始偏移(朝着单一方向)
            while (true) {
                // 默认不需要偏移
                var isShift = false;

                // 通过resJson遍历已经绘制的元素
                // var resLength = Object.keys(resJson).length;
                // for (var j = 0; j < resLength; j++) {
                //     // console.log(canvas.item(j));
                //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                //         // 有重叠，得继续偏移
                //         isShift = true;
                //         // 计算偏移后的坐标
                //         newX = newX + xx;
                //         newY = newY + yy;
                //         // 开始移动标签
                //         tempPOI.set({ left: newX, top: newY });
                //         tempPOI.setCoords();
                //         // 退出遍历resJson
                //         break;
                //     }
                // }

                // 通过 canvas.forEachObject 遍历画布上所有元素
                canvas.forEachObject(function (obj) {
                    // console.log(obj);
                    // 排除当前正在移动的元素
                    if (obj === tempPOI) return

                    // 检查对象是否与另一个对象相交
                    if (tempPOI.intersectsWithObject(obj)) {
                        // 有重叠，得继续偏移
                        isShift = true;
                        // 计算偏移后的坐标
                        newX = originX + xx * k;
                        newY = originY + yy * k;
                        k++;
                        // 开始移动标签
                        tempPOI.set({ left: newX, top: newY });
                        tempPOI.setCoords();
                    }
                })


                if (!isShift) {
                    // 不需要偏移了，退出while循环
                    nowJson[i].newX = newX;
                    nowJson[i].newY = newY;
                    break;
                }

            }
        }
        else if (strategy == 2) {
            // 初始位置为圆形中心
            var newX = originX;
            var newY = originY;
            // 初始化该标签
            var tempPOI = new fabric.Text(pName, {
                left: newX,
                top: newY,
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false  // 不可选中，默认是可以选中的
            });
            canvas.add(tempPOI);


            // 计算偏移量
            var xx = nowJson[i].screenX - originX;
            var yy = nowJson[i].screenY - originY;
            var xie = Math.sqrt(xx * xx + yy * yy);
            // xx = 20 * xx / xie;
            // yy = 20 * yy / xie;
            var random1 = Math.random() * (1.3 - 0.7) + 0.7;
            var random2 = Math.random() * (1.3 - 0.7) + 0.7;
            // console.log(random1, random2);
            xx = 20 * random1 * xx / xie;
            yy = 20 * random2 * yy / xie;

            var k = 1;

            // 开始偏移(朝着单一方向)
            while (true) {
                // 默认不需要偏移
                var isShift = false;

                // 通过resJson遍历已经绘制的元素
                // var resLength = Object.keys(resJson).length;
                // for (var j = 0; j < resLength; j++) {
                //     // console.log(canvas.item(j));
                //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                //         // 有重叠，得继续偏移
                //         isShift = true;
                //         // 计算偏移后的坐标
                //         newX = newX + xx;
                //         newY = newY + yy;
                //         // 开始移动标签
                //         tempPOI.set({ left: newX, top: newY });
                //         tempPOI.setCoords();
                //         // 退出遍历resJson
                //         break;
                //     }
                // }

                // 通过 canvas.forEachObject 遍历画布上所有元素
                canvas.forEachObject(function (obj) {
                    // console.log(obj);
                    // 排除当前正在移动的元素
                    if (obj === tempPOI) return

                    // 检查对象是否与另一个对象相交
                    if (tempPOI.intersectsWithObject(obj)) {
                        // 有重叠，得继续偏移
                        isShift = true;
                        // 计算偏移后的坐标
                        newX = originX + xx * k;
                        newY = originY + yy * k;
                        k++;
                        // 开始移动标签
                        tempPOI.set({ left: newX, top: newY });
                        tempPOI.setCoords();
                    }
                })


                if (!isShift) {
                    // 不需要偏移了，退出while循环
                    nowJson[i].newX = newX;
                    nowJson[i].newY = newY;
                    break;
                }

            }
        }
        else if (strategy == 3) {
            // [x,y]围绕中心点[cx,cy]旋转angle度。
            function rotate(cx, cy, x, y, angle) {
                var radians = (Math.PI / 180) * angle;
                var cos = Math.cos(radians);
                var sin = Math.sin(radians);
                var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
                var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
                return [nx, ny];
            }
            nowJson[i].screenLocations = [];
            nowJson[i].newScreenLocations = [];
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -15));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -10));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, -5));
            nowJson[i].screenLocations.push([nowJson[i].screenX, nowJson[i].screenY]);
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 5));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 10));
            nowJson[i].screenLocations.push(rotate(originX, originY, nowJson[i].screenX, nowJson[i].screenY, 15));
            // console.log(nowJson[i].screenLocations);

            var maybeScreenLos = nowJson[i].screenLocations.length;

            // 第i个标签的第j个方向
            for (var j = 0; j < maybeScreenLos; j++) {

                // 初始位置为圆形中心
                var newX = originX;
                var newY = originY;
                // 初始化该标签
                var tempPOI = new fabric.Text(pName, {
                    left: newX,
                    top: newY,
                    fill: nowJson[i].fontColor,
                    strokeWidth: 5,
                    stroke: 'rgba(0,0,0,0.5)',
                    fontSize: nowJson[i].fontSize,
                    fontFamily: nowJson[i].typeface,
                    fontWeight: nowJson[i].fontWeight,
                    textAlign: 'center',
                    selectable: false  // 不可选中，默认是可以选中的
                });
                canvas.add(tempPOI);


                // 计算偏移量
                var offsetXX = nowJson[i].screenLocations[j][0] - originX;
                var offsetYY = nowJson[i].screenLocations[j][1] - originY;

                var xie = Math.sqrt(offsetXX * offsetXX + offsetYY * offsetYY);
                var xx = offsetXX / xie * 20;
                var yy = offsetYY / xie * 20;


                // 开始偏移(朝着单一方向)
                while (true) {
                    // 默认不需要偏移
                    var isShift = false;

                    // 通过resJson遍历已经绘制的元素
                    // var resLength = Object.keys(resJson).length;
                    // for (var j = 0; j < resLength; j++) {
                    //     // console.log(canvas.item(j));
                    //     if (tempPOI.intersectsWithObject(canvas.item(j))) {
                    //         // 有重叠，得继续偏移
                    //         isShift = true;
                    //         // 计算偏移后的坐标
                    //         newX = newX + xx;
                    //         newY = newY + yy;
                    //         // 开始移动标签
                    //         tempPOI.set({ left: newX, top: newY });
                    //         tempPOI.setCoords();
                    //         // 退出遍历resJson
                    //         break;
                    //     }
                    // }

                    // 通过 canvas.forEachObject 遍历画布上所有元素
                    canvas.forEachObject(function (obj) {
                        // console.log(obj);
                        // 排除当前正在移动的元素
                        if (obj === tempPOI) return

                        // 检查对象是否与另一个对象相交
                        if (tempPOI.intersectsWithObject(obj)) {
                            // 有重叠，得继续偏移
                            isShift = true;
                            // 计算偏移后的坐标
                            newX = newX + xx;
                            newY = newY + yy;
                            // 开始移动标签
                            tempPOI.set({ left: newX, top: newY });
                            tempPOI.setCoords();
                        }
                    })


                    if (!isShift) {
                        // 不需要偏移了，退出while循环
                        nowJson[i].newScreenLocations[j] = [newX, newY];
                        canvas.remove(tempPOI);
                        break;
                    }
                }
            }

            // 寻找最近的摆放位置
            var theMinDistance = 99999999999;
            var theNewLocation = [];
            for (var j = 0; j < maybeScreenLos; j++) {
                var newXY = nowJson[i].newScreenLocations[j];
                var tempDis = (newXY[0] - originX) * (newXY[0] - originX) + (newXY[1] - originY) * (newXY[1] - originY);
                if (tempDis < theMinDistance) {
                    // 更新最近距离
                    theMinDistance = tempDis;
                    theNewLocation[0] = newXY[0];
                    theNewLocation[1] = newXY[1];
                }
            }

            // 正式绘制
            var tempPOI = new fabric.Text(pName, {
                left: theNewLocation[0],
                top: theNewLocation[1],
                // strokeWidth: 1,
                // stroke: 'rgba(0,0,0,0.9)',
                fill: nowJson[i].fontColor,
                fontSize: nowJson[i].fontSize,
                fontFamily: nowJson[i].typeface,
                fontWeight: nowJson[i].fontWeight,
                textAlign: 'center',
                selectable: false,  // 不可选中，默认是可以选中的
                shadow: {
                    color: 'rgba(0, 0, 0, 0.2)', // 阴影颜色
                    offsetX: 5, // 阴影水平偏移量
                    offsetY: 5, // 阴影垂直偏移量
                    blur: 10 // 阴影模糊程度
                }
            });
            canvas.add(tempPOI);
        }

    }

    // function upRank(a, b) {
    //     return a[0] - b[0];
    // }

    // RES.sort(upRank);
    // console.log(RES);


    // 显示当前的POI数量
    var showPOINum = document.getElementById("showPOINum");
    showPOINum.innerHTML = "当前展示的景点数量：" + Object.keys(nowJson).length;

    console.timeEnd('计时器');

}




// 鼠标交互事件
function mouseInteractive(nowJson) {

    // 鼠标滚轮缩放 最小为原来的百分之一，最大为原来的20倍
    canvas.on('mouse:wheel', mouseWheelHandler);
    // 默认可以拖拽漫游画布
    canvas.on('mouse:down', mouseDownHandler);
    canvas.on('mouse:move', mouseMoveHandler);
    canvas.on('mouse:up', mouseUpHandler);


    // 鼠标单击事件，显示某类要素的详细信息+高亮此要素
    canvas.on('mouse:down', function (options) {
        showDetail(options, nowJson);
    });

    // // 右键菜单
    // canvas.on('mouse:down', function (opt) {
    //     // 判断：右键，且在元素上右键
    //     // opt.button: 1-左键；2-中键；3-右键
    //     // 在画布上点击：opt.target 为 null
    //     if (opt.button === 3 && opt.target) {
    //         // 获取当前元素
    //         activeEl = opt.target;

    //         menu = document.getElementById("right_menu");
    //         // menu.domReady = function () {
    //         //     console.log(123);
    //         // }

    //         // 显示菜单，设置右键菜单位置
    //         // 获取菜单组件的宽高
    //         const menuWidth = menu.offsetWidth;
    //         const menuHeight = menu.offsetHeight;

    //         // 当前鼠标位置
    //         let pointX = opt.pointer.x;
    //         let pointY = opt.pointer.y;

    //         // 计算菜单出现的位置
    //         // 如果鼠标靠近画布右侧，菜单就出现在鼠标指针左侧
    //         if (canvas.width - pointX <= menuWidth) {
    //             pointX -= menuWidth;
    //         }
    //         // 如果鼠标靠近画布底部，菜单就出现在鼠标指针上方
    //         if (canvas.height - pointY <= menuHeight) {
    //             pointY -= menuHeight;
    //         }

    //         // console.log(opt.target);
    //         // 读取右键对象的字体、字重、字号等属性
    //         var afontWeight = opt.target.fontWeight;
    //         var atypeface = opt.target.fontFamily;
    //         var afontSize = opt.target.fontSize;

    //         // 字重
    //         var selectElement = document.getElementById("afontWeight");
    //         selectElement.value = afontWeight;

    //         // 字体
    //         var selectElement = document.getElementById("atypeface");
    //         selectElement.value = atypeface;


    //         // 展示菜单
    //         menu.style = "visibility: visible; left: " + pointX + "px;top: " + pointY + "px; z-index: 999;";
    //     }
    //     else {
    //         // 隐藏菜单
    //         menu.style = "visibility: hidden;left: 0;top: 0;z-index: -100;";
    //         activeEl = null;
    //     }
    // })



    // 获取图例中的色块容器
    const legendColor = document.getElementById('legendColor');
    // 为每个色块添加鼠标移入和移出事件监听器
    legendColor.childNodes.forEach(colorDiv => {
        colorDiv.addEventListener('mouseover', function () {
            // 获取当前色块的背景颜色
            const currColor = this.style.backgroundColor;

            // 遍历标签云中的标签
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 1; i < nowJsonLen + 1; i++) {
                if (currColor == nowJson[i - 1].fontColor) {
                    canvas.item(i).set({ strokeWidth: nowJson[i - 1].fontSize / 12, stroke: 'rgba(255,255,255,0.8)' });
                }
                else {
                    canvas.item(i).set({ strokeWidth: 0 });
                }
            }
            // 更新画布，重绘
            canvas.renderAll();
        });

        colorDiv.addEventListener('mouseout', function () {
            // 移除所有标签的高亮状态
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 1; i < nowJsonLen + 1; i++) {
                canvas.item(i).set({ strokeWidth: 0 });
            }
            // 更新画布，重绘
            canvas.renderAll();
        });
    });

}


// 竖排功能点
function verticalBtmInter() {

    // 返回原始中心
    const returnCenterPosBtm = document.getElementById('returnCenterPos');
    returnCenterPosBtm.addEventListener('click', function (event) {
        vpt[4] = 0;
        vpt[5] = 0;
        // console.log(vpt);
        canvas.setViewportTransform(vpt);
    });
    // 返回原始缩放
    const returnScaleBtm = document.getElementById('returnScale');
    returnScaleBtm.addEventListener('click', function (event) {
        vpt[0] = 1;
        vpt[3] = 1;
        // console.log(vpt);
        canvas.setViewportTransform(vpt);
    });
    // 是否可拖拽画布
    const grabCanvasBtn = document.getElementById("grabCanvas");
    grabCanvasBtn.addEventListener('click', function (event) {
        if (grabCanvasBtn.classList.contains('selected')) {
            // 当前已被选中，则将其设置为不可拖拽
            grabCanvasBtn.classList.remove("selected");
            canvas.defaultCursor = "auto";
            canvas.off('mouse:down', mouseDownHandler);
            canvas.off('mouse:move', mouseMoveHandler);
            canvas.off('mouse:up', mouseUpHandler);
        }
        else {
            // 当前未被选中，则将其设置为可拖拽
            grabCanvasBtn.classList.add("selected");
            canvas.defaultCursor = "grab";
            canvas.on('mouse:down', mouseDownHandler);
            canvas.on('mouse:move', mouseMoveHandler);
            canvas.on('mouse:up', mouseUpHandler);
        }
    });
    // 放大与缩小
    var zoomInButton = document.getElementById('zoomIn');
    var zoomOutButton = document.getElementById('zoomOut');
    zoomInButton.addEventListener('click', function () {
        zoomCanvas(1.1); // 调用放大方法
    });
    zoomOutButton.addEventListener('click', function () {
        zoomCanvas(0.9); // 调用缩小方法
    });

}


// 鼠标按下事件处理程序
function mouseDownHandler(opt) {
    var evt = opt.e;
    this.isDragging = true;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
    this.preX = evt.clientX;
    this.preY = evt.clientY;
}
// 鼠标移动事件处理程序
function mouseMoveHandler(opt) {
    if (this.isDragging) {
        var e = opt.e;
        vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
}
// 鼠标松开事件处理程序
function mouseUpHandler(opt) {
    this.setViewportTransform(vpt);
    this.isDragging = false;
}
// 鼠标滚轮缩放事件
function mouseWheelHandler(opt) {
    const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
    zoom = canvas.getZoom() // 获取画布当前缩放值
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01

    // 以左上角为原点
    // this.canvas.setZoom(zoom)

    // 以鼠标所在位置为原点缩放
    canvas.zoomToPoint(
        { // 关键点
            x: opt.e.offsetX,
            y: opt.e.offsetY
        },
        zoom
    )

    // 记录当前的缩放与偏移
    vpt = this.viewportTransform;
    // console.log(vpt);


    opt.e.preventDefault()
    opt.e.stopPropagation()
}
// 定义放大和缩小画布的方法
function zoomCanvas(factor) {
    zoom = canvas.getZoom(); // 获取当前缩放比例
    zoom *= factor; // 根据传入的因子进行放大或缩小操作

    // 设置缩放范围限制
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;

    // 以画布中心点进行缩放
    var center = new fabric.Point(canvas.width / 2, canvas.height / 2);
    canvas.zoomToPoint(center, zoom);

    // 记录当前的缩放与偏移
    vpt = canvas.viewportTransform;
}

// 显示悬浮框(竖排功能栏的悬浮框)
function showTooltip(text, button) {
    var tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.right = '75px';
    tooltip.style.top = button.getBoundingClientRect().top - 50 + 'px';
}
// 隐藏悬浮框(竖排功能栏的悬浮框)
function hideTooltip() {
    var tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

// 生成标签云(主函数)
async function getTagCloud(nowJson) {

    // 清除canvas已绘制的元素
    canvas.clear();
    // 移除所有监听事件、清除所有元素
    canvas.dispose();
    // 初始化canvas
    canvas = new fabric.Canvas('myCanvas', {
        backgroundColor: backgroundColor[nowBackgroundColorIndex],
        selectionColor: 'blue',
        selectionLineWidth: 2,
        // selection: false, // 禁用组选择
        crossOrigin: 'anonymous',
        fireRightClick: true, // 启用右键，button的数字为3
        stopContextMenu: true, // 禁止默认右键菜单
        defaultCursor: 'grab',  // 鼠标样式
    });
    // 中心不变
    canvas.setViewportTransform(vpt);


    // 获取将要绘制的区域范围
    getRegion(nowJson);
    // 经纬度与屏幕坐标的转换
    Latlon2ScreenCoordinates(nowJson);
    // 绘制中心点 
    drawCenter();
    // 初次绘制文本
    await initDraw(nowJson);
    // 鼠标交互事件
    mouseInteractive(nowJson);


    // 计算最远距离
    var maxDis = 0;
    var nowJsonLen = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLen; i++) {
        // 获取最远距离
        if (maxDis < nowJson[i].distance) maxDis = nowJson[i].distance;
    }
    var showmaxDis = document.getElementById("maxDis");
    showmaxDis.innerHTML = (maxDis / 1000).toFixed(2) + "km";

    // 竖排功能点
    verticalBtmInter();
}


