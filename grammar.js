// Quiz Questions
const questions = [
    {
        question: "___ apple is red.",
        options: ["A", "An", "The"],
        answer: "An"
    },
    {
        question: "___ cat is sleeping.",
        options: ["A", "An", "The"],
        answer: "A"
    },
    {
        question: "___ is my book. (najik ni vastu)",
        options: ["This", "That"],
        answer: "This"
    },
    {
        question: "___ is a tree. (dur ni vastu)",
        options: ["This", "That"],
        answer: "That"
    },
    {
        question: "He ___ a boy.",
        options: ["is", "are"],
        answer: "is"
    },
    {
        question: "They ___ kids.",
        options: ["is", "are"],
        answer: "are"
    },
    {
        question: "___ elephant is big.",
        options: ["A", "An", "The"],
        answer: "An"
    },
    {
        question: "She ___ a girl.",
        options: ["is", "are"],
        answer: "is"
    }
];

let currentQuestion = 0;

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').textContent = q.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(btn, option, q.answer);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('feedback').textContent = '';
}

function checkAnswer(btn, selected, correct) {
    const feedback = document.getElementById('feedback');
    const allOptions = document.querySelectorAll('.quiz-option');

    allOptions.forEach(opt => opt.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        feedback.style.color = '#4caf50';
        feedback.textContent = '✅ Shabash! Sahi jawab!';
    } else {
        btn.classList.add('wrong');
        feedback.style.color = '#f44336';
        feedback.textContent = '❌ Khoto jawab. Sahi chhe: ' + correct;
        // Highlight correct answer
        allOptions.forEach(opt => {
            if (opt.textContent === correct) {
                opt.classList.add('correct');
            }
        });
    }
}

function nextQuestion() {
    currentQuestion = (currentQuestion + 1) % questions.length;
    loadQuestion();
}

// Pehli question load karo
loadQuestion();