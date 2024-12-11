// Load all questions when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadAllQuestions();
});

// Polling function to fetch new questions periodically
function startPollingForQuestions() {
    setInterval(loadAllQuestions, 5000);  // Poll every 5 seconds (5000 ms)
}

// Load all questions from the backend
function loadAllQuestions() {
    fetch('/all-questions')
        .then(response => response.json())
        .then(questions => {
            const questionsList = document.getElementById('questions-list');
            questionsList.innerHTML = '';  // Clear the current list

            questions.forEach(question => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="question-controls">
                        <label class="switch small">
                            <input type="checkbox" ${question.approved ? 'checked' : ''} onclick="toggleApproval(${question.id}, ${question.approved})">
                            <span class="slider"></span>
                        </label>
                        <p>${question.approved ? 'Approved' : 'Not Approved'}</p>

                        <label class="switch small">
                            <input type="checkbox" ${question.answered ? 'checked' : ''} onclick="toggleAnswered(${question.id}, ${question.answered})">
                            <span class="slider"></span>
                        </label>
                        <p>${question.answered ? 'Marked as Answered' : 'Not Answered'}</p>
                    </div>

                    <p>${question.question}</p>
                `;
                questionsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Toggle approval status (approve/reject)
function toggleApproval(id, currentStatus) {
    const newStatus = !currentStatus;

    fetch('/manage-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, approve: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAllQuestions();  // Reload the questions after approval change
        } else {
            alert('Error managing question: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}


// Toggle answered/unanswered status (using the toggle button)
function toggleAnswered(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1; // Toggle between answered (1) and unanswered (0)

    fetch(newStatus === 1 ? '/mark-as-answered' : '/mark-as-unanswered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadAllQuestions();  // Reload the list after updating
        } else {
            alert('Error updating question: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Delete all questions from the database
function deleteAllQuestions() {
    if (confirm("Are you sure you want to delete all questions? This action cannot be undone.")) {
        fetch('/delete-all-questions', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadAllQuestions();  // Reload the list after deletion
                alert('All questions have been deleted.');
            } else {
                alert('Error deleting questions: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
