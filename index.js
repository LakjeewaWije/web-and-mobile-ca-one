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
        <p class="property-price">Price: ${rentItem.price}</p>
        <p class="property-location">Location: ${rentItem.location} City</p>
        <p class="property-location">Category: ${rentItem.category} City</p>
        <a class="view-details" href="details.html?id=${rentItem.id}">View Details</a>
      </div>
    </div>`;
        gridContainer.append(gridItem)
    });

    gridContainer.append()
}

$("#searchKey").on("keyup", function () {
    var val = $.trim(this.value);
    console.log("val ", val);

    if (!val) return appendRentData(rentData);
    // Configure Fuse.js options 
    options = {
        keys: ['name', 'location', 'category'], // Fields to search 
        threshold: 0.3 // Adjust this value for stricter or looser matches 
    };

    // Create a new instance of Fuse 
    const fuse = new Fuse(rentData, options);

    const sortedRentals = fuse.search(val);

    console.log("sortedRentals ", sortedRentals);

    let tempRental = [];

    sortedRentals.forEach((data) => {
        tempRental.push(data.item);
    })


    appendRentData(tempRental);
});