document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in with token
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // If authentication data is missing, redirect to login page
        alert('Please log in to take the quiz');
        window.location.href = 'login.html';
        return;
    }

    let userAnswers = Array(10).fill(undefined); // Initialize with 10 undefined answers
    let score = 0;

    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const resultContainer = document.getElementById('result-container');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const tryAgainButton = document.getElementById('try-again');
    const goHomeButton = document.getElementById('go-home');
    const currentScoreElement = document.getElementById('current-score');

    // Quiz questions
    const questions = [
        {
            question: "How does the Knight move in chess?",
            options: [
                "In a straight line",
                "Diagonally",
                "In an L-shape",
                "One square in any direction"
            ],
            correctAnswer: 2
        },
        {
            question: "Which piece can only move diagonally?",
            options: [
                "Rook",
                "Bishop",
                "Knight",
                "Queen"
            ],
            correctAnswer: 1
        },
        {
            question: "What is 'castling' in chess?",
            options: [
                "A special move involving the king and a rook",
                "Capturing an opponent's king",
                "Promoting a pawn to a queen",
                "A defensive formation"
            ],
            correctAnswer: 0
        },
        {
            question: "Which piece can jump over other pieces?",
            options: [
                "Queen",
                "Knight",
                "Bishop",
                "Rook"
            ],
            correctAnswer: 1
        },
        {
            question: "When does a chess game end in a stalemate?",
            options: [
                "When a player's king is captured",
                "When both players agree to a draw",
                "When a player has no legal moves and their king is not in check",
                "When only kings remain on the board"
            ],
            correctAnswer: 2
        },
        {
            question: "What is 'en passant' in chess?",
            options: [
                "A defensive strategy",
                "A special pawn capture move",
                "A method of queenside castling",
                "A way to promote pawns"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the name of the starting position on a chess board?",
            options: [
                "Standard position",
                "Initial setup",
                "Opening stance",
                "Starting position"
            ],
            correctAnswer: 0
        },
        {
            question: "How many squares are on a standard chess board?",
            options: [
                "49",
                "64",
                "81",
                "100"
            ],
            correctAnswer: 1
        },
        {
            question: "Which piece is considered the most valuable (apart from the king)?",
            options: [
                "Queen",
                "Rook",
                "Bishop",
                "Knight"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the only piece that can 'promote' in chess?",
            options: [
                "Knight",
                "Bishop",
                "Pawn",
                "Rook"
            ],
            correctAnswer: 2
        }
    ];

    function displayAllQuestions() {
        questionsContainer.innerHTML = ''; // Clear container

        // Create and append each question
        questions.forEach((question, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-container';

            questionDiv.innerHTML = `
                <div class="question">${questionIndex + 1}. ${question.question}</div>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <div class="option">
                            <input type="radio" id="q${questionIndex}o${optionIndex}" name="q${questionIndex}" value="${optionIndex}" ${userAnswers[questionIndex] === optionIndex ? 'checked' : ''}>
                            <label for="q${questionIndex}o${optionIndex}">${option}</label>
                        </div>
                    `).join('')}
                </div>
            `;

            questionsContainer.appendChild(questionDiv);

            // Add event listeners to option radio buttons
            question.options.forEach((_, optionIndex) => {
                const radio = document.getElementById(`q${questionIndex}o${optionIndex}`);
                if (radio) {
                    radio.addEventListener('change', () => {
                        userAnswers[questionIndex] = optionIndex;
                        console.log(`Answer for question ${questionIndex + 1} set to: ${optionIndex}`);

                        // Update the score
                        calculateScore();
                        currentScoreElement.textContent = score;
                    });
                }
            });
        });
    }

    function calculateScore() {
        score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correctAnswer) {
                score++;
            }
        });
        return score;
    }

    function showResult() {
        quizForm.style.display = 'none';
        resultContainer.style.display = 'block';

        const finalScore = calculateScore();
        scoreElement.textContent = `Your score: ${finalScore}/${questions.length}`;

        // Generate feedback based on score
        if (finalScore === questions.length) {
            feedbackElement.textContent = "Perfect! You're a chess master!";
        } else if (finalScore >= questions.length * 0.8) {
            feedbackElement.textContent = "Excellent! You have a strong understanding of chess!";
        } else if (finalScore >= questions.length * 0.6) {
            feedbackElement.textContent = "Good job! You know the basics of chess well.";
        } else if (finalScore >= questions.length * 0.4) {
            feedbackElement.textContent = "Not bad! With a little more practice, you'll improve your chess knowledge.";
        } else {
            feedbackElement.textContent = "Keep learning! Chess takes time to master.";
        }

        // Submit the quiz result to the server
        submitQuizResult(finalScore, questions.length, userAnswers);
    }

    async function submitQuizResult(score, totalQuestions, answers) {
        try {
            console.log('Submitting quiz results...');
            console.log('Using token (first few chars):', authToken.substring(0, 10) + '...');

            const response = await fetch('http://localhost:3000/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    score,
                    totalQuestions,
                    answers: answers.map((answer, index) => ({
                        question: questions[index].question,
                        answer: answer !== undefined ? questions[index].options[answer] : "Not answered",
                        correct: answer === questions[index].correctAnswer
                    }))
                })
            });

            const data = await response.json();
            console.log('Quiz submission response:', data);

            if (!response.ok) {
                console.error('Failed to submit quiz:', data.message);

                // Handle token issues
                if (response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    localStorage.removeItem('authToken');
                    window.location.href = 'login.html';
                } else {
                    alert('Failed to submit quiz. ' + (data.message || 'Please try again later.'));
                }
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Error submitting quiz. Please check your connection and try again.');
        }
    }

    // Initialize the quiz by displaying all questions
    displayAllQuestions();

    // Quiz form submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check if all questions have been answered
        const unansweredQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            if (userAnswers[i] === undefined) {
                unansweredQuestions.push(i + 1);
            }
        }

        if (unansweredQuestions.length > 0) {
            alert(`Please answer question(s): ${unansweredQuestions.join(', ')}`);
            return;
        }

        showResult();
    });

    // Try again button
    tryAgainButton.addEventListener('click', () => {
        userAnswers = Array(10).fill(undefined);
        score = 0;
        currentScoreElement.textContent = 0;
        displayAllQuestions();
        resultContainer.style.display = 'none';
        quizForm.style.display = 'block';
    });

    // Go home button
    goHomeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});