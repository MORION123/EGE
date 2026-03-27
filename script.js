// ==================== КОНФИГУРАЦИЯ ====================
// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '549758991862-888ndj9ubsjl5u8r04i804gh05d0mbbv.apps.googleusercontent.com';

// JSONBin.io конфигурация (для облачного хранения прогресса)
const CLOUD_CONFIG = {
    API_KEY: '$2a$10$Vxl9lZUaGmUANs2JQBixL.O37Ot8zteKKSAR98p.eP6.aTeQ4Brwu',
    BIN_ID: null,
    BASE_URL: 'https://api.jsonbin.io/v3/b'
};

// Банк заданий с сайта «Решу ЕГЭ» (расширенный)
const questionBank = {
    orthoepy: [
        {
            text: "В каком слове ударение падает на первый слог?",
            answers: ["красивЕе", "тортЫ", "бАнты", "звонИт"],
            correct: 2,
            explanation: "В слове «бАнты» ударение падает на первый слог. Запомните: бАнты, шАрфы, тОрты."
        },
        {
            text: "В каком слове ударение падает на последний слог?",
            answers: ["клАла", "создалА", "нАчал", "понЯв"],
            correct: 1,
            explanation: "В глаголах женского рода прошедшего времени ударение падает на окончание: создалА, взялА, спалА."
        },
        {
            text: "В каком слове ударение падает на второй слог?",
            answers: ["докумЕнт", "каталОг", "красИвее", "квартАл"],
            correct: 2,
            explanation: "В слове «красИвее» ударение падает на второй слог. Запомните: красИвее, обеспЕчение, оптОвый."
        }
    ],
    paronyms: [
        {
            text: "В каком предложении вместо слова ДЛИННЫЙ нужно употребить ДЛИТЕЛЬНЫЙ?",
            answers: [
                "ДЛИННЫЙ хвост павлина переливался всеми цветами.",
                "Нам предстоял ДЛИННЫЙ путь через пустыню.",
                "После ДЛИННОГО совещания все разошлись.",
                "ДЛИННЫЙ свисток паровоза разбудил округу."
            ],
            correct: 2,
            explanation: "ДЛИТЕЛЬНЫЙ — о времени, ДЛИННЫЙ — о размере. Правильно: после ДЛИТЕЛЬНОГО совещания."
        },
        {
            text: "В каком предложении вместо слова ВЕЧНЫЙ нужно употребить ВЕКОВЕЧНЫЙ?",
            answers: [
                "ВЕЧНЫЙ лес охраняется государством.",
                "Это был ВЕЧНЫЙ спор.",
                "ВЕЧНЫЕ ценности остаются неизменными.",
                "ВЕЧНАЯ мерзлота встречается в Сибири."
            ],
            correct: 0,
            explanation: "ВЕКОВЕЧНЫЙ — очень старый (о лесе), ВЕЧНЫЙ — бесконечный во времени."
        }
    ],
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
        },
        {
            text: "Укажите пример с ошибкой в образовании формы слова",
            answers: [
                "ЛЯГТЕ на пол",
                "ЕДЬТЕ быстрее",
                "КЛАДИ на место",
                "ПОЕЗЖАЙ в город"
            ],
            correct: 1,
            explanation: "Правильно: ПОЕЗЖАЙ. Глагола «едь» в русском языке нет."
        }
    ],
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
        },
        {
            text: "В каком ряду во всех словах пропущена чередующаяся гласная корня?",
            answers: [
                "прик...сновение, выр...сти, з...ря",
                "отр...сль, р...сток, к...сание",
                "прил...жение, предл...жить, сл...гать",
                "все варианты верны"
            ],
            correct: 3,
            explanation: "Во всех словах чередующиеся гласные: -кас-/-кос-, -раст-/-ращ-/-рос-, -зар-/-зор-."
        }
    ],
    punctuation: [
        {
            text: "В каком варианте ответа правильно указаны все цифры, на месте которых должны стоять запятые? «Солнце (1) выглянувшее из-за туч (2) осветило лес (3) и (4) заиграло на траве.»",
            answers: ["1,2", "1,2,3", "1,2,3,4", "2,3,4"],
            correct: 0,
            explanation: "Причастный оборот «выглянувшее из-за туч» выделяется запятыми (1 и 2)."
        },
        {
            text: "В каком варианте ответа правильно указаны все цифры, на месте которых должны стоять запятые? «Дождь (1) усиливающийся с каждой минутой (2) превратился в ливень (3) и (4) затопил улицы.»",
            answers: ["1,2", "1,2,3", "1,2,4", "1,2,3,4"],
            correct: 0,
            explanation: "Причастный оборот «усиливающийся с каждой минутой» выделяется запятыми (1 и 2)."
        }
    ]
};

// Объединяем все задания
const allQuestions = [
    ...questionBank.orthoepy,      // 3 вопроса
    ...questionBank.paronyms,      // 2 вопроса
    ...questionBank.grammar,       // 2 вопроса
    ...questionBank.roots,         // 2 вопроса
    ...questionBank.punctuation    // 2 вопроса
];

// Данные уроков (11 вопросов, распределённые по урокам)
const lessons = [
    { id: 0, title: "Орфоэпия (ударения)", completed: false, unlocked: true, questionIndices: [0, 1, 2] },
    { id: 1, title: "Паронимы", completed: false, unlocked: false, questionIndices: [3, 4] },
    { id: 2, title: "Грамматические нормы", completed: false, unlocked: false, questionIndices: [5, 6] },
    { id: 3, title: "Правописание корней", completed: false, unlocked: false, questionIndices: [7, 8] },
    { id: 4, title: "Пунктуация", completed: false, unlocked: false, questionIndices: [9, 10] }
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
let isSyncing = false;
let syncQueue = [];

// DOM элементы
let lessonsPath, xpFill, xpText, livesContainer, owlTooltip;
let lessonModal, closeModal, lessonTitle, currentQuestionNum, totalQuestions;
let questionText, answersGrid, explanationDiv, explanationText;
let reviveModal, reviveBtn, reviveTimerText;
let completeModal, continueBtn, completeTitle, completeText;
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn, syncStatus, googleLoginBtn;

// ==================== GOOGLE AUTH ====================
// Инициализация Google Sign-In
function initGoogleAuth() {
    if (!window.google || !window.google.accounts) {
        console.log('Google API not loaded yet, waiting...');
        setTimeout(initGoogleAuth, 500);
        return;
    }
    
    window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    console.log('Google Auth initialized');
}

// Обработчик ответа от Google
async function handleGoogleCredentialResponse(response) {
    try {
        showLoading(true);
        
        // Декодируем JWT токен
        const payload = parseJwt(response.credential);
        
        currentUser = {
            uid: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            token: response.credential
        };
        
        // Сохраняем локально
        localStorage.setItem('egelingo_user', JSON.stringify(currentUser));
        
        // Загружаем данные из облака
        await loadFromCloud();
        
        showMainApp();
        showLoading(false);
    } catch (error) {
        console.error('Login error:', error);
        showError('Ошибка входа. Попробуйте ещё раз.');
        showLoading(false);
    }
}

// Парсинг JWT токена
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Кнопка входа через Google
function handleGoogleLogin() {
    if (window.google && window.google.accounts) {
        window.google.accounts.id.prompt();
    } else {
        showError('Загрузка Google сервисов... Попробуйте обновить страницу');
        // Повторная попытка инициализации
        setTimeout(initGoogleAuth, 1000);
    }
}

// ==================== ОБЛАЧНОЕ ХРАНЕНИЕ ====================
// Сохранить прогресс в облако
async function saveToCloud() {
    if (!currentUser) return;
    
    if (isSyncing) {
        syncQueue.push(saveToCloud);
        return;
    }
    
    updateSyncStatus('syncing', 'Синхронизация...');
    isSyncing = true;
    
    const progress = {
        userId: currentUser.uid,
        email: currentUser.email,
        name: currentUser.name,
        picture: currentUser.picture,
        lastSync: new Date().toISOString(),
        xp: currentXP,
        lives: lives,
        lessons: lessons.map(l => ({
            id: l.id,
            completed: l.completed,
            unlocked: l.unlocked
        }))
    };
    
    try {
        let binId = localStorage.getItem(`egelingo_bin_${currentUser.uid}`);
        
        if (binId) {
            // Обновляем существующий bin
            const response = await fetch(`${CLOUD_CONFIG.BASE_URL}/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': CLOUD_CONFIG.API_KEY
                },
                body: JSON.stringify(progress)
            });
            
            if (!response.ok) throw new Error('Update failed');
        } else {
            // Создаём новый bin
            const response = await fetch(CLOUD_CONFIG.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': CLOUD_CONFIG.API_KEY,
                    'X-Bin-Private': 'false'
                },
                body: JSON.stringify(progress)
            });
            
            if (!response.ok) throw new Error('Create failed');
            
            const data = await response.json();
            binId = data.metadata.id;
            localStorage.setItem(`egelingo_bin_${currentUser.uid}`, binId);
        }
        
        updateSyncStatus('success', 'Синхронизировано');
        setTimeout(() => {
            if (syncStatus) syncStatus.style.opacity = '0';
        }, 2000);
        
        // Удаляем офлайн-кэш если был
        localStorage.removeItem(`egelingo_offline_${currentUser.uid}`);
        
    } catch (error) {
        console.error('Cloud save error:', error);
        updateSyncStatus('error', 'Офлайн-режим');
        // Сохраняем в офлайн-кэш
        localStorage.setItem(`egelingo_offline_${currentUser.uid}`, JSON.stringify(progress));
    } finally {
        isSyncing = false;
        if (syncQueue.length) {
            const next = syncQueue.shift();
            setTimeout(next, 1000);
        }
    }
}

// Загрузить прогресс из облака
async function loadFromCloud() {
    if (!currentUser) return;
    
    updateSyncStatus('syncing', 'Загрузка...');
    
    const binId = localStorage.getItem(`egelingo_bin_${currentUser.uid}`);
    
    if (binId) {
        try {
            const response = await fetch(`${CLOUD_CONFIG.BASE_URL}/${binId}/latest`, {
                headers: {
                    'X-Master-Key': CLOUD_CONFIG.API_KEY
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const progress = data.record;
                
                currentXP = progress.xp || 0;
                lives = progress.lives !== undefined ? progress.lives : 3;
                
                progress.lessons?.forEach(savedLesson => {
                    const lesson = lessons.find(l => l.id === savedLesson.id);
                    if (lesson) {
                        lesson.completed = savedLesson.completed;
                        lesson.unlocked = savedLesson.unlocked;
                    }
                });
                
                updateSyncStatus('success', 'Загружено из облака');
                console.log('Cloud data loaded');
            } else {
                console.log('No cloud data, using local');
                loadLocalData();
            }
        } catch (error) {
            console.error('Cloud load error:', error);
            loadLocalData();
            updateSyncStatus('error', 'Офлайн-режим');
        }
    } else {
        // Проверяем офлайн-кэш
        const offlineData = localStorage.getItem(`egelingo_offline_${currentUser.uid}`);
        if (offlineData) {
            const progress = JSON.parse(offlineData);
            currentXP = progress.xp || 0;
            lives = progress.lives !== undefined ? progress.lives : 3;
            progress.lessons?.forEach(savedLesson => {
                const lesson = lessons.find(l => l.id === savedLesson.id);
                if (lesson) {
                    lesson.completed = savedLesson.completed;
                    lesson.unlocked = savedLesson.unlocked;
                }
            });
            updateSyncStatus('success', 'Загружено из кэша');
        } else {
            loadLocalData();
        }
    }
    
    saveProgress();
    renderLessons();
    updateUI();
}

// Загрузка локальных данных
function loadLocalData() {
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
        console.log('Local data loaded');
    } else {
        // Начальная инициализация
        currentXP = 0;
        lives = 3;
        lessons.forEach((lesson, idx) => {
            lesson.completed = false;
            lesson.unlocked = idx === 0;
        });
        console.log('Fresh start');
    }
}

// ==================== ЛОКАЛЬНОЕ СОХРАНЕНИЕ ====================
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
    
    // Отправляем в облако с задержкой (не спамим)
    if (window.cloudSaveTimeout) clearTimeout(window.cloudSaveTimeout);
    window.cloudSaveTimeout = setTimeout(() => {
        saveToCloud();
    }, 3000);
}

// Обновить статус синхронизации
function updateSyncStatus(status, text) {
    if (!syncStatus) return;
    syncStatus.className = 'sync-status';
    if (status === 'syncing') syncStatus.classList.add('syncing');
    if (status === 'error') syncStatus.classList.add('error');
    
    const textSpan = syncStatus.querySelector('.sync-text');
    if (textSpan) textSpan.textContent = text;
    
    syncStatus.style.opacity = '1';
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    syncStatus = document.getElementById('syncStatus');
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
    
    // Инициализируем Google Auth
    initGoogleAuth();
    
    // Кнопка входа
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    // Проверяем сохранённую сессию
    const savedUser = localStorage.getItem('egelingo_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loadFromCloud().then(() => {
            showMainApp();
        }).catch(() => {
            loadLocalData();
            showMainApp();
        });
    }
    
    // События
    closeModal.addEventListener('click', closeLessonModal);
    reviveBtn.addEventListener('click', reviveLives);
    continueBtn.addEventListener('click', () => {
        completeModal.classList.remove('active');
    });
    logoutBtn.addEventListener('click', handleLogout);
    
    window.addEventListener('click', (e) => {
        if (e.target === lessonModal) closeLessonModal();
        if (e.target === reviveModal) reviveModal.classList.remove('active');
        if (e.target === completeModal) completeModal.classList.remove('active');
    });
    
    // Подсказка совы
    const owlAvatar = document.getElementById('owlAvatar');
    if (owlAvatar) {
        owlAvatar.addEventListener('click', () => {
            if (lessons[0]?.unlocked && !lessons[0]?.completed) {
                owlTooltip.textContent = 'Нажми на первый урок, чтобы начать!';
            } else if (lessons[0]?.completed) {
                owlTooltip.textContent = 'Отлично! Продолжай в том же духе! 🎯';
            } else {
                owlTooltip.textContent = 'Начни с первого урока!';
            }
            setTimeout(() => {
                owlTooltip.style.display = 'none';
            }, 2000);
        });
    }
    
    // Обработка онлайн/офлайн
    window.addEventListener('online', () => {
        updateSyncStatus('syncing', 'Восстановление связи...');
        saveToCloud();
    });
    
    window.addEventListener('offline', () => {
        updateSyncStatus('error', 'Офлайн-режим');
    });
});

function showMainApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    if (usernameSpan) usernameSpan.textContent = currentUser?.name || 'Ученик';
    if (userAvatar) {
        if (currentUser?.picture) {
            userAvatar.innerHTML = `<img src="${currentUser.picture}" alt="avatar">`;
        } else {
            userAvatar.textContent = '👤';
        }
    }
    
    renderLessons();
    updateUI();
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти? Ваш прогресс сохранён в облаке.')) {
        localStorage.removeItem('egelingo_user');
        localStorage.removeItem(`egelingo_progress_${currentUser?.uid}`);
        currentUser = null;
        if (authScreen) authScreen.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
        
        // Сбрасываем Google сессию
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    }
}

// ==================== ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ ====================
function renderLessons() {
    if (!lessonsPath) return;
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
                    ${lesson.completed ? '✅ Пройдено' : (lesson.unlocked ? `🔓 ${lesson.questionIndices.length} заданий` : '🔒 Заблокировано')}
                </div>
            </div>
        `;
        
        if (lesson.unlocked) {
            lessonDiv.addEventListener('click', () => startLesson(lesson.id));
        }
        
        lessonsPath.appendChild(lessonDiv);
    });
}

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

function checkAnswer(selectedIndex, buttonElement, question) {
    if (waitingForNext) return;
    
    const isCorrect = selectedIndex === question.correct;
    
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

function nextQuestion() {
    const lesson = lessons[currentLesson];
    
    if (currentQuestionIndex + 1 < lesson.questionIndices.length) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        completeLesson();
    }
}

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

function showReviveModal() {
    reviveModal.classList.add('active');
    startReviveTimer();
}

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

function closeLessonModal() {
    lessonModal.classList.remove('active');
    waitingForNext = false;
    explanationDiv.style.display = 'none';
}

function showError(message) {
    owlTooltip.textContent = message;
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 3000);
}

function showLoading(show) {
    // Можно добавить индикатор загрузки
    if (show) {
        if (syncStatus) updateSyncStatus('syncing', 'Загрузка...');
    }
}

// PWA регистрация
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW error:', err));
}
