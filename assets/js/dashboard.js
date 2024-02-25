var themeToggleImg = document.getElementById("themeToggle");
var inlineFormtheme = document.getElementById("inlineFormtheme");
var inlineFormSelectPref = document.getElementById("inlineFormSelectPref");
var output = document.getElementById("output");
var outputContainer = document.getElementById("outputContainer");
var input = document.getElementById("input");
var inputContainer = document.getElementById("inputContainer");
themeToggleImg.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode"); // Toggle dark mode
    var textContainer = document.querySelector(".textContainer");
    if (themeToggleImg.src.includes("moon.png")) {
        themeToggleImg.src = "publics/img/sun.png"; // Change image to sun
        themeToggleImg.style.height = "50px"; // Change height to 50px
        themeToggleImg.style.marginTop = "-10px"; // Reset margin
        textContainer.style.backgroundColor = "rgb(42 48 51)";
        inlineFormtheme.style.backgroundColor = "rgb(42 48 51)"
        inlineFormtheme.style.color = "white"
        inlineFormSelectPref.style.backgroundColor = "rgb(42 48 51)"
        inlineFormSelectPref.style.color = "white"
        outputContainer.style.backgroundColor = "rgb(42 48 51)"
        outputContainer.style.color = "white"
        outputContainer.style.border= "1px solid rgba(0, 0, 0, 0.25)"
        output.style.backgroundColor = "rgb(30 39 43)"
        output.style.color = "white"
        inputContainer.style.backgroundColor = "rgb(42 48 51)"
        inputContainer.style.color = "white"
        inputContainer.style.border= "1px solid rgba(0, 0, 0, 0.25)"
        input.style.backgroundColor = "rgb(30 39 43)"
        input.style.color = "white"

    } else {
        themeToggleImg.src = "public/img/moon.png"; // Change image back to moon
        themeToggleImg.style.height = "40px"; // Reset height to 40px
        themeToggleImg.style.marginTop = "-10px"; // Reset margin
        textContainer.style.backgroundColor = "#F2ECEC"; // Reset text container background color
        inlineFormtheme.style.backgroundColor = "white"
        inlineFormtheme.style.color = "black"
        inlineFormSelectPref.style.backgroundColor = "white"
        inlineFormSelectPref.style.color = "black"
        outputContainer.style.backgroundColor = "#F2ECEC"
        outputContainer.style.color = "black"
        outputContainer.style.border= "1px solid rgba(242, 236, 236, 0.81)"
        output.style.backgroundColor = "white"
        output.style.color = "black"
        inputContainer.style.backgroundColor = "#F2ECEC"
        inputContainer.style.color = "black"
        inputContainer.style.border= "1px solid rgba(242, 236, 236, 0.81)"
        input.style.backgroundColor = "white"
        input.style.color = "black"

    }
});