(() => {
    let page = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=12";
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

    document.getElementById("nextPokemon").addEventListener("click", function (){
        document.getElementById("target").innerHTML = "";
        input++;
        if (input == 1){
            document.getElementById("prevPokemon").disabled = true;
        } else {
            document.getElementById("prevPokemon").disabled = false;
        }
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        fetchPokemon(url, pokeClass);
        setTimeout(function () {
            printPokemon();
        }, 1000)
    })

    document.getElementById("prevPokemon").addEventListener("click", function (){
        document.getElementById("target").innerHTML = "";
        input--;
        if (input == 1){
            document.getElementById("prevPokemon").disabled = true;
        } else {
            document.getElementById("prevPokemon").disabled = false;
        }
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        fetchPokemon(url, pokeClass);
        setTimeout(function () {
            printPokemon();
        }, 1000)
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
        if (prevPage == null){
            document.getElementById("previous").disabled = true;
        } else {
            document.getElementById("previous").disabled = false;
        }

        if (nextPage == null){
            document.getElementById("next").disabled = true;
        } else {
            document.getElementById("next").disabled = false;
        }

        for (let i = 0; i < data.results.length; i++) {
            pokeUrl.push(data.results[i].url);
        }
        console.log(pokeUrl)
        pageClass = new pokPage(data);
        fetchPokemonPage();
    }

    async function fetchPokemonPage() {
                try {
            const response = Promise.all(pokeUrl.map((url, i) =>
                fetch(pokeUrl[i]).then(resp => resp.json())
            )).then(json=> {
                for (let i = 0; i < json.length; i++){
                    pageClass.name.push(json[i].name);
                    pageClass.sprite.push(json[i].sprites.front_default);
                    pageClass.id.push(makeId(json[i]));
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
    const init = () => {
        fetchPokemonPage();
    }

    function printPage(){
        for (let i = 0; i < pageClass.name.length; i++){
            let div = document.createElement("div");
            div.classList.add("col-sm-4", "col-lg-12");

            let sprite = document.createElement("img");
            sprite.src = pageClass.sprite[i];
            div.append(sprite);

            let name = document.createElement("strong");
            name.innerHTML = pageClass.name[i];
            div.append(name);

            let id = document.createElement("em");
            id.innerHTML = pageClass.id[i];
            div.append(id);

            document.getElementById("pokemon").append(div);
        }
    }

    function search(){
        document.getElementById("target").innerHTML = "";
        checkInput()
        document.getElementById("prevPokemon").disabled = false;
        document.getElementById("nextPokemon").disabled = false;
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        fetchPokemon(url, pokeClass);
        setTimeout(function () {
            printPokemon();
            document.getElementById("singlePokemon").style.display = "block";
            document.getElementById("page").style.marginTop = "10px";
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

        pokeObj.id = data.id;
        pokeObj.name = data.name;
        pokeObj.idHash = makeId(data);
        pokeObj.sprite = data.sprites.front_default;
        pokeObj.shinySprite = data.sprites.front_shiny;
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
        id.innerHTML = pokeObj.idHash;
        div.append(id);

        document.getElementById("target").append(div);
    }

    function checkInput() {
        input = document.getElementById("pokeInput").value;
        if (input == 1){
            document.getElementById("prevPokemon").disabled = true;
        } else {
            document.getElementById("prevPokemon").disabled = false;
        }
    }

})();