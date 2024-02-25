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
    else if (option.value == "python") {
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