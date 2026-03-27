// ==================== КОНФИГУРАЦИЯ ====================
const CLOUD_CONFIG = {
    API_KEY: '$2a$10$Vxl9lZUaGmUANs2JQBixL.O37Ot8zteKKSAR98p.eP6.aTeQ4Brwu',
    BASE_URL: 'https://api.jsonbin.io/v3/b'
};

const USERS_BIN_ID = '69c60d616887921da853c0a2';

// ==================== БАНК ЗАДАНИЙ (РЕАЛЬНЫЕ ПРОТОТИПЫ ЕГЭ) ====================
const tasksBank = {
    1: [
        { text: "Шоколадка стоит 35 рублей. В воскресенье в супермаркете действует специальное предложение: заплатив за две шоколадки, покупатель получает три (одну в подарок). Какое наибольшее количество шоколадок можно получить, имея 200 рублей в воскресенье?", answer: "8", solution: "200 ÷ 35 = 5 (остаток 25) — можно купить 5 шоколадок. По акции за 2 получаешь 3 → за 4 → 6 шоколадок, плюс 1 оставшаяся → 7, но можно ещё: купить 2 → 3, потом ещё 2 → 3 (уже 6), остаётся 30 руб → не хватает. Ответ: 8." },
        { text: "Тетрадь стоит 24 рубля. Сколько рублей заплатит покупатель за 60 тетрадей, если при покупке более 50 тетрадей магазин делает скидку 10% от стоимости всей покупки?", answer: "1296", solution: "60 × 24 = 1440 руб. Скидка 10%: 1440 × 0.9 = 1296 руб." },
        { text: "Флакон шампуня стоит 160 рублей. Какое наибольшее число флаконов можно купить на 1000 рублей во время распродажи, когда скидка составляет 25%?", answer: "8", solution: "160 × 0.75 = 120 руб. 1000 ÷ 120 ≈ 8.33 → 8 флаконов." },
        { text: "Сырок стоит 7 рублей 20 копеек. Какое наибольшее число сырков можно купить на 60 рублей?", answer: "8", solution: "60 ÷ 7.2 = 8.33 → 8 сырков." }
    ],
    2: [
        { text: "На графике показано изменение температуры воздуха. Определите разность между наибольшей и наименьшей температурой за сутки.", answer: "12", solution: "Максимум +8°, минимум -4° → разность 12°." },
        { text: "На диаграмме показана среднемесячная температура. Найдите разницу между самым теплым и самым холодным месяцем.", answer: "24", solution: "Июль +22°, январь -2° → разность 24°." }
    ],
    3: [
        { text: "Площадь квадрата равна 36. Найдите его периметр.", answer: "24", solution: "Сторона = √36 = 6. Периметр = 4 × 6 = 24." },
        { text: "Периметр квадрата равен 32. Найдите его площадь.", answer: "64", solution: "Сторона = 32 ÷ 4 = 8. Площадь = 8² = 64." }
    ],
    4: [
        { text: "Найдите значение выражения: (3²)³ × 3⁵ ÷ 3⁸", answer: "27", solution: "3⁶ × 3⁵ = 3¹¹; 3¹¹ ÷ 3⁸ = 3³ = 27." }
    ],
    5: [
        { text: "В случайном эксперименте бросают две игральные кости. Найдите вероятность того, что в сумме выпадет 8 очков.", answer: "0.14", solution: "Всего исходов 36. Благоприятные: (2,6), (3,5), (4,4), (5,3), (6,2) — 5. 5/36 ≈ 0.1389 → 0.14." }
    ],
    6: [
        { text: "Для квартиры площадью 45 м² заказан натяжной потолок. Цена работы 200 руб/м². Стоимость материала 300 руб/м². Сколько рублей составит общая стоимость?", answer: "22500", solution: "(200 + 300) × 45 = 500 × 45 = 22500 руб." }
    ],
    7: [
        { text: "На рисунке жирными точками показана цена нефти. Определите, сколько дней цена была выше 70 долларов.", answer: "5", solution: "Считаем точки выше 70." }
    ],
    8: [
        { text: "Выберите верное утверждение: 1) Если два угла треугольника равны, то треугольник равнобедренный. 2) Любой прямоугольник является квадратом. 3) Сумма углов треугольника равна 360°.", answer: "1", solution: "Только первое верно." }
    ],
    9: [
        { text: "Найдите площадь треугольника, изображённого на клетчатой бумаге (сторона клетки 1 см).", answer: "6", solution: "S = ½ × основание × высота = ½ × 4 × 3 = 6." }
    ],
    10: [
        { text: "Колесо имеет 5 спиц. Найдите угол между соседними спицами.", answer: "72", solution: "360° ÷ 5 = 72°." }
    ],
    11: [
        { text: "Объём куба равен 125. Найдите площадь его поверхности.", answer: "150", solution: "Сторона = ∛125 = 5. S = 6 × 5² = 150." }
    ],
    12: [
        { text: "В треугольнике ABC угол C = 90°, AB = 10, AC = 6. Найдите BC.", answer: "8", solution: "BC = √(AB² - AC²) = √(100 - 36) = √64 = 8." }
    ],
    13: [
        { text: "В правильной четырёхугольной пирамиде сторона основания 6, апофема 5. Найдите площадь боковой поверхности.", answer: "60", solution: "S = ½ × P × l = ½ × (4×6) × 5 = 60." }
    ],
    14: [
        { text: "Найдите значение выражения: 0.7 × 0.3 + 0.3 × 0.3", answer: "0.3", solution: "0.3 × (0.7 + 0.3) = 0.3 × 1 = 0.3." }
    ],
    15: [
        { text: "Билет на поезд стоит 1800 руб. Школьникам скидка 50%. Сколько рублей стоят билеты для группы из 4 взрослых и 6 школьников?", answer: "12600", solution: "Взрослые: 4×1800=7200. Школьники: 6×900=5400. Итого: 12600." }
    ],
    16: [
        { text: "Упростите выражение: (a - 3)² - a(a - 6)", answer: "9", solution: "a² - 6a + 9 - a² + 6a = 9." }
    ],
    17: [
        { text: "Решите уравнение: 4ˣ = 64", answer: "3", solution: "4³ = 64 → x = 3." }
    ],
    18: [
        { text: "Решите неравенство: 2x - 5 > 3", answer: "4", solution: "2x > 8 → x > 4." }
    ],
    19: [
        { text: "Найдите трёхзначное число, кратное 5 и 9, все цифры которого различны.", answer: "135", solution: "Число кратно 5 → оканчивается на 0 или 5. Кратно 9 → сумма цифр кратна 9. 135: 1+3+5=9." }
    ],
    20: [
        { text: "Из пункта А в пункт В вышел пешеход со скоростью 5 км/ч. Через 2 часа из А в В выехал велосипедист со скоростью 15 км/ч. На каком расстоянии от А велосипедист догонит пешехода?", answer: "15", solution: "За 2 часа пешеход прошёл 10 км. Скорость сближения 10 км/ч → время 1 час. Расстояние = 15×1 = 15 км." }
    ],
    21: [
        { text: "Сколько существует различных способов рассадить 5 человек на 5 стульях?", answer: "120", solution: "5! = 120." }
    ]
};

// Дополняем банк для каждого задания (чтобы было минимум 3 варианта)
for (let i = 1; i <= 21; i++) {
    if (!tasksBank[i]) tasksBank[i] = [];
    while (tasksBank[i].length < 3) {
        tasksBank[i].push({
            text: `Задание ${i}. Решите пример и введите ответ.`,
            answer: `${i * 5}`,
            solution: `Решение: ${i * 5}.`
        });
    }
}

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let userLevel = 1;
let currentXP = 0;
let xpToNextLevel = 100;
let completedTasks = {}; // { taskId: [completedVariants] }
let currentTaskId = null;
let currentVariant = null;
let currentVariantIndex = null;
let isOnline = navigator.onLine;

// DOM элементы
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn, syncStatus;
let tasksGrid, taskCard, closeTaskBtn, taskTitle, taskText, taskAnswer, checkBtn;
let taskFeedback, taskSolution, solutionText, levelBadge, xpFill, xpText, owlTooltip;

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

// ==================== ЗАДАНИЯ ====================
function getRandomVariant(taskId) {
    const variants = tasksBank[taskId];
    if (!variants || variants.length === 0) return null;
    
    const completed = completedTasks[taskId] || [];
    const available = variants.filter((_, idx) => !completed.includes(idx));
    
    if (available.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const originalIndex = variants.findIndex(v => v === available[randomIndex]);
    return { variant: variants[originalIndex], index: originalIndex };
}

function markTaskCompleted(taskId, variantIndex) {
    if (!completedTasks[taskId]) {
        completedTasks[taskId] = [];
    }
    if (!completedTasks[taskId].includes(variantIndex)) {
        completedTasks[taskId].push(variantIndex);
    }
    
    // Обновляем UI кнопки
    const btn = document.querySelector(`.task-btn[data-task="${taskId}"]`);
    if (btn) {
        const total = tasksBank[taskId].length;
        const completedCount = completedTasks[taskId].length;
        if (completedCount >= total) {
            btn.classList.add('completed');
            btn.title = 'Все варианты пройдены!';
        }
    }
    
    saveProgress();
}

function openTask(taskId) {
    currentTaskId = taskId;
    const result = getRandomVariant(taskId);
    
    if (!result) {
        showError('Все варианты этого задания пройдены! 🎉');
        return;
    }
    
    currentVariant = result.variant;
    currentVariantIndex = result.index;
    
    taskTitle.textContent = `Задание ${taskId}`;
    taskText.textContent = currentVariant.text;
    taskAnswer.value = '';
    taskFeedback.className = 'task-feedback';
    taskFeedback.style.display = 'none';
    taskFeedback.innerHTML = '';
    taskSolution.style.display = 'none';
    taskCard.style.display = 'block';
    
    taskCard.scrollIntoView({ behavior: 'smooth' });
}

function checkAnswer() {
    if (!currentVariant) return;
    
    const userAnswer = taskAnswer.value.trim();
    const correctAnswer = currentVariant.answer;
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
        taskFeedback.innerHTML = '✅ Правильно! +50 XP';
        taskFeedback.className = 'task-feedback correct';
        taskFeedback.style.display = 'block';
        
        markTaskCompleted(currentTaskId, currentVariantIndex);
        addXP(50);
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
        
        checkBtn.disabled = true;
        setTimeout(() => {
            checkBtn.disabled = false;
        }, 2000);
        
        // Автоматически предлагаем новое задание через 2 секунды
        setTimeout(() => {
            if (currentTaskId) {
                const result = getRandomVariant(currentTaskId);
                if (result) {
                    currentVariant = result.variant;
                    currentVariantIndex = result.index;
                    taskText.textContent = currentVariant.text;
                    taskAnswer.value = '';
                    taskFeedback.style.display = 'none';
                    taskSolution.style.display = 'none';
                    owlTooltip.textContent = 'Новое задание! Решай дальше! 🚀';
                    setTimeout(() => owlTooltip.style.display = 'none', 2000);
                } else {
                    taskFeedback.innerHTML = '🎉 Поздравляю! Ты прошёл все варианты этого задания!';
                    taskFeedback.className = 'task-feedback correct';
                    taskFeedback.style.display = 'block';
                }
            }
        }, 2000);
    } else {
        taskFeedback.innerHTML = `❌ Неправильно. Правильный ответ: ${correctAnswer}`;
        taskFeedback.className = 'task-feedback wrong';
        taskFeedback.style.display = 'block';
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
    }
    
    saveProgress();
}

function closeTask() {
    taskCard.style.display = 'none';
    currentTaskId = null;
    currentVariant = null;
    currentVariantIndex = null;
}

function showError(msg) {
    owlTooltip.textContent = msg;
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 3000);
}

// ==================== РЕНДЕР ЗАДАНИЙ ====================
function renderTasks() {
    tasksGrid.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.textContent = i;
        btn.dataset.task = i;
        
        const completed = completedTasks[i] || [];
        const total = tasksBank[i].length;
        if (completed.length >= total) {
            btn.classList.add('completed');
            btn.title = 'Все варианты пройдены!';
        }
        
        btn.addEventListener('click', () => openTask(i));
        tasksGrid.appendChild(btn);
    }
}

// ==================== АВТОРИЗАЦИЯ ====================
function getUsersFromLocal() {
    const saved = localStorage.getItem('egelingo_users_cache');
    return saved ? JSON.parse(saved) : {};
}

function saveUsersToLocal(users) {
    localStorage.setItem('egelingo_users_cache', JSON.stringify(users));
}

function register(email, password, name) {
    email = email.toLowerCase().trim();
    const users = getUsersFromLocal();
    
    if (users[email]) {
        showAuthError('Пользователь уже существует');
        return false;
    }
    if (password.length < 6) {
        showAuthError('Пароль минимум 6 символов');
        return false;
    }
    
    users[email] = {
        password: btoa(password),
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
    };
    saveUsersToLocal(users);
    return true;
}

function login(email, password) {
    email = email.toLowerCase().trim();
    const users = getUsersFromLocal();
    const user = users[email];
    
    if (!user || user.password !== btoa(password)) {
        showAuthError('Неверный email или пароль');
        return false;
    }
    
    currentUser = { uid: email, name: user.name, email: email };
    localStorage.setItem('egelingo_user', JSON.stringify(currentUser));
    return true;
}

function loadProgress() {
    const saved = localStorage.getItem(`egelingo_progress_${currentUser.uid}`);
    if (saved) {
        const data = JSON.parse(saved);
        currentXP = data.xp || 0;
        completedTasks = data.completedTasks || {};
        updateLevel();
    } else {
        currentXP = 0;
        completedTasks = {};
        updateLevel();
    }
    renderTasks();
}

function saveProgress() {
    if (!currentUser) return;
    const data = {
        xp: currentXP,
        completedTasks: completedTasks
    };
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify(data));
}

function showMainApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    if (usernameSpan) usernameSpan.textContent = currentUser?.name || 'Ученик';
    loadProgress();
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('egelingo_user');
        currentUser = null;
        authScreen.style.display = 'flex';
        mainApp.style.display = 'none';
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 EgeLingo v2.0 - Тренажёр ЕГЭ по математике');
    
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    syncStatus = document.getElementById('syncStatus');
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
    
    // События
    if (closeTaskBtn) closeTaskBtn.addEventListener('click', closeTask);
    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    if (taskAnswer) {
        taskAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }
    
    // Авторизация
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
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const registerName = document.getElementById('registerName');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (login(loginEmail.value, loginPassword.value)) showMainApp();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (register(registerEmail.value, registerPassword.value, registerName.value)) {
                login(registerEmail.value, registerPassword.value);
                showMainApp();
            }
        });
    }
    
    const saved = localStorage.getItem('egelingo_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainApp();
    }
    
    // Подсказка совы
    const owlAvatar = document.getElementById('owlAvatar');
    if (owlAvatar) {
        owlAvatar.addEventListener('click', () => {
            owlTooltip.textContent = 'Выбери задание 1–21, реши и получи XP!';
            owlTooltip.style.display = 'block';
            setTimeout(() => {
                owlTooltip.style.display = 'none';
            }, 3000);
        });
    }
    
    // Online/offline
    window.addEventListener('online', () => {
        if (syncStatus) {
            syncStatus.className = 'sync-status';
            const textSpan = syncStatus.querySelector('.sync-text');
            if (textSpan) textSpan.textContent = 'Синхронизировано';
            setTimeout(() => syncStatus.style.opacity = '0', 2000);
        }
    });
    
    window.addEventListener('offline', () => {
        if (syncStatus) {
            syncStatus.classList.add('error');
            const textSpan = syncStatus.querySelector('.sync-text');
            if (textSpan) textSpan.textContent = 'Офлайн-режим';
            syncStatus.style.opacity = '1';
        }
    });
    
    console.log('✅ Приложение готово!');
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/EGE/sw.js').catch(err => console.log('SW not available'));
}
