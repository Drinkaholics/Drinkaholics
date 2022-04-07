var searchbar = document.querySelector("#ingredients");
var searchbtn = document.querySelector("#submit-button")
var resetbtn = document.querySelector("#reset");
var ingredientlist = document.querySelector("#search-history");
var currentlist = [];

var displayonsearch = function() {
  if (currentlist.length == 0) {
    console.log("No Search and Default Display");
    return;
  } else {
    var ingredient =  "";
    for (var i = 0; i < currentlist.length; i++) {
      ingredient += currentlist[i] + ",";
    }
    var apiUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + ingredient.slice(0, -1);
    console.log("this is ur apiurl: --- " + apiUrl);
    fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        if (data.drinks == "None Found") {
          console.log("No Result")
        } else {
          for (var i = 0; i < data.drinks.length; i++) {
            console.log(data.drinks[i].strDrink);
          }
        }
      })});
  }
};

var addlist = function (name) {
  var templist = document.createElement("li");
  templist.textContent = name;
  ingredientlist.appendChild(templist);
};

var search = function (event) {
  event.preventDefault();
  var ingredientname = searchbar.value.trim();
  console.log(ingredientname);
  if (ingredientname) {
    currentlist.push(ingredientname);
    addlist(ingredientname);
    displayonsearch();
    searchbar.value = "";
  } else {
    alert("Please enter an ingredient username");
  }
};

var resetsearch = function (event) {
  event.preventDefault();
  currentlist = [];
  while (ingredientlist.lastElementChild) {
    ingredientlist.removeChild(ingredientlist.lastElementChild);
  };
  displayonsearch();
};

searchbtn.addEventListener("click", search);
resetbtn.addEventListener("click", resetsearch);