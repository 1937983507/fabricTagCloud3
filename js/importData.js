// 数据导入函数

selectedFile = null;

// 初始化数据导入=================================================
function initImportData() {
    // 导入数据按钮
    var openInputDataModelBtn = document.getElementById("openInputDataModel");
    // 数据导入模态框
    var modal = document.getElementById("myModal");
    // 关闭模态框按钮
    var closeModelBtn = document.getElementById("closeModel");

    // 文件上传按钮
    var fileInput = document.getElementById("fileInput");
    // 数据预览按钮
    var previewDataBtn = document.getElementById("previewDataBtn");
    // 确定导入数据
    var importDataBtn = document.getElementById("importDataBtn");

    // 获取模态框中的各参数
    var encodingSelect = document.getElementById("encodingSelect");
    var delimiterSelect = document.getElementById("delimiterSelect");

    // 获取各字段
    var placeColumnSelect = document.getElementById("placeColumn");
    var longitudeColumnSelect = document.getElementById("longitudeColumn");
    var latitudeColumnSelect = document.getElementById("latitudeColumn");
    var rankColumnSelect = document.getElementById("rankColumn");


    // 打开数据导入模态框
    openInputDataModelBtn.onclick = function () {
        modal.style.display = "block";
    }

    // 关闭数据导入模态框
    closeModelBtn.onclick = function () {
        modal.style.display = "none";
    }

    // 监听文件上传变化
    fileInput.addEventListener('change', function (e) {
        // 获取选中的文件
        selectedFile = e.target.files[0];
        console.log(selectedFile);
        handleFileSelect();
        previewData();
    });

    // 数据导入的参数改变
    encodingSelect.addEventListener('change', changeParameter);
    delimiterSelect.addEventListener('change', changeParameter);

    // 字段修改
    placeColumnSelect.addEventListener('change', previewData);
    longitudeColumnSelect.addEventListener('change', previewData);
    latitudeColumnSelect.addEventListener('change', previewData);
    rankColumnSelect.addEventListener('change', previewData);


    // 预览数据按钮点击事件
    previewDataBtn.addEventListener("click", previewDataShow);

    // 导入数据按钮点击事件
    importDataBtn.addEventListener("click", importData);
}




// 选择本地文件+读取文件表头（总）================================================
function handleFileSelect() {
    // 文件上传input
    var fileInput = document.getElementById("fileInput");
    var filePath = fileInput.value;
    // 文件名显示处
    var filenameInput = document.getElementById("filenameInput");
    filenameInput.value = filePath;

    // 获取文件后缀
    var fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    // 根据文件后缀调用不同的文件读取函数
    switch (fileExtension) {
        case 'txt':
        case 'csv':
            readCSVHeader();
            break;
        case 'xlsx':
            readExcelHeader();
            break;
        case 'shp':
            readShpHeader();
            break;
        default:
            alert('不支持的文件格式');
            break;
    }
}

// 读取CSV文件的表头
function readCSVHeader() {
    var reader = new FileReader();

    // 获取模态框中的各参数（编码、分隔符、忽略首行）
    var encodingSelect = document.getElementById("encodingSelect");
    var delimiterSelect = document.getElementById("delimiterSelect");
    // var ignoreHeaderCheckbox = document.getElementById("ignoreHeaderCheckbox");

    // 各字段下拉框
    var placeColumnSelect = document.getElementById("placeColumn");
    var longitudeColumnSelect = document.getElementById("longitudeColumn");
    var latitudeColumnSelect = document.getElementById("latitudeColumn");
    var rankColumnSelect = document.getElementById("rankColumn");

    reader.onload = function (e) {
        // 获取文件数据
        var content = e.target.result;
        var lines = content.split('\n');
        // 分隔符
        var delimiter = delimiterSelect.value;

        // 获取表头
        var header = lines[0].split(delimiter);


        // 更新字段选择下拉框
        updateSelectOptions(placeColumnSelect, header);
        updateSelectOptions(longitudeColumnSelect, header);
        updateSelectOptions(latitudeColumnSelect, header);
        updateSelectOptions(rankColumnSelect, header);
    };

    // 以文本形式读取文件
    reader.readAsText(selectedFile, encodingSelect.value);
}

// 读取Excel文件字段
function readExcelHeader() {
    // 实现读取Excel文件字段的逻辑
}

// 读取Shapefile文件字段
function readShpHeader() {
    // 实现读取Shapefile文件字段的逻辑
}

// 更新下拉框选项
function updateSelectOptions(selectElement, options) {
    // 清空下拉框
    selectElement.innerHTML = "";
    // 添加选项
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.text = options[i];
        selectElement.add(option);
    }
}






// 数据导入的参数改变===========================================================
function changeParameter() {
    // 读取文件表头
    handleFileSelect();
    // 自动更新数据预览窗口
    previewData();
}






// 显示/隐藏数据预览窗口==================================================
function previewDataShow() {
    var dataPreviewDiv = document.getElementById("dataPreview");
    if (dataPreviewDiv.style.display == "none") {
        dataPreviewDiv.style.display = "block";
        previewData();
    }
    else {
        dataPreviewDiv.style.display = "none";
    }
}

// 数据预览（总）
function previewData() {
    // 获取文件后缀
    var fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    // 根据文件后缀调用不同的文件读取函数
    switch (fileExtension) {
        case 'txt':
        case 'csv':
            previewCSVData();
            break;
        case 'xlsx':
            previewExcelData();
            break;
        case 'shp':
            previewShpData();
            break;
        default:
            alert('不支持的文件格式');
            break;
    }
}

// 数据预览（csv格式）
function previewCSVData() {
    // 分隔符
    var selectedDelimiter = document.getElementById("delimiterSelect").value;
    // 编码方式
    var selectedEncoding = document.getElementById("encodingSelect").value;
    // 数据预览窗口
    var dataPreviewDiv = document.getElementById("dataPreviewtBody");
    dataPreviewDiv.innerHTML = '';

    var reader = new FileReader();

    reader.onload = function (e) {
        // 获取数据
        var content = e.target.result;
        var lines = content.split('\n');

        var previewHTML = '';
        var rowCount = 0;

        // 仅显示用户选择的四个字段数据
        var placeColumnIndex = document.getElementById("placeColumn").selectedIndex;
        var longitudeColumnIndex = document.getElementById("longitudeColumn").selectedIndex;
        var latitudeColumnIndex = document.getElementById("latitudeColumn").selectedIndex;
        var rankColumnIndex = document.getElementById("rankColumn").selectedIndex;

        // 添加数据
        lines.forEach(function (line) {
            if (rowCount == 0) rowCount++;
            else if (rowCount < 6) {
                var cells = line.split(selectedDelimiter);
                const row = `
                        <tr>
                            <td>${cells[placeColumnIndex]}</td>
                            <td>${cells[longitudeColumnIndex]}</td>
                            <td>${cells[latitudeColumnIndex]}</td>
                            <td>${cells[rankColumnIndex]}</td>
                        </tr>
                    `;
                previewHTML += row;
                rowCount++;
            }
        });
        dataPreviewDiv.innerHTML = previewHTML;
    };

    // 以指定编码读取文件
    reader.readAsText(selectedFile, selectedEncoding);
}

// 数据预览（Excel格式）
function previewExcelData() {

}

// 数据预览（Shapefile格式）
function previewShpData() {

}






// 确定数据导入函数（总）===============================================================
function importData() {
    // 隐藏模态框
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    // 获取文件后缀
    var fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    // 根据文件后缀调用不同的文件读取函数
    switch (fileExtension) {
        case 'txt':
        case 'csv':
            importCSVData();
            break;
        case 'xlsx':
            importExcelData();
            break;
        case 'shp':
            importShpData();
            break;
        default:
            alert('不支持的文件格式');
            break;
    }

}


// 导入csv数据
function importCSVData() {
    // 分隔符
    var selectedDelimiter = document.getElementById("delimiterSelect").value;
    // 编码方式
    var selectedEncoding = document.getElementById("encodingSelect").value;
    // 数据预览窗口
    var dataPreviewDiv = document.getElementById("dataPreviewtBody");
    dataPreviewDiv.innerHTML = '';

    // 数据清零
    allPOI = [];

    var reader = new FileReader();

    reader.onload = function (e) {
        // 获取数据
        var content = e.target.result;
        var lines = content.split('\n');

        // 仅显示用户选择的四个字段数据
        var placeColumnIndex = document.getElementById("placeColumn").selectedIndex;
        var longitudeColumnIndex = document.getElementById("longitudeColumn").selectedIndex;
        var latitudeColumnIndex = document.getElementById("latitudeColumn").selectedIndex;
        var rankColumnIndex = document.getElementById("rankColumn").selectedIndex;

        // 添加数据
        for (var i = 0; i < lines.length; i++) {
            if (i == 0) continue;
            else {
                var cells = lines[i].split(selectedDelimiter);

                var pname = cells[placeColumnIndex];
                var X_gcj02 = cells[longitudeColumnIndex];
                var Y_gcj02 = cells[latitudeColumnIndex];
                var location = [X_gcj02, Y_gcj02];
                var rankInChina = cells[rankColumnIndex];
                var onePOI = {
                    "pid": i - 1,
                    "pname": pname,
                    "X_gcj02": X_gcj02,
                    "Y_gcj02": Y_gcj02,
                    "lnglat": location,
                    "rankInChina": rankInChina,
                    "selected": "",
                    "checked": false,
                    "deleted": false,
                }
                allPOI.push(onePOI);
            }
        }
        console.log(allPOI);
        // 更新POI总数
        allPOILength = allPOI.length;
        // 更新当前画布的POI
        changeSelected();
        // 更新表格
        initTable();
        // 在高德地图展示POI点
        showPOI();
    };

    // 以指定编码读取文件
    reader.readAsText(selectedFile, selectedEncoding);
}

// 导入excel数据
function importExcelData(){

}

// 导入shp数据
function importShpData(){

}