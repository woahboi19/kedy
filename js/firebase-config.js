// ===================================
// FIREBASE CONFIGURATION & AUTH
// ===================================

// Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyAmn7-b75TrEevLWS-RjhcjkiEU92hJTAY",
    authDomain: "kedy-student-analyzer.firebaseapp.com",
    databaseURL: "https://kedy-student-analyzer-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "kedy-student-analyzer",
    storageBucket: "kedy-student-analyzer.firebasestorage.app",
    messagingSenderId: "77241931760",
    appId: "1:77241931760:web:96ea9afad105b98c282f35",
    measurementId: "G-GKK37W0573"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Database references
const examsRef = database.ref('exams');
const goalsRef = database.ref('goals');
const usersRef = database.ref('users');

// Current user state
let currentUser = null;
let currentUserNickname = null;
let isFirebaseReady = false;
let dataLoadedFromFirebase = false;

// ===================================
// AUTHENTICATION FUNCTIONS
// ===================================

// Sign in with email and password
async function loginWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showNotification('✅ Giriş başarılı!', 'success');
        closeAuthModal();
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Giriş başarısız!';
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
                break;
            case 'auth/wrong-password':
                message = 'Şifre hatalı.';
                break;
            case 'auth/invalid-email':
                message = 'Geçersiz e-posta adresi.';
                break;
            case 'auth/too-many-requests':
                message = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
                break;
        }
        showNotification('❌ ' + message, 'error');
        throw error;
    }
}

// Register new user
async function registerWithEmail(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        showNotification('✅ Kayıt başarılı!', 'success');
        closeAuthModal();
        return userCredential.user;
    } catch (error) {
        console.error('Register error:', error);
        let message = 'Kayıt başarısız!';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'Bu e-posta zaten kullanılıyor.';
                break;
            case 'auth/weak-password':
                message = 'Şifre en az 6 karakter olmalı.';
                break;
            case 'auth/invalid-email':
                message = 'Geçersiz e-posta adresi.';
                break;
        }
        showNotification('❌ ' + message, 'error');
        throw error;
    }
}

// Sign out
async function logout() {
    try {
        await auth.signOut();
        showNotification('👋 Çıkış yapıldı.', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('❌ Çıkış yapılırken hata oluştu.', 'error');
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user email
function getCurrentUserEmail() {
    return currentUser ? currentUser.email : null;
}

// Get current user nickname
function getCurrentUserNickname() {
    return currentUserNickname || (currentUser ? currentUser.email : null);
}

// Get current user ID
function getCurrentUserId() {
    return currentUser ? currentUser.uid : null;
}

// Load user nickname from Firebase
async function loadUserNickname(uid) {
    try {
        const snapshot = await usersRef.child(uid).once('value');
        const userData = snapshot.val();
        if (userData && userData.nickname) {
            currentUserNickname = userData.nickname;
        } else {
            currentUserNickname = null;
        }
        return currentUserNickname;
    } catch (error) {
        console.error('Error loading nickname:', error);
        return null;
    }
}

// ===================================
// AUTH STATE OBSERVER
// ===================================

auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    
    if (user) {
        // Load user's nickname
        await loadUserNickname(user.uid);
    } else {
        currentUserNickname = null;
    }
    
    updateAuthUI();
    
    if (!isFirebaseReady) {
        isFirebaseReady = true;
        // Load data from Firebase once auth is ready
        loadDataFromFirebase();
    }
});

// Update UI based on auth state
function updateAuthUI() {
    const loginBtn = document.getElementById('auth-login-btn');
    const logoutBtn = document.getElementById('auth-logout-btn');
    const userNickname = document.getElementById('auth-user-nickname');
    const authStatus = document.getElementById('auth-status');
    
    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userNickname) {
            userNickname.textContent = currentUserNickname || currentUser.email;
            userNickname.style.display = 'inline';
            userNickname.title = currentUser.email;
        }
        if (authStatus) {
            authStatus.className = 'auth-status auth-status-logged-in';
            authStatus.title = 'Düzenleme yapabilirsiniz';
        }
        
        // Enable write actions
        enableWriteActions(true);
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userNickname) {
            userNickname.textContent = '';
            userNickname.style.display = 'none';
        }
        if (authStatus) {
            authStatus.className = 'auth-status auth-status-logged-out';
            authStatus.title = 'Sadece görüntüleme - Düzenleme için giriş yapın';
        }
        
        // Disable write actions
        enableWriteActions(false);
    }
}

// Enable/disable write action buttons
function enableWriteActions(enabled) {
    const writeButtons = document.querySelectorAll('.write-action');
    writeButtons.forEach(btn => {
        btn.disabled = !enabled;
        btn.classList.toggle('disabled', !enabled);
    });
    
    // Show/hide form based on auth
    const examForm = document.getElementById('exam-form');
    if (examForm) {
        const formCard = examForm.closest('.card');
        if (formCard) {
            const authOverlay = formCard.querySelector('.auth-overlay');
            if (!enabled && !authOverlay) {
                // Add overlay
                const overlay = document.createElement('div');
                overlay.className = 'auth-overlay';
                overlay.innerHTML = `
                    <div class="auth-overlay-content">
                        <span>🔒</span>
                        <p>Düzenleme yapmak için giriş yapın</p>
                        <button onclick="openAuthModal()" class="primary-btn">Giriş Yap</button>
                    </div>
                `;
                formCard.style.position = 'relative';
                formCard.appendChild(overlay);
            } else if (enabled && authOverlay) {
                authOverlay.remove();
            }
        }
    }
}

// ===================================
// FIREBASE DATA OPERATIONS
// ===================================

// Load data from Firebase
function loadDataFromFirebase() {
    // Listen for exams changes
    examsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            exams = Object.values(data);
        } else {
            exams = [];
        }
        
        // Also save to localStorage as backup
        localStorage.setItem('studentExams', JSON.stringify(exams));
        
        // Re-render UI if app is initialized
        if (typeof renderRecentEntries === 'function') {
            renderRecentEntries();
            populateStudentDropdown();
            updateQuickStats();
            updateDashboard();
        }
        
        dataLoadedFromFirebase = true;
    }, (error) => {
        console.error('Firebase read error:', error);
        // Fall back to localStorage
        exams = JSON.parse(localStorage.getItem('studentExams') || '[]');
    });
    
    // Listen for goals changes
    goalsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            studentGoals = data;
        } else {
            studentGoals = {};
        }
        
        // Also save to localStorage as backup
        localStorage.setItem('studentGoals', JSON.stringify(studentGoals));
        
        // Re-render goals if function exists
        if (typeof renderGoals === 'function') {
            renderGoals();
        }
    }, (error) => {
        console.error('Firebase goals read error:', error);
        // Fall back to localStorage
        studentGoals = JSON.parse(localStorage.getItem('studentGoals') || '{}');
    });
}

// Save exams to Firebase
async function saveDataToFirebase() {
    if (!isAuthenticated()) {
        showNotification('⚠️ Kaydetmek için giriş yapın!', 'warning');
        return false;
    }
    
    try {
        // Convert array to object with IDs as keys
        const examsObject = {};
        exams.forEach(exam => {
            examsObject[exam.id] = exam;
        });
        
        await examsRef.set(examsObject);
        
        // Also save to localStorage
        localStorage.setItem('studentExams', JSON.stringify(exams));
        
        return true;
    } catch (error) {
        console.error('Firebase write error:', error);
        showNotification('❌ Veri kaydedilemedi: ' + error.message, 'error');
        return false;
    }
}

// Save goals to Firebase
async function saveGoalsToFirebase() {
    if (!isAuthenticated()) {
        showNotification('⚠️ Kaydetmek için giriş yapın!', 'warning');
        return false;
    }
    
    try {
        await goalsRef.set(studentGoals);
        
        // Also save to localStorage
        localStorage.setItem('studentGoals', JSON.stringify(studentGoals));
        
        return true;
    } catch (error) {
        console.error('Firebase goals write error:', error);
        showNotification('❌ Hedefler kaydedilemedi: ' + error.message, 'error');
        return false;
    }
}

// Clear all data from Firebase
async function clearFirebaseData() {
    if (!isAuthenticated()) {
        showNotification('⚠️ Silmek için giriş yapın!', 'warning');
        return false;
    }
    
    try {
        await examsRef.remove();
        await goalsRef.remove();
        return true;
    } catch (error) {
        console.error('Firebase clear error:', error);
        return false;
    }
}

// Sync local data to Firebase (for first-time migration)
async function syncLocalToFirebase() {
    if (!isAuthenticated()) {
        showNotification('⚠️ Senkronizasyon için giriş yapın!', 'warning');
        return false;
    }
    
    const localExams = JSON.parse(localStorage.getItem('studentExams') || '[]');
    const localGoals = JSON.parse(localStorage.getItem('studentGoals') || '{}');
    
    if (localExams.length === 0 && Object.keys(localGoals).length === 0) {
        showNotification('ℹ️ Yüklenecek yerel veri yok.', 'info');
        return false;
    }
    
    try {
        // Merge with existing Firebase data
        const currentExamsSnapshot = await examsRef.once('value');
        const currentExams = currentExamsSnapshot.val() || {};
        
        localExams.forEach(exam => {
            if (!currentExams[exam.id]) {
                currentExams[exam.id] = exam;
            }
        });
        
        await examsRef.set(currentExams);
        
        // Merge goals
        const currentGoalsSnapshot = await goalsRef.once('value');
        const currentGoals = currentGoalsSnapshot.val() || {};
        const mergedGoals = { ...currentGoals, ...localGoals };
        await goalsRef.set(mergedGoals);
        
        showNotification('✅ Veriler buluta yüklendi!', 'success');
        return true;
    } catch (error) {
        console.error('Sync error:', error);
        showNotification('❌ Senkronizasyon hatası: ' + error.message, 'error');
        return false;
    }
}

// ===================================
// AUTH MODAL FUNCTIONS
// ===================================

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('auth-email').focus();
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
        // Clear form
        document.getElementById('auth-email').value = '';
        document.getElementById('auth-password').value = '';
    }
}

function handleAuthSubmit(event, mode) {
    event.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        showNotification('⚠️ E-posta ve şifre gerekli!', 'warning');
        return;
    }
    
    // Only login is allowed now
    loginWithEmail(email, password);
}

function switchAuthMode(mode) {
    const loginSection = document.getElementById('auth-login-section');
    const registerSection = document.getElementById('auth-register-section');
    const modalTitle = document.getElementById('auth-modal-title');
    
    if (mode === 'register') {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        modalTitle.textContent = '📝 Kayıt Ol';
    } else {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        modalTitle.textContent = '🔐 Giriş Yap';
    }
}

// ===================================
// NOTIFICATION HELPER
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.firebase-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `firebase-notification notification-${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('notification-fade');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================================
// GLOBAL EXPORTS
// ===================================

window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.logout = logout;
window.isAuthenticated = isAuthenticated;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.switchAuthMode = switchAuthMode;
window.syncLocalToFirebase = syncLocalToFirebase;
window.saveDataToFirebase = saveDataToFirebase;
window.saveGoalsToFirebase = saveGoalsToFirebase;
window.getCurrentUserNickname = getCurrentUserNickname;
window.getCurrentUserId = getCurrentUserId;
