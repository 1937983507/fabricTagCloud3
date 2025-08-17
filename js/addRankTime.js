// 单击添加排名与通行时间


function addRankTime() {
    // 单击添加排名
    const addRankBtm = document.getElementById('addRank');
    addRankBtm.addEventListener('click', addRankFunction);

    // 单击添加通行时间
    const addTimeBtm = document.getElementById('addTime');
    addTimeBtm.addEventListener('click', addTimeFunction);
}


// 添加排名函数
function addRankFunction() {
    // const isChecked = event.target.checked;

    const addRankBtm = document.getElementById('addRank');
    const nowTemp = addRankBtm.getAttribute("class");
    if(nowTemp=="hide"){
        // 原本状态是隐藏
        addRankBtm.className = "show";
        addRankBtm.textContent = "隐藏排名信息";
    }
    else{
        // 原本状态是显示
        addRankBtm.className = "hide";
        addRankBtm.textContent = "显示排名信息";
    }

    // 绘制标签云
    getTagCloud(poisPyramid[tagCloudScale]);
}



// 添加通行时间函数
async function addTimeFunction() {

    const addTimeBtm = document.getElementById('addTime');
    const nowTemp = addTimeBtm.getAttribute("class");
    if(nowTemp=="hide"){
        // 原本状态是隐藏
        addTimeBtm.className = "show";
        addTimeBtm.textContent = "隐藏通行时间(min)";
    }
    else{
        // 原本状态是显示
        addTimeBtm.className = "hide";
        addTimeBtm.textContent = "显示通行时间(min)";
    }

    // 绘制标签云
    getTagCloud(poisPyramid[tagCloudScale]);
}


// 输入中心经纬度与当前POI点，计算通行时间
function getTime(lnglat, poi) {
    return new Promise((resolve, reject) => {
        // 高德驾车路径查询，一天只有5000配额
        driving.search(new AMap.LngLat(lnglat[0], lnglat[1]), new AMap.LngLat(poi.X_gcj02, poi.Y_gcj02), (status, result) => {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
                resolve(result)
            } else {
                console.log("error", result)
            }
        });
    });
}