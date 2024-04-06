var themeToggleImg = document.getElementById("themeToggle");
var inlineFormtheme = document.getElementById("inlineFormtheme");
var inlineFormSelectPref = document.getElementById("inlineFormSelectPref");
var output = document.getElementById("output");
var outputContainer = document.getElementById("outputContainer"); 
var input = document.getElementById("input");
var body = document.getElementById("body");
var inputContainer = document.getElementById("inputContainer");

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    smartIndent: true,
})


const socket = io();
editor.setSize('100%', '100%')
var option = document.getElementById("inlineFormSelectPref")

option.addEventListener("change", function () {
    if (option.value == "Java") {
        editor.setOption("mode", "text/x-java")
    }
    else if (option.value == "Python") {
        editor.setOption("mode", "text/x-python")
    }
    else if (option.value == "Golang") {
        editor.setOption("mode", "go")
    }
    else if (option.value == "Ruby") {
        editor.setOption("mode", "ruby")
    }
    else {
        editor.setOption("mode", "text/x-c++src")
    }
})

// window.onload = function () {
//     editor.setValue("#include <stdio.h>\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}");

// }

function changeTheme(theme) {
    editor.setOption("theme", theme);
    console.log(theme);
}

var savedCode = {
    "C": "#include <stdio.h>\nint main() {\n\tprintf(\"Hello World\");\n\treturn 0;\n}",
    "Cpp": "#include <iostream>\nusing namespace std;\nint main() {\n\tcout << \"Hello World\";\n\treturn 0;\n}",
    "Java": "class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World\");\n\t}\n}",
    "Python": "print(\"Hello World\")",
    "Golang": "package main\nimport \"fmt\"\nfunc main() {\n\tfmt.Println(\"Hello World\")\n}",
    "Ruby": "puts \"Hello World\"",
};

const selectElement = document.getElementById('inlineFormSelectPref');
socket.on('updateSelect', (selectedOptionValue) => {
    console.log('received select update:', selectedOptionValue);
    selectElement.value = selectedOptionValue; 
    if (selectedOptionValue == "Java") {
        editor.setOption("mode", "text/x-java")
    }
    else if (selectedOptionValue == "Python") {
        editor.setOption("mode", "text/x-python")
    }
    else if (selectedOptionValue == "Golang") {
        editor.setOption("mode", "go")
    }
    else if (selectedOptionValue == "Ruby") {
        editor.setOption("mode", "ruby")
    }
    else {
        editor.setOption("mode", "text/x-c++src")
    }
});

function programTemplate() {
    var lang = document.getElementById("inlineFormSelectPref").value;
    if (lang == "Java") {
        editor.setOption("mode", "text/x-java")
    }
    else if (lang == "Python") {
        editor.setOption("mode", "text/x-python")
    }
    else if (lang == "Golang") {
        editor.setOption("mode", "go")
    }
    else if (lang == "Ruby") {
        editor.setOption("mode", "ruby")
    }
    else {
        editor.setOption("mode", "text/x-c++src")
    }

    if (savedCode.hasOwnProperty(lang)) {
        editor.setValue(savedCode[lang]);
    } else {
        editor.setValue(""); // Clear the textarea if no saved code or default template available
    }
    var data = {
        lang: lang,
        problem_id: problemId,
        session_id: sessionId
    }
    console.log("Changed to " + data);
    socket.emit('changeSelect', data);
}

function autosave() {
    var lang = document.getElementById("inlineFormSelectPref").value;
    savedCode[lang] = editor.getValue();
    console.log("Saved code for " + lang);
}

editor.on("change", autosave);

var flag = 0;
var flag2 = 0;

var previousCode = editor.getValue();

// Store the previous cursor position
let cursorPos = editor.getCursor();

// Add a debounce function to prevent continuous emissions
function debounce(fn, delay) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}


const debouncedEmitCodeChange = debounce(() => {
    if (flag == 1 || start == 1) {
        flag = 0;
        start = 0;
        return;
    }
    const newCode = editor.getValue();
    const cursor = editor.getCursor(); // Get the current cursor position

    if (newCode != previousCode) {
        console.log('emitted code change:', newCode);
        var data = {
            code: newCode,
            problem_id: problemId,
            session_id: sessionId
        }
        socket.emit('codeChange', data);

        // Update the previous code and cursor position
        previousCode = newCode;
        cursorPos = cursor;
    }
}, 500);

editor.on("change", debouncedEmitCodeChange);

socket.on('codeChange', (newCode) => {
    // console.log('received code change:', newCode);
    // editor.setValue(newCode);
    flag = 1;
    // Get the current scroll position
    const scrollInfo = editor.getScrollInfo();


    // Replace the editor content without losing cursor position
    editor.replaceRange(newCode, { line: 0, ch: 0 }, { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length });

    // Restore the cursor and scroll position
    editor.setCursor(cursorPos);
    editor.scrollTo(scrollInfo.left, scrollInfo.top);
});


socket.on('userCountUpdate', (userCount) => {
    console.log('user count update:', userCount);
    document.getElementById('userCount').textContent = userCount;
});

const cursorPositions = {};

// ...

// Update the cursor position of other users
socket.on('cursorPosition', (data) => {
    var point = editor.getCursor();
if(data.cursor.line!=point.line && data.cursor.ch!=point.ch){

  const { userId, cursor } = data;
//   console.log(socket.id)
//     console.log("cursor ",data)

  if (userId !== socket.id) {
    console.log(socket.id)
    console.log("cursor position received !!",data)
   const cursorMarker = document.createElement("divcursor");
cursorMarker.className = "other-user-cursor";
cursorMarker.style.position = "absolute";
cursorMarker.style.width = "20px"; // Example width
cursorMarker.style.height = "3px"; // Example height
cursorMarker.style.backgroundColor = "red"; // Example background color
cursorMarker.style.left = "0"; // Example left position
// cursorMarker.style.zIndex = "1000"; 
    cursorMarker.className = "other-user-cursor";
    const cursorWidget = editor.addLineWidget(cursor.line, cursorMarker, {
      coverGutter: true,
        noHScroll: true,
    });


    // Remove the previous cursor marker for the user
    if (cursorPositions[userId]) {
      cursorPositions[userId].clear();
    }

    // Store the current cursor marker for the user
    cursorPositions[userId] = cursorWidget;
  }

}
});

// Listen for cursor movement and send updates to the server
editor.on("cursorActivity", () => {
if(flag2==0){

    console.log("cursor activity frontend !!")
  const cursor = editor.getCursor();
  socket.emit('updateCursorPosition', { cursor });
    }
});

socket.on('disconnected', () => {
    // Remove the cursor marker for the disconnected user
    const userId = socket.id;
    if (cursorPositions[userId]) {
      cursorPositions[userId].clear();
      delete cursorPositions[userId];
    }
  });


let passedCount = 0;
var run = document.getElementById("run")
const checkbox = document.getElementById('customInputBox');
const custominput = document.getElementById('custominput');
run.addEventListener("click", async function () {
    if (checkbox.checked) {
        var load = document.getElementById("load")
        load.style.display = "block"
        var final = custominput.value
        if (final.trim() == "") {
            final = " "
        }
        customCode = {
            code: editor.getValue(),
            input: final,
            lang: option.value
        }
        // console.log(code)
        var code;
        code = {
            code: editor.getValue(),
            lang: option.value,
            // email: userId,
            problemId: problemId

        }
        function showLoadAnimation() {
            var load = document.getElementById("load")
            load.style.display = "block"
        }
        //write a code to show loading animation during fetching
        try {
            const currentURL = window.location.href;

            // Split the URL by slashes ("/") to get an array of parts
            const parts = currentURL.split('/');

            // The last part of the array will be the `questionid`
            const questionid = parts[parts.length - 2];


            // console.log('Question hgjhgfhjID:', questionid);
            var ts = await fetch(`/findTestcases/${questionid}`);
            var result = await ts.json();
            console.log(result.test_cases.length);

            for (let i = 0; i < result.test_cases.length; i++) {
                code.input = result.test_cases[i].input;
                var oData = await fetch("http://code.jayworks.tech/compile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(code)


                });
                var d = await oData.json();
                console.log("Input:", result.test_cases[i].input)
                console.log("Expected Output:", result.test_cases[i].output);
                console.log("Actual Output:", d.output);
                const expectedOutputInt = result.test_cases[i].output;
                const actualOutputInt = d.output;
                const t_id = result.test_cases[i]._id
                const testId = document.getElementById("img_" + t_id);
                try {
                    if (actualOutputInt.toString().trim() === expectedOutputInt.toString().trim()) {

                        testId.src = "/public/img/passed.png";
                        testId.style.visibility = "visible";
                        passedCount++;
                        console.log("Test case", i + 1, "passed");
                    } else {

                        testId.src = "/public/img/wrong.png";
                        testId.style.visibility = "visible";
                        console.log("Test case", i + 1, "failed");

                    }
                    // console.log(d.output)
                }
                catch (err) {
                    console.log("hidden test case")
                }
            }
            console.log("Passed Count:", passedCount);
            // code.input = final;
            var oData = await fetch("http://code.jayworks.tech/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customCode)

            })
            // const res=document.getElementById("allResult");
            var d = await oData.json()
            var customoutput = document.getElementById("customoutput")
            customoutput.value = d.output
            // res.textContent=passedCount+"/"+result.test_cases.length+" Test Cases Passed";
            // res = passedCount+"/"+result[0].testCases.length+" Test Cases Passed";
            passedCount = 0;
        }
        catch (error) {
            console.log(error)
            // output.value = d.output
        }
        finally {
            load.style.display = "none"
        }


        // var d = await oData.json()
        // output.value = d.output
    }
    else {
        var load = document.getElementById("load")
        load.style.display = "block"
        // var final = input.value
        // if(final.trim() == ""){
        //     final = " "
        // }
        // code = {
        //     code: editor.getValue(),
        //     input: input.value,
        //     lang: option.value
        // }
        // console.log(code)
        var code;
        code = {
            code: editor.getValue(),
            lang: option.value,
            // email: userId,
            problemId: problemId

        }
        function showLoadAnimation() {
            var load = document.getElementById("load")
            load.style.display = "block"
        }
        //write a code to show loading animation during fetching
        try {
            const currentURL = window.location.href;

            // Split the URL by slashes ("/") to get an array of parts
            const parts = currentURL.split('/');

            // The last part of the array will be the `questionid`
            const questionid = parts[parts.length - 2];


            console.log('Question ID:', questionid);
            var ts = await fetch(`/findTestcases/${questionid}`);
            var result = await ts.json();
            console.log(result.test_cases.length);

            for (let i = 0; i < result.test_cases.length; i++) {
                code.input = result.test_cases[i].input;
                var oData = await fetch("http://code.jayworks.tech/compile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(code)


                });
                var d = await oData.json();
                console.log("Input:", result.test_cases[i].input)
                console.log("Expected Output:", result.test_cases[i].output);
                console.log("Actual Output:", d.output);
                const expectedOutputInt = result.test_cases[i].output;
                const actualOutputInt = d.output;
                const t_id = result.test_cases[i]._id
                const testId = document.getElementById("img_" + t_id);
                try {
                    if (actualOutputInt.toString().trim() === expectedOutputInt.toString().trim()) {

                        testId.src = "/public/img/passed.png";
                        testId.style.visibility = "visible";
                        passedCount++;
                        console.log("Test case", i + 1, "passed");
                    } else {

                        testId.src = "/public/img/wrong.png";
                        testId.style.visibility = "visible";
                        console.log("Test case", i + 1, "failed");

                    }
                    // console.log(d.output)
                }
                catch (err) {
                    console.log("hidden test case")
                }
            }
            console.log("Passed Count:", passedCount);
            // code.input = final;
            // var oData = await fetch("http://localhost:5055/compile", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(code)

            // })
            // const res=document.getElementById("allResult");
            // var d = await oData.json()
            // output.value = d.output
            // res.textContent=passedCount+"/"+result.test_cases.length+" Test Cases Passed";
            // res = passedCount+"/"+result[0].testCases.length+" Test Cases Passed";
            passedCount = 0;
        }
        catch (error) {
            console.log(error)
            // output.value = d.output
        }
        finally {
            load.style.display = "none"
        }


        // var d = await oData.json()
        // output.value = d.output
    }

})

submit.addEventListener("click", async function () {
    var load = document.getElementById("load")
    load.style.display = "block"
    // var final = input.value
    code = {
        code: editor.getValue(),
        // input: customInput.value, 
        lang: option.value,
        // email: userId,
        problemId: problemId,
        // problemName: problemName
    }
    console.log(code)
    try {
        var finalData = await fetch(`http://code.jayworks.tech/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(code)
        });
        var d = await finalData.json()
        console.log(d)
        if (d.passedTestCases == d.totalTestCases) {
            var subA = document.getElementById("subA");
            var subB = document.getElementById("subB");
            subA.href = "/dashboard";
            subB.textContent = "Goto Dashboard";
            var res = document.getElementById("res");
            var resHead = document.getElementById("resHead");
            resHead.textContent = "Congratulations !";
            var resDesc = document.getElementById("resDesc");
            var submitLogo = document.getElementById("submitLogo");
            var submitId = document.getElementById('SubmitId');
            submitId.style.display = "flex"
            resDesc.textContent = "Your Solution is Accepted";
            res.textContent = d.passedTestCases + "/" + d.totalTestCases + " Test Cases Passed";
            submitLogo.src = "/public/img/submit.png";
        }
        else {
            var subA = document.getElementById("subA");
            var subB = document.getElementById("subB");
            subA.href = window.location.href;
            subB.textContent = "Try Again";
            var res = document.getElementById("res");
            var resDesc = document.getElementById("resDesc");
            var submitLogo = document.getElementById("submitLogo");
            var submitId = document.getElementById('SubmitId');
            submitId.style.display = "flex"
            var resHead = document.getElementById("resHead");
            resHead.textContent = "Try Again !";
            resDesc.textContent = "Your Solution is Rejected";
            res.textContent = d.passedTestCases + "/" + d.totalTestCases + " Test Cases Passed";
            submitLogo.src = "/public/img/wrong.png";
        }
        // res.textContent=passedCount+"/"+result.test_cases.length+" Test Cases Passed";
        // res = passedCount+"/"+result[0].testCases.length+" Test Cases Passed";
        // passedCount = 0;
    }
    catch (err) {
        console.log("Error in ejs " + err)
    }
    finally {
        load.style.display = "none"
    }


});


var customioContainer = document.querySelector('.customioContainer');

checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        customioContainer.style.display = 'block';
    } else {
        customioContainer.style.display = 'none';
    }
});   
 

// const debouncedEmitCodeChange = debounce(() => {
//     const newCode = editor.getValue();
//     const cursor = editor.getCursor(); // Get the current cursor position

//     if (newCode !== previousCode) {
//         console.log('emitted code change:', newCode);
//         var data = {
//             code: newCode,
//             problem_id: problemId,
//             session_id: sessionId
//         }
//         socket.emit('codeChange', data);

//         // Update the previous code and cursor position
//         previousCode = newCode;
//         cursorPos = cursor;
//     }
// }); // Adjust the delay (in milliseconds) as needed

var editorContainer = document.querySelector(".editorContainer");
var navBar_a = document.getElementById("navBar-a");
var logo = document.getElementById("logoMain");
var questionDisplay = document.querySelector(".questionDisplay");
var dcolor = document.querySelectorAll(".dcolor");
var solveDisplay = document.querySelector(".solveDisplay");
var customoutputContainer = document.querySelector(".customoutputContainer");
var custominputContainer = document.querySelector(".custominputContainer");
var textAreacolor = document.querySelectorAll(".textAreacolor");
var SubmitContainer = document.querySelector(".SubmitContainer");

themeToggleImg.addEventListener("click", function () {
   var img =  document.querySelector("themeToggle");
    if (themeToggleImg.src.includes("public/img/moon.png")) {
        themeToggleImg.src = "/public/img/sun.png"; // Change image to sun
        themeToggleImg.style.height = "48px"; // Change height to 50px
        inlineFormtheme.style.backgroundColor = "rgb(42 48 51)"
        inlineFormtheme.style.color = "white"
        inlineFormSelectPref.style.backgroundColor = "rgb(42 48 51)"
        inlineFormSelectPref.style.color = "white"
        body.style.backgroundColor="#1d1d1d";
        body.style.color="white";
        navBar_a.style.color="white";
        logo.src="/public/img/logo-dark.png";
        questionDisplay.style.backgroundColor="#1d1d1d";
        questionDisplay.style.color="white";
        dcolor.forEach(element => {
            element.style.color="white"; 
        });
        solveDisplay.style.backgroundColor="#1d1d1d";
        customoutputContainer.style.backgroundColor="#1d1d1d";
        customoutputContainer.style.color="white";
        custominputContainer.style.backgroundColor="#1d1d1d";
        custominputContainer.style.color="white";
        textAreacolor.forEach(element => {
            element.style.backgroundColor="#3c3c3c";
            element.style.color="white";
        });
        SubmitContainer.style.backgroundColor="#1d1d1d";
        SubmitContainer.style.color="white";

    } else {
        themeToggleImg.src = "/public/img/moon.png"; // Change image back to moon
        themeToggleImg.style.height = "42px";
        inlineFormtheme.style.backgroundColor = "white"
        inlineFormtheme.style.color = "black"
        inlineFormSelectPref.style.backgroundColor = "white"
        inlineFormSelectPref.style.color = "black"
        body.style.backgroundColor="white";
        body.style.color="black";
        navBar_a.style.color="black";
        logo.src="https://i.ibb.co/sqF20Jw/coderz.png";
        questionDisplay.style.backgroundColor="#F6F6F6";
        questionDisplay.style.color="black";
        dcolor.forEach(element => {
            element.style.color="black";
        });
        solveDisplay.style.backgroundColor="#F6F6F6";
        customoutputContainer.style.backgroundColor="#F6F6F6";
        customoutputContainer.style.color="black";
        custominputContainer.style.backgroundColor="#F6F6F6";
        custominputContainer.style.color="black";
        textAreacolor.forEach(element => {
            element.style.backgroundColor="white";
            element.style.color="black";
        });
        SubmitContainer.style.backgroundColor="#F6F6F6";
        SubmitContainer.style.color="black";
        


        
    }
});
