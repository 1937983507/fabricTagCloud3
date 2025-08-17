window.onload = async function(){
    // 根据颜色列表显示色带
    const colorUl = document.querySelector('#color-list');
    for(let i = 0; i < colorScheme.length; i++){
        // 色带
        const scheme = colorScheme[i];
        const li = document.createElement('li');
        // 绑定数据
        d3.select(li).datum(scheme);

        li.className = 'color-li';
        if(i == 0) li.classList = 'color-li selected';
    
        for(let j = 0; j < scheme.length; j++){
            const color = scheme[j];
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-div';
            colorDiv.style.backgroundColor = color;
            li.appendChild(colorDiv);
        }
        colorUl.appendChild(li);
    }

    // 色带点击事件
    const colorList = document.querySelectorAll('.color-li');
    for(let i = 0; i < colorList.length; i++){
        colorList[i].onclick = function(){
            // 清除已选
            for(let j = 0; j < colorList.length; j++){
                colorList[j].classList.remove('selected');
            }
            this.classList.add('selected');
        }
    }

    // 中心城市Ul
    const cityUl = document.querySelector('ul#city-list');
    function createCityList(sourceCities){
        // 移除cityUl所有子节点
        while(cityUl.firstChild){
            cityUl.removeChild(cityUl.firstChild);
        }
        for(let i = 0; i < sourceCities.length; i++){
            const source = sourceCities[i];
            const li = document.createElement('li');
            li.className = 'city-li';
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.id = source;
            li.appendChild(checkBox);
            const label = document.createElement('label');
            label.htmlFor = source;
            label.innerHTML = source;
            li.appendChild(label);
            cityUl.appendChild(li);
        }
    }

    // 获取数据
    const flightData = await d3.json('./data/flightsData.json'); 
    // const migrationData22 = await d3.json('./data/migrationData_20220101.json');
    // const migrationData23 = await d3.json('./data/migrationData_20230101.json');
    // const migrationData24 = await d3.json('./data/migrationData_20240101.json');

    // 航班数据中心城市
    createCityList(flightData.map(d => d.source.name));

    // 数据类型单选框
    const dataInputs = document.querySelectorAll('input[name=data-input]');
    for(let i = 0; i < dataInputs.length; i++){
        dataInputs[i].onchange = async function(){
            switch(this.id){
                case 'dataMigration22':
                    const migrationData22 = await d3.json('./data/migrationData_20220101.json');
                    createCityList(migrationData22.map(d => d.source.name));
                    break;
                case 'dataMigration23':
                    const migrationData23 = await d3.json('./data/migrationData_20230101.json');
                    createCityList(migrationData23.map(d => d.source.name));
                    break;
                case 'dataMigration24':
                    const migrationData24 = await d3.json('./data/migrationData_20240101.json');
                    createCityList(migrationData24.map(d => d.source.name));
                    break;
                default:
                    createCityList(flightData.map(d => d.source.name));
            }
        }
    }



}