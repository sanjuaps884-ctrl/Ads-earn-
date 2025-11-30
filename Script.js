// User data and ads
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let ads = JSON.parse(localStorage.getItem('ads')) || [];
let currentAd = null;
let countdownInterval = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const adModal = document.getElementById('adModal');
const userBalance = document.getElementById('userBalance');
const adsList = document.getElementById('adsList');
const claimRewardBtn = document.getElementById('claimReward');
const countdownDisplay = document.getElementById('countdown');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAds();
    updateUI();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
    }
});

// Modal functionality
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Close modals when clicking X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target);
    }
}

// Login/Register buttons
loginBtn.onclick = () => openModal(loginModal);
registerBtn.onclick = () => openModal(registerModal);

// Login form
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUI();
        closeModal(loginModal);
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
};

// Register form
document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        balance: 0,
        viewedAds: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateUI();
    closeModal(registerModal);
    alert('Registration successful!');
};

// Load ads
function loadAds() {
    if (ads.length === 0) {
        // Sample ads
        ads = [
            {
                id: 1,
                title: "Tech Gadgets Sale",
                content: "Check out our amazing tech gadgets with 50% off! Limited time offer.",
                earnings: 0.10,
                duration: 30
            },
            {
                id: 2,
                title: "Fitness App",
                content: "Get fit with our new fitness app. Track your progress and achieve your goals.",
                earnings: 0.10,
                duration: 30
            },
            {
                id: 3,
                title: "Online Learning Platform",
                content: "Learn new skills with our online courses. Special discount for new users.",
                earnings: 0.10,
                duration: 30
            }
        ];
        localStorage.setItem('ads', JSON.stringify(ads));
    }
    
    displayAds();
}

function displayAds() {
    adsList.innerHTML = '';
    ads.forEach(ad => {
        const adElement = document.createElement('div');
        adElement.className = 'ad-item';
        adElement.innerHTML = `
            <h4>${ad.title}</h4>
            <p>Earn: $${ad.earnings.toFixed(2)}</p>
            <small>Duration: ${ad.duration} seconds</small>
        `;
        adElement.onclick = () => viewAd(ad);
        adsList.appendChild(adElement);
    });
}

// View ad
function viewAd(ad) {
    if (!currentUser) {
        alert('Please login to view ads');
        return;
    }
    
    if (currentUser.viewedAds.includes(ad.id)) {
        alert('You have already viewed this ad');
        return;
    }
    
    currentAd = ad;
    document.getElementById('adTitle').textContent = ad.title;
    document.getElementById('adBody').textContent = ad.content;
    
    let timeLeft = ad.duration;
    countdownDisplay.textContent = timeLeft;
    
    claimRewardBtn.disabled = true;
    
    openModal(adModal);
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            claimRewardBtn.disabled = false;
        }
    }, 1000);
}

// Claim reward
claimRewardBtn.onclick = function() {
    if (!currentAd || !currentUser) return;
    
    currentUser.balance += currentAd.earnings;
    currentUser.viewedAds.push(currentAd.id);
    
    // Update user in storage
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    updateUI();
    closeModal(adModal);
    clearInterval(countdownInterval);
    
    alert(`Congratulations! You earned $${currentAd.earnings.toFixed(2)}`);
};

// Update UI
function updateUI() {
    if (currentUser) {
        userBalance.textContent = `$${currentUser.balance.toFixed(2)}`;
        loginBtn.textContent = 'Logout';
        registerBtn.style.display = 'none';
        
        loginBtn.onclick = () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUI();
        };
    } else {
        userBalance.textContent = '$0.00';
        loginBtn.textContent = 'Login';
        registerBtn.style.display = 'inline-block';
        
        loginBtn.onclick = () => openModal(loginModal);
    }
}