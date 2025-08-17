/**
 * @param {Array} sortedTags 排序后的标签列表
 * @param {String} prop 指定的空间交互属性 
 * */ 
function placeTags(sortedTags, prop){
    console.log('---placeTags--');
    // 画布宽高
    const w = window.getComputedStyle(svg.node()).width.slice(0, -2),
        h = window.getComputedStyle(svg.node()).height.slice(0, -2);

    // 创建投影
    const proj = d3.geoMercator()
        .fitExtent([[0, 0], [w, h]], cn);

    // 字号比例尺
    const fontScale = d3.scaleLinear()
        .range([12, 30]);

    // 获取当前所选颜色
    const c = d3.select('li.selected')
        .datum();

    // 获取语言
    const lang = d3.select('input[name="lang"]:checked')
        .attr('id');

    // 添加文字标签相关信息
    for(let i = 0; i < sortedTags.length; i++){
        // 标签簇数据
        const sourceData = sortedTags[i];

        // 此标签簇targets交互强度范围
        const domain = d3.extent(sourceData.filter((_,i) => i != 0), d => d[prop]);
        fontScale.domain(domain);

        // 字号与投影位置
        for(let j = 0; j < sourceData.length; j++){
            const tag = sourceData[j];
            if(j == 0){
                tag.isAnchor = true;
                tag.fontSize = 35;
                tag.x = proj(tag.crd)[0];
                tag.y = proj(tag.crd)[1];
                tag.sx = proj(tag.crd)[0];
                tag.sy = proj(tag.crd)[1];
                continue;
            }
            tag.fontSize = fontScale(tag[prop]);
            tag.x = proj(tag.crd)[0];
            tag.y = proj(tag.crd)[1];
            tag.sx = proj(tag.crd)[0];
            tag.sy = proj(tag.crd)[1];
        }

        // 绘制文本标签
        const texts = textG.selectAll(`.tags${i}`)
            .data(sourceData)
            .join('text')
            .attr('class', d => {
                if(d.isAnchor) return `tags anchor ${d.cluster}`;
                return `tags ${d.cluster} ${d.name} targets`;
            })
            .attr('cursor', 'pointer')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            // .attr('font-family', '宋体')
            .attr('font-size', d => d.fontSize)
            .attr('fill', d => {
                if(d3.select('input#switchTags').node().checked){
                    switch(d.class){
                        case 'all':
                            return c[1];
                        case 'mid':
                            return c[2];
                        case 'uni':
                            return c[3];
                        default:
                            return c[0];
                    }
                }
                return 'none'
            })
            .text(d => {
                if(lang === 'en') return d.nameEn;
                return d.name;
            });

        // 外接矩形面积和
        let sumArea = 0; 
        // 外接矩形信息
        for(let j = 0; j < sourceData.length; j++){
            // 文本对象
            const textObj = texts.nodes()[j];
            // 文本外接矩形宽高
            const {width, height} = textObj.getBBox();
            sourceData[j].BBox = {
                width: width,
                height: height,
            }
            sumArea += width * height;
        }
        // sourceData[0].sumArea = sumArea;

        // 更新文本标签在布局螺线上的位置
        // 螺线最大半径
        const maxR_ = Math.sqrt(sumArea);
        // 螺线函数
        const getPosition = archimedeanSpiral();
        // 生成螺线点
        const spiralPts = genArcPts(maxR = maxR_, getPosi = getPosition, start = [sourceData[0].x, sourceData[0].y]);

        // 将起始于(0,0)的螺线点绑定在中心城市标签上
        sourceData[0].spiralPts = genArcPts(maxR = maxR_, getPosi = getPosition);

        // 更新文本标签在布局螺线上的位置
        updatePosition(sourceData, spiralPts);

        // 绘制外接矩形
        const rects = rectG.selectAll(`rect${i}`)
            .data(sourceData)
            .join('rect')
            .attr('class', d => {
                if(d.isAnchor) return `rect anchor ${d.cluster}`;
                return `rect cluster-${i} ${d.name}`;
            })
            .attr('x', d => d.x - d.BBox.width / 2)
            .attr('y', d => d.y - d.BBox.height / 2)
            .attr('width', d => d.BBox.width)
            .attr('height', d => d.BBox.height)
            .attr('fill', 'none')
            .attr('stroke', d => {
                if(d3.select('input#switchRects').node().checked){
                    switch(d.class){
                        case 'all':
                            return c[1];
                        case 'mid':
                            return c[2];
                        case 'uni':
                            return c[3];
                        default:
                            return c[0];
                    }
                }
                return 'none';
            })
            .attr('stroke-width', 1);

        // 记录标签簇外接圆的半径
        let R = 0;
        // 中心标签中心点到自身外接矩形角点的距离
        const D = Math.sqrt(((sourceData[0].sx - sourceData[0].BBox.width / 2) - sourceData[0].sx) ** 2 + ((sourceData[0].sy - sourceData[0].BBox.height / 2) - sourceData[0].sy) ** 2);
        if(D > R) R = D;
        for(let i = 1; i < sourceData.length; i++){
            // 当前标签与中心标签
            const curT = sourceData[i], centerT = sourceData[0];
            // 当前文本外接矩形角点到中心标签中心点的最远距离
            const maxD = Math.max(
                Math.sqrt(((curT.sx - curT.BBox.width / 2) - centerT.sx) ** 2 + ((curT.sy - curT.BBox.height / 2) - centerT.sy) ** 2),
                Math.sqrt(((curT.sx + curT.BBox.width / 2) - centerT.sx) ** 2 + ((curT.sy - curT.BBox.height / 2) - centerT.sy) ** 2),
                Math.sqrt(((curT.sx - curT.BBox.width / 2) - centerT.sx) ** 2 + ((curT.sy + curT.BBox.height / 2) - centerT.sy) ** 2),
                Math.sqrt(((curT.sx + curT.BBox.width / 2) - centerT.sx) ** 2 + ((curT.sy + curT.BBox.height / 2) - centerT.sy) ** 2),
            );
            if(maxD > R) R = maxD;
        }
        sourceData[0].R = R;
    }

    // 更新位置后的标签
    // d3.selectAll('text')
    //     .attr('x', d => d.sx)
    //     .attr('y', d => d.sy)

    // 标签簇外接圆信息
    const circles = Array.from(sortedTags, (d, i) => ({
        name: d[0].name,
        sx: d[0].sx,
        sy: d[0].sy,
        x: d[0].x,
        y: d[0].y,
        R: d[0].R,
        idx: i,
    }));

    // 绘制标签簇外接圆
    circleG.selectAll('circle')
        .data(circles)
        .join('circle')
        .attr('class', d => `circumCircles cluster-${d.idx}`)
        .attr('cx', d => d.sx)
        .attr('cy', d => d.sy)
        .attr('r', d => d.R)
        .attr('fill', 'none')
        .attr('stroke', function(){
            if(d3.select('input#switchCircles').node().checked){
                return 'black';
            }
            return 'none';
        })
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5');

    // 生成外接圆两两之间的联系
    const links = [];
    // 标签簇的数量
    let num = sortedTags.length;
    for(let i = 0; i < num; i++){
        const source = circles[i].name;
        const sR =  circles[i].R;
        for(let j = i + 1; j < num; j++){
            const target = circles[j].name;
            const tR = circles[j].R;
            const dist = sR + tR
            links.push({
                source: source,
                target: target,
                distance: dist,
            });
        }
    }    

    // 弹簧力模拟
    const springSimu = d3.forceSimulation(circles)
        .alphaDecay(0.1)
        .force('link', d3.forceLink(links).id(d => d.name).distance(d => d.distance))
        .force('collide', d3.forceCollide(d => d.R))
        .force('center', d3.forceCenter(w / 2, h / 2))
        .on('tick', stringTicked)
        .on('end', stringEnded);

    function stringTicked(){
        d3.selectAll('.circumCircles')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }
    function stringEnded(){
        for(let i = 0; i < circles.length; i++){
            // 外接圆移动距离
            const circle = circles[i];
            const dx = circle.x - circle.sx,
                dy = circle.y - circle.sy;
            // 当前外接圆对应的标签数据
            const sourceData = sortedTags[i];
            for(let j = 0; j < sourceData.length; j++){
                // 标签文本数据
                sourceData[j].sx = sourceData[j].sx + dx;
                sourceData[j].sy = sourceData[j].sy + dy;
            }
        }
        // 标签节点
        const nodes = sortedTags.flat(Infinity);
        // 重启posiSimu
        posiSimu.nodes(nodes).alpha(1).restart();
    }

    // 定位力模拟
    const posiSimu = d3.forceSimulation()
        .force('x', d3.forceX(d => d.sx))
        .force('y', d3.forceY(d => d.sy))
        .on('tick', posiTicked)
        .stop();

    function posiTicked(){
        // 更新标签位置
        d3.selectAll('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        // 更新外接矩形位置
        d3.selectAll('rect')
            .attr('x', d => d.x - d.BBox.width / 2)
            .attr('y', d => d.y - d.BBox.height / 2);
        }

    // 为色带li添加单击事件 选择色带更改文本颜色
    d3.selectAll('.color-li')
        .on('click', function(e, c){
            // 文本颜色
            d3.selectAll('text')
                .attr('fill', d => {
                    if(d3.select('input#switchTags').node().checked){
                        switch(d.class){
                            case 'all':
                                return c[1];
                            case 'mid':
                                return c[2];
                            case 'uni':
                                return c[3];
                            default:
                                return c[0];
                        }
                    }
                    return 'none';
                });
            // 外接矩形颜色
            d3.selectAll('rect')
                .attr('stroke', d => {
                    if(d3.select('input#switchRects').node().checked){
                        switch(d.class){
                            case 'all':
                                return c[1];
                            case 'mid':
                                return c[2];
                            case 'uni':
                                return c[3];
                            default:
                                return c[0];
                        }
                    }
                    return 'none';
                });
        });

    // 非锚点标签
    d3.selectAll('.tags:not(.anchor)')
        .on('mouseover', function(){
            const name = this.classList[2];
            d3.selectAll(`.tags.${name}:not(.anchor)`)
                .attr('fill', 'black');

            // 当前色带颜色
            const c = d3.select('.color-li.selected')
                .datum();

            // 选择对应的外接矩形
            d3.selectAll(`.rect.${name}:not(.anchor)`)
                .attr('fill', d => {
                    switch(d.class){
                        case 'all':
                            return c[1];
                        case 'mid':
                            return c[2];
                        case 'uni':
                            return c[3];
                        default:
                            return c[0];
                    }
                });
        }).on('mouseleave', function(){
            const name = this.classList[2];
            // 当前色带颜色
            const c = d3.select('.color-li.selected')
                .datum();

            d3.selectAll(`.tags.${name}:not(.anchor)`)
                .attr('fill', d => {
                    switch(d.class){
                        case 'all':
                            return c[1];
                        case 'mid':
                            return c[2];
                        case 'uni':
                            return c[3];
                        default:
                            return c[0];
                    }
                });

            // 选择对应的外接矩形
            d3.selectAll(`.rect.${name}:not(.anchor)`)
                .attr('fill', 'none');
        })
    
    // 为标签与下划线添加点拖拽事件
    const drag = d3.drag()
        .on('start', function(){
            const clusterClass = d3.select(this).node().classList[2];
            d3.selectAll(`.tags.${clusterClass}`)
                .attr('opacity', 0.5);
        }).on('drag', function(e,d){
            // 移动距离
            const X = e.x - d.x, Y = e.y - d.y;

            const clusterClass = d3.select(this).node().classList[2];
            // 更新标签位置
            d3.selectAll(`.tags.${clusterClass}`)
                .attr('x', d => d.x + X)
                .attr('y', d => d.y + Y);

            // 更新外接圆位置
            d3.select(`.circumCircles.${clusterClass}`)
                .attr('cx', d => d.x + X)
                .attr('cy', d => d.y + Y);

            // 更新外接矩形位置
            d3.selectAll(`.rect.${clusterClass}`)
                .attr('x', d => d.x + X - d.BBox.width / 2)
                .attr('y', d => d.y + Y - d.BBox.height / 2);

        }).on('end', function(e, d){
            const clusterClass = d3.select(this).node().classList[2];
            d3.selectAll(`.tags.${clusterClass}`)
                .attr('opacity', 1);
            // 移动距离 更改原始数据 防止回到上一次的位置
            const X = e.x - d.x, Y = e.y - d.y;
            d3.selectAll(`.tags.${clusterClass}`).data().forEach(datum => {
                datum.x += X;
                datum.y += Y;
            });

            d3.select(`.circumCircles.${clusterClass}`).datum().x += X;
            d3.select(`.circumCircles.${clusterClass}`).datum().y += Y;

        }); 

    // 单击中心城市标签时,移动整个标签簇的标签 外接圆 外接矩形
    d3.selectAll('.tags.anchor').call(drag);

    // 显示与隐藏状态切换
    d3.select('input#switchTags')
        .on('change', function(){
            // 当前色带颜色
            const c = d3.select('.color-li.selected')
            .datum();

            d3.selectAll(`.tags`)
                .attr('fill', d => {
                    if(this.checked){
                        switch(d.class){
                            case 'all':
                                return c[1];
                            case 'mid':
                                return c[2];
                            case 'uni':
                                return c[3];
                            default:
                                return c[0];
                        }
                    }
                    return 'none';
                });
        });
    d3.select('input#switchRects')
        .on('change', function(){
            // 当前色带颜色
            const c = d3.select('.color-li.selected')
            .datum();

            d3.selectAll(`.rect`)
                .attr('stroke', d => {
                    if(this.checked){
                        switch(d.class){
                            case 'all':
                                return c[1];
                            case 'mid':
                                return c[2];
                            case 'uni':
                                return c[3];
                            default:
                                return c[0];
                        }
                    }
                    return 'none';
                });
        });
    d3.select('input#switchCircles')
        .on('change', function(){
            d3.selectAll(`.circumCircles`)
                .attr('stroke', _ => {
                    if(this.checked) return 'black';
                    return 'none';
                });
        });
}