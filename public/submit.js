document.addEventListener('DOMContentLoaded', function () {

    //console.log("submit.js is running");
    
    const submitForm = document.getElementById('submit-form');
    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent the form from refreshing the page

        const question = document.getElementById('question').value;

        fetch('/submit-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: question })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Question submitted successfully!');
                document.getElementById('question').value = '';  // Clear the input field
            } else {
                alert('Error submitting question: ' + data.error);
            }
        })
        .catch(error => console.error('Error submitting question:', error));
    });
});
