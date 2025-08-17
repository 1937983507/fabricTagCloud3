// 参考地图的多尺度效应，单击添加减少POI数据


// 记录当前标签云的放缩尺度
// tagCloudScale = 4;
// MaxtagCloudScale = 6;


// 放大标签云
function amplifyTagCloud() {
    // 若已经到了最大放缩尺度，则停止缩放
    if (tagCloudScale == MaxtagCloudScale){
        window.alert("已显示最少标签");
        return;
    }
    // 修正放缩比例
    tagCloudScale = tagCloudScale + 1;
    // 重绘标签云
    getNewTagCloud(tagCloudScale);
}

// 缩小标签云
function reduceTagCloud() {
    // 若到了最小的放缩尺度，则停止缩放
    if (tagCloudScale == 0){
        window.alert("已显示全部标签");
        return;
    }
    // 修正方放缩比例
    tagCloudScale = tagCloudScale - 1;
    // 重绘标签云
    getNewTagCloud(tagCloudScale);
}

// 绘制新的标签云
function getNewTagCloud(i) {
    console.log(tagCloudScale, MaxtagCloudScale)
    // 放大缩小按键的颜色 
    // var amplifyBtm = document.getElementById("amplifyBtm");
    // var reduceBtm = document.getElementById("reduceBtm");
    // if (tagCloudScale == 0) {
    //     reduceBtm.style.filter = "grayscale(100%)";
    // }
    // else if (tagCloudScale == MaxtagCloudScale) {
    //     amplifyBtm.style.filter = "grayscale(100%)";
    // }
    // else {
    //     amplifyBtm.style.filter = "grayscale(0%)";
    //     reduceBtm.style.filter = "grayscale(0%)";
    // }

    // 绘制标签云
    getTagCloud(poisPyramid[i]);


}



