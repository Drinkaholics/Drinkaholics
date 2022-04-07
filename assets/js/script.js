var searchbar = document.querySelector("#ingredients");
var searchbtn = document.querySelector("#submit-button")
var resetbtn = document.querySelector("#reset");
var ingredientlist = document.querySelector("#search-history");
var display = document.querySelector("#displaylist");
var choose = document.querySelector("#chooselist");
var itemtitle = document.querySelector("#iteminfo");
var currentlist = [];

var displayonsearch = function() {
  clearlist();
  if (currentlist.length == 0) {
    return;
  } else {
    var ingredient =  "";
    for (var i = 0; i < currentlist.length; i++) {
      ingredient += currentlist[i] + ",";
    }
    var apiUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + ingredient.slice(0, -1);
    console.log("this is api to filter the list based on ingredients --------- " + apiUrl);
    fetch(apiUrl).then(function(response) {
      response.json().then(function(data) {
        if (data.drinks == "None Found") {
          display.textContent = "No Result Found, Please Reset and Try a New Combination"
        } else {
          display.textContent = data.drinks.length + " drinks found: "
          for (var i = 0; i < data.drinks.length; i++) {
            var templist = document.createElement("li");
            templist.setAttribute("class", "listitem");
            templist.setAttribute("id", data.drinks[i].idDrink);
            templist.textContent = data.drinks[i].strDrink;
            display.appendChild(templist);
          }
        }
      })});
  }
};

var displayitem = function (drinkid) {
  display.textContent = "";
  while (display.lastElementChild) {
    display.removeChild(display.lastElementChild);
  };
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkid;
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log("this is API to find the drink detail ------- " + apiUrl);
      var drink = data.drinks[0];
      var item_name = document.createElement("h2");
      var item_image = document.createElement("img");
      item_name.textContent = drink.strDrink;
      item_image.setAttribute("src", drink.strDrinkThumb);
      itemtitle.appendChild(item_name);
      itemtitle.appendChild(item_image);
      }
    )});
};


var addlist = function (name) {
  var templist = document.createElement("li");
  templist.textContent = name;
  ingredientlist.appendChild(templist);
};

var search = function (event) {
  event.preventDefault();
  var ingredientname = searchbar.value.trim();
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

var clearlist = function () {
  display.textContent = "";
  while (display.lastElementChild) {
    display.removeChild(display.lastElementChild);
  };
  while (itemtitle.lastElementChild) {
    itemtitle.removeChild(itemtitle.lastElementChild);
  };
}

var loadingoption = function () {
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";
  console.log("This is api to load all options into dropdown option ---- " + apiUrl);
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      for (var i = 0; i < data.drinks.length; i++) {
        var templist = document.createElement("option");
        templist.textContent = data.drinks[i].strIngredient1;
        templist.setAttribute("value", data.drinks[i].strIngredient1.replace(' ', '_'))
        choose.appendChild(templist);
      }
  })});
};

$("#chooselist").on("change", function(event) {
  searchbar.value = this.value;
});

$("#displaylist").on("click", ".listitem", function() {
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + this.id;
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      displayitem(data.drinks[0].idDrink);
    })});
  
});

searchbtn.addEventListener("click", search);
resetbtn.addEventListener("click", resetsearch);
loadingoption();