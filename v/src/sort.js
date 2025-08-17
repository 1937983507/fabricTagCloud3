/**
 * @param {Array} data 待摆放列表
 * @param {String} key 要排序的属性名
*/
function sortTags(data, key){
    // 1.选择的中心城市数量为1
    if(data.length === 1){
        // 锚点数据
        const anchor = data[0].source;
        anchor.cluster = 'cluster-0';
        // 非锚点数据
        const targets = data[0].targets;
        targets.forEach(d => {
            d.cluster = 'cluster-0';
            d.class = 'uni';
        });
        // 对targets按联系值与名称长度排序
        const sorted = sortByVN(targets);
        return [[anchor, ...sorted]];  
    }

    // 2.多锚点时，按照共有 部分共有 独有三部分排序
    // 所有targets标签
    const allTags = data.flatMap(d => d.targets)
        .map(d => d.name);

    // 统计标签出现的次数
    const count = allTags.reduce((pre, cur) => {
        if(cur in pre){
            pre[cur]++;
        }else{
            pre[cur] = 1;
        }
        return pre;
    }, {});

    const countArr = Object.keys(count)
        .map(d => [d, count[d]])
        .sort((a, b) => b[1] - a[1]);
    
    // 共有标签
    const allShared = countArr.filter(d => d[1] == data.length).map(d => d[0]);
    // 独有标签
    const unique = countArr.filter(d => d[1] == 1).map(d => d[0]);
    // 部分共有标签(带次数)
    const middleCount = countArr.filter(d => d[1] !== 1 && d[1] !== data.length) //.map(d => d[0]);
    
    const sorted = [];

    for(let i = 0; i < data.length; i++){
        // 一个标签簇的数据
        const cityData =  data[i];
        const targets = cityData.targets;
        cityData.source.cluster = `cluster-${i}`;
        // 与此锚点联系的非锚点数量
        cityData.source.tsNum = cityData.targets.length;
        targets.forEach(d => d.cluster = `cluster-${i}`);
        // 该标签簇中的共有数据、独有数据、部分共有数据
        const all = targets.filter(d => allShared.includes(d.name));
        all.forEach(tag => {
            tag.class = 'all';
            });
        const uni = targets.filter(d => unique.includes(d.name));
        uni.forEach(tag => {
            tag.class = 'uni';
            });
        const mid = targets.filter(d => middleCount.some(e => e[0] === d.name));
        mid.forEach(tag => {
            tag.class = 'mid';
            });
        // console.log('=========',cityData.source);
        // console.log({all,mid,uni});
        // 排序
        const allSorted = sortByVN(all);
        const uniSorted = sortByVN(uni);
        const midSorted = sortByVN(mid);
        console.log({allSorted,midSorted,uniSorted});
        sorted.push([cityData.source, ...allSorted, ...midSorted, ...uniSorted]);
    }

    return sorted;

    // 按照联系强度降序排序，强度一致时候按照名称长度降序
    function sortByVN(data){
        return d3.groups(data, d => d[key])
            .sort((a, b) => b[0] - a[0]) // 按联系值降序排序
            .flatMap(d => d[1].sort((ta, tb) => {//按照名称长度降序排序
                return tb.name.length - ta.name.length;
            }));
    }

}