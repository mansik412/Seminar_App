document.addEventListener('DOMContentLoaded', function () {
    loadDisplayQuestions();  // Load questions when the page is loaded
    startPollingForApprovedQuestions();  // Start polling for approved questions
});

// Polling function to fetch approved questions periodically
function startPollingForApprovedQuestions() {
    setInterval(loadDisplayQuestions, 5000);  // Poll every 5 seconds (5000 ms)
}

// Load approved questions from the backend
function loadDisplayQuestions() {
    fetch('/all-questions')  // Fetch all questions from the backend
        .then(response => response.json())
        .then(questions => {
            const questionsList = document.getElementById('display-questions-list');
            questionsList.innerHTML = '';  // Clear the current list

            // Only display questions that are approved
            questions.forEach(question => {
                if (question.approved) {  // Only show approved questions
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <p>${question.question}</p>
                    `;
                    questionsList.appendChild(listItem);  // Add the approved question to the display
                }
            });
        })
        .catch(error => console.error('Error fetching questions:', error));
}
