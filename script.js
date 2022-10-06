const domElements = {
  results: document.getElementById("result"),
  search: {
    input: document.getElementById("search-input"),
    button: document.getElementById("search-button"),
  },
  filters: {
    category: document.getElementById("filter-category"),
    color: document.getElementById("filter-color"),
    year: document.getElementById("filter-year"),
    country: document.getElementById("filter-country"),
  },
};

//Cards generation
function generateCards(data) {
  const cards = [];

  for (let i = 0; i < data.length; i++) {
    let countClass = "card_stock";
    let stockCheck = data[i].count;
    if (data[i].count === 0) {
      countClass = "card_stock card_stock_empty";
      stockCheck = "Out of Stock";
    }
    cards.push(
      `<div class="card">
            <img
              src="https://placeimg.com/300/200/tech?id=${i}"
              alt=""
              class="card_img"
            />

            <div class="card_content">
              <h3 class="card_title">${data[i].title}</h3>
              <div class="card_description">${data[i].description}</div>
              <div class="card_info">
                <div class="card_param">
                  <label>Year:</label>
                  <div id="year">${data[i].params.year}</div>
                </div>
                <div class="card_param">
                  <label>Color:</label>
                  <div id="color">${data[i].params.color}</div>
                </div>

                <div class="card_param">
                  <label>Country:</label>
                  <div id="country">${data[i].params.country}</div>
                </div>
                <div class="card_param">
                  <label>Category:</label>
                  <div id="type">${data[i].params.category}</div>
                </div>
              </div>
              <div class="card_footer">
                <div class="card_stock ${countClass}">
                  <label>In stock:</label>
                  <div id="stock">${stockCheck}</div>
                </div>
                <div class="card_cost">
                  <label>Price:</label>
                  <div>${data[i].cost}</div>
                </div>
              </div>
            </div>
          </div>
            `
    );
  }
  return cards;
}

//Inject card in html
const cardsArr = generateCards(cardsData);
domElements.results.innerHTML = cardsArr.join("");

//Seearch Items

let searchValue = "";
domElements.search.input.oninput = (event) => {
  searchValue = event.target.value;
  filter();
};
domElements.search.button.onclick = () => {
  filter();
};

//Filtering
function filter() {
  const rgx = new RegExp(searchValue, "i");
  let filteredData = cardsData.filter((card) => {
    if (rgx.test(card.title)) {
      return true;
    } else {
      return false;
    }
  });
  domElements.results.innerHTML = generateCards(filteredData).join("");
}

//Dropdown filtering
const filtersType = ["category", "color", "year", "country"];

filtersType.forEach((type) => handleChangeFilter(type));

//Monitoring filters changes
function handleChangeFilter(type) {
  domElements.filters[type].onchange = (event) => {
    const value = event.target.value;
    const filteredCards = filterCards(type, value, cardsData);
    const finalFiltering = checkOtherFilter(filtersType, filteredCards, type);
    const cardsHTML = generateCards(finalFiltering).join("");
    domElements.results.innerHTML = cardsHTML;
  };
}

//Filtering items
function filterCards(filterType, value, cards) {
  const filteredCards = cards.filter((card) => {
    const reg = new RegExp(value);
    if (reg.test(card.params[filterType])) {
      return true;
    } else {
      return false;
    }
  });
  return filteredCards;
}

//Checking and filtering considering another filters params
function checkOtherFilter(filtersType, filteredCards, extraFilterType) {
  let moreFilteredCards = filteredCards;
  const filteredFiltersType = filtersType.filter(
    (type) => type !== extraFilterType
  );

  filteredFiltersType.forEach((type) => {
    const value = domElements.filters[type].value;
    const reg = new RegExp(value);
    const newFilteredCards = moreFilteredCards.filter((card) => {
      if (reg.test(card.params[type])) {
        return true;
      } else {
        return false;
      }
    });
    moreFilteredCards = newFilteredCards;
  });
  return moreFilteredCards;
}
