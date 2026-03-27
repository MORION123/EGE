// Банк заданий с сайта «Решу ЕГЭ» (реальные задания по русскому языку)
const questionBank = {
    // Орфоэпия (ударения)
    orthoepy: [
        {
            text: "В каком слове ударение падает на первый слог?",
            answers: ["красивЕе", "тортЫ", "бАнты", "звонИт"],
            correct: 2,
            explanation: "В слове «бАнты» ударение падает на первый слог. Запомните: банты, шарфы, торты — ударение на первый слог."
        },
        {
            text: "В каком слове ударение падает на последний слог?",
            answers: ["клАла", "создалА", "нАчал", "понЯв"],
            correct: 1,
            explanation: "В глаголах женского рода прошедшего времени ударение часто падает на окончание: создалА, взялА, спалА."
        }
    ],
    // Паронимы
    paronyms: [
        {
            text: "В каком предложении вместо слова ДЛИННЫЙ нужно употребить ДЛИТЕЛЬНЫЙ?",
            answers: [
                "ДЛИННЫЙ хвост павлина переливался всеми цветами радуги.",
                "Нам предстоял ДЛИННЫЙ путь через пустыню.",
                "После ДЛИННОГО совещания все разошлись.",
                "ДЛИННЫЙ свисток паровоза разбудил всю округу."
            ],
            correct: 2,
            explanation: "ДЛИТЕЛЬНЫЙ — о времени, ДЛИННЫЙ — о размере. Правильно: после ДЛИТЕЛЬНОГО совещания."
        }
    ],
    // Грамматические нормы
    grammar: [
        {
            text: "Укажите пример с ошибкой в образовании формы слова",
            answers: [
                "пара ТУФЕЛЬ",
                "пять АПЕЛЬСИНОВ",
                "ИХНИЙ портфель",
                "более КРАСИВЫЙ"
            ],
            correct: 2,
            explanation: "Правильно: ИХ портфель. Слово «ихний» является просторечным."
        }
    ],
    // Правописание корней
    roots: [
        {
            text: "В каком ряду во всех словах пропущена безударная проверяемая гласная корня?",
            answers: [
                "ст...рожил (дом), ум...лчать, р...сток",
                "зар...сли, пок...сившийся, оп...здание",
                "п...стух, к...залось, уд...вление",
                "пл...вец, выр...щенный, р...внина"
            ],
            correct: 2,
            explanation: "Пастух (пас), казалось (кажется), удивление (диво) — проверяемые гласные."
        }
    ],
    // Пунктуация
    punctuation: [
        {
            text: "В каком варианте ответа правильно указаны все цифры, на месте которых в предложении должны стоять запятые? «Солнце (1) выглянувшее из-за туч (2) осветило лес (3) и (4) заиграло на траве.»",
            answers: ["1,2", "1,2,3", "1,2,3,4", "2,3,4"],
            correct: 0,
            explanation: "Причастный оборот «выглянувшее из-за туч» выделяется запятыми (1 и 2). Запятая перед «и» не нужна, так как нет повторяющегося союза."
        }
    ]
};

// Объединяем все задания в один массив для уроков
const allQuestions = [
    ...questionBank.orthoepy,
    ...questionBank.paronyms,
    ...questionBank.grammar,
    ...questionBank.roots,
    ...questionBank.punctuation
];

// Данные уроков (темы ЕГЭ по русскому языку)
const lessons = [
    { id: 0, title: "Орфоэпия (ударения)", completed: false, unlocked: true, questionIndices: [0, 1] },
    { id: 1, title: "Паронимы", completed: false, unlocked: false, questionIndices: [2] },
    { id: 2, title: "Грамматические нормы", completed: false, unlocked: false, questionIndices: [3] },
    { id: 3, title: "Правописание корней", completed: false, unlocked: false, questionIndices: [4] },
    { id: 4, title: "Пунктуация", completed: false, unlocked: false, questionIndices: [5] }
];

// Глобальное состояние
let currentUser = null;
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
let questionText, answersGrid, explanationDiv, explanationText;
let reviveModal, reviveBtn, reviveTimerText;
let completeModal, continueBtn, completeTitle, completeText;
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn, googleLoginBtn;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    googleLoginBtn = document.getElementById('googleLoginBtn');
    
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
    explanationDiv = document.getElementById('explanation');
    explanationText = document.getElementById('explanationText');
    reviveModal = document.getElementById('reviveModal');
    reviveBtn = document.getElementById('reviveBtn');
    reviveTimerText = document.getElementById('reviveTimerText');
    completeModal = document.getElementById('completeModal');
    continueBtn = document.getElementById('continueBtn');
    completeTitle = document.getElementById('completeTitle');
    completeText = document.getElementById('completeText');
    
    // Настройка Firebase Auth
    setupAuth();
    
    // События
    closeModal.addEventListener('click', closeLessonModal);
    reviveBtn.addEventListener('click', reviveLives);
    continueBtn.addEventListener('click', () => {
        completeModal.classList.remove('active');
    });
    logoutBtn.addEventListener('click', handleLogout);
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
    
    // Закрытие модалок по клику вне
    window.addEventListener('click', (e) => {
        if (e.target === lessonModal) closeLessonModal();
        if (e.target === reviveModal) reviveModal.classList.remove('active');
        if (e.target === completeModal) completeModal.classList.remove('active');
    });
    
    // Подсказка совы
    document.getElementById('owlAvatar').addEventListener('click', () => {
        if (lessons[0].unlocked && !lessons[0].completed) {
            owlTooltip.textContent = 'Нажми на первый урок, чтобы начать!';
        } else if (lessons[0].completed) {
            owlTooltip.textContent = 'Отлично! Продолжай в том же духе! 🎯';
        } else {
            owlTooltip.textContent = 'Начни с первого урока!';
        }
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 2000);
    });
});

// Настройка авторизации
function setupAuth() {
    const auth = window.firebaseAuth;
    const onAuthStateChanged = window.onAuthStateChanged;
    
    if (auth && onAuthStateChanged) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = {
                    uid: user.uid,
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    photoURL: user.photoURL
                };
                loadUserData();
                showMainApp();
            } else {
                showAuthScreen();
            }
        });
    } else {
        // Fallback: используем localStorage для демо
        const savedUser = localStorage.getItem('egelingo_demo_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadUserData();
            showMainApp();
        } else {
            showAuthScreen();
        }
    }
}

// Вход через Google
async function handleGoogleLogin() {
    const auth = window.firebaseAuth;
    const provider = new window.GoogleAuthProvider();
    
    if (auth && window.signInWithPopup) {
        try {
            const result = await window.signInWithPopup(auth, provider);
            currentUser = {
                uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL
            };
            loadUserData();
            showMainApp();
        } catch (error) {
            console.error('Google login error:', error);
            // Fallback для демо
            demoLogin();
        }
    } else {
        demoLogin();
    }
}

// Демо-вход (без Firebase)
function demoLogin() {
    const demoName = prompt('Введите ваше имя (для демо-режима):', 'Ученик');
    currentUser = {
        uid: 'demo_' + Date.now(),
        name: demoName || 'Ученик',
        email: 'demo@egelingo.ru',
        photoURL: null
    };
    localStorage.setItem('egelingo_demo_user', JSON.stringify(currentUser));
    loadUserData();
    showMainApp();
}

// Выход
async function handleLogout() {
    const auth = window.firebaseAuth;
    if (auth && window.signOut) {
        await window.signOut(auth);
    }
    localStorage.removeItem('egelingo_demo_user');
    localStorage.removeItem('egelingo_progress');
    currentUser = null;
    showAuthScreen();
}

// Показать экран авторизации
function showAuthScreen() {
    if (authScreen) authScreen.style.display = 'flex';
    if (mainApp) mainApp.style.display = 'none';
}

// Показать основное приложение
function showMainApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    if (usernameSpan) usernameSpan.textContent = currentUser?.name || 'Ученик';
    if (userAvatar) userAvatar.textContent = currentUser?.photoURL ? '📸' : '👤';
    
    renderLessons();
    updateUI();
}

// Загрузить данные пользователя
function loadUserData() {
    const saved = localStorage.getItem(`egelingo_progress_${currentUser.uid}`);
    if (saved) {
        const progress = JSON.parse(saved);
        currentXP = progress.xp || 0;
        lives = progress.lives !== undefined ? progress.lives : 3;
        
        progress.lessons?.forEach(savedLesson => {
            const lesson = lessons.find(l => l.id === savedLesson.id);
            if (lesson) {
                lesson.completed = savedLesson.completed;
                lesson.unlocked = savedLesson.unlocked;
            }
        });
    } else {
        currentXP = 0;
        lives = 3;
        lessons.forEach((lesson, idx) => {
            lesson.completed = false;
            lesson.unlocked = idx === 0;
        });
    }
    saveProgress();
}

// Сохранить прогресс
function saveProgress() {
    if (!currentUser) return;
    const progress = {
        xp: currentXP,
        lives: lives,
        lessons: lessons.map(lesson => ({
            id: lesson.id,
            completed: lesson.completed,
            unlocked: lesson.unlocked
        }))
    };
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify(progress));
}

// Рендер дорожки уроков
function renderLessons() {
    if (!lessonsPath) return;
    lessonsPath.innerHTML = '';
    lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-item';
        if (lesson.completed) lessonDiv.classList.add('completed');
        if (!lesson.unlocked) lessonDiv.classList.add('locked');
        if (lesson.unlocked && !lesson.completed) lessonDiv.classList.add('active');
        
        const questionCount = lesson.questionIndices.length;
        
        lessonDiv.innerHTML = `
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-status ${lesson.completed ? 'completed' : ''}">
                    ${lesson.completed ? '✅ Пройдено' : (lesson.unlocked ? `🔓 ${questionCount} заданий` : '🔒 Заблокировано')}
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
    
    lessonTitle.textContent = lesson.title;
    totalQuestions.textContent = lesson.questionIndices.length;
    lessonModal.classList.add('active');
    loadQuestion();
}

// Загрузить вопрос
function loadQuestion() {
    const lesson = lessons[currentLesson];
    const questionIdx = lesson.questionIndices[currentQuestionIndex];
    const question = allQuestions[questionIdx];
    
    if (!question) return;
    
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.text;
    explanationDiv.style.display = 'none';
    
    answersGrid.innerHTML = '';
    question.answers.forEach((answer, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(idx, btn, question));
        answersGrid.appendChild(btn);
    });
}

// Проверить ответ
function checkAnswer(selectedIndex, buttonElement, question) {
    if (waitingForNext) return;
    
    const isCorrect = selectedIndex === question.correct;
    
    // Блокируем кнопки
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    if (isCorrect) {
        buttonElement.classList.add('correct');
        currentXP += 10;
        saveProgress();
        updateUI();
        
        owlTooltip.textContent = 'Правильно! +10 XP 🎉';
        owlTooltip.style.display = 'block';
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 1500);
        
        waitingForNext = true;
        setTimeout(() => {
            nextQuestion();
            waitingForNext = false;
        }, 1000);
    } else {
        buttonElement.classList.add('wrong');
        
        // Показываем пояснение
        explanationText.textContent = question.explanation;
        explanationDiv.style.display = 'block';
        
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
            }, 2000);
        } else {
            waitingForNext = true;
            setTimeout(() => {
                nextQuestion();
                waitingForNext = false;
            }, 2000);
        }
    }
    
    saveProgress();
}

// Следующий вопрос
function nextQuestion() {
    const lesson = lessons[currentLesson];
    
    if (currentQuestionIndex + 1 < lesson.questionIndices.length) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        completeLesson();
    }
}

// Завершить урок
function completeLesson() {
    const lesson = lessons[currentLesson];
    lesson.completed = true;
    
    if (currentLesson + 1 < lessons.length) {
        lessons[currentLesson + 1].unlocked = true;
    }
    
    const bonusXP = 30;
    currentXP += bonusXP;
    saveProgress();
    updateUI();
    
    closeLessonModal();
    
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

// Обновить UI
function updateUI() {
    if (xpText) xpText.textContent = `${currentXP} XP`;
    if (xpFill) {
        const xpPercent = Math.min((currentXP % 100) / 100 * 100, 100);
        xpFill.style.width = `${xpPercent}%`;
    }
    
    if (livesContainer) {
        const livesElements = livesContainer.querySelectorAll('.life');
        livesElements.forEach((life, idx) => {
            if (idx >= lives) {
                life.classList.add('lost');
            } else {
                life.classList.remove('lost');
            }
        });
    }
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
    explanationDiv.style.display = 'none';
}

// Регистрация Service Worker (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW error:', err));
}
