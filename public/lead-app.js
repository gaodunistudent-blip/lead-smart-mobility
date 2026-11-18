// LEAD - Smart Mobility Platform for Indonesia
// Main Application JavaScript

// App State
const AppState = {
    currentUser: null,
    activeVehicle: null,
    vehicles: [],
    currentLocation: null,
    map: null,
    marker: null,
    routeLayer: null,
    isVoiceActive: false,
    selectedCity: null,
    journeyHistory: [],
    savedPlaces: [],
    isDemoMode: false,
    useRealAPIs: true,
    watchId: null,
    initialized: false
};

// API Configuration
const API_CONFIG = {
    nominatim: {
        baseUrl: 'https://nominatim.openstreetmap.org/search',
        format: 'json',
        userAgent: 'LEAD-App'
    },
    osrm: {
        baseUrl: 'https://router.project-osrm.org/route/v1'
    }
};

// Indonesian Cities Data
const cities = [
    { id: 1, name: 'Jakarta', lat: -6.2088, lng: 106.8456, icon: 'fa-city' },
    { id: 2, name: 'Surabaya', lat: -7.2575, lng: 112.7521, icon: 'fa-city' },
    { id: 3, name: 'Bandung', lat: -6.9175, lng: 107.6191, icon: 'fa-city' },
    { id: 4, name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, icon: 'fa-city' },
    { id: 5, name: 'Malang', lat: -7.9797, lng: 112.6304, icon: 'fa-city' },
    { id: 6, name: 'Semarang', lat: -6.9667, lng: 110.4167, icon: 'fa-city' },
    { id: 7, name: 'Medan', lat: 3.5952, lng: 98.6722, icon: 'fa-city' },
    { id: 8, name: 'Denpasar', lat: -8.6705, lng: 115.2126, icon: 'fa-city' },
    { id: 9, name: 'Palembang', lat: -2.9764, lng: 104.7758, icon: 'fa-city' },
    { id: 10, name: 'Makassar', lat: -5.1477, lng: 119.4328, icon: 'fa-city' },
    { id: 11, name: 'Balikpapan', lat: -1.2379, lng: 116.8529, icon: 'fa-city' },
    { id: 12, name: 'Manado', lat: 1.4931, lng: 124.8464, icon: 'fa-city' },
    { id: 13, name: 'Banda Aceh', lat: 5.5483, lng: 95.3238, icon: 'fa-city' },
    { id: 14, name: 'Jayapura', lat: -2.5337, lng: 140.7181, icon: 'fa-city' }
];

// Sample Places Data by City
const cityPlaces = {
    'Jakarta': [
        { id: 1, name: 'Warung Bu Sri', category: 'warung', address: 'Jl. Merdeka No. 123', lat: -6.2088, lng: 106.8456, hours: '08:00 - 20:00', distance: 0.5 },
        { id: 2, name: 'Restoran Padang Sederhana', category: 'restaurant', address: 'Jl. Sudirman No. 45', lat: -6.2200, lng: 106.8300, hours: '10:00 - 22:00', distance: 1.2 },
        { id: 3, name: 'Cafe Senja', category: 'cafe', address: 'Jl. Gatot Subroto No. 88', lat: -6.2300, lng: 106.8200, hours: '07:00 - 23:00', distance: 2.1 },
        { id: 4, name: 'RS Umum Pusat', category: 'hospital', address: 'Jl. Diponegoro No. 10', lat: -6.2000, lng: 106.8500, hours: '24 Jam', distance: 0.8 },
        { id: 5, name: 'SPBU Pertamina', category: 'fuel', address: 'Jl. Ahmad Yani No. 77', lat: -6.2400, lng: 106.8400, hours: '06:00 - 22:00', distance: 1.5 },
        { id: 6, name: 'EV Charging Station', category: 'charging', address: 'Mall Central Park', lat: -6.2500, lng: 106.8100, hours: '24 Jam', distance: 3.0 }
    ],
    'Surabaya': [
        { id: 101, name: 'Rawon Setan', category: 'restaurant', address: 'Jl. Dharmawangsa No. 45', lat: -7.2575, lng: 112.7521, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 102, name: 'House of Sampoerna', category: 'shop', address: 'Jl. Krembangan Utara No. 1', lat: -7.2358, lng: 112.7368, hours: '09:00 - 16:00', distance: 1.5 },
        { id: 103, name: 'RS Dr. Soetomo', category: 'hospital', address: 'Jl. Mayjen Prof. Dr. Moestopo No. 6', lat: -7.2456, lng: 112.7423, hours: '24 Jam', distance: 2.0 },
        { id: 104, name: 'Tunjungan Plaza', category: 'shop', address: 'Jl. Tunjungan No. 1', lat: -7.2575, lng: 112.7419, hours: '10:00 - 22:00', distance: 0.5 }
    ],
    'Bandung': [
        { id: 201, name: 'Sumber Hidangan', category: 'restaurant', address: 'Jl. Braga No. 10', lat: -6.9175, lng: 107.6191, hours: '10:00 - 22:00', distance: 0.6 },
        { id: 202, name: 'Paris Van Java', category: 'shop', address: 'Jl. Sukajadi No. 137', lat: -6.9035, lng: 107.6098, hours: '10:00 - 22:00', distance: 1.2 },
        { id: 203, name: 'RS Hasan Sadikin', category: 'hospital', address: 'Jl. Pasteur No. 38', lat: -6.9025, lng: 107.6088, hours: '24 Jam', distance: 1.8 },
        { id: 204, name: 'Gedung Sate', category: 'shop', address: 'Jl. Diponegoro No. 22', lat: -6.9024, lng: 107.6188, hours: '08:00 - 17:00', distance: 0.9 }
    ],
    'Yogyakarta': [
        { id: 301, name: 'Gudeg Yu Djum', category: 'restaurant', address: 'Jl. Wijilan No. 1', lat: -7.7956, lng: 110.3695, hours: '08:00 - 21:00', distance: 0.7 },
        { id: 302, name: 'Malioboro Street', category: 'shop', address: 'Jl. Malioboro', lat: -7.7926, lng: 110.3658, hours: '24 Jam', distance: 0.5 },
        { id: 303, name: 'RS PKU Muhammadiyah', category: 'hospital', address: 'Jl. Kedung Kandang No. 1', lat: -7.7856, lng: 110.3758, hours: '24 Jam', distance: 1.5 },
        { id: 304, name: 'Tugu Yogyakarta', category: 'shop', address: 'Jl. Margo Utomo', lat: -7.7829, lng: 110.3670, hours: '24 Jam', distance: 0.8 }
    ],
    'Malang': [
        { id: 401, name: 'Rawon Nguling', category: 'restaurant', address: 'Jl. Zainul Arifin No. 38', lat: -7.9797, lng: 112.6304, hours: '08:00 - 21:00', distance: 0.6 },
        { id: 402, name: 'Malang Town Square', category: 'shop', address: 'Jl. Letjen S. Parman No. 2', lat: -7.9777, lng: 112.6284, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 403, name: 'RS Luhut Djanuardi', category: 'hospital', address: 'Jl. Panji Suroso No. 15', lat: -7.9827, lng: 112.6324, hours: '24 Jam', distance: 1.2 },
        { id: 404, name: 'Batu Night Spectacular', category: 'shop', address: 'Jl. Oro-Oro Ombo No. 9', lat: -7.8717, lng: 112.5284, hours: '15:00 - 23:00', distance: 15.0 }
    ],
    'Semarang': [
        { id: 501, name: 'Warung Mbok Sri', category: 'warung', address: 'Jl. Pemuda No. 123', lat: -6.9667, lng: 110.4167, hours: '07:00 - 20:00', distance: 0.5 },
        { id: 502, name: 'Simpang Lima', category: 'shop', address: 'Jl. Pemuda', lat: -6.9707, lng: 110.4207, hours: '24 Jam', distance: 0.6 },
        { id: 503, name: 'RS Telogorejo', category: 'hospital', address: 'Jl. KH. Ahmad Dahlan No. 35', lat: -6.9757, lng: 110.4257, hours: '24 Jam', distance: 1.0 },
        { id: 504, name: 'Lawang Sewu', category: 'shop', address: 'Jl. Pemuda No. 2', lat: -6.9727, lng: 110.4227, hours: '08:00 - 17:00', distance: 0.7 }
    ],
    'Medan': [
        { id: 601, name: 'Soto Medan', category: 'restaurant', address: 'Jl. Gatot Subroto No. 45', lat: 3.5952, lng: 98.6722, hours: '08:00 - 21:00', distance: 0.8 },
        { id: 602, name: 'Cambridge City Square', category: 'shop', address: 'Jl. Kapten Muslim No. 17', lat: 3.5922, lng: 98.6692, hours: '10:00 - 22:00', distance: 1.2 },
        { id: 603, name: 'RS Royal Prima', category: 'hospital', address: 'Jl. Ayahanda No. 10', lat: 3.5982, lng: 98.6752, hours: '24 Jam', distance: 1.5 },
        { id: 604, name: 'Maimun Palace', category: 'shop', address: 'Jl. Brigjen Katamso No. 1', lat: 3.5852, lng: 98.6652, hours: '08:00 - 17:00', distance: 0.9 }
    ],
    'Denpasar': [
        { id: 701, name: 'Warung Babi Guling', category: 'restaurant', address: 'Jl. Raya Kuta No. 88', lat: -8.6705, lng: 115.2126, hours: '08:00 - 20:00', distance: 0.7 },
        { id: 702, name: 'Beachwalk Shopping Center', category: 'shop', address: 'Jl. Pantai Kuta', lat: -8.7185, lng: 115.1686, hours: '10:00 - 22:00', distance: 5.0 },
        { id: 703, name: 'RS Sanglah', category: 'hospital', address: 'Jl. Diponegoro No. 1', lat: -8.6785, lng: 115.2206, hours: '24 Jam', distance: 1.2 },
        { id: 704, name: 'Tanah Lot', category: 'shop', address: 'Jl. Raya Tanah Lot', lat: -8.6215, lng: 115.0866, hours: '07:00 - 19:00', distance: 15.0 }
    ],
    'Palembang': [
        { id: 801, name: 'Pempek Pak Raden', category: 'restaurant', address: 'Jl. Jend. Sudirman No. 45', lat: -2.9764, lng: 104.7758, hours: '08:00 - 21:00', distance: 0.6 },
        { id: 802, name: 'Palembang Trade Center', category: 'shop', address: 'Jl. R. Sukamto No. 1', lat: -2.9734, lng: 104.7728, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 803, name: 'RS Muhammad Hoesin', category: 'hospital', address: 'Jl. Jend. Sudirman No. 1', lat: -2.9794, lng: 104.7788, hours: '24 Jam', distance: 1.0 },
        { id: 804, name: 'Ampera Bridge', category: 'shop', address: 'Jl. Ampera', lat: -2.9884, lng: 104.7658, hours: '24 Jam', distance: 1.5 }
    ],
    'Makassar': [
        { id: 901, name: 'Coto Nusantara', category: 'restaurant', address: 'Jl. Nusantara No. 45', lat: -5.1477, lng: 119.4328, hours: '08:00 - 21:00', distance: 0.7 },
        { id: 902, name: 'Mall Panakkukang', category: 'shop', address: 'Jl. Boulevard No. 1', lat: -5.1507, lng: 119.4358, hours: '10:00 - 22:00', distance: 0.9 },
        { id: 903, name: 'RS Wahidin Sudirohusodo', category: 'hospital', address: 'Jl. Perintis Kemerdekaan No. 1', lat: -5.1447, lng: 119.4298, hours: '24 Jam', distance: 1.3 },
        { id: 904, name: 'Fort Rotterdam', category: 'shop', address: 'Jl. Ujung Pandang No. 1', lat: -5.1407, lng: 119.4258, hours: '08:00 - 17:00', distance: 1.0 }
    ],
    'Balikpapan': [
        { id: 1001, name: 'Sop Kepiting', category: 'restaurant', address: 'Jl. Gajah Mada No. 88', lat: -1.2379, lng: 116.8529, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 1002, name: 'Balikpapan Plaza', category: 'shop', address: 'Jl. Jend. Sudirman No. 1', lat: -1.2349, lng: 116.8499, hours: '10:00 - 22:00', distance: 0.6 },
        { id: 1003, name: 'RS Kanujoso Djatiwibowo', category: 'hospital', address: 'Jl. MT. Haryono No. 1', lat: -1.2409, lng: 116.8559, hours: '24 Jam', distance: 1.2 },
        { id: 1004, name: 'Kebun Raya Balikpapan', category: 'shop', address: 'Jl. Soekarno Hatta No. 1', lat: -1.2309, lng: 116.8459, hours: '08:00 - 17:00', distance: 2.0 }
    ],
    'Manado': [
        { id: 1101, name: 'Tinutuan', category: 'restaurant', address: 'Jl. Pahlawan No. 45', lat: 1.4931, lng: 124.8464, hours: '07:00 - 20:00', distance: 0.6 },
        { id: 1102, name: 'Manado Town Square', category: 'shop', address: 'Jl. Wolter Monginsidi No. 1', lat: 1.4901, lng: 124.8434, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 1103, name: 'RS Prof. Dr. R. D. Kandou', category: 'hospital', address: 'Jl. Raya Tanawangko No. 1', lat: 1.4961, lng: 124.8494, hours: '24 Jam', distance: 1.1 },
        { id: 1104, name: 'Bunaken Island', category: 'shop', address: 'Bunaken Marine Park', lat: 1.6201, lng: 124.7504, hours: '24 Jam', distance: 12.0 }
    ],
    'Banda Aceh': [
        { id: 1201, name: 'Mie Aceh', category: 'restaurant', address: 'Jl. Teuku Umar No. 45', lat: 5.5483, lng: 95.3238, hours: '08:00 - 21:00', distance: 0.7 },
        { id: 1202, name: 'Hermes Palace Mall', category: 'shop', address: 'Jl. Tgk. Daud Syah No. 1', lat: 5.5453, lng: 95.3208, hours: '10:00 - 22:00', distance: 0.9 },
        { id: 1203, name: 'RS Zainal Abidin', category: 'hospital', address: 'Jl. Tgk. Daud Syah No. 1', lat: 5.5513, lng: 95.3268, hours: '24 Jam', distance: 1.0 },
        { id: 1204, name: 'Baiturrahman Grand Mosque', category: 'shop', address: 'Jl. Tgk. Daud Syah No. 1', lat: 5.5423, lng: 95.3178, hours: '24 Jam', distance: 0.8 }
    ],
    'Jayapura': [
        { id: 1301, name: 'Papeda', category: 'restaurant', address: 'Jl. Sam Ratulangi No. 45', lat: -2.5337, lng: 140.7181, hours: '07:00 - 20:00', distance: 0.6 },
        { id: 1302, name: 'Mall Jayapura', category: 'shop', address: 'Jl. Trikora No. 1', lat: -2.5307, lng: 140.7151, hours: '10:00 - 22:00', distance: 0.8 },
        { id: 1303, name: 'RS Dok II Jayapura', category: 'hospital', address: 'Jl. Trikora No. 1', lat: -2.5367, lng: 140.7211, hours: '24 Jam', distance: 1.2 },
        { id: 1304, name: 'Sentani Lake', category: 'shop', address: 'Danau Sentani', lat: -2.5807, lng: 140.6851, hours: '24 Jam', distance: 8.0 }
    ]
};

// Backward compatibility
const samplePlaces = cityPlaces['Jakarta'];

// Vehicle Type Icons
const vehicleIcons = {
    motorcycle: 'fa-motorcycle',
    car: 'fa-car',
    ev: 'fa-bolt',
    truck: 'fa-truck',
    angkot: 'fa-van-shuttle',
    bus: 'fa-bus'
};

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function initializeApp() {
    if (AppState.initialized) return;
    AppState.initialized = true;

    initializeLanguage();
    loadUserData();
    initializeMap();
    loadCities();
    fetchWeatherSimulated();
    updateLocationStatus();
    checkGeolocation();
    updateVoiceSamplePhrases();

    // Auto-start demo mode if no user data exists
    if (!AppState.currentUser) {
        addDemoButton();
    } else {
        showScreen('home-screen');
    }
}

function addDemoButton() {
    const welcomeContainer = document.querySelector('.welcome-container');
    if (welcomeContainer && !document.getElementById('demo-mode-button')) {
        const demoBtn = document.createElement('button');
        demoBtn.id = 'demo-mode-button';
        demoBtn.className = 'btn btn-quiet btn-block';
        demoBtn.innerHTML = '<i class="fas fa-rocket"></i> ' + t('demoMode');
        demoBtn.onclick = startDemoMode;
        welcomeContainer.appendChild(demoBtn);

        // Add presentation mode button
        const presBtn = document.createElement('button');
        presBtn.className = 'btn btn-primary btn-block';
        presBtn.innerHTML = '<i class="fas fa-person-chalkboard"></i> ' + t('presentationMode');
        presBtn.onclick = () => {
            startDemoMode();
            setTimeout(startPresentationMode, 500);
        };
        welcomeContainer.appendChild(presBtn);
    }
}

// Language Selection
function selectLanguage(lang) {
    setLanguage(lang);
    showScreen('login-screen');
}

// Change app language from settings
function changeAppLanguage(lang) {
    setLanguage(lang);
    // Update the select to reflect current language
    document.getElementById('setting-language').value = lang;
}

function startDemoMode() {
    AppState.isDemoMode = true;

    // Create demo user with current language
    AppState.currentUser = {
        username: 'Demo User',
        email: 'demo@lead.id',
        language: currentLanguage,
        isPremium: true
    };

    // Add demo vehicles
    AppState.vehicles = [
        {
            id: 1,
            type: 'motorcycle',
            brand: 'Honda Vario 150',
            plate: 'B 4567 XYZ'
        },
        {
            id: 2,
            type: 'ev',
            brand: 'Tesla Model 3',
            plate: 'B 1234 ABC',
            battery: 75,
            range: 400
        },
        {
            id: 3,
            type: 'truck',
            brand: 'Hino 300',
            plate: 'B 7890 DEF',
            height: 3.2,
            width: 2.4,
            weight: 5
        }
    ];

    // Set active vehicle
    AppState.activeVehicle = AppState.vehicles[0];

    // Add demo journey history
    AppState.journeyHistory = [
        {
            from: 'Home',
            to: 'Warung Bu Sri',
            date: '2024-01-15',
            distance: '5.2 km',
            time: '15 min'
        },
        {
            from: 'Office',
            to: 'RS Umum Pusat',
            date: '2024-01-14',
            distance: '3.8 km',
            time: '12 min'
        }
    ];

    // Add demo saved places
    AppState.savedPlaces = [
        samplePlaces[0],
        samplePlaces[3]
    ];

    saveUserData();
    updateUI();
    showScreen('home-screen');
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    const navigationTarget = {
        'home-screen': 'home',
        'city-screen': 'explore',
        'place-screen': 'explore',
        'voice-screen': 'voice',
        'vehicle-screen': 'vehicle',
        'history-screen': 'history',
        'saved-screen': 'saved',
        'profile-screen': 'profile',
        'premium-screen': 'premium'
    }[screenId];
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle(
            'active',
            navigationTarget !== undefined &&
                link.getAttribute('onclick') === `navigateTo('${navigationTarget}')`
        );
    });

    // Special handling for certain screens
    if (screenId === 'home-screen') {
        setTimeout(() => {
            if (AppState.map) {
                AppState.map.invalidateSize();
            }
        }, 100);
    }
}

function navigateTo(section) {
    switch(section) {
        case 'home':
            showScreen('home-screen');
            break;
        case 'explore':
            showScreen('city-screen');
            break;
        case 'navigation':
            showScreen('home-screen');
            document.getElementById('search-input').focus();
            break;
        case 'voice':
            showScreen('voice-screen');
            break;
        case 'profile':
            showScreen('profile-screen');
            break;
        case 'history':
            loadJourneyHistory();
            showScreen('history-screen');
            break;
        case 'saved':
            loadSavedPlaces();
            showScreen('saved-screen');
            break;
        case 'vehicle':
            loadVehicles();
            showScreen('vehicle-screen');
            break;
        case 'premium':
            showScreen('premium-screen');
            break;
        case 'settings':
            showScreen('profile-screen');
            break;
    }
}

// User Authentication
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Simulated login
    if (username && password) {
        AppState.currentUser = {
            username: username,
            email: username + '@email.com',
            isPremium: false
        };
        saveUserData();
        updateUI();
        showScreen('home-screen');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const language = document.getElementById('reg-language').value;

    // Simulated registration
    if (username && email && password) {
        AppState.currentUser = {
            username: username,
            email: email,
            language: language,
            isPremium: false
        };
        saveUserData();
        updateUI();
        showScreen('home-screen');
    }
}

function handleLogout() {
    AppState.currentUser = null;
    AppState.activeVehicle = null;
    stopLocationWatch();
    saveUserData();
    addDemoButton();
    showScreen('welcome-screen');
}

// Data Persistence
function saveUserData() {
    localStorage.setItem('lead_user', JSON.stringify(AppState.currentUser));
    localStorage.setItem('lead_vehicles', JSON.stringify(AppState.vehicles));
    localStorage.setItem('lead_active_vehicle', JSON.stringify(AppState.activeVehicle));
    localStorage.setItem('lead_journey_history', JSON.stringify(AppState.journeyHistory));
    localStorage.setItem('lead_saved_places', JSON.stringify(AppState.savedPlaces));
}

function loadUserData() {
    const user = localStorage.getItem('lead_user');
    const vehicles = localStorage.getItem('lead_vehicles');
    const activeVehicle = localStorage.getItem('lead_active_vehicle');
    const journeyHistory = localStorage.getItem('lead_journey_history');
    const savedPlaces = localStorage.getItem('lead_saved_places');

    if (user) {
        AppState.currentUser = JSON.parse(user);
    }
    if (vehicles) {
        AppState.vehicles = JSON.parse(vehicles);
    }
    if (activeVehicle) {
        AppState.activeVehicle = JSON.parse(activeVehicle);
    }
    if (journeyHistory) {
        AppState.journeyHistory = JSON.parse(journeyHistory);
    }
    if (savedPlaces) {
        AppState.savedPlaces = JSON.parse(savedPlaces);
    }

    updateUI();
}

function updateUI() {
    if (AppState.currentUser) {
        document.getElementById('user-name').textContent = t('welcome') + ', ' + AppState.currentUser.username;
        document.getElementById('profile-name').textContent = AppState.currentUser.username;
        document.getElementById('profile-email').textContent = AppState.currentUser.email;

        if (AppState.activeVehicle) {
            document.getElementById('active-vehicle').textContent = AppState.activeVehicle.brand || t('noVehicle');
        }

        // Update premium badge
        const badge = document.querySelector('.profile-badges .badge');
        if (badge) {
            if (AppState.currentUser.isPremium) {
                badge.textContent = t('premium');
                badge.className = 'badge badge-premium';
            } else {
                badge.textContent = t('free');
                badge.className = 'badge badge-free';
            }
        }

        // Update language select in settings
        const langSelect = document.getElementById('setting-language');
        if (langSelect) {
            langSelect.value = currentLanguage;
        }

        // Load journey history if on history screen
        loadJourneyHistory();

        // Load saved places if on saved places screen
        loadSavedPlaces();
    }
}

// Map Initialization
function initializeMap() {
    // Center on Indonesia archipelago
    const indonesiaCenter = [-2.5489, 118.0149];
    const indonesiaZoom = 5;

    try {
        AppState.map = L.map('map').setView(indonesiaCenter, indonesiaZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(AppState.map);

        // Add location control button
        const locationControl = L.control({ position: 'topleft' });
        locationControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            div.innerHTML = '<a href="#" title="' + t('centerOnLocation') + '"><i class="fas fa-crosshairs"></i></a>';
            div.style.backgroundColor = 'white';
            div.style.padding = '5px';
            div.style.border = '2px solid rgba(0,0,0,0.2)';
            div.style.cursor = 'pointer';
            div.onclick = function(e) {
                e.preventDefault();
                centerOnCurrentLocation();
            };
            return div;
        };
        locationControl.addTo(AppState.map);

        // Initialize marker (will be updated with real location)
        AppState.marker = L.marker(indonesiaCenter, {
            opacity: 0
        }).addTo(AppState.map);

        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Map initialization error:', error);
        document.getElementById('map').innerHTML = '<div style="padding: 2rem; text-align: center;"><p>Map failed to load. Please check your internet connection.</p></div>';
    }
}

function checkGeolocation() {
    if (navigator.geolocation) {
        // Request location permission and get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                AppState.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                updateMapLocation();
                startLocationWatch();
                fetchWeather();
                updateLocationStatus();
            },
            (error) => {
                console.log('Geolocation error:', error);
                handleGeolocationError(error);
                fetchWeatherSimulated();
                updateLocationStatus();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.log('Geolocation not supported');
        fetchWeatherSimulated();
        updateLocationStatus();
    }
}

function startLocationWatch() {
    if (navigator.geolocation && !AppState.watchId) {
        AppState.watchId = navigator.geolocation.watchPosition(
            (position) => {
                AppState.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                updateMapLocation();
            },
            (error) => {
                console.log('Location watch error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );
    }
}

function stopLocationWatch() {
    if (AppState.watchId) {
        navigator.geolocation.clearWatch(AppState.watchId);
        AppState.watchId = null;
    }
}

function handleGeolocationError(error) {
    let message = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = t('locationDenied');
            break;
        case error.POSITION_UNAVAILABLE:
            message = t('locationUnavailable');
            break;
        case error.TIMEOUT:
            message = t('tryAgainLater');
            break;
        default:
            message = t('error');
    }
    console.log(message);
    // Could show user notification here
}

function centerOnCurrentLocation() {
    if (AppState.currentLocation && AppState.map) {
        AppState.map.setView([AppState.currentLocation.lat, AppState.currentLocation.lng], 15);
        updateMapLocation();
    } else {
        // Request location if not available
        checkGeolocation();
    }
}

function updateMapLocation() {
    if (AppState.currentLocation && AppState.map) {
        AppState.marker.setLatLng([AppState.currentLocation.lat, AppState.currentLocation.lng]);
        AppState.marker.setOpacity(1);
        AppState.marker.bindPopup(t('yourLocation')).openPopup();

        // Only auto-center if this is the first location update
        if (!AppState.locationInitialized) {
            AppState.map.setView([AppState.currentLocation.lat, AppState.currentLocation.lng], 15);
            AppState.locationInitialized = true;
        }
    }
}

// Weather Functions
function fetchWeather() {
    // Note: In production, integrate with BMKG API or OpenWeatherMap
    // For now, using simulated data
    fetchWeatherSimulated();
}

function fetchWeatherSimulated() {
    const weatherConditions = [
        { icon: 'fa-sun', text: 'Sunny, 32°C' },
        { icon: 'fa-cloud-sun', text: 'Partly Cloudy, 30°C' },
        { icon: 'fa-cloud-rain', text: 'Light Rain, 28°C' },
        { icon: 'fa-cloud-showers-heavy', text: 'Heavy Rain, 26°C' }
    ];

    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    document.getElementById('current-weather').innerHTML = `
        <i class="fas ${randomWeather.icon}"></i>
        <span>${randomWeather.text}</span>
    `;
}

// City Functions
function loadCities() {
    const cityGrid = document.getElementById('city-grid');
    cityGrid.innerHTML = '';

    cities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        cityCard.setAttribute('data-city-name', city.name.toLowerCase());
        cityCard.innerHTML = `
            <i class="fas ${city.icon}"></i>
            <h3>${city.name}</h3>
        `;
        cityCard.onclick = () => selectCity(city);
        cityGrid.appendChild(cityCard);
    });
}

function filterCities(query) {
    const cityCards = document.querySelectorAll('.city-card');
    const searchQuery = query.toLowerCase();

    cityCards.forEach(card => {
        const cityName = card.getAttribute('data-city-name');
        if (cityName.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectCity(city) {
    AppState.selectedCity = city;
    document.getElementById('selected-city-name').textContent = city.name;
    loadPlaces(city.name);
    showScreen('place-screen');

    // Update map to city location
    if (AppState.map) {
        AppState.map.setView([city.lat, city.lng], 13);
        AppState.marker.setLatLng([city.lat, city.lng]);
    }
}

// Place Functions
function loadPlaces(cityName) {
    const placeList = document.getElementById('place-list');
    placeList.innerHTML = '';

    // Get places for the selected city
    const places = cityPlaces[cityName] || [];

    if (places.length === 0) {
        placeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <p>${t('noPlacesFound')}</p>
                <p class="text-muted">${t('tryDifferent')}</p>
            </div>
        `;
        return;
    }

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h4>${place.name}</h4>
            <p>${place.address}</p>
            <div class="meta">
                <span><i class="fas fa-clock"></i> ${place.hours}</span>
                <span><i class="fas fa-road"></i> ${place.distance} km</span>
            </div>
        `;
        placeCard.onclick = () => selectPlace(place);
        placeList.appendChild(placeCard);
    });
}

function filterPlaces() {
    const category = document.getElementById('category-filter').value;
    const distance = document.getElementById('distance-filter').value;
    const timeFilter = document.getElementById('time-filter').value;

    let filteredPlaces = cityPlaces[AppState.selectedCity?.name] || [];

    filteredPlaces = filteredPlaces.filter(place => {
        // Category filter
        if (category !== 'all' && place.category !== category) {
            return false;
        }
        // Distance filter
        if (distance !== 'any' && place.distance > parseInt(distance)) {
            return false;
        }
        // Time filter
        if (timeFilter !== 'any') {
            const now = new Date();
            const currentHour = now.getHours();
            
            if (timeFilter === 'now') {
                // Would check if currently open - for demo, we'll assume all are open
                return true;
            } else if (timeFilter === 'morning' && (currentHour < 6 || currentHour >= 12)) {
                return false;
            } else if (timeFilter === 'afternoon' && (currentHour < 12 || currentHour >= 18)) {
                return false;
            } else if (timeFilter === 'evening' && (currentHour < 18 || currentHour >= 22)) {
                return false;
            } else if (timeFilter === 'night' && (currentHour >= 6 && currentHour < 22)) {
                return false;
            }
        }
        return true;
    });

    const placeList = document.getElementById('place-list');
    placeList.innerHTML = '';

    if (filteredPlaces.length === 0) {
        placeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <p>${t('noPlacesFound')}</p>
                <p class="text-muted">${t('tryDifferent')}</p>
            </div>
        `;
        return;
    }

    filteredPlaces.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h4>${place.name}</h4>
            <p>${place.address}</p>
            <div class="meta">
                <span><i class="fas fa-clock"></i> ${place.hours}</span>
                <span><i class="fas fa-road"></i> ${place.distance} km</span>
            </div>
        `;
        placeCard.onclick = () => selectPlace(place);
        placeList.appendChild(placeCard);
    });
}

function selectPlace(place) {
    document.getElementById('search-input').value = place.name;

    // Show route modal
    showRouteModal(place);
}

// Search Functions
async function handleSearch() {
    const query = document.getElementById('search-input').value;

    if (!query) return;

    if (AppState.useRealAPIs) {
        // Use real Nominatim API for place search
        try {
            const results = await searchPlaces(query);
            if (results && results.length > 0) {
                // Show first result or let user choose
                const place = results[0];
                showSearchResults(results);
            } else {
                alert(t('noResults'));
            }
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to simulated search
            fallbackSearch(query);
        }
    } else {
        fallbackSearch(query);
    }
}

async function searchPlaces(query) {
    const url = `${API_CONFIG.nominatim.baseUrl}?format=${API_CONFIG.nominatim.format}&q=${encodeURIComponent(query)}&limit=5&countrycodes=id`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Search failed');
    }

    const data = await response.json();

    return data.map(item => ({
        name: item.display_name.split(',')[0],
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.display_name,
        type: item.type,
        category: item.class
    }));
}

function showSearchResults(results) {
    // For now, just select the first result
    // In future, could show a list for user to choose
    const place = results[0];
    document.getElementById('search-input').value = place.name;

    // Center map on the place
    if (AppState.map) {
        AppState.map.setView([place.lat, place.lng], 15);
        AppState.marker.setLatLng([place.lat, place.lng]);
        AppState.marker.bindPopup(escapeHtml(place.name)).openPopup();
    }

    showRouteModal(place);
}

function fallbackSearch(query) {
    // Simulate finding a place
    const foundPlace = samplePlaces.find(place =>
        place.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundPlace) {
        showRouteModal(foundPlace);
    } else {
        // If not found, simulate a destination
        const simulatedPlace = {
            name: query,
            lat: -6.2088 + (Math.random() - 0.5) * 0.1,
            lng: 106.8456 + (Math.random() - 0.5) * 0.1
        };
        showRouteModal(simulatedPlace);
    }
}

// Route Functions
async function showRouteModal(destination) {
    const modal = document.getElementById('nav-modal');
    const routeOptions = document.getElementById('route-options');

    modal.classList.add('active');
    routeOptions.innerHTML = '<p>' + t('loading') + '</p>';

    // Generate route options based on vehicle type
    if (AppState.useRealAPIs && AppState.currentLocation) {
        try {
            const routes = await fetchRealRoutes(destination);
            displayRouteOptions(routes, destination);
        } catch (error) {
            console.error('Route error:', error);
            // Fallback to simulated routes
            const routes = generateRouteOptions(destination);
            displayRouteOptions(routes, destination);
        }
    } else {
        const routes = generateRouteOptions(destination);
        displayRouteOptions(routes, destination);
    }
}

async function fetchRealRoutes(destination) {
    const startLat = AppState.currentLocation ? AppState.currentLocation.lat : -6.2088;
    const startLng = AppState.currentLocation ? AppState.currentLocation.lng : 106.8456;

    // OSRM API request
    const url = `${API_CONFIG.osrm.baseUrl}/driving/${startLng},${startLat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Route request failed');
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
    }

    const route = data.routes[0];

    return [{
        name: t('fastestRoute'),
        distance: (route.distance / 1000).toFixed(1) + ' km',
        time: Math.round(route.duration / 60) + ' min',
        geometry: route.geometry,
        real: true
    }];
}

function displayRouteOptions(routes, destination) {
    const routeOptions = document.getElementById('route-options');
    routeOptions.innerHTML = '';

    routes.forEach((route, index) => {
        const routeOption = document.createElement('div');
        routeOption.className = 'route-option' + (index === 0 ? ' selected' : '');
        routeOption.innerHTML = `
            <h4>${route.name} ${route.real ? '<span style="font-size:0.75rem;color:#10B981;">(' + t('realData') + ')</span>' : '<span style="font-size:0.75rem;color:#F59E0B;">(' + t('simulatedData') + ')</span>'}</h4>
            <div class="meta">
                <span><i class="fas fa-road"></i> ${route.distance}</span>
                <span><i class="fas fa-clock"></i> ${route.time}</span>
            </div>
        `;
        routeOption.onclick = () => selectRoute(routeOption, route);
        routeOptions.appendChild(routeOption);
    });

    // Store selected route for navigation
    AppState.selectedRoute = routes[0];
    AppState.selectedDestination = destination;

    // Simulate weather check on route
    setTimeout(() => {
        document.getElementById('route-weather-info').innerHTML = `
            <i class="fas fa-cloud-sun"></i>
            <span>${t('clearSkies')}</span>
        `;
    }, 1000);
}

function generateRouteOptions(destination) {
    const baseRoutes = [
        { name: 'Fastest Route', distance: '5.2 km', time: '15 min' },
        { name: 'Shortest Route', distance: '4.8 km', time: '18 min' },
        { name: 'Eco Route', distance: '6.1 km', time: '20 min' }
    ];

    // Customize based on vehicle type
    if (AppState.activeVehicle) {
        const vehicleType = AppState.activeVehicle.type;

        if (vehicleType === 'motorcycle') {
            return [
                { name: 'Motorcycle Friendly', distance: '5.0 km', time: '14 min' },
                { name: 'Scenic Route', distance: '6.5 km', time: '22 min' }
            ];
        } else if (vehicleType === 'truck') {
            return [
                { name: 'Truck Suitable', distance: '6.2 km', time: '20 min' },
                { name: 'Highway Route', distance: '7.5 km', time: '18 min' }
            ];
        } else if (vehicleType === 'ev') {
            return [
                { name: 'EV Optimized', distance: '5.5 km', time: '16 min' },
                { name: 'With Charging Stop', distance: '8.0 km', time: '28 min' }
            ];
        }
    }

    return baseRoutes;
}

function selectRoute(element, route) {
    document.querySelectorAll('.route-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    AppState.selectedRoute = route;
}

function closeNavModal() {
    document.getElementById('nav-modal').classList.remove('active');
}

function startNavigation() {
    closeNavModal();

    if (!AppState.selectedRoute || !AppState.selectedDestination) {
        return;
    }

    AppState.journeyHistory.unshift({
        from: AppState.currentLocation ? 'Current location' : 'Jakarta',
        to: AppState.selectedDestination.name,
        date: new Date().toLocaleDateString(),
        distance: AppState.selectedRoute.distance,
        time: AppState.selectedRoute.time
    });
    saveUserData();
    loadJourneyHistory();

    if (AppState.map) {
        // Remove existing route layer
        if (AppState.routeLayer) {
            AppState.map.removeLayer(AppState.routeLayer);
        }

        if (AppState.selectedRoute.real && AppState.selectedRoute.geometry) {
            // Draw real route from OSRM
            const coordinates = AppState.selectedRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            AppState.routeLayer = L.polyline(coordinates, {
                color: '#D71920',
                weight: 5,
                opacity: 0.8
            }).addTo(AppState.map);

            AppState.map.fitBounds(AppState.routeLayer.getBounds(), { padding: [50, 50] });
        } else {
            // Draw simulated route
            const startLat = AppState.currentLocation ? AppState.currentLocation.lat : -6.2088;
            const startLng = AppState.currentLocation ? AppState.currentLocation.lng : 106.8456;
            const destLat = AppState.selectedDestination.lat;
            const destLng = AppState.selectedDestination.lng;

            const routePoints = [
                [startLat, startLng],
                [startLat + (destLat - startLat) * 0.33, startLng + (destLng - startLng) * 0.33],
                [startLat + (destLat - startLat) * 0.66, startLng + (destLng - startLng) * 0.66],
                [destLat, destLng]
            ];

            AppState.routeLayer = L.polyline(routePoints, {
                color: '#D71920',
                weight: 5,
                opacity: 0.8,
                dashArray: '10, 10' // Dashed line to indicate simulated
            }).addTo(AppState.map);

            AppState.map.fitBounds(AppState.routeLayer.getBounds(), { padding: [50, 50] });
        }

        // Add destination marker
        if (AppState.destinationMarker) {
            AppState.map.removeLayer(AppState.destinationMarker);
        }
        AppState.destinationMarker = L.marker([AppState.selectedDestination.lat, AppState.selectedDestination.lng])
            .addTo(AppState.map)
            .bindPopup(escapeHtml(AppState.selectedDestination.name))
            .openPopup();
    }

    // Show redesigned rain alert
    setTimeout(() => {
        showRainAlert();
    }, 3000);
}

// Vehicle Functions
function loadVehicles() {
    const vehicleList = document.getElementById('vehicle-list');
    vehicleList.innerHTML = '';

    if (AppState.vehicles.length === 0) {
        vehicleList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-car"></i>
                <p>${t('noVehicles')}</p>
                <p class="text-muted">${t('addUpTo')}</p>
            </div>
        `;
        return;
    }

    AppState.vehicles.forEach((vehicle, index) => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card' + (AppState.activeVehicle && AppState.activeVehicle.id === vehicle.id ? ' active' : '');
        vehicleCard.innerHTML = `
            <div class="vehicle-icon">
                <i class="fas ${vehicleIcons[vehicle.type] || 'fa-car'}"></i>
            </div>
            <div class="vehicle-info">
                <h4>${escapeHtml(vehicle.brand || 'Vehicle ' + (index + 1))}</h4>
                <p>${escapeHtml(vehicle.plate || 'No plate')}</p>
                <span class="vehicle-type-label">${escapeHtml(getVehicleTypeName(vehicle.type))}</span>
            </div>
            <div class="vehicle-actions">
                <button class="btn btn-icon" onclick="selectVehicle(${index})" title="Select">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-icon" onclick="editVehicle(${index})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon btn-danger" onclick="deleteVehicle(${index})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        vehicleList.appendChild(vehicleCard);
    });
}

function getVehicleTypeName(type) {
    const names = {
        motorcycle: 'Motorcycle',
        car: 'Car',
        ev: 'Electric Vehicle',
        truck: 'Truck',
        angkot: 'Angkot',
        bus: 'Bus'
    };
    return names[type] || type;
}

function editVehicle(index) {
    const vehicle = AppState.vehicles[index];
    document.getElementById('vehicle-type').value = vehicle.type;
    document.getElementById('vehicle-brand').value = vehicle.brand || '';
    document.getElementById('vehicle-plate').value = vehicle.plate || '';
    
    if (vehicle.type === 'ev') {
        document.getElementById('vehicle-battery').value = vehicle.battery || '';
        document.getElementById('vehicle-range').value = vehicle.range || '';
    }
    
    if (vehicle.type === 'truck') {
        document.getElementById('vehicle-height').value = vehicle.height || '';
        document.getElementById('vehicle-width').value = vehicle.width || '';
        document.getElementById('vehicle-weight').value = vehicle.weight || '';
    }
    
    updateVehicleFields();
    
    // Store editing index
    AppState.editingVehicleIndex = index;
    
    showVehicleModal();
}

function deleteVehicle(index) {
    const confirmed = confirm('Are you sure you want to delete this vehicle?');
    if (confirmed) {
        AppState.vehicles.splice(index, 1);
        
        // If deleted vehicle was active, clear active vehicle
        if (AppState.activeVehicle && AppState.vehicles.length > 0) {
            AppState.activeVehicle = AppState.vehicles[0];
        } else {
            AppState.activeVehicle = null;
        }
        
        saveUserData();
        loadVehicles();
        updateUI();
    }
}

function showVehicleModal() {
    if (AppState.editingVehicleIndex === undefined && AppState.vehicles.length >= 3) {
        alert('You can only add up to 3 vehicles');
        return;
    }
    document.getElementById('vehicle-modal').classList.add('active');
}

function closeVehicleModal() {
    document.getElementById('vehicle-modal').classList.remove('active');
    document.getElementById('vehicle-form').reset();
    document.getElementById('ev-fields').classList.add('hidden');
    document.getElementById('truck-fields').classList.add('hidden');
}

function updateVehicleFields() {
    const type = document.getElementById('vehicle-type').value;
    const evFields = document.getElementById('ev-fields');
    const truckFields = document.getElementById('truck-fields');

    evFields.classList.add('hidden');
    truckFields.classList.add('hidden');

    if (type === 'ev') {
        evFields.classList.remove('hidden');
    } else if (type === 'truck') {
        truckFields.classList.remove('hidden');
    }
}

function handleAddVehicle(event) {
    event.preventDefault();

    const vehicle = {
        id: Date.now(),
        type: document.getElementById('vehicle-type').value,
        brand: document.getElementById('vehicle-brand').value,
        plate: document.getElementById('vehicle-plate').value
    };

    // Add EV-specific fields
    if (vehicle.type === 'ev') {
        vehicle.battery = document.getElementById('vehicle-battery').value;
        vehicle.range = document.getElementById('vehicle-range').value;
    }

    // Add truck-specific fields
    if (vehicle.type === 'truck') {
        vehicle.height = document.getElementById('vehicle-height').value;
        vehicle.width = document.getElementById('vehicle-width').value;
        vehicle.weight = document.getElementById('vehicle-weight').value;
    }

    // Check if editing or adding
    if (AppState.editingVehicleIndex !== undefined) {
        const wasActive = AppState.activeVehicle &&
            AppState.activeVehicle.id === AppState.vehicles[AppState.editingVehicleIndex].id;
        AppState.vehicles[AppState.editingVehicleIndex] = vehicle;
        if (wasActive) {
            AppState.activeVehicle = vehicle;
        }
        AppState.editingVehicleIndex = undefined;
    } else {
        AppState.vehicles.push(vehicle);
    }

    saveUserData();
    loadVehicles();
    closeVehicleModal();

    // Auto-select if first vehicle
    if (AppState.vehicles.length === 1) {
        selectVehicle(0);
    }
}

function selectVehicle(index) {
    AppState.activeVehicle = AppState.vehicles[index];
    saveUserData();
    updateUI();
    loadVehicles();
}

// Journey History Functions
function loadJourneyHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    historyList.innerHTML = '';

    if (AppState.journeyHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-route"></i>
                <p>${t('noJourneys')}</p>
                <p class="text-muted">${t('startNavigating')}</p>
            </div>
        `;
        return;
    }

    AppState.journeyHistory.forEach(journey => {
        const journeyCard = document.createElement('div');
        journeyCard.className = 'place-card';
        journeyCard.innerHTML = `
            <h4>${escapeHtml(journey.from)} → ${escapeHtml(journey.to)}</h4>
            <div class="meta">
                <span><i class="fas fa-calendar"></i> ${escapeHtml(journey.date)}</span>
                <span><i class="fas fa-road"></i> ${escapeHtml(journey.distance)}</span>
                <span><i class="fas fa-clock"></i> ${escapeHtml(journey.time)}</span>
            </div>
        `;
        historyList.appendChild(journeyCard);
    });
}

// Saved Places Functions
function loadSavedPlaces() {
    const savedPlacesList = document.getElementById('saved-places-list');
    if (!savedPlacesList) return;

    savedPlacesList.innerHTML = '';

    if (AppState.savedPlaces.length === 0) {
        savedPlacesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <p>${t('noSavedPlaces')}</p>
                <p class="text-muted">${t('savePlacesTip')}</p>
            </div>
        `;
        return;
    }

    AppState.savedPlaces.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h4>${escapeHtml(place.name)}</h4>
            <p>${escapeHtml(place.address)}</p>
            <div class="meta">
                <span><i class="fas fa-clock"></i> ${escapeHtml(place.hours)}</span>
                <span><i class="fas fa-road"></i> ${escapeHtml(place.distance)} km</span>
            </div>
        `;
        placeCard.onclick = () => selectPlace(place);
        savedPlacesList.appendChild(placeCard);
    });
}

function saveSelectedPlace() {
    const destination = AppState.selectedDestination;
    if (!destination) return;

    const place = {
        ...destination,
        address: destination.address || destination.fullName || 'Address unavailable',
        hours: destination.hours || 'Hours unavailable',
        distance: Number(destination.distance) || 0
    };
    const alreadySaved = AppState.savedPlaces.some(saved =>
        saved.name === place.name ||
        (saved.lat === place.lat && saved.lng === place.lng)
    );

    if (!alreadySaved) {
        AppState.savedPlaces.push(place);
        saveUserData();
        loadSavedPlaces();
    }

    closeNavModal();
}

// Voice AI Overlay Functions
function openVoiceAIOverlay() {
    document.getElementById('voice-ai-overlay').classList.remove('hidden');
}

function closeVoiceAIOverlay() {
    document.getElementById('voice-ai-overlay').classList.add('hidden');
}

function handleVoiceAIKeypress(event) {
    if (event.key === 'Enter') {
        sendVoiceAIMessage();
    }
}

function sendVoiceAIMessage() {
    const input = document.getElementById('voice-ai-text-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addVoiceAIMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = processVoiceQuery(message);
        addVoiceAIMessage(response, 'ai');
    }, 500);
}

function addVoiceAIMessage(text, type) {
    const conversation = document.getElementById('voice-ai-conversation');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'voice-message ' + type;

    const icon = type === 'user' ? 'fa-user' : 'fa-robot';
    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    const textElement = document.createElement('span');
    textElement.textContent = text;
    messageDiv.append(iconElement, textElement);

    conversation.appendChild(messageDiv);
    conversation.scrollTop = conversation.scrollHeight;
}

function processVoiceQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('rain') || lowerQuery.includes('hujan')) {
        return "I checked the weather along your route. Rain is expected approximately 2 kilometers ahead. Please prepare for wet conditions.";
    } else if (lowerQuery.includes('restaurant') || lowerQuery.includes('makan') || lowerQuery.includes('warung')) {
        return "I found several restaurants and warungs nearby. Would you like me to show you the closest ones or the highest-rated?";
    } else if (lowerQuery.includes('missed') || lowerQuery.includes('lewat')) {
        return "No problem! I'm recalculating your route now.";
    } else if (lowerQuery.includes('station') || lowerQuery.includes('stasiun')) {
        return "The nearest train station is approximately 2.5 kilometers from your current location.";
    } else {
        return "I understand. How else can I help you with your journey?";
    }
}

function toggleVoiceOverlay() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = voiceLanguageCodes[currentVoiceLanguage] || 'id-ID';
        recognition.continuous = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('voice-ai-text-input').value = transcript;
            sendVoiceAIMessage();
        };
        
        recognition.start();
    } else {
        alert('Voice recognition not supported in this browser');
    }
}

// Redesigned Rain Alert
function showRainAlert() {
    const alertCard = document.getElementById('rain-alert-card');
    alertCard.classList.remove('hidden');
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        dismissRainAlert();
    }, 10000);
}

function dismissRainAlert() {
    document.getElementById('rain-alert-card').classList.add('hidden');
}
const voiceSamplePhrases = {
    'id': [
        'Apakah ada hujan di depan?',
        'Carikan restoran terdekat.',
        'Tolong cari rute alternatif.'
    ],
    'jv': [
        'Ing ngarep ana udan ora?',
        'Tulung golekké warung sing cedhak.',
        'Jalane macet ora?'
    ],
    'su': [
        'Di payun aya hujan teu?',
        'Tulung carikeun tempat dahar nu deukeut.',
        'Rute mana nu panggampangna?'
    ],
    'mad': [
        'Èngghi, èpon bedeh ojan e depan?',
        'Golekè warung kadhâ.',
        'Jalane macet oya?'
    ],
    'min': [
        'Apakah ado hujan di muko?',
        'Cari rumah makan tarakek.',
        'Jalan macet atau tidak?'
    ],
    'bug': [
        'Iyalo, ada ujan to depan?',
        'Cari warung tode.',
        'Jalan macet kah?'
    ],
    'bal': [
        'Tusing ada hujan di depan?',
        'Cari warung kedeh.',
        'Jalan macet?'
    ],
    'btk': [
        'Unang ada hujan di depan?',
        'Cari warung tode.',
        'Jalan macet kah?'
    ],
    'id-medan': [
        'Bah, di depan ada hujan tak?',
        'Cakak warung yang deket.',
        'Jalan macet tidak bah?'
    ],
    'en': [
        'Is it going to rain ahead?',
        'Find a nearby restaurant.',
        'Find another route.'
    ]
};

const voiceLanguageCodes = {
    'id': 'id-ID',
    'jv': 'jv-ID',
    'su': 'su-ID',
    'mad': 'mad-ID',
    'min': 'min-ID',
    'bug': 'bug-ID',
    'bal': 'bal-ID',
    'btk': 'btk-ID',
    'id-medan': 'id-ID',
    'en': 'en-US'
};

let currentVoiceLanguage = 'id';

function changeVoiceLanguage(lang) {
    currentVoiceLanguage = lang;
    updateVoiceSamplePhrases();
}

function updateVoiceSamplePhrases() {
    const phrasesList = document.getElementById('voice-sample-phrases');
    if (!phrasesList) return;

    const phrases = voiceSamplePhrases[currentVoiceLanguage] || voiceSamplePhrases['id'];
    phrasesList.innerHTML = '';

    phrases.forEach(phrase => {
        const li = document.createElement('li');
        li.textContent = phrase;
        phrasesList.appendChild(li);
    });
}

// Premium Upgrade Handler
function handlePremiumUpgrade() {
    if (AppState.currentUser) {
        if (AppState.currentUser.isPremium) {
            alert('You already have Premium!');
        } else {
            const confirmed = confirm('Upgrade to Premium? (Demo Mode)');
            if (confirmed) {
                AppState.currentUser.isPremium = true;
                saveUserData();
                updateUI();
                alert('Welcome to Premium! (Demo)');
            }
        }
    }
}

// Update Location Status in Settings
function updateLocationStatus() {
    const statusText = document.getElementById('location-status-text');
    if (!statusText) return;

    if (AppState.currentLocation) {
        statusText.textContent = 'Granted';
        statusText.style.color = 'var(--success)';
    } else {
        statusText.textContent = 'Not Granted';
        statusText.style.color = 'var(--danger)';
    }
}

function toggleVoice() {
    const btn = document.getElementById('voice-btn');
    const status = document.getElementById('voice-status');

    if (!AppState.isVoiceActive) {
        // Start voice recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = voiceLanguageCodes[currentVoiceLanguage] || 'id-ID';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                AppState.isVoiceActive = true;
                btn.innerHTML = '<i class="fas fa-stop"></i>';
                btn.classList.add('btn-danger');
                status.textContent = t('listening');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                addVoiceMessage(transcript, 'user');
                processVoiceCommand(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                AppState.isVoiceActive = false;
                btn.innerHTML = '<i class="fas fa-microphone"></i>';
                btn.classList.remove('btn-danger');
                status.textContent = t('voiceNotSupported');
            };

            recognition.onend = () => {
                AppState.isVoiceActive = false;
                btn.innerHTML = '<i class="fas fa-microphone"></i>';
                btn.classList.remove('btn-danger');
                status.textContent = t('tapToSpeak');
            };

            recognition.start();
        } else {
            // Fallback for browsers without speech recognition
            status.textContent = t('voiceNotSupported');
            setTimeout(() => {
                status.textContent = t('tapToSpeak');
            }, 2000);
        }
    }
}

function addVoiceMessage(text, type) {
    const conversation = document.getElementById('voice-conversation');
    const message = document.createElement('div');
    message.className = 'voice-message ' + type;
    message.textContent = text;
    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
}

function processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();

    // Simple command processing
    let response = '';

    if (lowerCommand.includes('hujan') || lowerCommand.includes('rain')) {
        response = 'Based on current weather data, there is a possibility of light rain in some areas. I will continue to monitor conditions along your route.';
    } else if (lowerCommand.includes('arah') || lowerCommand.includes('navigate') || lowerCommand.includes('jalan')) {
        response = 'I can help you navigate. Please tell me your destination, or use the search bar to find a place.';
    } else if (lowerCommand.includes('makan') || lowerCommand.includes('restoran') || lowerCommand.includes('warung')) {
        response = 'I found several restaurants and warungs nearby. You can view them in the Explore section or search for a specific place.';
    } else if (lowerCommand.includes('stasiun') || lowerCommand.includes('station')) {
        response = 'The nearest train station is approximately 2.5 kilometers from your current location.';
    } else if (lowerCommand.includes('bensin') || lowerCommand.includes('fuel') || lowerCommand.includes('spbu')) {
        response = 'There are several fuel stations nearby. The closest one is 1.2 kilometers away on Jl. Ahmad Yani.';
    } else if (lowerCommand.includes('isi daya') || lowerCommand.includes('charging') || lowerCommand.includes('ev')) {
        response = 'I found EV charging stations in the area. The nearest one is at Central Park Mall, 3 kilometers away.';
    } else if (lowerCommand.includes('terima kasih') || lowerCommand.includes('thanks')) {
        response = 'Sama-sama! Safe travels!';
    } else {
        response = 'I understand you said: "' + command + '". How can I help you with your journey?';
    }

    // Simulate AI thinking delay
    setTimeout(() => {
        addVoiceMessage(response, 'ai');

        // Text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            utterance.lang = 'id-ID';
            speechSynthesis.speak(utterance);
        }
    }, 500);
}

// Referral Functions
function copyReferralCode() {
    const code = document.getElementById('referral-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Referral code copied!');
    });
}

// Presentation Mode - Auto tour through features
let presentationTimer = null;

function startPresentationMode() {
    const screens = [
        { id: 'home-screen', duration: 3000, description: 'Home Screen with Map' },
        { id: 'city-screen', duration: 3000, description: 'City Selection' },
        { id: 'place-screen', duration: 3000, description: 'Place Search' },
        { id: 'voice-screen', duration: 3000, description: 'Voice AI Assistant' },
        { id: 'vehicle-screen', duration: 3000, description: 'Vehicle Management' },
        { id: 'profile-screen', duration: 3000, description: 'User Profile' },
        { id: 'premium-screen', duration: 3000, description: 'Premium Features' }
    ];

    let currentIndex = 0;

    function showNextScreen() {
        if (currentIndex >= screens.length) {
            currentIndex = 0; // Loop back to start
        }

        const screen = screens[currentIndex];
        showScreen(screen.id);

        // Show presentation indicator
        showPresentationIndicator(screen.description, currentIndex + 1, screens.length);

        currentIndex++;
        presentationTimer = setTimeout(showNextScreen, screen.duration);
    }

    showNextScreen();
}

function stopPresentationMode() {
    if (presentationTimer) {
        clearTimeout(presentationTimer);
        presentationTimer = null;
    }
    const indicator = document.getElementById('presentation-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function showPresentationIndicator(description, current, total) {
    let indicator = document.getElementById('presentation-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'presentation-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(215, 25, 32, 0.95);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(indicator);
    }
    indicator.innerHTML = `
        <i class="fas fa-play-circle"></i>
        Presentation Mode: ${description} (${current}/${total})
        <button onclick="stopPresentationMode()" style="margin-left: 1rem; background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; cursor: pointer;">Stop</button>
    `;
}

// Add presentation mode button to profile screen
const profileScreen = document.getElementById('profile-screen');
if (profileScreen) {
    const presentationBtn = document.createElement('button');
    presentationBtn.className = 'menu-item';
    presentationBtn.innerHTML = `
        <i class="fas fa-presentation"></i>
        <span>Start Presentation Mode</span>
        <i class="fas fa-chevron-right"></i>
    `;
    presentationBtn.onclick = startPresentationMode;
    const menu = profileScreen.querySelector('.profile-menu');
    if (menu) {
        menu.insertBefore(presentationBtn, menu.lastElementChild);
    }
}