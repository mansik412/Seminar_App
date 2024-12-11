document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.querySelector('.questions-container'); // The scrollable container

    // Function to scroll down slowly and automatically
    function autoScroll() {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        let currentScroll = scrollContainer.scrollTop;

        if (currentScroll < maxScroll) {
            scrollContainer.scrollTop += 1; // Scroll down by 1px
        } else {
            scrollContainer.scrollTop = 0; // Reset to the top when scrolled to the bottom
        }
    }

    // Set an interval to scroll down every 20 milliseconds
    setInterval(autoScroll, 20);
});


document.addEventListener('DOMContentLoaded', function () {
    const questionsList = document.getElementById('questions-list');

    // Example data (you'll likely be fetching this from an API)
    const questions = [
        { question: "What is your name?", status: "approved" },
        { question: "What is your age?", status: "pending" },
        { question: "Where are you from?", status: "rejected" },
        { question: "What do you do?", status: "approved" },
        // Add more questions as needed
    ];

    // Populate the questions dynamically
    questions.forEach(q => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${q.question}</td>
            <td>${q.status}</td>
        `;
        questionsList.appendChild(row);
    });

    // Scroll automatically
    const scrollContainer = document.querySelector('.questions-container'); 

    function autoScroll() {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        let currentScroll = scrollContainer.scrollTop;

        if (currentScroll < maxScroll) {
            scrollContainer.scrollTop += 1;
        } else {
            scrollContainer.scrollTop = 0;
        }
    }

    setInterval(autoScroll, 20);
});
