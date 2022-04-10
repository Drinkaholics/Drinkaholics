var searchbar = document.querySelector("#ingredients");
var searchbtn = document.querySelector("#submit-button")
var resetbtn = document.querySelector("#reset");
var ingredientlist = document.querySelector("#search-history");
var display = document.querySelector("#displaylist");
var choose = document.querySelector("#chooselist");
var itemtitle = document.querySelector("#iteminfo");
var title = document.querySelector("#displaytitle");
var displaysave = document.querySelector("#saved");
var currentlist = [];
var saveddrink = [];

var displayonsearch = function() {
  var apiUrl = "";
  clearlist();
  if (currentlist.length == 0) {
    apiUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/randomselection.php";
  } else {
    var ingredient =  "";
    for (var i = 0; i < currentlist.length; i++) {
      ingredient += currentlist[i] + ",";
    }
    apiUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=" + ingredient.slice(0, -1);
  }
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      if (currentlist.length == 0) {
        title.textContent = "Here are some random cocktails";
      } else if (data.drinks == "None Found") {
        title.textContent = "No results found, Please try other combination"
        return;
      } else {
        title.textContent = data.drinks.length + " drinks found: "
      };
      for (var i = 0; i < data.drinks.length; i++) {
        var templist = document.createElement("div");
        var drinkimg = document.createElement("img");
        drinkimg.setAttribute("src", data.drinks[i].strDrinkThumb);
        templist.setAttribute("class", "listitem card");
        templist.setAttribute("id", data.drinks[i].idDrink);
        templist.textContent = data.drinks[i].strDrink;
        templist.appendChild(drinkimg);
        display.appendChild(templist);
      }
   })
  });
};

var displayitem = function (drinkid) {
  title.textContent = "";
  while (display.lastElementChild) {
    display.removeChild(display.lastElementChild);
  };
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkid;
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      var drink = data.drinks[0];
      var item_image = document.createElement("img");
      var instruction = document.createElement("p");
      instruction.textContent = drink.strInstructions;
      item_image.setAttribute("src", drink.strDrinkThumb);
      title.textContent = drink.strDrink;
      itemtitle.appendChild(item_image);
      itemtitle.appendChild(instruction);
      test = drink;
      var temp = document.createElement("ul");
      for (var i = 1; i<15; i++) {
        var templist = document.createElement("li");
        temping = "strIngredient" + i;
        tempmeature = "strMeasure" + i;
        if (eval("drink." + temping)) {
          templist.textContent = eval("drink." + temping) + ": " + eval("drink." + tempmeature);
          temp.appendChild(templist);
        }
      }
      var savebtn = document.createElement("button");
      savebtn.setAttribute("class", "button");
      savebtn.setAttribute("type", "click");
      savebtn.setAttribute("id", drink.idDrink);
      if (saveddrink.includes(drink.idDrink)) {
        savebtn.textContent = "Saved";
      } else {
        savebtn.textContent = "Save";
      };
      display.appendChild(temp);
      display.appendChild(savebtn);
      }
    )});
};


var addlist = function (name) {
  var templist = document.createElement("li");
  templist.textContent = name;
  var b = document.createElement("button");
  b.setAttribute("class", "alert button");
  b.setAttribute("type", "click");
  b.textContent = "X";
  templist.appendChild(b);
  ingredientlist.appendChild(templist);
};

var search = function (event) {
  event.preventDefault();
  chooselist.value = "";
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

var displaysaved = function () {
  clearlist();
  if (saveddrink.length == 0) {
    title.textContent = "You haven't saved any drink yet";
  } else {
    for (var i = 0; i < saveddrink.length; i++) {
      var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + saveddrink[i];
      fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
          var templist = document.createElement("div");
          var drinkimg = document.createElement("img");
          drinkimg.setAttribute("src", data.drinks[0].strDrinkThumb);
          templist.setAttribute("class", "listitem card");
          templist.setAttribute("id", data.drinks[0].idDrink);
          templist.textContent = data.drinks[0].strDrink;
          templist.appendChild(drinkimg);
          display.appendChild(templist);
        })})
    }
  }
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
  var templist = [];
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      for (var i = 0; i < data.drinks.length; i++) {
        templist.push(data.drinks[i].strIngredient1);
      }
      templist = templist.sort();
      for (var i = 0;i < templist.length; i++) {
        var temp = document.createElement("option");
        temp.setAttribute("value", templist[i].replace(' ', '_'));
        temp.textContent = templist[i];
        choose.appendChild(temp);
      }
  })});
};

$("#chooselist").on("change", function(event) {
  searchbar.value = this.value;
});

$("#search-history").on("click", "button", function(event){
  var temp = this.parentElement.textContent.slice(0, -1);
  for (var i = 0; i < currentlist.length; i++) {
    if (currentlist[i] == temp) {
      currentlist.pop(i);
    }
  };
  this.parentElement.remove();
  displayonsearch();
});

$("#displaylist").on("click", ".listitem", function() {
  var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + this.id;
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      displayitem(data.drinks[0].idDrink);
    })});
});

$("#displaylist").on("click", "button", function(event) {
  if (this.textContent == "Save") {
    this.textContent = "Saved";
    saveddrink.push(this.id);
  } else {
    this.textContent = "Save";
    for (var i = 0; i < saveddrink.length; i++) {
      if (saveddrink[i] == this.id) {
        saveddrink.pop(i);
      }
    }
  }
  save();
});

var save = function() {
  localStorage.setItem("saved", JSON.stringify(saveddrink));
};

var load = function() {
  if (localStorage.length != 0) {
  saveddrink = JSON.parse(localStorage.getItem("saved"));
  };
};

searchbtn.addEventListener("click", search);
resetbtn.addEventListener("click", resetsearch);
displaysave.addEventListener("click", displaysaved);
loadingoption();
displayonsearch();
load();