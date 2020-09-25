(() => {
    let page = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=12";
    getPage(page);
    let pokeUrl = [];
    let pageClass;
    setTimeout(function () {
        console.log(pageClass);
    }, 1000);
    let prevPage;
    let nextPage;
    let input;
    let pokeObj;

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById("singlePokemon").style.display = "none";
    })

    document.getElementById("pokeInput").addEventListener("keypress", function (e) {
        let key = e.which || e.keyCode || 0;
        if (key === 13) {
            search();
        }
    });

    document.getElementById("search").addEventListener("click", function () {
        search();
    })

    document.getElementById("nextPokemon").addEventListener("click", function () {
        document.getElementById("target").innerHTML = "";
        input = pokeObj.id + 1;
        if (input == 1) {
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

    document.getElementById("prevPokemon").addEventListener("click", function () {
        document.getElementById("target").innerHTML = "";
        input = pokeObj.id - 1;
        if (input == 1) {
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

    document.getElementById("previous").addEventListener("click", function () {
        document.getElementById("pokemon").innerHTML = "";
        pokeUrl = [];
        getPage(prevPage);
    })

    document.getElementById("next").addEventListener("click", function () {
        document.getElementById("pokemon").innerHTML = "";
        pokeUrl = [];
        getPage(nextPage);
    })

    function getPage(url) {
        fetchPokemon(url, getUrls)
        setTimeout(function () {
            printPage();
        }, 1000)
    }

    function getUrls(data) {
        prevPage = data.previous;
        nextPage = data.next;
        if (prevPage == null) {
            document.getElementById("previous").disabled = true;
        } else {
            document.getElementById("previous").disabled = false;
        }

        if (nextPage == null) {
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
            )).then(json => {
                for (let i = 0; i < json.length; i++) {
                    pageClass.name.push(json[i].name);
                    pageClass.sprite.push(json[i].sprites.front_default);
                    pageClass.id.push(makeId(json[i]));
                    pageClass.type.push(json[i].types[0].type.name);
                    pageClass.color.push(getColor(pageClass.type[i]));
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    const init = () => {
        fetchPokemonPage();
    }

    function printPage() {
        for (let i = 0; i < pageClass.name.length; i++) {
            let div = document.createElement("div");
            div.classList.add("col-sm-4", "col-lg-12", "showPokemon");
            div.style.backgroundColor = pageClass.color[i];

            let id = document.createElement("em");
            id.innerHTML = pageClass.id[i];
            div.append(id);

            let sprite = document.createElement("img");
            sprite.src = pageClass.sprite[i];
            div.append(sprite);

            let name = document.createElement("strong");
            name.innerHTML = pageClass.name[i];
            div.append(name);

            document.getElementById("pokemon").append(div);
        }
        let link = document.getElementsByClassName("showPokemon");
        for (let i = 0; i < link.length; i++) {
            link[i].addEventListener("click", function () {
                document.getElementById("target").innerHTML = "";
                document.getElementById("prevPokemon").disabled = false;
                document.getElementById("nextPokemon").disabled = false;
                let url = "https://pokeapi.co/api/v2/pokemon/" + pageClass.name[i];
                fetchPokemon(url, pokeClass);
                setTimeout(function () {
                    printPokemon();
                    document.getElementById("singlePokemon").style.display = "block";
                }, 1000)
            })
        }
    }

    function search() {
        document.getElementById("target").innerHTML = "";
        checkInput()
        document.getElementById("prevPokemon").disabled = false;
        document.getElementById("nextPokemon").disabled = false;
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        fetchPokemon(url, pokeClass);
        setTimeout(function () {
            printPokemon();
            document.getElementById("singlePokemon").style.display = "block";
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
        pokeObj.typeOne = data.types[0].type.name;
        //pokeObj.typeTwo = data.types[1].type.name;

        pokeObj.color = getColor(pokeObj.typeOne);

        console.log(pokeObj.color);
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

    function getColor(type) {
        let color;
        switch (type) {
            case "bug":
                color = "rgb(168, 184, 32, 0.5)";
                break;
            case "dark":
                color = "rgb(112, 88, 72, 0.5)";
                break;
            case "dragon":
                color = "rgb(112, 56, 248, 0.5)";
                break;
            case "electric":
                color = "rgb(248, 208, 48, 0.5)";
                break;
            case "fairy":
                color = "rgb(238, 153, 172, 0.5)";
                break;
            case "fighting":
                color = "rgb(192, 48, 40, 0.5)";
                break;
            case "fire":
                color = "rgb(240, 128, 48, 0.5)";
                break;
            case "flying":
                color = "rgb(168, 144, 240, 0.5)";
                break;
            case "ghost":
                color = "rgb(112, 88, 152, 0.5)";
                break;
            case "grass":
                color = "rgb(120, 200, 80, 0.5)";
                break;
            case "ground":
                color = "rgb(224, 192, 104, 0.5)";
                break;
            case "ice":
                color = "rgb(152, 216, 216, 0.5)";
                break;
            case "normal":
                color = "rgb(168, 168, 120, 0.5)";
                break;
            case "poison":
                color = "rgb(160, 64, 160, 0.5)";
                break;
            case "psychic":
                color = "rgb(248, 88, 136, 0.5)";
                break;
            case "rock":
                color = "rgb(184, 160, 56, 0.5)";
                break;
            case "steel":
                color = "rgb(184, 184, 208, 0.5)";
                break;
            case "water":
                color = "rgb(104, 144, 240, 0.5)";
                break;
        }
        return color;
    }

    function getBackgroundColor(type) {
        let color;
        switch (type) {
            case "bug":
                color = "rgb(168, 184, 32)";
                break;
            case "dark":
                color = "rgb(112, 88, 72)";
                break;
            case "dragon":
                color = "rgb(112, 56, 248)";
                break;
            case "electric":
                color = "rgb(248, 208, 48)";
                break;
            case "fairy":
                color = "rgb(238, 153, 172)";
                break;
            case "fighting":
                color = "rgb(192, 48, 40)";
                break;
            case "fire":
                color = "rgb(240, 128, 48)";
                break;
            case "flying":
                color = "rgb(168, 144, 240)";
                break;
            case "ghost":
                color = "rgb(112, 88, 152)";
                break;
            case "grass":
                color = "rgb(120, 200, 80)";
                break;
            case "ground":
                color = "rgb(224, 192, 104)";
                break;
            case "ice":
                color = "rgb(152, 216, 216)";
                break;
            case "normal":
                color = "rgb(168, 168, 120)";
                break;
            case "poison":
                color = "rgb(160, 64, 160)";
                break;
            case "psychic":
                color = "rgb(248, 88, 136)";
                break;
            case "rock":
                color = "rgb(184, 160, 56)";
                break;
            case "steel":
                color = "rgb(184, 184, 208)";
                break;
            case "water":
                color = "rgb(104, 144, 240)";
                break;
        }
        return color;
    }

    function printPokemon() {
        document.getElementById("content").style.backgroundColor = getBackgroundColor(pokeObj.typeOne);

        let div = document.createElement("div");
        div.classList.add("pokemon");

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
        if (input == 1) {
            document.getElementById("prevPokemon").disabled = true;
        } else {
            document.getElementById("prevPokemon").disabled = false;
        }
    }

})();