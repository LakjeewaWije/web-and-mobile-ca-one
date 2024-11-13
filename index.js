console.log("index laoded");
// const Fuse = require('fuse.js');
var rentData = [];
async function init() {
    // load initial data
    const resData = await loadRentalData();
    rentData = resData;
    appendRentData(resData);
}
init();

const dialog = $('#myDialog');
const openBtn = $('#moreFilters');
const closeBtn = $('#closeDialogBtn');
const confirmBtn = $('#confirmBtn');

// Open the dialog when the button is clicked
openBtn[0].addEventListener('click', () => {
    // dialog.showModal(); // Use showModal() for a modal dialog
    dialog[0].showModal();
});

// Close the dialog when the close button is clicked
closeBtn[0].addEventListener('click', () => {
    dialog[0].close();
});

confirmBtn[0].addEventListener('click', () => {
    dialog[0].close();
    filterProperties()
});

$('.clear-filter-btn').addEventListener('click', () => {
    // dialog.showModal(); // Use showModal() for a modal dialog
    alert("wije")
});


// load json data from file
async function loadRentalData() {
    const resData = await fetch('./data.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    const data = await resData.json();

    return data;
};

function appendRentData(data) {
    let gridContainer = $('.property-grid');
    console.log("Data ", data);
    gridContainer.empty();
    data.forEach(rentItem => {
        const gridItem = `    <div class="property-card">
      <img src="${rentItem.featuredImage}" alt="Property Image" class="property-image">
      <div class="property-info">
        <h2 class="property-title">${rentItem.name}</h2>
        <p class="property-price" style="font-weight: 700;">${rentItem.price}</p>
        <p class="property-price">🏛️ ${rentItem.type} ⚡ ${rentItem.berRating}</p>
        <p class="property-location">📍 ${rentItem.location}</p>
        <p class="property-location">Category: ${rentItem.category}</p>
        <p class="property-location">🛏️ ${rentItem.bedrooms}  🛁 ${rentItem.bathrooms}</p>
        <a class="view-details" href="details.html?id=${rentItem.id}">View Details</a>
      </div>
    </div>`;
        gridContainer.append(gridItem)
    });

    gridContainer.append()
}

function filterProperties() {
    // search query
    var searchKey = $('#searchKey').val();
    console.log("searchKey ", searchKey);

    // price order
    var priceOrder = $('#selectPriceInput').find(":selected").val();
    console.log("priceOrder ", priceOrder);

    // no of beds
    var noOfBeds = $('#selectBedsInput').find(":selected").val();
    console.log("noOfBeds ", noOfBeds);

    // no of baths
    var noOfBaths = $('#selectBathsInput').find(":selected").val();
    console.log("noOfBaths ", noOfBaths);

    let tempRental = rentData;
    let tempFinalRentalData = [];
    if (!searchKey && noOfBeds == 0 && noOfBaths == 0 && priceOrder == 0) {
        $(".clear-filter-btn").hide();
        return appendRentData(tempRental);
    }
    console.log("wije final called ",)
    if (searchKey) {
        $(".clear-filter-btn").show();
        // Configure Fuse.js options 
        options = {
            keys: ['name', 'location', 'category'], // Fields to search 
            threshold: 0.3 // Adjust this value for stricter or looser matches 
        };

        // Create a new instance of Fuse 
        const fuse = new Fuse(tempFinalRentalData.length > 0 ? tempFinalRentalData : tempRental, options);

        const sortedRentals = fuse.search(searchKey);

        console.log("sortedRentals ", sortedRentals);



        sortedRentals.forEach((data) => {
            tempFinalRentalData.push(data.item);
        })
    }

    if (noOfBeds > 0) {
        $(".clear-filter-btn").show();
        tempFinalRentalData = tempFinalRentalData.length > 0 ? tempFinalRentalData.filter(property => property.bedrooms == noOfBeds) :
            tempRental.filter(property => property.bedrooms == noOfBeds);
    }

    if (noOfBaths > 0) {
        $(".clear-filter-btn").show();
        tempFinalRentalData = tempFinalRentalData.length > 0 ? tempFinalRentalData.filter(property => property.bathrooms == noOfBaths) :
            tempRental.filter(property => property.bathrooms == noOfBaths);
    }

    if (priceOrder > 0) {
        $(".clear-filter-btn").show();
        if (priceOrder == 2) {
            // Sort the array by price from highest to lowest 
            tempFinalRentalData = tempFinalRentalData.length > 0 ? tempFinalRentalData.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)) :
                tempRental.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }
        if (priceOrder == 1) {
            // Sort the array by price from lowest to highest 
            tempFinalRentalData = tempFinalRentalData.length > 0 ? tempFinalRentalData.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)) :
                tempRental.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        }

    }

    if (tempFinalRentalData.length == 0) {
        $("#noDataMessage").show();
    } else {
        $("#noDataMessage").hide();
    }

    appendRentData(tempFinalRentalData);
}

// Function to parse price string to a number 
function parsePrice(price) { return parseFloat(price.replace(/[^0-9.-]+/g, "")); }