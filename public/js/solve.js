
var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    indentUnit: 4,
    smartIndent: true,
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
    "Python": "print(\"Hello World\")",
    "Golang": "package main\nimport \"fmt\"\nfunc main() {\n\tfmt.Println(\"Hello World\")\n}",
    "Ruby": "puts \"Hello World\"",
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
            email: userId,
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
            const questionid = parts[parts.length - 1];


            console.log('Question ID:', questionid);
            var ts = await fetch(`/findTestcases/${questionid}`);
            var result = await ts.json();
            console.log(result.test_cases.length);

            for (let i = 0; i < result.test_cases.length; i++) {
                code.input = result.test_cases[i].input;
                var oData = await fetch("https://compiler.jayworks.tech/compile", {
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
            var oData = await fetch("https://compiler.jayworks.tech/compile", {
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
            email: userId,
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
            const questionid = parts[parts.length - 1];


            console.log('Question ID:', questionid);
            var ts = await fetch(`/findTestcases/${questionid}`);
            var result = await ts.json();
            console.log(result.test_cases.length);

            for (let i = 0; i < result.test_cases.length; i++) {
                code.input = result.test_cases[i].input;
                var oData = await fetch("https://compiler.jayworks.tech/compile", {
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
        email: userId,
        problemId: problemId,
        problemName: problemName
    }
    console.log(code)
    try {
        var finalData = await fetch(`https://compiler.jayworks.tech/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(code)
        });
        var d = await finalData.json()
        console.log(d)

        if (d.passedTestCases == d.totalTestCases && d.passedTestCases != 'undefined') {
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


const customioContainer = document.querySelector('.customioContainer');

checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        customioContainer.style.display = 'block';
    } else {
        customioContainer.style.display = 'none';
    }
});

var themeToggleImg = document.getElementById("themeToggle");
var inlineFormtheme = document.getElementById("inlineFormtheme");
var inlineFormSelectPref = document.getElementById("inlineFormSelectPref");
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
var body = document.getElementById("body");

themeToggleImg.addEventListener("click", function () {
    if (themeToggleImg.src.includes("public/img/moon.png")) {
        themeToggleImg.src = "/public/img/sun.png"; // Change image to sun
        themeToggleImg.style.height = "48px"; // Change height to 50px
        inlineFormtheme.style.backgroundColor = "rgb(42 48 51)"
        inlineFormtheme.style.color = "white"
        inlineFormSelectPref.style.backgroundColor = "rgb(42 48 51)"
        inlineFormSelectPref.style.color = "white"
        body.style.backgroundColor = "#1d1d1d";
        body.style.color = "white";
        navBar_a.style.color = "white";
        logo.src = "/public/img/logo-dark.png";
        questionDisplay.style.backgroundColor = "#1d1d1d";
        questionDisplay.style.color = "white";
        dcolor.forEach(element => {
            element.style.color = "white";
        });
        solveDisplay.style.backgroundColor = "#1d1d1d";
        customoutputContainer.style.backgroundColor = "#1d1d1d";
        customoutputContainer.style.color = "white";
        custominputContainer.style.backgroundColor = "#1d1d1d";
        custominputContainer.style.color = "white";
        textAreacolor.forEach(element => {
            element.style.backgroundColor = "#3c3c3c";
            element.style.color = "white";
        });
        SubmitContainer.style.backgroundColor = "#1d1d1d";
        SubmitContainer.style.color = "white";

    } else {
        themeToggleImg.src = "/public/img/moon.png"; // Change image back to moon
        themeToggleImg.style.height = "42px";
        inlineFormtheme.style.backgroundColor = "white"
        inlineFormtheme.style.color = "black"
        inlineFormSelectPref.style.backgroundColor = "white"
        inlineFormSelectPref.style.color = "black"
        body.style.backgroundColor = "white";
        body.style.color = "black";
        navBar_a.style.color = "black";
        logo.src = "https://i.ibb.co/sqF20Jw/coderz.png";
        questionDisplay.style.backgroundColor = "#F6F6F6";
        questionDisplay.style.color = "black";
        dcolor.forEach(element => {
            element.style.color = "black";
        });
        solveDisplay.style.backgroundColor = "#F6F6F6";
        customoutputContainer.style.backgroundColor = "#F6F6F6";
        customoutputContainer.style.color = "black";
        custominputContainer.style.backgroundColor = "#F6F6F6";
        custominputContainer.style.color = "black";
        textAreacolor.forEach(element => {
            element.style.backgroundColor = "white";
            element.style.color = "black";
        });
        SubmitContainer.style.backgroundColor = "#F6F6F6";
        SubmitContainer.style.color = "black";




    }
});

const bugContainerId = document.getElementById("bugContainerId");
const bugButtoncancel = document.getElementById("bugButtoncancel");
const bugButtonsubmit = document.getElementById("bugButtonsubmit");
const bugInput = document.getElementById("bugInput");
const bookmark = document.getElementById("bookmark");
const divbookmark = document.getElementById("divbookmark");
const bugs = document.getElementById("bugs");
const divbugs = document.getElementById("divbug");

bugButtoncancel.addEventListener("click", function () {
    bugContainerId.style.display = "none";
});

bugButtonsubmit.addEventListener("click", async function () {
    var bug;
    bug = {
        problem_id: problemId,
        user_id: userId,
        bugs: bugInput.value
    }
    try {
        if (bugs.src.includes("/public/img/bugyellow.png")) {
        var finalData = await fetch(`https://code.jayworks.tech/bugs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bug)
        });
        var d = await finalData.json()
        console.log(d)
        if (d.message == "Bug Reported successfully") {
            bugContainerId.style.display = "none";
            bugs.src = "/public/img/bug.png"
        }
    }
    }
    catch (err) {
        console.log("Error in ejs " + err)
    }
});



divbookmark.addEventListener("click", async function () {
    var book;
    book = {
        problem_id: problemId,
        user_id: userId
    }
    try {

        if (bookmark.src.includes("/public/img/bookgreen.png")) {
            var finalData = await fetch(`https://code.jayworks.tech/bookmark`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(book)
            });

            var d = await finalData.json()
            console.log(d)
            if (d.message == "Bookmark saved successfully") {
                // console.log("/public/img/bookyellow.png")
                bookmark.src = "/public/img/bookyellow.png"
            }

        }

        else if (bookmark.src.includes("/public/img/bookyellow.png")) {
            var finalData = await fetch(`https://code.jayworks.tech/bookmark`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(book)
            });
            var d = await finalData.json()
            console.log(d)
            if (d.message == "Bookmark deleted successfully") {
                // console.log("/public/img/bookgreen.png")
                bookmark.src = "/public/img/bookgreen.png"
            }
        }
    }
    catch (err) {
        console.log("Error in ejs " + err)
    }
})

divbugs.addEventListener("click", async function () {
    if (bugs.src.includes("/public/img/bug.png")) {
        bugContainerId.style.display = "none";
    }
    else{
    bugContainerId.style.display = "flex";
    }
    // var bug;
    // bug = {
    //     problem_id: problemId,
    //     user_id: userId
    // }
    // try {

    //     if (bugs.src.includes("/public/img/bugyellow.png")) {
    //         var finalData = await fetch(`http://localhost:3000/bugs`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(bug)
    //         });

    //         var d = await finalData.json()
    //         console.log(d)
    //         if (d.message == "Bug Reported successfully") {
    //             // console.log("/public/img/bookyellow.png")
    //             bugs.src = "/public/img/bug.png"
    //         }

    //     }

    // }
    // catch (err) {
    //     console.log("Error in ejs " + err)
    // }
});

