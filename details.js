console.log("details laoded");
// const Fuse = require('fuse.js');
var rentDetails = {};
var propertyId = 0;
async function init() {
    // load initial data
    const resData = await loadRentalData();
    var params = new window.URLSearchParams(window.location.search);
    propertyId = params.get('id');
    console.log(" propertyId ", propertyId, "dssds", propertyId - 1)
    rentDetails = resData[propertyId - 1];
    appendRentDetails(rentDetails);
    appendRentImages(rentDetails.featuredImage, rentDetails.otherMedia)
    console.log("rentDetails ", rentDetails);

    // Get references to the dialog and buttons

    const dialog = $('#myDialog');
    const openBtn = $('#openDialogBtn');
    const closeBtn = $('#closeDialogBtn');

    // Open the dialog when the button is clicked
    openBtn[0].addEventListener('click', () => {
        // dialog.showModal(); // Use showModal() for a modal dialog
        dialog[0].showModal();
    });

    // Close the dialog when the close button is clicked
    closeBtn[0].addEventListener('click', () => {
        dialog[0].close();
    });
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

function seeMoreDescription() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
    }
}

function appendRentDetails(data) {
    let detailsContainer = $('.details-content');
    console.log("Data ", data);
    detailsContainer.empty();

    // Get the first 200 characters 
    let firstPart = data.description.substring(0, 200);
    // Get the rest of the text 
    let remainingPart = data.description.substring(200);

    const detailsHTML = `<h2>${data.name}</h2>
                  <p><strong>Location:</strong>${data.location}</p>
                  <p><strong>Price:</strong> ${data.price}   <strong>Category:</strong> ${data.category}</p>
                <p><strong>Type:</strong> ${data.type}</p>
                <p><strong>Baths:</strong> ${data.bathrooms}   <strong>Beds:</strong> ${data.bedrooms}</p>
                <p><strong>Ber Rating:</strong> ${data.berRating}</p>
                <p>${firstPart}<span id="dots">...</span><span id="more">${remainingPart}</span></p>
                <p><button onclick="seeMoreDescription()" id="myBtn">Read more</button></p>
                <button id="openDialogBtn" class="details-btn">Book A Viewing</button>`

    detailsContainer.append(detailsHTML)
}

function setMainImage(img) {
    let mainImage = $('.main-media');
    mainImage.attr("src", img);
}

function appendRentImages(mainMedia, otherImages) {
    let mainImage = $('.main-media');
    let otherImagesContainer = $('.media-thumbnails');
    otherImagesContainer.empty();
    mainImage.attr("src", mainMedia);
    otherImagesContainer.append(`<img src="${mainMedia}" onclick="setMainImage(this.src)"
                    alt="Media 1" class="thumbnail" />`)
    otherImages.forEach(element => {
        console.log("element ", element)
        let html = `<img src="${element.src}" onclick="setMainImage(this.src)"
                    alt="Media 1" class="thumbnail" />`
        otherImagesContainer.append(html)
    });
    // mainImage.empty();
}