var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
})
editor.setSize('100%', '100%')

function updateEditor(code){
    editor.setValue(code);
}

var themeToggleImg = document.getElementById("themeToggle");
var codeContainer = document.querySelectorAll(".codeContainer");  
var logoMain = document.getElementById("logoMain");
var navBarop = document.querySelectorAll(".navBarop")
var body = document.getElementById("body");
var testScroller = document.querySelector(".testScroller")
themeToggleImg.addEventListener("click", function () {
    if (themeToggleImg.src.includes("moon.png")) {
        themeToggleImg.src = "public/img/sun.png"; // Change image to sun
        themeToggleImg.style.height = "50px"; // Change height to 50px
        themeToggleImg.style.marginTop = "-10px"; // Reset margin
        logoMain.src="public/img/logo-dark.png";
        navBarop.forEach(element => {
            element.style.color="white";
        });
       codeContainer.forEach(element => {    
        element.style.backgroundColor = "#3c3c3c"
        element.style.color = "white"
         });
         body.style.backgroundColor="black";
            body.style.color="white";
            testScroller.style.backgroundColor="black";
            testScroller.style.border="1px solid white";

    } else {
        themeToggleImg.src = "public/img/moon.png"; // Change image back to moon
        themeToggleImg.style.height = "40px"; // Reset height to 40px
        themeToggleImg.style.marginTop = "-10px"; // Reset margin
        logoMain.src="https://i.ibb.co/sqF20Jw/coderz.png";
        navBarop.forEach(element => {
            element.style.color="black";
        }
        );
        codeContainer.forEach(element => {
            element.style.backgroundColor = "#f2ecec"
            element.style.color = "black"
        }
        );
        body.style.backgroundColor="white";
        body.style.color="black";
        testScroller.style.backgroundColor="#F6F6F6";
        testScroller.style.border="1px solid white";
    }
});