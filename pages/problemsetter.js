document.addEventListener('DOMContentLoaded', function() {
    const deleteProblemSelector = document.getElementById('deleted-problem');
    const deleteProblemButton = document.getElementById('delete-problem');
    const selectedProblem = document.getElementById('selected-problem');
    const addTestCaseButton = document.getElementById('add-test-case');
    const problemForm = document.getElementById('problem-form');
    const additional_test_case_form = document.getElementById('additional-test-case-form');

    if (problemForm) {
        problemForm.addEventListener('submit', function(event) {

            const problemId = document.getElementById('problem-id').value;
            const problemCategory = document.getElementById('problem-category').value;
            const problemTitle = document.getElementById('problem-title').value;
            const problemDescription = document.getElementById('problem-description').value;
            const testCaseInput = document.getElementById('test-case-input').value;
            const testCaseOutput = document.getElementById('test-case-output').value;

            const problemData = {
                problem_id: problemId,
                problem_category: problemCategory,
                problem_title: problemTitle,
                problem_description: problemDescription,
                test_cases: [
                    { input: testCaseInput, output: testCaseOutput }
                ]
            };

            // Send the problem data to the server
            fetch('/addProblem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(problemData)
            })
            .then(response => {
                if (response.ok) {
                    // The problem was successfully added, handle it accordingly
                    console.log('Problem added successfully');
                    populateProblemList(); // Refresh the problem list
                } else {
                    // Handle errors, such as failed validation or other issues
                    console.error('Problem could not be added');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, such as network errors
            });
        });

        additional_test_case_form.addEventListener('submit', function() {
            const selectedProblemId = selectedProblem.value;
            const additionalTestCaseInput = document.getElementById('additional-test-case-input').value;
            const additionalTestCaseOutput = document.getElementById('additional-test-case-output').value;
            const testcaseVisible = document.getElementById('test-case-visible').checked;
            console.log('Additional test case button clicked', selectedProblemId, additionalTestCaseInput, additionalTestCaseOutput, testcaseVisible);

            const additionalTestCase = {
                input: additionalTestCaseInput,
                output: additionalTestCaseOutput,
                hidden: testcaseVisible // You can adjust this value as needed
            };

            // Send the additional test case data to the server
            fetch('/addTestCase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ problem_id: selectedProblemId, testCase: additionalTestCase })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Additional test case added successfully');
                    // You can display a success message or perform other actions here
                } else {
                    console.error('Failed to add additional test case');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

       
    }
    
    function populateProblemList() {
        // Fetch the list of problems from the server and populate the select element
        fetch('/getproblems')
            .then(response => response.json())
            .then(problems => {
                // selectedProblem.innerHTML = ''; // Clear existing options

                problems.forEach(problem => {
                    const option = document.createElement('option');
                    option.value = problem.problem_id;
                    option.textContent = problem.problem_title + ' ( id-' + problem.problem_id + ')';
                    selectedProblem.appendChild(option);
                    deleteProblemSelector.appendChild(option.cloneNode(true));
                });
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
            });
    }

    

    // Initially populate the problem list when the page loads
    populateProblemList();
});

const deleteProblemSelector = document.getElementById('deleted-problem');
function delete_Problem() {
    console.log('Delete problem button clicked');
    const selectedProblemId = deleteProblemSelector.value;

    // Send the problem ID to the server
    fetch('/deleteProblem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ problem_id: selectedProblemId })
    })
    .then(response => {
        if (response.ok) {
            console.log('Problem deleted successfully');
           window.location.reload();
            // You can display a success message or perform other actions here
            populateProblemList(); // Refresh the problem list
        } else {
            console.error('Failed to delete problem');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
