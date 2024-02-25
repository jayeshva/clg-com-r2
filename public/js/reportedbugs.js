var themeToggleImg = document.getElementById("themeToggle");
var body = document.querySelector("body");
var ProblemsData = document.querySelector(".ProblemsData");
var ProfileData = document.querySelector(".ProfileData");
var challenges = document.querySelectorAll(".challenges-Wrapper");
var logo = document.getElementById("logoMain");
var navBarop = document.querySelectorAll(".navBarop")
var solvedLink = document.getElementById("solvedLink");
themeToggleImg.addEventListener("click", function () {
    if (themeToggleImg.src.includes("moon.png")) {
        themeToggleImg.src = "public/img/sun.png"; // Change image to sun
        body.style.backgroundColor="black";
        themeToggleImg.style.height = "48px";
        body.style.color="white";
        challenges.forEach(element => {
            element.style.backgroundColor="#3c3c3c";
        });
        logo.src="public/img/logo-dark.png";
        navBarop.forEach(element => {
            element.style.color="white";
        });
        solvedLink.style.color="violet";
      
        
 
    } else {
        themeToggleImg.src = "public/img/moon.png"; // Change image back to moon
        body.style.backgroundColor="white";
        themeToggleImg.style.height = "42px";
        body.style.color="black";
        challenges.forEach(element => {
            element.style.backgroundColor="#F6F6F6";
        }
        );
        logo.src="https://i.ibb.co/sqF20Jw/coderz.png";
      
        navBarop.forEach(element => {
            element.style.color="black";
        }
        );
        solvedLink.style.color="blue";
 
    }
});

function getClassForCategory(category) {
    if (category === 'easy') {
        return 'easy-category';
    } else if (category === 'medium') {
        return 'medium-category';
    } else {
        return 'hard-category';
    }
}


var bugContainerId = document.getElementById("bugContainerId");
const bugButtoncancel = document.getElementById("bugButtoncancel");
const bugInput = document.getElementById("bugInput");

bugButtoncancel.addEventListener("click", () => {
    bugContainerId.style.display = "none";
});

function showBug(a,b){
    var bugContainerId = document.getElementById("bugContainerId");
    bugContainerId.style.display = "flex";
    bugInput.value = b;
}
