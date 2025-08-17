// 详情页面


// 显示详情页面
function showDetail(options, nowJson) {
    // 如果单击的是对象
    if (options.target) {
        // console.log(options.target);
        if (options.target.text == "中心位置") {
            // 清除除中心位置外所有的的高亮
            var nowJsonLen = Object.keys(nowJson).length;
            for (var i = 1; i < nowJsonLen + 1; i++) {
                canvas.item(i).set({ strokeWidth: 0 });
            }
            canvas.renderAll();
            return;
        }

        // 获取单击要素的ID
        var currindex = canvas.getObjects().indexOf(options.target) - 1;

        // 先清除所有的高亮
        var nowJsonLen = Object.keys(nowJson).length;
        for (var i = 1; i < nowJsonLen + 1; i++) {
            canvas.item(i).set({ strokeWidth: 0 });
        }
        // 高亮此要素
        canvas.item(currindex + 1).set({ strokeWidth: 4, stroke: 'rgba(255,255,255,0.5)' })

        // 显示要素详情窗口
        let detailsWindow = document.getElementById('detailsWindow');
        detailsWindow.style.display = "block";

        // 获取该要素信息
        var pid = currindex;
        var pname = nowJson[currindex].pname;
        var X = nowJson[currindex].X_wgs84;
        var Y = nowJson[currindex].Y_wgs84;
        var distance = nowJson[currindex].distance;
        var rankInChina = nowJson[currindex].rankInChina;
        var rankInCity = nowJson[currindex].rankInCity;
        var city = nowJson[currindex].city;

        var str = "地点名：" + pname + "\n经度：" + X + "\n纬度：" + Y + "\n与中心点距离：" + Math.trunc(distance) + "米\n在" + city + "排名：" + rankInCity;
        if (nowJson[currindex].time) {
            // 已经获取了时间的
            str += ("\n通行时间：" + nowJson[currindex].time + "分钟");
        }

        let detailsInformation = document.getElementById('detailsInformation');
        detailsInformation.innerText = str;

    }
    // 如果单击的是背景
    // else {
    //     // 清除所有的的高亮
    //     var nowJsonLen = Object.keys(nowJson).length;
    //     for (var i = 1; i < nowJsonLen + 1; i++) {
    //         canvas.item(i).set({ strokeWidth: 0 });
    //     }
    //     canvas.renderAll();
    // }
}


// 详情页面交互
function detailsWindowInteractive() {
    // 详情窗口拖拽
    let detailsWindow = document.querySelector('#detailsWindow')
    let moveOk = false
    let x = 0,
        y = 0
    detailsWindow.onmousedown = function (e) {
        x = e.pageX - detailsWindow.offsetLeft
        y = e.pageY - detailsWindow.offsetTop
        moveOk = true
    }
    window.onmouseup = function () {
        moveOk = false
    }
    window.onblur = function () {
        moveOk = false
    }
    window.onmousemove = function (e) {
        e.preventDefault();
        if (moveOk) {

            let left = e.pageX - x
            let top = e.pageY - y

            if (left < 0) left = 0
            if (top < 0) top = 0
            let maxLeft = window.innerWidth - detailsWindow.offsetWidth
            let maxTop = window.innerHeight - detailsWindow.offsetHeight
            if (left > maxLeft) left = maxLeft
            if (top > maxTop) top = maxTop

            detailsWindow.style.left = left + "px"
            detailsWindow.style.top = top + 'px'
        }
    }

    // 关闭要素详情窗口
    let closeDetailsWindow = document.querySelector("#closeDetailsWindow");
    closeDetailsWindow.addEventListener("mousedown", function (e) {
        let detailsWindow = document.getElementById('detailsWindow');
        detailsWindow.style.display = "none";
        // 清除所有的的高亮(不知为何不起作用)
        var myJson = poisPyramid[tagCloudScale];
        var myJsonLen = Object.keys(myJson).length;
        for (var i = 1; i < myJsonLen; i++) {
            canvas.item(i).set({ strokeWidth: 0 });
        }
        canvas.renderAll();
    })
}