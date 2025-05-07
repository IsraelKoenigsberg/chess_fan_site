document.addEventListener('DOMContentLoaded', function () {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Quiz questions
    const quizQuestions = [
        {
            question: "How does the Knight move in chess?",
            options: [
                "In a straight line only",
                "Diagonally any number of squares",
                "In an L-shape: 2 squares in one direction and then 1 square perpendicular",
                "1 square in any direction"
            ],
            correctAnswer: 2 // Index of the correct answer (0-based)
        },
        {
            question: "Which piece can only move diagonally?",
            options: [
                "Rook",
                "Bishop",
                "Queen",
                "Pawn"
            ],
            correctAnswer: 1
        },
        {
            question: "What is 'castling' in chess?",
            options: [
                "Promoting a pawn to a higher-value piece",
                "A special move involving the king and a rook",
                "Putting the opponent's king in check",
                "Capturing the opponent's queen"
            ],
            correctAnswer: 1
        },
        {
            question: "Which piece can jump over other pieces?",
            options: [
                "Queen",
                "Bishop",
                "Knight",
                "Rook"
            ],
            correctAnswer: 2
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
            question: "What is 'en passant' in chess?",
            options: [
                "A special pawn capture move",
                "When a king is in check",
                "A draw by agreement",
                "When a player resigns"
            ],
            correctAnswer: 0
        },
        {
            question: "How does a pawn capture pieces?",
            options: [
                "In the same way it moves - straight ahead",
                "It cannot capture pieces",
                "Diagonally forward one square",
                "In any direction one square"
            ],
            correctAnswer: 2
        },
        {
            question: "What happens when a pawn reaches the opposite end of the board?",
            options: [
                "It is removed from the board",
                "It can move backwards",
                "It can be promoted to any piece except a king",
                "Nothing happens"
            ],
            correctAnswer: 2
        },
        {
            question: "What is checkmate?",
            options: [
                "When a king is attacked but can escape",
                "When a king is attacked and cannot escape",
                "When no legal moves are available (stalemate)",
                "When both players agree to a draw"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of these is NOT a way a chess game can end?",
            options: [
                "Checkmate",
                "Stalemate",
                "Resignation",
                "Capturing all pieces except the king"
            ],
            correctAnswer: 3
        }
    ];

    // Elements
    const questionsContainer = document.getElementById('questions-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const currentScoreSpan = document.getElementById('current-score');
    const quizForm = document.getElementById('quiz-form');
    const resultContainer = document.getElementById('result-container');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const tryAgainButton = document.getElementById('try-again');
    const goHomeButton = document.getElementById('go-home');

    // Track user answers and score
    let userAnswers = [];
    let score = 0;

    // Load questions
    function loadQuestions() {
        questionsContainer.innerHTML = ''; // Clear previous questions

        quizQuestions.forEach((questionData, index) => {
            // Create question container
            const questionContainer = document.createElement('div');
            questionContainer.className = 'question-container';
            questionContainer.id = `question-${index}`;

            // Create question text
            const questionText = document.createElement('div');
            questionText.className = 'question';
            questionText.textContent = `${index + 1}. ${questionData.question}`;

            // Create options
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options';

            questionData.options.forEach((option, optionIndex) => {
                const optionDiv = document.createElement('label');
                optionDiv.className = 'option';

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question-${index}`;
                radio.value = optionIndex;
                radio.required = true;
                radio.addEventListener('change', () => {
                    // Update user answer when option is selected
                    userAnswers[index] = optionIndex;
                    updateProgress();
                });

                const optionText = document.createTextNode(option);

                optionDiv.appendChild(radio);
                optionDiv.appendChild(optionText);
                optionsContainer.appendChild(optionDiv);
            });

            // Append elements to question container
            questionContainer.appendChild(questionText);
            questionContainer.appendChild(optionsContainer);

            // Append question to questions container
            questionsContainer.appendChild(questionContainer);
        });

        // Initialize user answers array
        userAnswers = new Array(quizQuestions.length).fill(null);
    }

    // Update progress display
    function updateProgress() {
        // Count answered questions
        const answeredQuestions = userAnswers.filter(answer => answer !== null).length;
        currentQuestionSpan.textContent = answeredQuestions;

        // Calculate current score
        score = calculateScore();
        currentScoreSpan.textContent = score;
    }

    // Calculate score based on user answers
    function calculateScore() {
        let correctAnswers = 0;

        userAnswers.forEach((answer, index) => {
            if (answer === quizQuestions[index].correctAnswer) {
                correctAnswers++;
            }
        });

        return correctAnswers;
    }

    // Submit quiz results to server
    async function submitQuizResults(finalScore) {
        try {
            const token = localStorage.getItem('authToken');

            // Prepare detailed answers data
            const detailedAnswers = quizQuestions.map((question, index) => {
                return {
                    question: question.question,
                    userAnswer: userAnswers[index] !== null ? question.options[userAnswers[index]] : null,
                    correctAnswer: question.options[question.correctAnswer],
                    isCorrect: userAnswers[index] === question.correctAnswer
                };
            });

            const response = await fetch('http://localhost:3000/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score: finalScore,
                    totalQuestions: quizQuestions.length,
                    answers: detailedAnswers
                })
            });

            if (response.ok) {
                console.log('Quiz results submitted successfully');
                return true;
            } else {
                console.error('Failed to submit quiz results');
                return false;
            }
        } catch (error) {
            console.error('Error submitting quiz results:', error);
            return false;
        }
    }

    // Display results
    function showResults() {
        const finalScore = calculateScore();
        const percentage = (finalScore / quizQuestions.length) * 100;

        scoreElement.textContent = `Your score: ${finalScore}/${quizQuestions.length} (${percentage}%)`;

        // Custom feedback based on score
        if (percentage >= 90) {
            feedbackElement.textContent = "Excellent! You're a chess master in the making!";
        } else if (percentage >= 70) {
            feedbackElement.textContent = "Great job! You have a solid understanding of chess rules.";
        } else if (percentage >= 50) {
            feedbackElement.textContent = "Good effort! You know the basics, but there's room to improve.";
        } else {
            feedbackElement.textContent = "Keep practicing! Chess takes time to master.";
        }

        // Submit results to server
        submitQuizResults(finalScore);

        // Hide quiz, show results
        quizForm.style.display = 'none';
        resultContainer.style.display = 'block';
    }

    // Handle form submission
    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check if all questions are answered
        const unansweredQuestions = userAnswers.filter(answer => answer === null).length;

        if (unansweredQuestions > 0) {
            alert(`Please answer all questions. You have ${unansweredQuestions} unanswered questions.`);
            return;
        }

        showResults();
    });

    // Try again button
    tryAgainButton.addEventListener('click', function () {
        // Reset quiz
        userAnswers = new Array(quizQuestions.length).fill(null);
        score = 0;

        // Update display
        currentQuestionSpan.textContent = '0';
        currentScoreSpan.textContent = '0';

        // Reset form and reload questions
        loadQuestions();

        // Hide results, show quiz
        resultContainer.style.display = 'none';
        quizForm.style.display = 'block';
    });

    // Go home button
    goHomeButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Initialize quiz
    loadQuestions();
});