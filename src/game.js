(() => {
    let input;
    let pokobj;

    document.getElementById("search").addEventListener("click", function () {
        checkInput()
        let url = "https://pokeapi.co/api/v2/pokemon/" + input;
        let pokemon = fetchPokemon(url, makeClass);
        console.log(pokemon);
    })

    function fetchPokemon(url, func) {
        fetch(url)
            .then(response => response.json())
            .then(data => func(data))
    }

    function makeClass(data){
        console.log(data);
        pokobj = new pokemon(data)
        pokobj.name = data.name;
        pokobj.id = data.id;
        return pokobj;
    }

    function checkInput() {
        input = document.getElementById("pokeInput").value;
    }

})();