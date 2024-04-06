var themeToggleImg = document.getElementById("themeToggle");
var body = document.querySelector("body");
var ProblemsData = document.getElementById("pd");
var ProfileData = document.getElementById("dp");
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
        ProblemsData.style.backgroundColor="#3c3c3c";
        ProfileData.style.backgroundColor="#3c3c3c";
        ProfileData.style.color="white";
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
        ProblemsData.style.backgroundColor="#F6F6F6";
        ProfileData.style.backgroundColor="#F6F6F6";
        ProfileData.style.color="black";
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
