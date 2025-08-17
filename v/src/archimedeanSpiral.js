/**
 *  返回阿基米德螺线函数
 * @param {*} ratio 画布宽高比，默认为1
 * @param {*} {step = 0.1, b = 1, a = 0} 步长(弧度)，螺距，起始点中心的距离
 * */ 
function archimedeanSpiral(ratio = 1, {step = 0.1, b = 1, a = 0} = {}){
    // 根据画布宽高比例进行缩放
    const e = ratio;

    // 参数t为当前的弧度值
    return function(t){
        return [e * (a + b * (t *= step)) * Math.cos(t), (a + b * t) * Math.sin(t)];
    }
}

/**
 * 产生阿基米德螺线点
 * @param {*} maxR 阿基米德螺线的最大半径
 * @param {function} getPosi 阿基米德螺线函数 
 * @param {*} start 螺线起始点坐标 [x,y] 默认 [0, 0]
 * */ 
function genArcPts(maxR, getPosi, start = [0, 0]){
    // 螺线点
    const pts = [];

    let t = 0, dxdy;

    while(dxdy = getPosi(t += 1)){
        dx = dxdy[0];
        dy = dxdy[1];

        const r = Math.sqrt(dx**2 + dy**2);
        if(r > maxR) break;

        pts.push([dx + start[0], dy + start[1]]);
    }

    return pts;
}
