const createClothesContainer = document.getElementById('createClothesContainer');
// createClothesContainer.innerHTML = `
//     <div id='imgContainer'>
//         <div id='imgDisplay'>
//             <img src='../assets/uploadIMG.jpeg'/>
//         </div>
//     </div>
//     <div id='optionsContainer'>
//         <form id='optionsForm' method='POST' action='/wardrobe' enctype='multipart/form-data'>
//             <input type='file' id='imageInput' name='image' onchange='previewImage()'>
            
//         </form>
//     </div>
// `;
const optionsContainer = document.getElementById('optionsContainer');

// Select the form element
const form = document.getElementById('optionsForm');

// Create the first dropdown menu
var dropdown1 = document.createElement("select");
dropdown1.setAttribute("name", "type");
var options1 = ['Head Wear', 'Jacket', 'Top', 'Bottom', 'Shoes'];
for (var i = 0; i < options1.length; i++) {
    var option = document.createElement("option");
    option.value = options1[i];
    option.text = options1[i];
    dropdown1.appendChild(option);
}

// Create the second dropdown menu
var dropdown2 = document.createElement("select");
dropdown2.setAttribute("name", "subType");
dropdown2.setAttribute("disabled", true);
var options2 = {
    'Head Wear': ['Hat', 'Beanie', 'Scarf'],
    'Jacket': ['Hoodie', 'Bomber', 'Coat', 'Cardigan'],
    'Top': ['T-Shirt', 'Sweater', 'Dress', 'Onezee'],
    'Bottom': ['Pant', 'Short', 'Skirt', 'Sweats'],
    'Shoes': ['Sneakers', 'Wedges', 'Professional']
};

// Add event listener to first dropdown
dropdown1.addEventListener("change", function(){
    var selectedValue = this.value;
    // remove previous options
    while (dropdown2.firstChild) {
        dropdown2.removeChild(dropdown2.firstChild);
    }
    // Add new options based on selected value
    var suboptions = options2[selectedValue];
    for (var i = 0; i < suboptions.length; i++) {
        var option = document.createElement("option");
        option.value = suboptions[i];
        option.text = suboptions[i];
        dropdown2.appendChild(option);
    }
    dropdown2.removeAttribute("disabled");
});

var dropdown3 = document.createElement("select");
dropdown3.setAttribute("name", "color");
var options3 = ['Red', 'Orange','Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
for (var i = 0; i < options3.length; i++) {
    var option = document.createElement("option");
    option.value = options3[i];
    option.text = options3[i];
    dropdown3.appendChild(option);
}

// Create the create button
var createButton = document.createElement("button");
createButton.setAttribute("type", "submit");
createButton.innerHTML = "Create";

// Add the dropdown menus and button to the form
form.appendChild(dropdown1);
form.appendChild(dropdown2);
form.appendChild(dropdown3);
form.appendChild(createButton);

// Add the form to the optionsContainer div
optionsContainer.appendChild(form);

function previewImage() {
    var input = document.getElementById('imageInput');
    var imgDisplay = document.getElementById('imgDisplay');
  
    if (input.files && input.files[0]) {
        var reader = new FileReader();
  
        reader.onload = function (e) {
            imgDisplay.innerHTML = '<img src="' + e.target.result + '"/>';
        }
  
        reader.readAsDataURL(input.files[0]);
    }
}

const outfitSelector = document.getElementById('outfitSelector');

document.addEventListener("DOMContentLoaded", () => {
    const types = ['headWear', 'jacket', 'top', 'bottom', 'shoes'];
    for (let i=0; i < types.length; i++) {
        const type = types[i];
        // const type = 'shoes'
        fetch("http://localhost:3000/wardrobe/getImages", {
          method: 'POST',
          body: JSON.stringify({type: type}),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            // Check if the response was successful
            if (!response.ok) {
              throw new Error("HTTP error " + response.status);
            }
            // Parse the response as JSON
            return response.json(); //body = {imgage: '/img/path', imageNum: imdIdx}
          })
          .then(data => {
            // Do something with the response
            const typeContainer = document.getElementById(type);
            console.log(type)
            console.log(typeContainer)
            typeContainer.getElementsByClassName('typeLeft')[0].setAttribute('num', data.imageNum);
            typeContainer.getElementsByClassName('typeMid')[0].innerHTML = "<img src=" + data.imgPath + ">";
            typeContainer.getElementsByClassName('typeRight')[0].setAttribute('num', data.imageNum);
          })
          .catch(error => {
            console.error("Error:", error);
          });
    }
});

function nextImage(type) {
    console.log('nextImage')
    const typeContainer = document.getElementById(type);
    const typeRight = typeContainer.getElementsByClassName('typeRight')[0];
    const typeLeft = typeContainer.getElementsByClassName('typeLeft')[0];
    const typeMid = typeContainer.getElementsByClassName('typeMid')[0];
    const num = typeRight.getAttribute('num')
    fetch("http://localhost:3000/wardrobe/getNextImage", {
          method: 'POST',
          body: JSON.stringify({type: type, num: num}),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            console.log('receivedResponse')
            // Check if the response was successful
            if (!response.ok) {
              throw new Error("HTTP error " + response.status);
            }
            // Parse the response as JSON
            return response.json(); //body = {imgage: '/img/path', imageNum: imdIdx}
          })
          .then(data => {
            console.log("received data: ", data)
            // Do something with the response
            const typeContainer = document.getElementById(type);
            typeLeft.setAttribute('num', data.imageNum);
            typeMid.innerHTML = "<img src=" + data.imgPath + ">";
            typeRight.setAttribute('num', data.imageNum);
          })
          .catch(error => {
            console.error("Error:", error);
          });
}
function previousImage(type) {
    console.log('nextImage')
    const typeContainer = document.getElementById(type);
    const typeRight = typeContainer.getElementsByClassName('typeRight')[0];
    const typeLeft = typeContainer.getElementsByClassName('typeLeft')[0];
    const typeMid = typeContainer.getElementsByClassName('typeMid')[0];
    const num = typeRight.getAttribute('num')
    fetch("http://localhost:3000/wardrobe/getPrevImage", {
          method: 'POST',
          body: JSON.stringify({type: type, num: num}),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            console.log('receivedResponse')
            // Check if the response was successful
            if (!response.ok) {
              throw new Error("HTTP error " + response.status);
            }
            // Parse the response as JSON
            return response.json(); //body = {imgage: '/img/path', imageNum: imdIdx}
          })
          .then(data => {
            console.log("received data: ", data)
            // Do something with the response
            const typeContainer = document.getElementById(type);
            typeLeft.setAttribute('num', data.imageNum);
            typeMid.innerHTML = "<img src=" + data.imgPath + ">";
            typeRight.setAttribute('num', data.imageNum);
          })
          .catch(error => {
            console.error("Error:", error);
          });
}
async function logout() {
    const response = await fetch('/login/logout', { method: 'GET' });
    if (response.redirected) {
      window.location.href = response.url;
    }
  }