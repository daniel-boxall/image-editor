const fileInput = document.querySelector(".file-input"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    previewImage = document.querySelector(".preview-image img"),
    chooseImgBtn = document.querySelector(".choose-image"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    saveImgBtn = document.querySelector(".save-image");


let brightness = 100, saturation = 100, inversion = 0, grayscale = 0; blur = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px)`;
}

const loadImage = () => {
    let file = fileInput.files[0] // getting user selected file
    if (!file) return; // return if user has not selected a file
    previewImage.src = URL.createObjectURL(file); // passing file url as preview image source
    previewImage.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterSlider.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterSlider.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterSlider.innerText = `${inversion}%`;
        } else if (option.id === "blur") {
            filterSlider.max = "10";
            filterSlider.value = blur;
            filterSlider.innerText = `${blur}px`;
        }
        else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterSlider.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter button

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if (selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    } else {
        blur = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listener to all rotate/flip buttons
        if (option.id === "left") { // if clicked left button, decrement rotation by 90 degrees
            rotate -= 90;
        } else if (option.id === "right") { // if clicked right button, increment rotation by 90 degrees
            rotate += 90;
        }  else if (option.id === "horizontal") { // if clicked horizontal button, invert horizontally
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else { // if clicked vertical button, invert vertically
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    })
})

const resetFilter = () => {
    // resetting all variable values to its default value
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d"); // return a drwaing context on the canvas
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;

    //applying filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical)
    ctx.drawImage(previewImage, -canvas.width /2, -canvas.height /2, canvas.width, canvas.height);

    const link = document.createElement("a"); // creating <a> element
    link.download = "image.jpg"; // passing <a> tag download value to image.jpg
    link.href = canvas.toDataURL(); // passing <a> tag href value to vanvas data url
    link.click(); // clicking <a> tag 
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());