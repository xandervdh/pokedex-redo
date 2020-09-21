(() => {
    let page = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=9";
    getPage(page);
    let pokeUrl = [];
    let pageClass;
    setTimeout(function (){
        console.log(pageClass);
    },1000);
    let prevPage;
    let nextPage;
    let input;
    let pokeObj;

    document.getElementById("pokeInput").addEventListener("keypress", function(e) {
        let key = e.which || e.keyCode || 0;
        if (key === 13) {
            search();
        }
    });

    document.getElementById("search").addEventListener("click", function () {
        search();
    })

    document.getElementById("previous").addEventListener("click", function (){
        document.getElementById("pokemon").innerHTML = "";
        pokeUrl = [];
        getPage(prevPage);
    })

    document.getElementById("next").addEventListener("click", function (){
        document.getElementById("pokemon").innerHTML = "";
        pokeUrl = [];
        getPage(nextPage);
    })

    function getPage(url) {
        fetchPokemon(url, getUrls)
        setTimeout(function (){
            printPage();
        },1000)
    }

    function getUrls(data) {
        prevPage = data.previous;
        nextPage = data.next;
        for (let i = 0; i < data.results.length; i++) {
            pokeUrl.push(data.results[i].url);
        }
        console.log(pokeUrl)
        pageClass = new pokPage(data);
        for (let i = 0; i < pokeUrl.length; i++){
            fetchPokemon(pokeUrl[i], getPageClass)
        }
    }

    function getPageClass(data){
        pageClass.name.push(data.name);
        pageClass.sprite.push(data.sprites.front_default);
    }

    function printPage(){
        for (let i = 0; i < pageClass.name.length; i++){
            let div = document.createElement("div");
            div.classList.add("col-4");

            let sprite = document.createElement("img");
            sprite.src = pageClass.sprite[i];
            div.append(sprite);

            let name = document.createElement("strong");
            name.innerHTML = pageClass.name[i];
            div.append(name);

            document.getElementById("pokemon").append(div);
        }
    }

    function search(){
        checkInput()
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        fetchPokemon(url, pokeClass);
        setTimeout(function () {
            printPokemon();
        }, 1000)
    }

    function fetchPokemon(url, func) {
        fetch(url)
            .then(response => response.json())
            .then(data => func(data))
    }

    function pokeClass(data) {
        console.log(data);
        pokeObj = new pokemon(data)

        pokeObj.name = data.name;
        pokeObj.id = makeId(data);
        pokeObj.sprite = data.sprites.front_default;
    }

    function makeId(data) {
        let ID;
        if (data.id < 10) {
            ID = "#00" + data.id;
        } else if (data.id < 100) {
            ID = "#0" + data.id;
        } else {
            ID = "#" + data.id;
        }
        return ID;
    }

    function printPokemon() {
        let div = document.createElement("div");

        let sprite = document.createElement("img");
        sprite.src = pokeObj.sprite;
        div.append(sprite);

        let name = document.createElement("strong");
        name.innerHTML = pokeObj.name;
        div.append(name);

        let id = document.createElement("em");
        id.innerHTML = pokeObj.id;
        div.append(id);

        document.getElementById("target").append(div);
    }

    function checkInput() {
        input = document.getElementById("pokeInput").value;
        document.getElementById("target").innerHTML = "";
    }

})();