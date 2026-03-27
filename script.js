// ==================== ЗАГРУЗКА ЗАДАНИЙ ИЗ ФАЙЛА ====================
let subjectsBank = {};

async function loadTasks() {
    try {
        const response = await fetch('/EGE/tasks_math.json');
        subjectsBank = await response.json();
        
        for (let subject in subjectsBank) {
            for (let i = 1; i <= 21; i++) {
                if (!subjectsBank[subject].tasks[i]) {
                    subjectsBank[subject].tasks[i] = [];
                }
                // Минимум 10 заданий для первого задания
                if (i === 1 && subjectsBank[subject].tasks[i].length < 10) {
                    const defaultTasks = [];
                    for (let j = subjectsBank[subject].tasks[i].length + 1; j <= 10; j++) {
                        defaultTasks.push({
                            text: `Задание 1.${j}. Решите и введите ответ.`,
                            answer: `${j}`,
                            solution: `Ответ: ${j}.`
                        });
                    }
                    subjectsBank[subject].tasks[i] = [...subjectsBank[subject].tasks[i], ...defaultTasks];
                }
            }
        }
        
        if (currentUser) {
            renderTasks();
            renderAchievements();
        }
        
        console.log('✅ Задания загружены');
    } catch (error) {
        console.error('Ошибка загрузки заданий:', error);
    }
}

// ==================== ДОСТИЖЕНИЯ ====================
const achievementsList = [
    { id: "first_task", name: "Первое задание", icon: "🎯", condition: (stats) => stats.totalSolved >= 1 },
    { id: "ten_tasks", name: "10 заданий", icon: "📚", condition: (stats) => stats.totalSolved >= 10 },
    { id: "fifty_tasks", name: "50 заданий", icon: "🏅", condition: (stats) => stats.totalSolved >= 50 },
    { id: "hundred_tasks", name: "100 заданий", icon: "🎖️", condition: (stats) => stats.totalSolved >= 100 },
    { id: "perfect_math", name: "Математик", icon: "📐", condition: (stats) => stats.subjectMath >= 20 },
    { id: "streak_5", name: "Серия 5", icon: "🔥", condition: (stats) => stats.streak >= 5 },
    { id: "streak_10", name: "Серия 10", icon: "⚡", condition: (stats) => stats.streak >= 10 }
];

// ==================== ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let currentXP = 0;
let xpToNextLevel = 100;
let userLevel = 1;
let currentSubject = "math";
let completedTasks = {}; // { subject: { taskId: [completedVariants] } }
let currentTaskId = null;
let currentTaskVariants = []; // Все варианты текущего задания
let currentVariantIndex = 0;
let currentVariant = null;
let currentTaskResults = []; // Массив результатов: { variant, userAnswer, isCorrect }
let isWaitingForNext = false;

// Статистика пользователя
let userStats = {
    totalSolved: 0,
    correctAnswers: 0,
    streak: 0,
    subjectMath: 0,
    subjectRussian: 0,
    subjectPhysics: 0,
    subjectInformatics: 0,
    achievements: []
};

// DOM элементы
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn;
let tasksGrid, taskCard, closeTaskBtn, taskTitle, taskText, taskAnswer, checkBtn, nextTaskBtn, showMistakesBtn;
let taskFeedback, taskSolution, solutionText, levelBadge, xpFill, xpText, owlTooltip;
let statsBar, totalTasksSpan, correctPercentSpan, streakSpan;
let subjectTitle, achievementsGrid;

// ==================== СИСТЕМА УРОВНЕЙ ====================
function updateLevel() {
    let newLevel = 1;
    let neededXP = 100;
    let tempXP = currentXP;
    
    while (tempXP >= neededXP && newLevel < 100) {
        tempXP -= neededXP;
        newLevel++;
        neededXP = Math.floor(neededXP * 1.2);
    }
    
    userLevel = newLevel;
    xpToNextLevel = neededXP;
    currentXP = tempXP;
    
    if (levelBadge) levelBadge.textContent = `📊 Уровень ${userLevel}`;
    if (xpFill) {
        const percent = (currentXP / xpToNextLevel) * 100;
        xpFill.style.width = `${Math.min(percent, 100)}%`;
    }
    if (xpText) xpText.textContent = `${currentXP} / ${xpToNextLevel} XP`;
}

function addXP(amount) {
    currentXP += amount;
    updateLevel();
    saveProgress();
}

// ==================== СТАТИСТИКА ====================
function updateStats() {
    if (totalTasksSpan) totalTasksSpan.textContent = userStats.totalSolved;
    if (correctPercentSpan) {
        const percent = userStats.totalSolved > 0 
            ? Math.round((userStats.correctAnswers / userStats.totalSolved) * 100) 
            : 0;
        correctPercentSpan.textContent = `${percent}%`;
    }
    if (streakSpan) streakSpan.textContent = userStats.streak;
}

function recordAnswer(isCorrect) {
    if (isCorrect) {
        userStats.correctAnswers++;
        userStats.streak++;
    } else {
        userStats.streak = 0;
    }
    userStats.totalSolved++;
    
    if (currentSubject === "math") userStats.subjectMath++;
    updateStats();
    checkAchievements();
    saveProgress();
}

// ==================== ДОСТИЖЕНИЯ ====================
function checkAchievements() {
    const stats = {
        totalSolved: userStats.totalSolved,
        streak: userStats.streak,
        subjectMath: userStats.subjectMath,
        subjectRussian: userStats.subjectRussian
    };
    
    let newUnlocked = false;
    
    achievementsList.forEach(achievement => {
        if (!userStats.achievements.includes(achievement.id) && achievement.condition(stats)) {
            userStats.achievements.push(achievement.id);
            newUnlocked = true;
            showTip(`🏆 Новое достижение: ${achievement.name}!`);
        }
    });
    
    if (newUnlocked) renderAchievements();
}

function renderAchievements() {
    if (!achievementsGrid) return;
    achievementsGrid.innerHTML = '';
    
    achievementsList.forEach(achievement => {
        const unlocked = userStats.achievements.includes(achievement.id);
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${unlocked ? 'unlocked' : ''}`;
        badge.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <span class="achievement-name">${achievement.name}</span>
        `;
        achievementsGrid.appendChild(badge);
    });
}

// ==================== ЗАДАНИЯ (НОВАЯ СИСТЕМА) ====================
function startTask(taskId) {
    const variants = subjectsBank[currentSubject]?.tasks[taskId];
    if (!variants || variants.length === 0) {
        showTip('Нет заданий для этого номера');
        return;
    }
    
    currentTaskId = taskId;
    currentTaskVariants = [...variants];
    currentTaskResults = [];
    currentVariantIndex = 0;
    
    // Перемешиваем варианты
    for (let i = currentTaskVariants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentTaskVariants[i], currentTaskVariants[j]] = [currentTaskVariants[j], currentTaskVariants[i]];
    }
    
    loadNextVariant();
    
    taskTitle.textContent = `${subjectsBank[currentSubject].name} - Задание ${taskId} (${currentTaskVariants.length} примеров)`;
    taskCard.style.display = 'block';
    taskCard.scrollIntoView({ behavior: 'smooth' });
    
    // Прячем кнопку "Показать ошибки" если она была
    if (showMistakesBtn) showMistakesBtn.style.display = 'none';
    if (nextTaskBtn) nextTaskBtn.style.display = 'none';
}

function loadNextVariant() {
    if (currentVariantIndex >= currentTaskVariants.length) {
        finishTask();
        return;
    }
    
    currentVariant = currentTaskVariants[currentVariantIndex];
    
    taskText.textContent = currentVariant.text;
    taskAnswer.value = '';
    taskFeedback.className = 'task-feedback';
    taskFeedback.style.display = 'none';
    taskFeedback.innerHTML = '';
    taskSolution.style.display = 'none';
    checkBtn.disabled = false;
    checkBtn.textContent = 'Проверить';
    isWaitingForNext = false;
    
    // Обновляем прогресс
    const progressSpan = document.getElementById('taskProgress');
    if (progressSpan) {
        progressSpan.textContent = `${currentVariantIndex + 1} / ${currentTaskVariants.length}`;
    }
}

function checkAnswer() {
    if (isWaitingForNext) return;
    if (!currentVariant) return;
    
    const userAnswer = taskAnswer.value.trim();
    const isCorrect = userAnswer === currentVariant.answer;
    
    // Сохраняем результат
    currentTaskResults.push({
        variant: currentVariant,
        userAnswer: userAnswer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        taskFeedback.innerHTML = '✅ Правильно! +10 XP';
        taskFeedback.className = 'task-feedback correct';
        taskFeedback.style.display = 'block';
        
        addXP(10);
        recordAnswer(true);
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
        
        checkBtn.disabled = true;
        isWaitingForNext = true;
        
        setTimeout(() => {
            currentVariantIndex++;
            loadNextVariant();
        }, 1500);
    } else {
        taskFeedback.innerHTML = `❌ Неправильно. Правильный ответ: ${currentVariant.answer}`;
        taskFeedback.className = 'task-feedback wrong';
        taskFeedback.style.display = 'block';
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
        
        recordAnswer(false);
        
        // Не переходим к следующему, даём возможность попробовать снова?
        // По вашему запросу: при неправильном ответе можно продолжить
        // Но задание не засчитывается. Переходим к следующему по кнопке
        
        checkBtn.disabled = true;
        checkBtn.textContent = 'Следующий →';
        isWaitingForNext = true;
        
        // Ждём нажатия кнопки "Следующий"
        const originalHandler = checkBtn.onclick;
        checkBtn.onclick = () => {
            currentVariantIndex++;
            loadNextVariant();
            checkBtn.onclick = originalHandler;
            checkBtn.textContent = 'Проверить';
            checkBtn.disabled = false;
        };
    }
    
    saveProgress();
}

function finishTask() {
    // Подсчитываем ошибки
    const mistakes = currentTaskResults.filter(r => !r.isCorrect);
    const correctCount = currentTaskResults.filter(r => r.isCorrect).length;
    
    taskFeedback.innerHTML = `🎉 Задание завершено! Правильных: ${correctCount} из ${currentTaskVariants.length}`;
    taskFeedback.className = 'task-feedback correct';
    taskFeedback.style.display = 'block';
    
    if (mistakes.length > 0) {
        taskFeedback.innerHTML += `<br>❌ Ошибок: ${mistakes.length}`;
        
        // Создаём кнопку показа ошибок
        if (!showMistakesBtn) {
            showMistakesBtn = document.createElement('button');
            showMistakesBtn.className = 'check-btn';
            showMistakesBtn.style.marginTop = '15px';
            showMistakesBtn.style.background = '#f59e0b';
            taskCard.appendChild(showMistakesBtn);
        }
        showMistakesBtn.textContent = '📋 Показать ошибки';
        showMistakesBtn.style.display = 'block';
        showMistakesBtn.onclick = () => showMistakes(mistakes);
    }
    
    // Кнопка для следующего задания
    if (!nextTaskBtn) {
        nextTaskBtn = document.createElement('button');
        nextTaskBtn.className = 'check-btn';
        nextTaskBtn.style.marginTop = '15px';
        nextTaskBtn.style.marginLeft = '10px';
        taskCard.appendChild(nextTaskBtn);
    }
    nextTaskBtn.textContent = '🏠 Выбрать другое задание';
    nextTaskBtn.style.display = 'inline-block';
    nextTaskBtn.onclick = () => {
        closeTask();
    };
    
    checkBtn.disabled = true;
}

function showMistakes(mistakes) {
    // Создаём модальное окно с ошибками
    const modal = document.createElement('div');
    modal.className = 'mistakes-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        padding: 20px;
    `;
    
    content.innerHTML = '<h3 style="margin-bottom: 15px;">❌ Задания с ошибками</h3>';
    
    mistakes.forEach((mistake, idx) => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 12px;
            margin-bottom: 10px;
            background: #f7fafc;
            border-radius: 15px;
            border-left: 4px solid #f56565;
        `;
        item.innerHTML = `
            <p style="font-weight: 600;">${mistake.variant.text}</p>
            <p style="color: #c53030;">Ваш ответ: ${mistake.userAnswer}</p>
            <p style="color: #276749;">Правильный ответ: ${mistake.variant.answer}</p>
            <button class="show-solution-btn" data-solution="${mistake.variant.solution.replace(/"/g, '&quot;')}">📖 Показать решение</button>
        `;
        
        const solutionBtn = item.querySelector('.show-solution-btn');
        solutionBtn.style.cssText = `
            margin-top: 8px;
            padding: 6px 12px;
            background: #4a6cf7;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
        `;
        solutionBtn.onclick = () => {
            alert(`Решение:\n${mistake.variant.solution}`);
        };
        
        content.appendChild(item);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        width: 100%;
    `;
    closeBtn.onclick = () => modal.remove();
    content.appendChild(closeBtn);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function closeTask() {
    taskCard.style.display = 'none';
    currentTaskId = null;
    currentTaskVariants = [];
    currentTaskResults = [];
    currentVariant = null;
    
    if (showMistakesBtn) showMistakesBtn.style.display = 'none';
    if (nextTaskBtn) nextTaskBtn.style.display = 'none';
}

function renderTasks() {
    if (!tasksGrid || !subjectsBank[currentSubject]) return;
    tasksGrid.innerHTML = '';
    const tasks = subjectsBank[currentSubject].tasks;
    
    for (let i = 1; i <= 21; i++) {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.textContent = i;
        btn.dataset.task = i;
        
        const completedCount = completedTasks[currentSubject]?.[i]?.length || 0;
        const totalCount = tasks[i]?.length || 0;
        if (completedCount >= totalCount && totalCount > 0) {
            btn.classList.add('completed');
            btn.title = 'Все варианты пройдены!';
        }
        btn.addEventListener('click', () => startTask(i));
        tasksGrid.appendChild(btn);
    }
    
    subjectTitle.textContent = `📌 ${subjectsBank[currentSubject].name} - Выбери задание`;
}

function changeSubject(subject) {
    if (!subjectsBank[subject]) return;
    currentSubject = subject;
    renderTasks();
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        if (btn.dataset.subject === subject) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    closeTask();
    saveProgress();
}

function showTip(msg) {
    if (owlTooltip) {
        owlTooltip.textContent = msg;
        owlTooltip.style.display = 'block';
        setTimeout(() => { owlTooltip.style.display = 'none'; }, 2000);
    }
}

// ==================== АВТОРИЗАЦИЯ ====================
function loadUsers() {
    const saved = localStorage.getItem('egelingo_users');
    return saved ? JSON.parse(saved) : {};
}

function saveUsers(users) {
    localStorage.setItem('egelingo_users', JSON.stringify(users));
}

function register(username, password) {
    username = username.trim();
    const users = loadUsers();
    
    if (users[username]) {
        showAuthError('Пользователь уже существует');
        return false;
    }
    if (password.length < 4) {
        showAuthError('Пароль минимум 4 символа');
        return false;
    }
    
    users[username] = {
        password: btoa(password),
        name: username,
        createdAt: new Date().toISOString()
    };
    saveUsers(users);
    return true;
}

function login(username, password) {
    username = username.trim();
    const users = loadUsers();
    const user = users[username];
    
    if (!user || user.password !== btoa(password)) {
        showAuthError('Неверное имя или пароль');
        return false;
    }
    
    currentUser = { uid: username, name: username };
    localStorage.setItem('egelingo_user', JSON.stringify(currentUser));
    return true;
}

function loadProgress() {
    const saved = localStorage.getItem(`egelingo_progress_${currentUser.uid}`);
    if (saved) {
        const data = JSON.parse(saved);
        currentXP = data.xp || 0;
        completedTasks = data.completedTasks || {};
        userStats = data.userStats || {
            totalSolved: 0, correctAnswers: 0, streak: 0,
            subjectMath: 0, subjectRussian: 0, subjectPhysics: 0, subjectInformatics: 0,
            achievements: []
        };
        currentSubject = data.currentSubject || "math";
        updateLevel();
        updateStats();
    } else {
        currentXP = 0;
        completedTasks = {};
        userStats = {
            totalSolved: 0, correctAnswers: 0, streak: 0,
            subjectMath: 0, subjectRussian: 0, subjectPhysics: 0, subjectInformatics: 0,
            achievements: []
        };
        updateLevel();
        updateStats();
    }
    renderTasks();
    renderAchievements();
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        if (btn.dataset.subject === currentSubject) {
            btn.classList.add('active');
        }
    });
}

function saveProgress() {
    if (!currentUser) return;
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify({
        xp: currentXP,
        completedTasks: completedTasks,
        userStats: userStats,
        currentSubject: currentSubject
    }));
}

function showMainApp() {
    authScreen.style.display = 'none';
    mainApp.style.display = 'block';
    usernameSpan.textContent = currentUser.name;
    statsBar.style.display = 'flex';
    loadProgress();
}

function handleLogout() {
    if (confirm('Выйти из аккаунта?')) {
        localStorage.removeItem('egelingo_user');
        currentUser = null;
        authScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        statsBar.style.display = 'none';
    }
}

function showAuthError(msg) {
    const err = document.createElement('div');
    err.className = 'auth-error';
    err.textContent = msg;
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    if (activeForm) activeForm.appendChild(err);
    setTimeout(() => err.remove(), 3000);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 EgeLingo v4.0 - Новая система заданий');
    
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    tasksGrid = document.getElementById('tasksGrid');
    taskCard = document.getElementById('taskCard');
    closeTaskBtn = document.getElementById('closeTaskBtn');
    taskTitle = document.getElementById('taskTitle');
    taskText = document.getElementById('taskText');
    taskAnswer = document.getElementById('taskAnswer');
    checkBtn = document.getElementById('checkBtn');
    taskFeedback = document.getElementById('taskFeedback');
    taskSolution = document.getElementById('taskSolution');
    solutionText = document.getElementById('solutionText');
    levelBadge = document.getElementById('levelBadge');
    xpFill = document.getElementById('xpFill');
    xpText = document.getElementById('xpText');
    owlTooltip = document.getElementById('owlTooltip');
    statsBar = document.getElementById('statsBar');
    totalTasksSpan = document.getElementById('totalTasks');
    correctPercentSpan = document.getElementById('correctPercent');
    streakSpan = document.getElementById('streak');
    subjectTitle = document.getElementById('subjectTitle');
    achievementsGrid = document.getElementById('achievementsGrid');
    
    // Добавляем индикатор прогресса в задание
    const progressSpan = document.createElement('div');
    progressSpan.id = 'taskProgress';
    progressSpan.style.cssText = 'text-align: center; margin-bottom: 15px; font-weight: 600; color: #4a6cf7;';
    taskCard.insertBefore(progressSpan, taskText);
    
    if (closeTaskBtn) closeTaskBtn.addEventListener('click', closeTask);
    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (taskAnswer) taskAnswer.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', () => changeSubject(btn.dataset.subject));
    });
    
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.tab === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (login(loginUsername.value, loginPassword.value)) showMainApp();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (register(registerUsername.value, registerPassword.value)) {
                login(registerUsername.value, registerPassword.value);
                showMainApp();
            }
        });
    }
    
    const saved = localStorage.getItem('egelingo_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainApp();
    }
    
    const owlAvatar = document.getElementById('owlAvatar');
    if (owlAvatar) {
        owlAvatar.addEventListener('click', () => {
            showTip('Выбери задание 1–21 и реши все примеры!');
        });
    }
    
    await loadTasks();
    
    console.log('✅ Приложение готово!');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/EGE/sw.js').catch(err => console.log('SW not available'));
}
