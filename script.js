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
let completedTasks = {};
let currentTaskId = null;
let currentTaskVariants = [];
let currentVariantIndex = 0;
let currentVariant = null;
let currentTaskResults = [];
let isAnswered = false;

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
let tasksGrid, taskCard, closeTaskBtn, taskTitle, taskText, taskAnswer, checkBtn, nextBtn;
let taskFeedback, taskSolution, solutionText, levelBadge, xpFill, xpText, owlTooltip;
let statsBar, totalTasksSpan, correctPercentSpan, streakSpan;
let subjectTitle, achievementsGrid, progressSpan;

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

// ==================== ЗАДАНИЯ ====================
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
    isAnswered = false;
    
    // Перемешиваем
    for (let i = currentTaskVariants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentTaskVariants[i], currentTaskVariants[j]] = [currentTaskVariants[j], currentTaskVariants[i]];
    }
    
    // Показываем кнопки
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) checkBtn.style.display = 'flex';
    if (checkBtn) checkBtn.disabled = false;
    
    loadNextVariant();
    
    taskTitle.textContent = `${subjectsBank[currentSubject].name} - Задание ${taskId}`;
    taskCard.style.display = 'block';
    taskCard.scrollIntoView({ behavior: 'smooth' });
    
    // Убираем кнопку "Показать ошибки" если была
    const oldMistakesBtn = document.getElementById('mistakesBtn');
    if (oldMistakesBtn) oldMistakesBtn.remove();
}

function loadNextVariant() {
    if (currentVariantIndex >= currentTaskVariants.length) {
        finishTask();
        return;
    }
    
    currentVariant = currentTaskVariants[currentVariantIndex];
    isAnswered = false;
    
    taskText.textContent = currentVariant.text;
    taskAnswer.value = '';
    taskAnswer.disabled = false;
    taskFeedback.className = 'task-feedback';
    taskFeedback.style.display = 'none';
    taskFeedback.innerHTML = '';
    taskSolution.style.display = 'none';
    
    if (checkBtn) checkBtn.disabled = false;
    if (nextBtn) nextBtn.style.display = 'none';
    if (progressSpan) progressSpan.textContent = `${currentVariantIndex + 1} / ${currentTaskVariants.length}`;
}

function checkAnswer() {
    if (isAnswered) return;
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
        
        isAnswered = true;
        taskAnswer.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        
        // Показываем кнопку "Далее"
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.textContent = '➡️ Далее';
        }
    } else {
        taskFeedback.innerHTML = `❌ Неправильно. Правильный ответ: ${currentVariant.answer}`;
        taskFeedback.className = 'task-feedback wrong';
        taskFeedback.style.display = 'block';
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
        
        recordAnswer(false);
        
        isAnswered = true;
        taskAnswer.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        
        // Показываем кнопку "Далее" (не засчитывая задание)
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.textContent = '➡️ Далее (ошибка)';
        }
    }
    
    saveProgress();
}

function nextVariant() {
    if (!isAnswered) return;
    
    currentVariantIndex++;
    loadNextVariant();
}

function finishTask() {
    const mistakes = currentTaskResults.filter(r => !r.isCorrect);
    const correctCount = currentTaskResults.filter(r => r.isCorrect).length;
    
    taskFeedback.innerHTML = `🎉 Задание завершено! Правильных: ${correctCount} из ${currentTaskVariants.length}`;
    taskFeedback.className = 'task-feedback correct';
    taskFeedback.style.display = 'block';
    
    if (checkBtn) checkBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    
    if (mistakes.length > 0) {
        taskFeedback.innerHTML += `<br>❌ Ошибок: ${mistakes.length}`;
        
        const mistakesBtn = document.createElement('button');
        mistakesBtn.id = 'mistakesBtn';
        mistakesBtn.textContent = '📋 Показать ошибки с решениями';
        mistakesBtn.className = 'check-btn';
        mistakesBtn.style.marginTop = '15px';
        mistakesBtn.style.background = '#f59e0b';
        mistakesBtn.onclick = () => showMistakes(mistakes);
        taskCard.appendChild(mistakesBtn);
    }
    
    // Кнопка выбора другого задания
    const chooseBtn = document.createElement('button');
    chooseBtn.textContent = '🏠 Выбрать другое задание';
    chooseBtn.className = 'check-btn';
    chooseBtn.style.marginTop = '15px';
    chooseBtn.style.marginLeft = '10px';
    chooseBtn.style.background = '#4a6cf7';
    chooseBtn.onclick = () => closeTask();
    taskCard.appendChild(chooseBtn);
    
    taskAnswer.disabled = true;
}

function showMistakes(mistakes) {
    const modal = document.createElement('div');
    modal.className = 'mistakes-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
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
        max-width: 550px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        padding: 25px;
    `;
    
    content.innerHTML = '<h2 style="margin-bottom: 20px; color: #c53030;">❌ Задания с ошибками</h2>';
    
    mistakes.forEach((mistake, idx) => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 15px;
            margin-bottom: 15px;
            background: #f7fafc;
            border-radius: 20px;
            border-left: 4px solid #f56565;
        `;
        item.innerHTML = `
            <p style="font-weight: 700; margin-bottom: 10px;">${mistake.variant.text}</p>
            <p style="color: #c53030; margin-bottom: 5px;">❌ Ваш ответ: ${mistake.userAnswer}</p>
            <p style="color: #276749; margin-bottom: 10px;">✅ Правильный ответ: ${mistake.variant.answer}</p>
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #4a6cf7; font-weight: 600;">📖 Показать решение</summary>
                <p style="margin-top: 10px; padding: 10px; background: #ebf4ff; border-radius: 12px;">${mistake.variant.solution}</p>
            </details>
        `;
        content.appendChild(item);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 24px;
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
        font-weight: 600;
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
    isAnswered = false;
    
    if (checkBtn) checkBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'none';
    if (progressSpan) progressSpan.textContent = '';
    
    const mistakesBtn = document.getElementById('mistakesBtn');
    if (mistakesBtn) mistakesBtn.remove();
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
    console.log('📱 EgeLingo v4.1 - Отдельная кнопка "Далее"');
    
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
    
    // Создаём кнопку "Далее"
    const buttonsDiv = document.querySelector('.task-input-area');
    if (buttonsDiv && !nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.textContent = '➡️ Далее';
        nextBtn.className = 'check-btn';
        nextBtn.style.background = '#48bb78';
        nextBtn.style.display = 'none';
        nextBtn.onclick = () => nextVariant();
        buttonsDiv.appendChild(nextBtn);
    }
    
    // Создаём индикатор прогресса
    progressSpan = document.createElement('div');
    progressSpan.id = 'taskProgress';
    progressSpan.style.cssText = 'text-align: center; margin-bottom: 15px; font-weight: 600; color: #4a6cf7;';
    const questionCard = document.querySelector('.question-card');
    if (questionCard) {
        questionCard.insertBefore(progressSpan, taskText);
    }
    
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
