// 字体改变相关事件

// 全局变量，设置字号、字重、字体
g_fontSize = [55, 45, 35, 25, 15, 5, 1];

g_fontWeight = 700;

g_typeface = "等线";

ChineseTypeface = ["等线", "等线 Light", "方正舒体", "方正姚体", "仿宋", "黑体",
    "华文彩云", "华文仿宋", "华文琥珀", "华文楷体", "华文隶书", "华文宋体", "华文细黑", "华文新魏",
    "华文行楷", "华文中宋", "楷体", "隶书", "宋体", "微软雅黑", "微软雅黑 Light", "新宋体", "幼圆"];
EnglishTypeface = ["Agency FB", "Algerian", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold",
    "Bahnschrift", "Bahnschrift Condensed", "Bahnschrift Light", "Bahnschrift SemiBold", "Bahnschrift SemiCondensed", "Bahnschrift SemiLight", "Baskerville Old Face", "Bauhaus 93",
    "Bell MT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "Blackadder ITC", "Bodoni MT", "Bodoni MT Black",
    "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC",
    "Britannic Bold", "Broadway", "Brush Script MT", "Californian FB", "Calisto MT", "Candara", "Candara Light", "Castellar", "Centaur",
    "Century", "Century Gothic", "Century Schoolbook", "Chiller", "Colonna MT", "Comic Sans MS", "Consolas", "Constantia", "Cooper Black",
    "Copperplate Gothic Bold", "Copperplate Gothic Light", "Corbel", "Courier New", "Curlz MT", "Dubai",
    "Dubai Medium", "Edwardian Script ITC", "Elephant", "Engravers MT", "Eras Bold ITC", "Felix Titling", "Fences", "Footlight MT Light", "Forte", "Franklin Gothic Book",
    "Franklin Gothic Demi", "Franklin Gothic Demi Cond", "Franklin Gothic Heavy", "Franklin Gothic Medium", "Franklin Gothic Medium Cond",
    "Freestyle Script", "French Script MT", "Gabriola", "Garamond", "Georgia", "Gigi", "Gill Sans MT", "Gill Sans MT Condensed",
    "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gloucester MT Extra Condensed",
    "Goudy Old Style", "Goudy Stout", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "High Tower Text", "HoloLens MDL2 Assets",
    "Impact", "Imprint MT Shadow", "Informal Roman", "Ink Free", "Javanese Text", "Jokerman", "Juice ITC", "Kristen ITC", "Kunstler Script",
    "Leelawadee", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax",
    "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Magneto", "Maiandra GD", 
    "Matura MT Script Capitals", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Mistral", "Modern No. 20",
    "Mongolian Baiti", "Monotype Corsiva", "MS Reference Sans Serif", "MV Boli", "Myanmar Text",
    "Niagara Engraved", "Niagara Solid", "OCR A Extended", "Old English Text MT", "Onyx", "Palace Script MT", "Palatino Linotype",
    "Papyrus", "Parchment", "Perpetua", "Perpetua Titling MT", "Playbill", "Poor Richard", "Pristina", "Rage Italic", "Ravie", "Rockwell",
    "Rockwell Condensed", "Rockwell Extra Bold", "Script MT Bold", "Segoe Fluent Icons", "Segoe MDL2 Assets", "Segoe Print", "Segoe Script",
    "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Semilight", "Segoe UI Variable Display", "Segoe UI Variable Display Light",
    "Segoe UI Variable Display Semib", "Segoe UI Variable Display Semil", "Segoe UI Variable Small", "Segoe UI Variable Small Light",
    "Segoe UI Variable Small Semibol", "Segoe UI Variable Small Semilig", "Segoe UI Variable Text", "Segoe UI Variable Text Light",
    "Segoe UI Variable Text Semibold", "Segoe UI Variable Text Semiligh", "Showcard Gothic", "Sitka Banner", "Sitka Banner Semibold",
    "Sitka Display", "Sitka Display Semibold", "Sitka Heading", "Sitka Heading Semibold", "Sitka Small", "Sitka Small Semibold", "Sitka Subheading",
    "Sitka Subheading Semibold", "Sitka Text", "Sitka Text Semibold", "Snap ITC", "Stencil", "Sylfaen", "Tempus Sans ITC", "Times New Roman",
    "Trebuchet MS", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "Viner Hand ITC", "Vivaldi", "Vladimir Script","Wide Latin"];








// 初始化字体下拉框
function initFontSelection() {

    // 字体类别
    var selectElement = document.getElementById("select-typeface-levelNum");
    selectElement.value = 5;

    // 字号大小分级
    var typefaceLevelNum = document.getElementById("select-typeface-levelNum");
    showFontSizeOptions(parseInt(typefaceLevelNum.value));




    // 中文字体
    ulElement = document.getElementById('chineseImages');
    for (let i = 0; i < ChineseTypeface.length; i++) {
        typefaceName = ChineseTypeface[i];
        // 创建div，并设置其文本内容与字体样式
        const typefaceElement1 = document.createElement('div');
        typefaceElement1.textContent = typefaceName; // 设置字体样式文本内容
        typefaceElement1.style.fontFamily = typefaceName; // 设置字体样式
        typefaceElement1.className = "typefaceitem";
        // 创建div“正在使用”
        const typefaceElement2 = document.createElement("div");
        typefaceElement2.textContent = "正在使用";
        typefaceElement2.style.display = "none";
        typefaceElement2.className = "usedTypeface";
        // 将其插入到li-ul中
        const liElement = document.createElement('li');
        liElement.appendChild(typefaceElement1);
        liElement.appendChild(typefaceElement2);
        ulElement.appendChild(liElement);
    }
    // 英文字体
    ulElement = document.getElementById('englishImages');
    for (let i = 0; i < EnglishTypeface.length; i++) {
        typefaceName = EnglishTypeface[i];
        // 创建div，并设置其文本内容与字体样式
        const typefaceElement1 = document.createElement('div');
        typefaceElement1.textContent = typefaceName; // 设置字体样式文本内容
        typefaceElement1.style.fontFamily = typefaceName; // 设置字体样式
        typefaceElement1.className = "typefaceitem";
        // 创建div“正在使用”
        const typefaceElement2 = document.createElement("div");
        typefaceElement2.textContent = "正在使用";
        typefaceElement2.style.display = "none";
        typefaceElement2.className = "usedTypeface";
        // 将其插入到li-ul中
        const liElement = document.createElement('li');
        liElement.appendChild(typefaceElement1);
        liElement.appendChild(typefaceElement2);
        ulElement.appendChild(liElement);
    }
    // 选中中文字体中的首个字体
    temp = document.getElementById("chineseImages").getElementsByClassName("usedTypeface")[0];
    temp.style.display = "block";

    // // 图片数据，按语言类别存储
    // const imagePaths = {
    //     Chinese: "../img/typeface/Chinese/",
    //     English: "../img/typeface/English/",
    //     Other: "../img/typeface/Other/"
    // };

    // // 获取图片并动态加载到页面
    // function loadImages() {
    //     for (let language in imagePaths) {
    //         if (imagePaths.hasOwnProperty(language)) {
    //             const ulElement = document.getElementById(language.toLowerCase() + 'Images');
    //             const imagePath = imagePaths[language];
    //             // 发送 AJAX 请求获取图片列表
    //             const xhr = new XMLHttpRequest();
    //             xhr.open('GET', imagePath, true);
    //             xhr.onload = function () {
    //                 if (xhr.status == 200) {
    //                     const files = parseResponseText(xhr.responseText);
    //                     for (let i = 5; i < files.length; i++) {
    //                         file = files[i];
    //                         const imgElement = document.createElement('img');
    //                         imgElement.src = imagePath + file.trim();

    //                         // console.log(imagePath + file.trim());

    //                         imgElement.alt = '';
    //                         const liElement = document.createElement('li');
    //                         liElement.appendChild(imgElement);
    //                         ulElement.appendChild(liElement);
    //                     }
    //                 }
    //             };
    //             xhr.send();
    //         }
    //     }
    // }

    // // 页面加载完毕后调用加载图片函数
    // window.onload = loadImages;

    // // 解析XHR响应文本以获取文件名列表
    // function parseResponseText(responseText) {
    //     // 创建一个虚拟的div元素来容纳responseText
    //     const div = document.createElement('div');
    //     div.innerHTML = responseText;

    //     // 获取所有<a>标签
    //     const links = div.getElementsByTagName('a');
    //     const fileNames = [];

    //     // 遍历所有链接并提取文件名
    //     for (let i = 0; i < links.length; i++) {
    //         const href = links[i].getAttribute('title');
    //         fileNames.push(href);
    //     }
    //     return fileNames;
    // }




    //============================================================================

    // 字体大小
    var fontSizeItems = document.getElementsByClassName("fontSizeItems");
    for (var i = 0; i < fontSizeItems.length; i++) {
        fontSizeItem = fontSizeItems[i].getElementsByTagName("select")[0];
        for (var j = 59; j >= 1; j -= 2) {
            var optionElement = document.createElement("option");
            optionElement.value = j;
            optionElement.text = j;
            fontSizeItem.appendChild(optionElement);
        }
        fontSizeItem.value = g_fontSize[i];
    }


    //============================================================================

    // 字重
    var selectElement = document.getElementById("fontWeight");
    for (var i = 1000; i >= 100; i -= 100) {
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i;
        selectElement.appendChild(optionElement);
    }
    selectElement.value = g_fontWeight;

    //============================================================================

    // 右键菜单栏的字重
    // var selectElement = document.getElementById("afontWeight");
    // for (var i = 1000; i >= 100; i -= 100) {
    //     var optionElement = document.createElement("option");
    //     optionElement.value = i;
    //     optionElement.text = i;
    //     selectElement.appendChild(optionElement);
    // }

    // 字号字体改变交互
    changeFontInteractive();

}

// 字体改变交互
function changeFontInteractive() {

    // 触发标签类别变化事件
    var typefaceLevelNum = document.getElementById("select-typeface-levelNum");
    typefaceLevelNum.addEventListener("change", function () {
        var selectedNum = parseInt(typefaceLevelNum.value);
        showFontSizeOptions(selectedNum);
        changeFontSize();
    });


    // 触发改变字号事件
    var fontSizeItems = document.getElementsByClassName("fontSizeItems");
    for (var i = 0; i < fontSizeItems.length; i++) {
        fontSizeItem = fontSizeItems[i].getElementsByTagName("select")[0];
        fontSizeItem.addEventListener("change", changeFontSize);
    }


    // 触发改变字体事件
    // 获取所有字体div，并为它们添加点击事件处理程序
    const allTypefaceDivs = document.querySelectorAll('.one-typeface-box .typefaceitem');
    const allusedTypefaces = document.querySelectorAll('.one-typeface-box .usedTypeface');
    allTypefaceDivs.forEach(function (div, index) {
        div.addEventListener('click', function () {
            // 修改当前的全局字体
            g_typeface = div.style.fontFamily;
            // 移除所有字体div的选中状态
            allusedTypefaces.forEach(divv => {
                divv.style.display = 'none';
            });
            // 将当前点击的字体的“正在使用”设为选中状态（使之显示）
            allusedTypefaces[index].style.display = "block";
            // 字体改变事件
            changetypeface();
        });
    });

    // 触发改变字重事件
    document.getElementById("fontWeight").addEventListener("change", changeFontWeight);

    // // 触发改变字体事件
    // document.getElementById("atypeface").addEventListener("change", changeAtypeface);

    // // 触发改变字重事件
    // document.getElementById("afontWeight").addEventListener("change", changeAFontWeight);
}

// 定义一个函数用于显示指定数量的级别选项
function showFontSizeOptions(num) {
    var fontSizeOptions = document.getElementsByClassName("fontSizeItems");
    for (var i = 0; i < fontSizeOptions.length; i++) {
        if (i < num) fontSizeOptions[i].style.display = "block";
        else fontSizeOptions[i].style.display = "none";
    }
}


// 改变字号事件
function changeFontSize() {

    // 更新全局字号变量
    var fontSize = document.getElementsByClassName("fontSizeItems");
    for (var i = 0; i < fontSize.length; i++) {
        g_fontSize[i] = fontSize[i].getElementsByTagName("select")[0].value;
    }

    // 初始化标签字体大小
    initTagSize(selectedPOI);
    // 初始化影像金字塔
    initpoisPyramid(selectedPOI);


    // 清除canvas已绘制的元素
    canvas.clear();
    // 重新设置其背景
    canvas.setBackgroundColor(backgroundColor[nowBackgroundColorIndex]);
    // 开始生成标签云
    // 绘制中心点 
    drawCenter();
    // 绘制文本
    initDraw(poisPyramid[tagCloudScale]);


}

// 改变字体事件
function changetypeface() {
    // var typeface = document.getElementById("typeface").value;

    // console.log(g_typeface);

    var nowJson = poisPyramid[tagCloudScale];
    // 更新字体
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLength; i++) {
        // nowJson[i].typeface = g_typeface;
        canvas.item(i + 1).set({ fontFamily: g_typeface });
    }

    // 更新影像金字塔里面的typeface数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            poisPyramid[i][j].typeface = g_typeface;
        }
    }

    // 使用当前选中的色带
    // changeColor(nowColorScheme);
    canvas.renderAll();
}

// 改变字重事件
function changeFontWeight() {
    var theFontWeight = document.getElementById("fontWeight").value;
    // console.log(typeface);

    // 更新字重
    g_fontWeight = theFontWeight;

    var nowJson = poisPyramid[tagCloudScale];
    // 更新字体
    var nowJsonLength = Object.keys(nowJson).length;
    for (var i = 0; i < nowJsonLength; i++) {
        // nowJson[i].fontWeight = theFontWeight;
        canvas.item(i + 1).set({ fontWeight: theFontWeight });
    }


    // 更新影像金字塔里面的fontWeight数据
    var poisPyramidLen = poisPyramid.length;
    for (var i = 0; i < poisPyramidLen; i++) {
        var jsonLen = Object.keys(poisPyramid[i]).length;
        for (var j = 0; j < jsonLen; j++) {
            poisPyramid[i][j].fontWeight = theFontWeight;
        }
    }

    // 使用当前选中的色带
    // changeColor(nowColorScheme);
    canvas.renderAll();
}





// 改变单个字体
function changeAtypeface() {
    var typeface = document.getElementById("atypeface").value;
    activeEl.set({ fontFamily: typeface });
    canvas.renderAll();

    // 隐藏菜单
    menu = document.getElementById("right_menu");
    menu.style = "visibility: hidden;left: 0;top: 0;z-index: -100;";
}

// 改变单个字重
function changeAFontWeight() {
    var theFontWeight = document.getElementById("afontWeight").value;
    activeEl.set({ fontWeight: theFontWeight });
    canvas.renderAll();

    // 隐藏菜单
    menu = document.getElementById("right_menu");
    menu.style = "visibility: hidden;left: 0;top: 0;z-index: -100;";
}