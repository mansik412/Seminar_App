// Handle form submission on submit.html
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('question-form');
    const message = document.getElementById('submission-message');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const question = document.getElementById('question').value;

            if (question) {
                fetch('/submit-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Display success message
                        message.style.display = 'block';
                        message.innerText = 'Your question has been submitted!';
                        document.getElementById('question').value = '';
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }
});

// Fetch and display questions on display.html
function loadQuestions() {
    fetch('/get-questions')
        .then(response => response.json())
        .then(questions => {
            const questionsList = document.getElementById('questions-list');
            questionsList.innerHTML = '';  // Clear previous questions

            questions.forEach(question => {
                const listItem = document.createElement('li');
                listItem.textContent = question.question;
                questionsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

// If on the display page, load questions
if (document.getElementById('questions-list')) {
    loadQuestions();

    // Optionally, reload the questions every few seconds for live updates
    setInterval(loadQuestions, 3000);  // Reload every 5 seconds
}
