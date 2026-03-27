// Данные уроков
const lessons = [
    {
        id: 0,
        title: "Квадратные корни",
        completed: false,
        unlocked: true,
        questions: [
            {
                text: "Вычислите значение выражения: √64",
                answers: ["6", "8", "4", "16"],
                correct: 1
            },
            {
                text: "Упростите выражение: √18 + √50",
                answers: ["√68", "8√2", "6√2", "2√34"],
                correct: 1
            },
            {
                text: "Решите уравнение: √(2x + 3) = 5",
                answers: ["x = 11", "x = 22", "x = 8", "x = 14"],
                correct: 0
            },
            {
                text: "Найдите значение выражения: (√12 - √3)²",
                answers: ["3", "9", "12", "6"],
                correct: 0
            }
        ]
    },
    {
        id: 1,
        title: "Производная",
        completed: false,
        unlocked: false,
        questions: []
    },
    {
        id: 2,
        title: "Теория вероятностей",
        completed: false,
        unlocked: false,
        questions: []
    },
    {
        id: 3,
        title: "Тригонометрия",
        completed: false,
        unlocked: false,
        questions: []
    },
    {
        id: 4,
        title: "Стереометрия",
        completed: false,
        unlocked: false,
        questions: []
    }
];

// Глобальное состояние
let currentXP = 0;
let lives = 3;
let currentLesson = null;
let currentQuestionIndex = 0;
let waitingForNext = false;
let reviveTimeout = null;
let reviveCountdown = null;

// DOM элементы
let lessonsPath, xpFill, xpText, livesContainer, owlTooltip;
let lessonModal, closeModal, lessonTitle, currentQuestionNum, totalQuestions;
let questionText, answersGrid, reviveModal, reviveBtn, reviveTimerText;
let completeModal, continueBtn, completeTitle, completeText;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы
    lessonsPath = document.getElementById('lessonsPath');
    xpFill = document.getElementById('xpFill');
    xpText = document.getElementById('xpText');
    livesContainer = document.getElementById('livesContainer');
    owlTooltip = document.getElementById('owlTooltip');
    lessonModal = document.getElementById('lessonModal');
    closeModal = document.getElementById('closeModal');
    lessonTitle = document.getElementById('lessonTitle');
    currentQuestionNum = document.getElementById('currentQuestionNum');
    totalQuestions = document.getElementById('totalQuestions');
    questionText = document.getElementById('questionText');
    answersGrid = document.getElementById('answersGrid');
    reviveModal = document.getElementById('reviveModal');
    reviveBtn = document.getElementById('reviveBtn');
    reviveTimerText = document.getElementById('reviveTimerText');
    completeModal = document.getElementById('completeModal');
    continueBtn = document.getElementById('continueBtn');
    completeTitle = document.getElementById('completeTitle');
    completeText = document.getElementById('completeText');
    
    // Загружаем сохраненные данные
    loadProgress();
    
    // Рендерим уроки
    renderLessons();
    
    // Обновляем UI
    updateUI();
    
    // События
    closeModal.addEventListener('click', closeLessonModal);
    reviveBtn.addEventListener('click', reviveLives);
    continueBtn.addEventListener('click', () => {
        completeModal.classList.remove('active');
    });
    
    // Закрытие модалок по клику вне
    window.addEventListener('click', (e) => {
        if (e.target === lessonModal) closeLessonModal();
        if (e.target === reviveModal) reviveModal.classList.remove('active');
        if (e.target === completeModal) completeModal.classList.remove('active');
    });
    
    // Изменяем подсказку при наведении
    document.getElementById('owlAvatar').addEventListener('click', () => {
        if (lessons[0].unlocked && !lessons[0].completed) {
            owlTooltip.textContent = 'Нажми на первый урок, чтобы начать!';
        } else if (lessons[0].completed) {
            owlTooltip.textContent = 'Отлично! Продолжай в том же духе! 🎯';
        } else {
            owlTooltip.textContent = 'Начни с первого урока!';
        }
        setTimeout(() => {
            if (owlTooltip.style.display === 'block') {
                owlTooltip.style.display = 'none';
            }
        }, 2000);
    });
});

// Рендер дорожки уроков
function renderLessons() {
    lessonsPath.innerHTML = '';
    lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-item';
        if (lesson.completed) lessonDiv.classList.add('completed');
        if (!lesson.unlocked) lessonDiv.classList.add('locked');
        if (lesson.unlocked && !lesson.completed) lessonDiv.classList.add('active');
        
        lessonDiv.innerHTML = `
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-status ${lesson.completed ? 'completed' : ''}">
                    ${lesson.completed ? '✅ Пройдено' : (lesson.unlocked ? '🔓 Доступно' : '🔒 Заблокировано')}
                </div>
            </div>
        `;
        
        if (lesson.unlocked) {
            lessonDiv.addEventListener('click', () => startLesson(lesson.id));
        }
        
        lessonsPath.appendChild(lessonDiv);
    });
}

// Начать урок
function startLesson(lessonId) {
    if (waitingForNext) return;
    if (lives <= 0) {
        showReviveModal();
        return;
    }
    
    currentLesson = lessonId;
    currentQuestionIndex = 0;
    const lesson = lessons[currentLesson];
    
    if (!lesson.questions.length) {
        // Если вопросов нет, создаем заглушки для демо
        if (currentLesson === 1) {
            lesson.questions = [
                { text: "Найдите производную функции f(x) = x²", answers: ["2x", "x", "2", "x²"], correct: 0 },
                { text: "Производная константы равна:", answers: ["0", "1", "∞", "Константе"], correct: 0 }
            ];
        } else if (currentLesson === 2) {
            lesson.questions = [
                { text: "Вероятность выпадения орла при подбрасывании монеты:", answers: ["0.5", "0.25", "0.75", "1"], correct: 0 }
            ];
        } else {
            lesson.questions = [
                { text: "Пример вопроса для этого урока", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], correct: 0 }
            ];
        }
    }
    
    lessonTitle.textContent = lesson.title;
    totalQuestions.textContent = lesson.questions.length;
    lessonModal.classList.add('active');
    loadQuestion();
}

// Загрузить вопрос
function loadQuestion() {
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestionIndex];
    
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.text;
    
    answersGrid.innerHTML = '';
    question.answers.forEach((answer, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(idx, btn));
        answersGrid.appendChild(btn);
    });
}

// Проверить ответ
function checkAnswer(selectedIndex, buttonElement) {
    if (waitingForNext) return;
    
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        // Правильный ответ
        buttonElement.classList.add('correct');
        currentXP += 10;
        saveProgress();
        updateUI();
        
        // Показать подсказку
        owlTooltip.textContent = 'Правильно! +10 XP 🎉';
        owlTooltip.style.display = 'block';
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 1500);
        
        // Переход к следующему вопросу
        waitingForNext = true;
        setTimeout(() => {
            nextQuestion();
            waitingForNext = false;
        }, 1000);
    } else {
        // Неправильный ответ
        buttonElement.classList.add('wrong');
        lives--;
        updateUI();
        
        owlTooltip.textContent = 'Неправильно! -1 жизнь 😢';
        owlTooltip.style.display = 'block';
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 1500);
        
        if (lives <= 0) {
            waitingForNext = true;
            setTimeout(() => {
                closeLessonModal();
                showReviveModal();
                waitingForNext = false;
            }, 1000);
        } else {
            waitingForNext = true;
            setTimeout(() => {
                nextQuestion();
                waitingForNext = false;
            }, 1000);
        }
    }
    
    saveProgress();
}

// Следующий вопрос
function nextQuestion() {
    const lesson = lessons[currentLesson];
    
    if (currentQuestionIndex + 1 < lesson.questions.length) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        // Урок пройден
        completeLesson();
    }
}

// Завершить урок
function completeLesson() {
    const lesson = lessons[currentLesson];
    lesson.completed = true;
    
    // Разблокировать следующий урок
    if (currentLesson + 1 < lessons.length) {
        lessons[currentLesson + 1].unlocked = true;
    }
    
    // Добавить бонус XP
    const bonusXP = 30;
    currentXP += bonusXP;
    saveProgress();
    updateUI();
    
    closeLessonModal();
    
    // Показать окно завершения
    completeTitle.textContent = `🎉 Урок пройден! 🎉`;
    completeText.textContent = `+${bonusXP} XP`;
    completeModal.classList.add('active');
    
    owlTooltip.textContent = `Урок пройден! +${bonusXP} XP 🌟`;
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 2000);
    
    renderLessons();
}

// Обновить UI (XP, жизни)
function updateUI() {
    // Обновляем XP
    xpText.textContent = `${currentXP} XP`;
    const xpPercent = Math.min((currentXP % 100) / 100 * 100, 100);
    xpFill.style.width = `${xpPercent}%`;
    
    // Обновляем жизни
    const livesElements = livesContainer.querySelectorAll('.life');
    livesElements.forEach((life, idx) => {
        if (idx >= lives) {
            life.classList.add('lost');
        } else {
            life.classList.remove('lost');
        }
    });
}

// Показать окно восстановления
function showReviveModal() {
    reviveModal.classList.add('active');
    startReviveTimer();
}

// Таймер восстановления
function startReviveTimer() {
    let timeLeft = 30;
    reviveBtn.disabled = true;
    
    if (reviveCountdown) clearInterval(reviveCountdown);
    if (reviveTimeout) clearTimeout(reviveTimeout);
    
    reviveCountdown = setInterval(() => {
        timeLeft--;
        reviveTimerText.textContent = `Подождите ${timeLeft} секунд`;
        
        if (timeLeft <= 0) {
            clearInterval(reviveCountdown);
            reviveBtn.disabled = false;
            reviveTimerText.textContent = 'Жизни восстановлены!';
        }
    }, 1000);
    
    reviveTimeout = setTimeout(() => {
        clearInterval(reviveCountdown);
    }, 30000);
}

// Восстановить жизни
function reviveLives() {
    if (reviveBtn.disabled) return;
    
    lives = 3;
    updateUI();
    saveProgress();
    reviveModal.classList.remove('active');
    
    if (reviveCountdown) clearInterval(reviveCountdown);
    if (reviveTimeout) clearTimeout(reviveTimeout);
    
    owlTooltip.textContent = 'Жизни восстановлены! Продолжай учиться! 💪';
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 2000);
}

// Закрыть модальное окно урока
function closeLessonModal() {
    lessonModal.classList.remove('active');
    waitingForNext = false;
}

// Сохранить прогресс
function saveProgress() {
    const progress = {
        xp: currentXP,
        lives: lives,
        lessons: lessons.map(lesson => ({
            id: lesson.id,
            completed: lesson.completed,
            unlocked: lesson.unlocked
        }))
    };
    localStorage.setItem('egelingo_progress', JSON.stringify(progress));
}

// Загрузить прогресс
function loadProgress() {
    const saved = localStorage.getItem('egelingo_progress');
    if (saved) {
        const progress = JSON.parse(saved);
        currentXP = progress.xp;
        lives = progress.lives;
        
        progress.lessons.forEach(savedLesson => {
            const lesson = lessons.find(l => l.id === savedLesson.id);
            if (lesson) {
                lesson.completed = savedLesson.completed;
                lesson.unlocked = savedLesson.unlocked;
            }
        });
    }
    
    // Убедимся, что первый урок всегда разблокирован
    lessons[0].unlocked = true;
}
