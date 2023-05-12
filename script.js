const resultsNav = document.getElementById("resultsNav");
const favouritesNav = document.getElementById("favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
// using an object and not an array is due to being able to delete an item from an object using it's KEY value
let favourites = {};

function showContent(page) {
  // on load, scroll goes back to the top auto
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favouritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favouritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favourites);
  // console.log("Current Array", page, currentArray);
  // Using the forEach to call a function for each item in the array
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    // add a CSS class to target the CSS
    card.classList.add("card");

    // Link
    const link = document.createElement("a");
    // get the link from the NASA url
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    // want images to lazy load, so when you scroll it load to improve performance
    image.loading = "lazy";
    image.classList.add("card-img-top");

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    // dynamically populating title from the NASA API
    cardTitle.textContent = result.title;

    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favourites";
      saveText.setAttribute("onclick", `saveFavourite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favourite";
      saveText.setAttribute("onclick", `removeFavourite('${result.url}')`);
    }

    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;

    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;

    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `${result.copyright}`;

    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    // use append child because we're only appending one item
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get Favourites from localStorage
  if (localStorage.getItem("nasaFavourites")) {
    favourites = JSON.parse(localStorage.getItem("nasaFavourites"));
    // console.log("favourites from localStorage", favourites);
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Add Result to Favourites
function saveFavourite(itemUrl) {
  // Loop through Results Array to select Favourite
  resultsArray.forEach((item) => {
    // checking that if item is already in favourites, it won't re-add it
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      // Show Save Confirmation for 2 Seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favourites in Local Storage
      localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    }
  });
}

// Remove item from Favourites
// (using delete operator)
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    // Set Favourites in Local Storage
    localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    updateDOM("favourites");
  }
}

// Get 10 Images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove("hidden");
  try {
    // Grabbing the data from the NASA Api
    const response = await fetch(apiUrl);
    // Conversting this into a json string to display in the console
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
  }
}

// On Load
getNasaPictures();
