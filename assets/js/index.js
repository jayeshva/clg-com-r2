var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
})
editor.setSize('100%', '100%')
var option = document.getElementById("inlineFormSelectPref")

option.addEventListener("change", function () {
    if (option.value == "Java") {
        editor.setOption("mode", "text/x-java")
    }
    else if (option.value == "Python") {
        editor.setOption("mode", "text/x-python")
    }
    else {
        editor.setOption("mode", "text/x-c++src")
    }
})

window.onload = function () {
    editor.setValue("#include <stdio.h>\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}");

}
function changeTheme(theme) {
    editor.setOption("theme", theme);
    console.log(theme);
}

var savedCode = {
    "C": "#include <stdio.h>\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}",
    "Cpp": "#include <iostream>\nusing namespace std;\nint main() {\n\tcout << \"Hello World\";\n\treturn 0;\n}",
    "Java": "class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World\");\n\t}\n}",
    "Python": "print(\"Hello World\")"
};

function programTemplate() {
    var lang = document.getElementById("inlineFormSelectPref").value;

    if (savedCode.hasOwnProperty(lang)) {
        editor.setValue(savedCode[lang]);
    } else {
        editor.setValue(""); // Clear the textarea if no saved code or default template available
    }
}

function autosave() {
    var lang = document.getElementById("inlineFormSelectPref").value;
    savedCode[lang] = editor.getValue();
    console.log("Saved code for " + lang);
}

editor.on("change", autosave);
document.getElementById("downloadButton").addEventListener("click", function () {
    const content = editor.getValue();
    var languageSelect = document.getElementById("inlineFormSelectPref");
    var selectedLanguage = languageSelect.options[languageSelect.selectedIndex].value;
    var fileExtension = "";

    switch (selectedLanguage) {
        case "C":
            fileExtension = "c";
            break;
        case "Cpp":
            fileExtension = "cpp";
            break;
        case "Java":
            fileExtension = "java";
            break;
        case "Python":
            fileExtension = "py";
            break;
    }

    const fileName = "my-program." + fileExtension;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
});

document.getElementById("fileInputButton").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result;
        editor.setValue(fileContent);
    };

    reader.readAsText(file);
});


document.getElementById("resetButton").addEventListener("click", function () {
    var languageSelect = document.getElementById("inlineFormSelectPref");
    var selectedLanguage = languageSelect.options[languageSelect.selectedIndex].value;

    switch (selectedLanguage) {
        case "C":
            editor.setValue("#include <stdio.h>\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}");
            break;
        case "Cpp":
            editor.setValue("#include <iostream>\nusing namespace std;\nint main() {\n\tcout << \"Hello World\";\n\treturn 0;\n}");
            break;
        case "Java":
            editor.setValue("class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World\");\n\t}\n}");
            break;
        case "Python":
            editor.setValue("print(\"Hello World\")");
            break;
    }
    // Clear the editor's content
});

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
        themeToggleImg.src = "./assets/img/sun.png"; // Change image to sun
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
        themeToggleImg.src = "./assets/img/moon.png"; // Change image back to moon
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



document.getElementById("runButton").addEventListener("click", function () {

    runCode();
    
});

async function runCode() {

    var load = document.getElementById("load")
        load.style.display = "block"
        code = {
            code: editor.getValue(),
            input: input.value,
            lang: option.value
        }
        console.log(code)
        function showLoadAnimation() {
            var load = document.getElementById("load")
            load.style.display = "block"
        }
        try{
            var oData = await fetch("http://localhost:5055/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    
                },
                body: JSON.stringify(code)

            })
            
            var d = await oData.json()
            output.value = d.output
        }
        catch(error){
            console.error(error)
            output.value = d.output
        }
        finally{
            load.style.display = "none"
        }

}