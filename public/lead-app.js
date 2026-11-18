// LEAD - Smart Mobility Platform for Indonesia
// Main Application JavaScript

// App State
const AppState = {
    currentUser: null,
    activeVehicle: null,
    vehicles: [],
    currentLocation: null,
    map: null,
    cityMap: null,
    marker: null,
    accuracyCircle: null,
    routeLayer: null,
    placeMarkers: null,
    cityPlaceMarkers: null,
    places: [],
    activePlaceCategory: null,
    placeSearchError: '',
    routeWeather: null,
    dismissedRainAlertKey: null,
    routeTimeZone: 'Asia/Jakarta',
    voiceRecognition: null,
    isVoiceActive: false,
    selectedCity: null,
    journeyHistory: [],
    savedPlaces: [],
    sharedLists: [],
    activeSharedListId: null,
    cityPlacesCache: {},
    cityClockTimer: null,
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
    },
    photon: {
        baseUrl: 'https://photon.komoot.io/api/'
    },
    weather: {
        baseUrl: 'https://api.open-meteo.com/v1/forecast'
    }
};

// Indonesian Cities Data
const cities = [
    { id: 1, name: 'Jakarta', lat: -6.2088, lng: 106.8456, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 2, name: 'Surabaya', lat: -7.2575, lng: 112.7521, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 3, name: 'Bandung', lat: -6.9175, lng: 107.6191, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 4, name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 5, name: 'Malang', lat: -7.9797, lng: 112.6304, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 6, name: 'Semarang', lat: -6.9667, lng: 110.4167, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 7, name: 'Medan', lat: 3.5952, lng: 98.6722, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 8, name: 'Denpasar', lat: -8.6705, lng: 115.2126, timeZone: 'Asia/Makassar', zoneLabel: 'WITA', icon: 'fa-city' },
    { id: 9, name: 'Palembang', lat: -2.9764, lng: 104.7758, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 10, name: 'Makassar', lat: -5.1477, lng: 119.4328, timeZone: 'Asia/Makassar', zoneLabel: 'WITA', icon: 'fa-city' },
    { id: 11, name: 'Balikpapan', lat: -1.2379, lng: 116.8529, timeZone: 'Asia/Makassar', zoneLabel: 'WITA', icon: 'fa-city' },
    { id: 12, name: 'Manado', lat: 1.4931, lng: 124.8464, timeZone: 'Asia/Makassar', zoneLabel: 'WITA', icon: 'fa-city' },
    { id: 13, name: 'Banda Aceh', lat: 5.5483, lng: 95.3238, timeZone: 'Asia/Jakarta', zoneLabel: 'WIB', icon: 'fa-city' },
    { id: 14, name: 'Jayapura', lat: -2.5337, lng: 140.7181, timeZone: 'Asia/Jayapura', zoneLabel: 'WIT', icon: 'fa-city' }
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

const placeCategories = [
    { group: 'Food & Dining', id: 'restaurants', label: 'Restaurants', icon: 'fa-utensils', tags: [['amenity', 'restaurant']] },
    { group: 'Food & Dining', id: 'local-restaurants', label: 'Local restaurants', icon: 'fa-bowl-food', tags: [['amenity', 'restaurant']] },
    { group: 'Food & Dining', id: 'warung', label: 'Warung', icon: 'fa-shop', tags: [['shop', 'convenience'], ['amenity', 'restaurant']] },
    { group: 'Food & Dining', id: 'street-food', label: 'Street food', icon: 'fa-hotdog', tags: [['amenity', 'fast_food'], ['shop', 'food']] },
    { group: 'Food & Dining', id: 'cafes', label: 'Cafes', icon: 'fa-mug-saucer', tags: [['amenity', 'cafe']] },
    { group: 'Food & Dining', id: 'coffee', label: 'Coffee shops', icon: 'fa-mug-hot', tags: [['amenity', 'cafe']] },
    { group: 'Food & Dining', id: 'bakeries', label: 'Bakeries', icon: 'fa-bread-slice', tags: [['shop', 'bakery']] },
    { group: 'Food & Dining', id: 'fast-food', label: 'Fast food', icon: 'fa-burger', tags: [['amenity', 'fast_food']] },
    { group: 'Food & Dining', id: 'food-courts', label: 'Food courts', icon: 'fa-table-cells', tags: [['amenity', 'food_court']] },

    { group: 'Shopping', id: 'malls', label: 'Shopping malls', icon: 'fa-bag-shopping', tags: [['shop', 'mall']] },
    { group: 'Shopping', id: 'clothing', label: 'Clothing stores', icon: 'fa-shirt', tags: [['shop', 'clothes']] },
    { group: 'Shopping', id: 'fashion', label: 'Fashion boutiques', icon: 'fa-wand-magic-sparkles', tags: [['shop', 'clothes']] },
    { group: 'Shopping', id: 'shoes', label: 'Shoe stores', icon: 'fa-shoe-prints', tags: [['shop', 'shoes']] },
    { group: 'Shopping', id: 'supermarkets', label: 'Supermarkets', icon: 'fa-cart-shopping', tags: [['shop', 'supermarket']] },
    { group: 'Shopping', id: 'convenience', label: 'Convenience stores', icon: 'fa-store', tags: [['shop', 'convenience']] },
    { group: 'Shopping', id: 'markets', label: 'Traditional markets', icon: 'fa-basket-shopping', tags: [['amenity', 'marketplace']] },
    { group: 'Shopping', id: 'electronics', label: 'Electronics stores', icon: 'fa-mobile-screen-button', tags: [['shop', 'electronics']] },
    { group: 'Shopping', id: 'beauty', label: 'Beauty & cosmetics', icon: 'fa-spa', tags: [['shop', 'cosmetics']] },
    { group: 'Shopping', id: 'bookstores', label: 'Bookstores', icon: 'fa-book-open', tags: [['shop', 'books']] },
    { group: 'Shopping', id: 'local-shops', label: 'Local shops', icon: 'fa-store', tags: [['shop', 'general']] },

    { group: 'Transportation', id: 'bus-stations', label: 'Bus stations', icon: 'fa-bus', tags: [['amenity', 'bus_station']] },
    { group: 'Transportation', id: 'bus-stops', label: 'Bus stops', icon: 'fa-signs-post', tags: [['highway', 'bus_stop']] },
    { group: 'Transportation', id: 'train-stations', label: 'Train stations', icon: 'fa-train', tags: [['railway', 'station']] },
    { group: 'Transportation', id: 'railway-stations', label: 'Railway stations & stops', icon: 'fa-train-subway', tags: [['railway', 'halt'], ['railway', 'tram_stop']] },
    { group: 'Transportation', id: 'airports', label: 'Airports', icon: 'fa-plane', tags: [['aeroway', 'aerodrome']] },
    { group: 'Transportation', id: 'ferry-terminals', label: 'Ferry terminals', icon: 'fa-ship', tags: [['amenity', 'ferry_terminal']] },
    { group: 'Transportation', id: 'transit-hubs', label: 'Public transport hubs', icon: 'fa-right-left', tags: [['public_transport', 'station']] },
    { group: 'Transportation', id: 'taxi', label: 'Taxi stands', icon: 'fa-taxi', tags: [['amenity', 'taxi']] },
    { group: 'Transportation', id: 'parking', label: 'Parking areas', icon: 'fa-square-parking', tags: [['amenity', 'parking']] },

    { group: 'Health', id: 'hospitals', label: 'Hospitals', icon: 'fa-hospital', tags: [['amenity', 'hospital']] },
    { group: 'Health', id: 'clinics', label: 'Clinics', icon: 'fa-house-medical', tags: [['amenity', 'clinic']] },
    { group: 'Health', id: 'pharmacies', label: 'Pharmacies', icon: 'fa-prescription-bottle-medical', tags: [['amenity', 'pharmacy']] },
    { group: 'Health', id: 'laboratories', label: 'Medical laboratories', icon: 'fa-flask', tags: [['healthcare', 'laboratory']] },
    { group: 'Health', id: 'dentists', label: 'Dental clinics', icon: 'fa-tooth', tags: [['amenity', 'dentist']] },

    { group: 'Education', id: 'universities', label: 'Universities', icon: 'fa-building-columns', tags: [['amenity', 'university']] },
    { group: 'Education', id: 'schools', label: 'Schools', icon: 'fa-school', tags: [['amenity', 'school']] },
    { group: 'Education', id: 'libraries', label: 'Libraries', icon: 'fa-book', tags: [['amenity', 'library']] },
    { group: 'Education', id: 'education', label: 'Educational institutions', icon: 'fa-graduation-cap', tags: [['amenity', 'college']] },
    { group: 'Education', id: 'language-centers', label: 'Language centers', icon: 'fa-language', tags: [['amenity', 'language_school']] },

    { group: 'Fuel & Mobility', id: 'fuel', label: 'Gas stations', icon: 'fa-gas-pump', tags: [['amenity', 'fuel']] },
    { group: 'Fuel & Mobility', id: 'ev-charging', label: 'EV charging stations', icon: 'fa-charging-station', tags: [['amenity', 'charging_station']] },
    { group: 'Fuel & Mobility', id: 'vehicle-repair', label: 'Vehicle repair shops', icon: 'fa-screwdriver-wrench', tags: [['shop', 'car_repair']] },
    { group: 'Fuel & Mobility', id: 'motorcycle-workshops', label: 'Motorcycle workshops', icon: 'fa-motorcycle', tags: [['shop', 'motorcycle']] },
    { group: 'Fuel & Mobility', id: 'car-workshops', label: 'Car workshops', icon: 'fa-car', tags: [['shop', 'car_repair']] },
    { group: 'Fuel & Mobility', id: 'tire-shops', label: 'Tire shops', icon: 'fa-circle-dot', tags: [['shop', 'tyres']] },
    { group: 'Fuel & Mobility', id: 'car-washes', label: 'Car washes', icon: 'fa-car-on', tags: [['amenity', 'car_wash']] },

    { group: 'Public & Essential Services', id: 'government', label: 'Government offices', icon: 'fa-landmark', tags: [['office', 'government']] },
    { group: 'Public & Essential Services', id: 'police', label: 'Police stations', icon: 'fa-shield-halved', tags: [['amenity', 'police']] },
    { group: 'Public & Essential Services', id: 'fire-stations', label: 'Fire stations', icon: 'fa-fire-extinguisher', tags: [['amenity', 'fire_station']] },
    { group: 'Public & Essential Services', id: 'post-offices', label: 'Post offices', icon: 'fa-envelopes-bulk', tags: [['amenity', 'post_office']] },
    { group: 'Public & Essential Services', id: 'banks', label: 'Banks', icon: 'fa-building-columns', tags: [['amenity', 'bank']] },
    { group: 'Public & Essential Services', id: 'atms', label: 'ATMs', icon: 'fa-money-bill-wave', tags: [['amenity', 'atm']] },
    { group: 'Public & Essential Services', id: 'worship', label: 'Places of worship', icon: 'fa-place-of-worship', tags: [['amenity', 'place_of_worship']] },
    { group: 'Public & Essential Services', id: 'public-services', label: 'Public facilities', icon: 'fa-circle-info', tags: [['amenity', 'community_centre']] },

    { group: 'Leisure & Tourism', id: 'attractions', label: 'Tourist attractions', icon: 'fa-camera', tags: [['tourism', 'attraction']] },
    { group: 'Leisure & Tourism', id: 'parks', label: 'Parks', icon: 'fa-tree', tags: [['leisure', 'park']] },
    { group: 'Leisure & Tourism', id: 'beaches', label: 'Beaches', icon: 'fa-umbrella-beach', tags: [['natural', 'beach']] },
    { group: 'Leisure & Tourism', id: 'museums', label: 'Museums', icon: 'fa-landmark', tags: [['tourism', 'museum']] },
    { group: 'Leisure & Tourism', id: 'cinemas', label: 'Cinemas', icon: 'fa-film', tags: [['amenity', 'cinema']] },
    { group: 'Leisure & Tourism', id: 'hotels', label: 'Hotels', icon: 'fa-hotel', tags: [['tourism', 'hotel']] },
    { group: 'Leisure & Tourism', id: 'resorts', label: 'Resorts', icon: 'fa-umbrella-beach', tags: [['tourism', 'resort']] },
    { group: 'Leisure & Tourism', id: 'sports', label: 'Sports facilities', icon: 'fa-futbol', tags: [['leisure', 'sports_centre']] },
    { group: 'Leisure & Tourism', id: 'gyms', label: 'Gyms & fitness centers', icon: 'fa-dumbbell', tags: [['leisure', 'fitness_centre']] },
    { group: 'Personal Care', id: 'beauty-salons', label: 'Beauty salons', icon: 'fa-spa', tags: [['shop', 'beauty'], ['shop', 'hairdresser']] }
];

const cityDiscoveryTags = [
    ['amenity', 'restaurant'], ['amenity', 'cafe'], ['amenity', 'fast_food'], ['amenity', 'food_court'],
    ['shop', 'bakery'], ['shop', 'mall'], ['shop', 'clothes'], ['shop', 'shoes'],
    ['shop', 'supermarket'], ['shop', 'convenience'], ['shop', 'books'], ['amenity', 'marketplace'],
    ['amenity', 'bus_station'], ['railway', 'station'], ['amenity', 'taxi'], ['amenity', 'parking'],
    ['amenity', 'hospital'], ['amenity', 'clinic'], ['amenity', 'pharmacy'], ['amenity', 'dentist'],
    ['amenity', 'university'], ['amenity', 'school'], ['amenity', 'library'], ['amenity', 'language_school'],
    ['amenity', 'fuel'], ['amenity', 'charging_station'], ['shop', 'car_repair'], ['shop', 'motorcycle'],
    ['shop', 'tyres'], ['amenity', 'car_wash'], ['office', 'government'], ['amenity', 'police'],
    ['amenity', 'bank'], ['amenity', 'atm'], ['tourism', 'attraction'], ['leisure', 'park'],
    ['natural', 'beach'], ['tourism', 'museum'], ['amenity', 'cinema'], ['tourism', 'hotel'],
    ['tourism', 'guest_house'], ['leisure', 'fitness_centre'], ['leisure', 'sports_centre'],
    ['shop', 'beauty'], ['shop', 'hairdresser']
];

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function getZonedDateParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
}

function getDateKeyInTimeZone(date, timeZone) {
    const parts = getZonedDateParts(date, timeZone);
    return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatTimeInTimeZone(date, timeZone) {
    return new Intl.DateTimeFormat(currentLanguage === 'id' ? 'id-ID' : 'en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(date);
}

function formatTimestampInTimeZone(timestamp, timeZone) {
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) return String(timestamp || 'Time unavailable');
    const label = cities.find(city => city.timeZone === timeZone)?.zoneLabel || '';
    const formatted = new Intl.DateTimeFormat(currentLanguage === 'id' ? 'id-ID' : 'en-GB', {
        timeZone,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(date);
    return `${formatted}${label ? ` ${label}` : ''}`;
}

function getWeekKeyInTimeZone(date, timeZone) {
    const dateKey = getDateKeyInTimeZone(date, timeZone);
    const weekStart = new Date(`${dateKey}T12:00:00Z`);
    const weekday = (weekStart.getUTCDay() + 6) % 7;
    weekStart.setUTCDate(weekStart.getUTCDate() - weekday);
    return weekStart.toISOString().slice(0, 10);
}

function shiftWeekKey(weekKey, weeks) {
    const date = new Date(`${weekKey}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + weeks * 7);
    return date.toISOString().slice(0, 10);
}

function getCityForCoordinates(lat, lng) {
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return null;
    return cities.reduce((nearest, city) => {
        const distance = distanceBetweenKm(Number(lat), Number(lng), city.lat, city.lng);
        return !nearest || distance < nearest.distance ? { city, distance } : nearest;
    }, null)?.city || null;
}

function getRelevantCity(lat, lng) {
    const selectedCity = AppState.selectedCity;
    if (selectedCity && distanceBetweenKm(Number(lat), Number(lng), selectedCity.lat, selectedCity.lng) <= 30) {
        return selectedCity;
    }
    return getCityForCoordinates(lat, lng);
}

function getTimeZoneForCoordinates(lat, lng) {
    return getCityForCoordinates(lat, lng)?.timeZone || 'Asia/Jakarta';
}

function getListWeeklyStats(list, now = new Date()) {
    const visitedWeeks = new Set((list.visits || []).map(visit => visit.weekKey).filter(Boolean));
    const currentWeek = getWeekKeyInTimeZone(now, list.timeZone || 'Asia/Jakarta');
    const completedThisWeek = visitedWeeks.has(currentWeek);
    let cursor = completedThisWeek ? currentWeek : shiftWeekKey(currentWeek, -1);
    let streak = 0;
    while (visitedWeeks.has(cursor)) {
        streak += 1;
        cursor = shiftWeekKey(cursor, -1);
    }
    return {
        currentWeek,
        completedThisWeek,
        streak,
        points: Number(list.points) || visitedWeeks.size * 50
    };
}

function initializeApp() {
    if (AppState.initialized) return;
    AppState.initialized = true;

    initializeLanguage();
    loadUserData();
    initializeMap();
    loadCities();
    setWeatherLabel('Allow location to show local weather');
    updateLocationStatus();
    checkGeolocation();
    updateVoiceSamplePhrases();
    renderCategoryBrowser();

    // Auto-start demo mode if no user data exists
    if (!AppState.currentUser) {
        addDemoButton();
    } else {
        showScreen('home-screen');
    }
    renderSharedLists();
    processSharedListInvite();
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
            createdAt: new Date().toISOString(),
            timeZone: 'Asia/Jakarta',
            cityName: 'Jakarta',
            distance: '5.2 km',
            time: '15 min'
        },
        {
            from: 'Office',
            to: 'RS Umum Pusat',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            timeZone: 'Asia/Jakarta',
            cityName: 'Jakarta',
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
        'lists-screen': 'lists',
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
    if (screenId === 'place-screen' && AppState.cityMap) {
        setTimeout(() => AppState.cityMap.invalidateSize(), 100);
    }
    const voiceFab = document.getElementById('voice-ai-fab');
    if (voiceFab) {
        voiceFab.classList.toggle('hidden', ['welcome-screen', 'login-screen', 'register-screen'].includes(screenId));
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
        case 'lists':
            loadSharedLists();
            showScreen('lists-screen');
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
    localStorage.setItem('lead_shared_lists', JSON.stringify(AppState.sharedLists));
}

function loadUserData() {
    const user = localStorage.getItem('lead_user');
    const vehicles = localStorage.getItem('lead_vehicles');
    const activeVehicle = localStorage.getItem('lead_active_vehicle');
    const journeyHistory = localStorage.getItem('lead_journey_history');
    const savedPlaces = localStorage.getItem('lead_saved_places');
    const sharedLists = localStorage.getItem('lead_shared_lists');

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
    if (sharedLists) {
        AppState.sharedLists = JSON.parse(sharedLists);
    }

    updateUI();
}

function updateUI() {
    const premiumStatus = document.getElementById('premium-status');
    const premiumCta = document.getElementById('premium-cta-label');
    const hasPremium = Boolean(AppState.currentUser?.isPremium);
    if (premiumStatus) premiumStatus.textContent = hasPremium ? 'Premium demo active' : 'Demo access available';
    if (premiumCta) premiumCta.textContent = hasPremium ? 'Premium demo active' : 'Enable Premium demo';

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
    const indonesiaCenter = [-2.5489, 118.0149];
    const indonesiaZoom = 5;

    try {
        AppState.map = L.map('map', {
            minZoom: 4,
            maxZoom: 19,
            worldCopyJump: true,
            zoomControl: true
        }).setView(indonesiaCenter, indonesiaZoom);
        AppState.placeMarkers = L.layerGroup().addTo(AppState.map);

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            updateWhenIdle: true,
            keepBuffer: 2
        }).addTo(AppState.map);
        tiles.on('tileerror', () => showMapError('Map tiles could not be loaded. Check your internet connection and try again.'));
        tiles.on('load', () => {
            const error = document.getElementById('map-error');
            if (error) error.classList.add('hidden');
        });

        const locationControl = L.control({ position: 'topleft' });
        locationControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            const button = L.DomUtil.create('button', 'map-location-control', div);
            button.type = 'button';
            button.title = t('centerOnLocation');
            button.setAttribute('aria-label', t('centerOnLocation'));
            button.innerHTML = '<i class="fas fa-crosshairs"></i>';
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.on(button, 'click', function(event) {
                L.DomEvent.preventDefault(event);
                centerOnCurrentLocation();
            });
            return div;
        };
        locationControl.addTo(AppState.map);

        AppState.marker = L.marker(indonesiaCenter, {
            opacity: 0,
            icon: createLeadMarkerIcon()
        }).addTo(AppState.map);
        AppState.accuracyCircle = L.circle(indonesiaCenter, {
            radius: 0,
            color: '#c83f3b',
            fillColor: '#c83f3b',
            fillOpacity: 0.1,
            weight: 1
        }).addTo(AppState.map);
        L.control.scale({ imperial: false }).addTo(AppState.map);

    } catch (error) {
        console.error('Map initialization error:', error);
        showMapError('The map could not start. Refresh the page or check your internet connection.');
    }
}

function showMapError(message, targetId = 'map-error') {
    const error = document.getElementById(targetId);
    if (!error) return;
    error.textContent = message;
    error.classList.remove('hidden');
}

function createLeadMarkerIcon() {
    return L.divIcon({
        className: 'lead-map-marker',
        html: '<span></span>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

function initializeCityMap(city) {
    if (!city) return;
    const center = [city.lat, city.lng];
    if (!AppState.cityMap) {
        AppState.cityMap = L.map('city-map', {
            minZoom: 9,
            maxZoom: 19,
            zoomControl: true
        }).setView(center, 13);
        AppState.cityPlaceMarkers = L.layerGroup().addTo(AppState.cityMap);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            updateWhenIdle: true,
            keepBuffer: 2
        }).addTo(AppState.cityMap);
        tiles.on('tileerror', () => showMapError('City map tiles could not be loaded. Check your connection.', 'city-map-error'));
        tiles.on('load', () => document.getElementById('city-map-error')?.classList.add('hidden'));
    } else {
        AppState.cityMap.setView(center, 13);
        setTimeout(() => AppState.cityMap.invalidateSize(), 100);
    }
}

function centerCityMap() {
    if (AppState.selectedCity && AppState.cityMap) {
        AppState.cityMap.setView([AppState.selectedCity.lat, AppState.selectedCity.lng], 13);
    }
}

function checkGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                AppState.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                updateMapLocation();
                startLocationWatch();
                fetchWeather().catch((error) => console.error('Weather request failed:', error));
                updateLocationStatus();
            },
            (error) => {
                handleGeolocationError(error);
                updateLocationStatus();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        AppState.locationError = 'This browser does not support geolocation.';
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
                updateLocationStatus();
            },
            (error) => {
                handleGeolocationError(error);
                updateLocationStatus();
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
    AppState.locationError = message;
    updateLocationStatus();
}

function centerOnCurrentLocation() {
    if (AppState.currentLocation && AppState.map) {
        AppState.map.setView([AppState.currentLocation.lat, AppState.currentLocation.lng], 15);
        updateMapLocation();
    } else {
        AppState.locationError = 'Location is not available. Allow location access or browse the map manually.';
        updateLocationStatus();
        checkGeolocation();
    }
}

function updateMapLocation() {
    if (AppState.currentLocation && AppState.map) {
        AppState.marker.setLatLng([AppState.currentLocation.lat, AppState.currentLocation.lng]);
        AppState.marker.setOpacity(1);
        AppState.marker.bindPopup(t('yourLocation'));
        AppState.accuracyCircle.setLatLng([AppState.currentLocation.lat, AppState.currentLocation.lng]);
        AppState.accuracyCircle.setRadius(Math.min(AppState.currentLocation.accuracy || 0, 1000));

        if (!AppState.locationInitialized) {
            AppState.map.setView([AppState.currentLocation.lat, AppState.currentLocation.lng], 15);
            AppState.locationInitialized = true;
        }
    }
}

function setWeatherLabel(text, icon = 'fa-cloud-sun') {
    const weather = document.getElementById('current-weather');
    if (!weather) return;
    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    const textElement = document.createElement('span');
    textElement.textContent = text;
    weather.replaceChildren(iconElement, textElement);
}

function describeWeatherCode(code) {
    if (code === 0) return 'Clear';
    if ([1, 2, 3].includes(code)) return 'Cloudy';
    if ([45, 48].includes(code)) return 'Fog';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Weather unavailable';
}

function weatherIconForCode(code) {
    if (code === 0) return 'fa-sun';
    if (code >= 51 && code <= 67) return 'fa-cloud-rain';
    if (code >= 80 && code <= 82) return 'fa-cloud-showers-heavy';
    if (code >= 95) return 'fa-cloud-bolt';
    return 'fa-cloud-sun';
}

async function fetchWeather() {
    if (!AppState.currentLocation) {
        setWeatherLabel('Location required for local weather');
        return null;
    }

    const { lat, lng } = AppState.currentLocation;
    const url = `${API_CONFIG.weather.baseUrl}?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code&timezone=UTC`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
        const data = await response.json();
        if (!data.current || !Number.isFinite(Number(data.current.temperature_2m))) {
            throw new Error('Weather service returned an incomplete current forecast.');
        }
        const description = describeWeatherCode(data.current.weather_code);
        const timeZone = getTimeZoneForCoordinates(lat, lng);
        const city = getCityForCoordinates(lat, lng);
        const localTime = data.current.time
            ? ` · ${formatTimeInTimeZone(new Date(`${data.current.time}:00Z`), timeZone)} ${city?.zoneLabel || ''}`
            : '';
        setWeatherLabel(`${description}, ${Math.round(data.current.temperature_2m)}°C${localTime}`, weatherIconForCode(data.current.weather_code));
        return data.current;
    } catch (error) {
        setWeatherLabel('Local weather unavailable', 'fa-circle-exclamation');
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
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
            <h3>${escapeHtml(city.name)}</h3>
            <span class="city-clock" id="city-clock-${city.id}"></span>
        `;
        cityCard.onclick = () => selectCity(city);
        cityGrid.appendChild(cityCard);
        updateCityClock(city);
    });

    const citySelect = document.getElementById('shared-list-city');
    if (citySelect) {
        citySelect.replaceChildren(new Option('Choose a city', ''));
        cities.forEach(city => citySelect.add(new Option(city.name, String(city.id))));
    }
    if (!AppState.cityClockTimer) {
        AppState.cityClockTimer = setInterval(() => cities.forEach(updateCityClock), 60000);
    }
}

function updateCityClock(city) {
    const clock = document.getElementById(`city-clock-${city.id}`);
    if (clock) clock.textContent = `${formatTimeInTimeZone(new Date(), city.timeZone)} ${city.zoneLabel}`;
    if (AppState.selectedCity?.id === city.id) {
        const selectedClock = document.getElementById('city-local-time');
        if (selectedClock) {
            selectedClock.textContent = `${formatTimestampInTimeZone(new Date(), city.timeZone)} · local time (${city.zoneLabel})`;
        }
    }
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
    AppState.placeQueryId = (AppState.placeQueryId || 0) + 1;
    document.getElementById('selected-city-name').textContent = city.name;
    document.getElementById('city-local-time').textContent =
        `${formatTimestampInTimeZone(new Date(), city.timeZone)} · local time (${city.zoneLabel})`;
    document.getElementById('city-time-note').textContent =
        `Visit dates and opening-hour filters use ${city.name} local time (${city.zoneLabel}).`;
    AppState.activePlaceCategory = null;
    document.getElementById('category-search').value = '';
    document.getElementById('place-text-filter').value = '';
    document.getElementById('distance-filter').value = 'any';
    document.getElementById('visit-date').value = getDateKeyInTimeZone(new Date(), city.timeZone);
    document.getElementById('visit-start').value = '';
    document.getElementById('visit-end').value = '';
    initializeCityMap(city);
    loadPlaces(city.name);
    showScreen('place-screen');

    if (AppState.map) {
        AppState.map.setView([city.lat, city.lng], 13);
    }
}

function loadPlaces(cityName) {
    AppState.placeSearchError = '';
    const city = cities.find(item => item.name === cityName);
    const curatedPlaces = (cityPlaces[cityName] || []).map(place => ({
        ...place,
        openingHours: place.hours,
        dataSource: 'Curated example',
        cityName,
        timeZone: city?.timeZone || 'Asia/Jakarta',
        zoneLabel: city?.zoneLabel || 'WIB',
        distance: Number(place.distance) || 0
    }));
    const cachedPlaces = city && AppState.cityPlacesCache[city.id];
    AppState.places = cachedPlaces || curatedPlaces;
    document.getElementById('category-source').textContent = cachedPlaces ? 'OpenStreetMap data' : 'Curated examples · loading nearby places';
    document.getElementById('city-map-caption').textContent = `${AppState.places.length} places · ${cityName}`;
    renderPlaces();
    renderCityPlaceMarkers(AppState.places);

    if (!city || cachedPlaces) return;
    const requestId = AppState.placeQueryId;
    fetchOpenStreetMapPlaces(cityDiscoveryTags, city, 15000, 100).then(places => {
        if (requestId !== AppState.placeQueryId || AppState.activePlaceCategory || AppState.selectedCity?.id !== city.id) return;
        if (!places.length) {
            document.getElementById('category-source').textContent = 'Curated examples · no nearby map data';
            return;
        }
        AppState.cityPlacesCache[city.id] = places;
        AppState.places = places;
        document.getElementById('category-source').textContent = `OpenStreetMap · ${places.length} results`;
        document.getElementById('city-map-caption').textContent = `Nearby places within 15 km · ${cityName}`;
        renderPlaces();
        renderCityPlaceMarkers(places);
    }).catch(error => {
        if (requestId !== AppState.placeQueryId || AppState.selectedCity?.id !== city.id) return;
        console.error('Nearby city discovery failed; keeping curated examples:', error);
        document.getElementById('category-source').textContent = 'Curated examples · map search unavailable';
    });
}

function renderCategoryBrowser(query = '') {
    const groups = document.getElementById('category-groups');
    if (!groups) return;
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = placeCategories.filter(category =>
        category.label.toLowerCase().includes(normalizedQuery) ||
        category.group.toLowerCase().includes(normalizedQuery)
    );
    const groupNames = [...new Set(filtered.map(category => category.group))];
    groups.replaceChildren();

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `category-chip${AppState.activePlaceCategory ? '' : ' selected'}`;
    allButton.innerHTML = '<i class="fas fa-layer-group"></i><span>All places</span>';
    allButton.onclick = () => selectPlaceCategory('all');
    groups.appendChild(allButton);

    groupNames.forEach(groupName => {
        const group = document.createElement('details');
        group.className = 'category-group';
        group.open = normalizedQuery.length > 0;
        const summary = document.createElement('summary');
        summary.textContent = groupName;
        group.appendChild(summary);
        const chips = document.createElement('div');
        chips.className = 'category-chips';
        filtered.filter(category => category.group === groupName).forEach(category => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `category-chip${AppState.activePlaceCategory === category.id ? ' selected' : ''}`;
            button.innerHTML = `<i class="fas ${category.icon}"></i><span>${escapeHtml(category.label)}</span>`;
            button.onclick = () => selectPlaceCategory(category.id);
            chips.appendChild(button);
        });
        group.appendChild(chips);
        groups.appendChild(group);
    });

    if (filtered.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'filter-note';
        empty.textContent = 'No categories match that search.';
        groups.appendChild(empty);
    }
}

async function selectPlaceCategory(categoryId) {
    AppState.activePlaceCategory = categoryId === 'all' ? null : categoryId;
    AppState.placeQueryId = (AppState.placeQueryId || 0) + 1;
    const requestId = AppState.placeQueryId;
    renderCategoryBrowser(document.getElementById('category-search').value);
    if (!AppState.activePlaceCategory) {
        AppState.placeSearchError = '';
        loadPlaces(AppState.selectedCity?.name);
        return;
    }

    const category = placeCategories.find(item => item.id === AppState.activePlaceCategory);
    if (!category || !AppState.selectedCity) return;

    const placeList = document.getElementById('place-list');
    placeList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Searching OpenStreetMap…</p></div>';
    document.getElementById('category-source').textContent = 'Searching OpenStreetMap…';
    document.getElementById('city-map-caption').textContent = `${category.label} near ${AppState.selectedCity.name}`;
    AppState.placeSearchError = '';

    try {
        const places = await fetchOpenStreetMapPlaces(category.tags, AppState.selectedCity, 15000, 40);
        if (requestId !== AppState.placeQueryId) return;
        AppState.places = places;
        AppState.placeSearchError = '';
        document.getElementById('category-source').textContent = `OpenStreetMap · ${places.length} results`;
        document.getElementById('city-map-caption').textContent = `${places.length} OpenStreetMap result${places.length === 1 ? '' : 's'} · ${AppState.selectedCity.name}`;
        renderPlaces();
        renderCityPlaceMarkers(places);
    } catch (error) {
        if (requestId !== AppState.placeQueryId) return;
        console.error('Place search failed:', error);
        document.getElementById('category-source').textContent = 'Search unavailable';
        AppState.places = [];
        AppState.placeSearchError = 'OpenStreetMap search is temporarily unavailable. Check your connection or try again.';
        renderPlaces();
        const retryButton = document.createElement('button');
        retryButton.className = 'btn btn-outline';
        retryButton.textContent = 'Try again';
        retryButton.onclick = () => selectPlaceCategory(category.id);
        document.getElementById('place-list').appendChild(retryButton);
        renderCityPlaceMarkers([]);
    }
}

async function fetchOpenStreetMapPlaces(tagPairs, center, radius, limit = 40) {
    const wait = Math.max(0, 1000 - (Date.now() - (AppState.lastCategorySearchAt || 0)));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    AppState.lastCategorySearchAt = Date.now();

    const uniqueTags = [...new Map(tagPairs.map(([key, value]) => [`${key}:${value}`, [key, value]])).values()];
    const allowedTags = new Set(uniqueTags.map(([key, value]) => `${key}:${value}`));
    const params = new URLSearchParams({
        lat: String(center.lat),
        lon: String(center.lng),
        limit: String(limit),
        lang: currentLanguage === 'id' ? 'default' : 'en',
        include: uniqueTags.map(([key, value]) => `osm.${key}.${value}`).join(',')
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${API_CONFIG.photon.baseUrl}?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Place search returned ${response.status}`);
        const data = await response.json();
        const seen = new Set();
        return (data.features || []).reduce((places, feature) => {
            const properties = feature.properties || {};
            const id = `${properties.osm_type}-${properties.osm_id}`;
            if (seen.has(id)) return places;
            const [lng, lat] = feature.geometry?.coordinates || [];
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return places;
            const osmTag = `${properties.osm_key}:${properties.osm_value}`;
            if (!allowedTags.has(osmTag)) return places;
            const distance = distanceBetweenKm(center.lat, center.lng, lat, lng);
            if (distance > radius / 1000) return places;
            seen.add(id);
            const category = placeCategories.find(item =>
                item.tags.some(([key, value]) => key === properties.osm_key && value === properties.osm_value)
            );
            const address = [
                properties.housenumber,
                properties.street,
                properties.locality,
                properties.district,
                properties.city
            ].filter(Boolean).join(', ');
            places.push({
                id: `photon-${id}`,
                name: properties.name || properties.street || category?.label || properties.osm_value,
                category: category?.id || properties.osm_value,
                categoryLabel: category?.label || properties.osm_value.replace(/_/g, ' '),
                address: address || [properties.city, properties.state, properties.country].filter(Boolean).join(', ') || 'Address not listed in OpenStreetMap',
                lat,
                lng,
                distance: Number(distance.toFixed(1)),
                hours: '',
                openingHours: '',
                dataSource: 'OpenStreetMap via Photon',
                cityName: center.name,
                timeZone: center.timeZone || 'Asia/Jakarta',
                zoneLabel: center.zoneLabel || 'WIB'
            });
            return places;
        }, []).sort((a, b) => a.distance - b.distance);
    } finally {
        clearTimeout(timeoutId);
    }
}

function distanceBetweenKm(lat1, lng1, lat2, lng2) {
    const radians = value => value * Math.PI / 180;
    const deltaLat = radians(lat2 - lat1);
    const deltaLng = radians(lng2 - lng1);
    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
        Math.sin(deltaLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderPlaces() {
    const placeList = document.getElementById('place-list');
    if (!placeList) return;
    placeList.replaceChildren();
    const filteredPlaces = filterPlaces(false);

    if (AppState.placeSearchError) {
        placeList.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><p>${escapeHtml(AppState.placeSearchError)}</p></div>`;
        return;
    }
    if (filteredPlaces.length === 0) {
        placeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <p>${AppState.activePlaceCategory ? 'No matching places found.' : t('noPlacesFound')}</p>
                <p class="text-muted">${AppState.activePlaceCategory ? 'Try another category or a wider distance.' : t('tryDifferent')}</p>
            </div>
        `;
        return;
    }

    filteredPlaces.forEach(place => {
        const schedule = place.openingHours || place.hours;
        const startTime = document.getElementById('visit-start')?.value || '';
        const endTime = document.getElementById('visit-end')?.value || '';
        const timeIsFiltered = Boolean(startTime || endTime);
        const targetStart = startTime || shiftTime(endTime, -60);
        const targetEnd = endTime || shiftTime(startTime, 60);
        const scheduleStatus = timeIsFiltered
            ? checkOpeningHours(place, document.getElementById('visit-date')?.value, targetStart, targetEnd)
            : null;
        const unknownHours = !schedule || (timeIsFiltered && scheduleStatus === null);
        const placeCard = document.createElement('button');
        placeCard.type = 'button';
        placeCard.className = 'place-card';
        const hoursLabel = unknownHours
            ? schedule ? 'Hours may be incomplete · verify' : 'Hours unknown · verify before visiting'
            : schedule;
        const distanceLabel = Number.isFinite(Number(place.distance)) ? `${place.distance} km from city center` : 'Distance unavailable';
        placeCard.innerHTML = `
            <span class="place-card-topline"><span class="place-category-label">${escapeHtml(place.categoryLabel || place.category || 'Place')}</span><span class="place-source">${escapeHtml(place.dataSource || 'Place')}</span></span>
            <h4>${escapeHtml(place.name)}</h4>
            <p>${escapeHtml(place.address || 'Address unavailable')}</p>
            <div class="meta">
                <span class="${unknownHours ? 'hours-unknown' : ''}"><i class="fas fa-clock"></i> ${escapeHtml(hoursLabel)}</span>
                <span><i class="fas fa-road"></i> ${escapeHtml(distanceLabel)}</span>
            </div>
        `;
        placeCard.onclick = () => selectPlace(place);
        placeList.appendChild(placeCard);
    });
}

function filterPlaces(render = true) {
    const distanceFilter = document.getElementById('distance-filter');
    const textFilter = document.getElementById('place-text-filter');
    const startField = document.getElementById('visit-start');
    const endField = document.getElementById('visit-end');
    const dateField = document.getElementById('visit-date');
    const maxDistance = distanceFilter?.value === 'any' ? Infinity : Number(distanceFilter?.value);
    const query = (textFilter?.value || '').trim().toLowerCase();
    const startTime = startField?.value || '';
    const endTime = endField?.value || '';
    const hasTimeFilter = Boolean(startTime || endTime);
    let targetStart = startTime;
    let targetEnd = endTime;
    if (hasTimeFilter && !targetStart) targetStart = shiftTime(targetEnd, -60);
    if (hasTimeFilter && !targetEnd) targetEnd = shiftTime(targetStart, 60);
    const unknownHours = [];
    const filteredPlaces = AppState.places.filter(place => {
        if (Number(place.distance) > maxDistance) return false;
        if (query && !`${place.name} ${place.address} ${place.categoryLabel || place.category}`.toLowerCase().includes(query)) return false;
        if (hasTimeFilter) {
            const status = checkOpeningHours(place, dateField?.value, targetStart, targetEnd);
            if (status === false) return false;
            if (status === null) unknownHours.push(place);
        }
        return true;
    });

    const note = document.getElementById('place-hours-note');
    if (note) {
        const zoneLabel = AppState.selectedCity?.zoneLabel || '';
        if (!hasTimeFilter) {
            note.textContent = `Times shown are local to ${AppState.selectedCity?.name || 'the selected city'}${zoneLabel ? ` (${zoneLabel})` : ''}. Places without published hours are marked for verification.`;
        } else {
            const timeLabel = `${targetStart}–${targetEnd}${dateField?.value ? ` on ${dateField.value}` : ''}${zoneLabel ? ` ${zoneLabel}` : ''}`;
            note.textContent = `${timeLabel}: ${filteredPlaces.length - unknownHours.length} known matches; ${unknownHours.length} place${unknownHours.length === 1 ? '' : 's'} have unverified hours and may be closed.`;
        }
    }
    if (render) renderPlaces();
    return filteredPlaces;
}

function shiftTime(value, minutes) {
    if (!value) return '';
    const [hour, minute] = value.split(':').map(Number);
    const shifted = (hour * 60 + minute + minutes + 1440) % 1440;
    return `${String(Math.floor(shifted / 60)).padStart(2, '0')}:${String(shifted % 60).padStart(2, '0')}`;
}

function checkOpeningHours(place, dateValue, startTime, endTime) {
    const schedule = (place.openingHours || place.hours || '').trim();
    if (!schedule) return null;
    if (/24\s*\/\s*7|24\s*(?:jam|hours?)/i.test(schedule)) return true;
    if (/^(?:closed|off|tutup)$/i.test(schedule)) return false;

    const visitDate = dateValue ? new Date(`${dateValue}T12:00:00Z`) : new Date();
    const weekdayCodes = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const weekday = dateValue
        ? weekdayCodes[visitDate.getUTCDay()]
        : ({ Mon: 'Mo', Tue: 'Tu', Wed: 'We', Thu: 'Th', Fri: 'Fr', Sat: 'Sa', Sun: 'Su' }[getZonedDateParts(visitDate, AppState.selectedCity?.timeZone || 'Asia/Jakarta').weekday]);
    const targetStart = timeToMinutes(startTime);
    let targetEnd = timeToMinutes(endTime);
    if (targetStart === null || targetEnd === null) return null;
    if (targetEnd < targetStart) targetEnd += 1440;

    const segments = schedule.split(';').map(segment => segment.trim()).filter(Boolean);
    let matchingDayRule = false;
    const dayIndex = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };
    for (const segment of segments) {
        const timeMatch = segment.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g);
        const dayMatch = segment.match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(Mo|Tu|We|Th|Fr|Sa|Su))?(?:\s*,\s*(Mo|Tu|We|Th|Fr|Sa|Su))*/);
        const closed = /\b(?:off|closed|tutup)\b/i.test(segment);
        for (const dayOffset of [0, -1]) {
            const openingDay = weekdayCodes[(dayIndex[weekday] + dayOffset + 7) % 7];
            if (dayMatch && !dayRangeIncludes(dayMatch[0], openingDay)) continue;
            if (dayOffset === 0) matchingDayRule = true;
            if (closed) continue;
            if (!timeMatch) return null;
            for (const range of timeMatch) {
                const [openText, closeText] = range.split('-');
                const open = timeToMinutes(openText);
                let close = timeToMinutes(closeText);
                if (open === null || close === null) return null;
                if (close <= open) close += 1440;
                const openOnVisitDate = open + dayOffset * 1440;
                const closeOnVisitDate = close + dayOffset * 1440;
                if (targetStart >= openOnVisitDate && targetEnd <= closeOnVisitDate) return true;
            }
        }
    }
    return matchingDayRule ? false : null;
}

function dayRangeIncludes(dayExpression, targetDay) {
    const dayIndex = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };
    const days = dayExpression.match(/Mo|Tu|We|Th|Fr|Sa|Su/g) || [];
    if (days.length === 0) return true;
    for (let index = 0; index < days.length; index += 1) {
        const current = days[index];
        const next = days[index + 1];
        if (next && dayExpression.includes(`${current}-${next}`)) {
            let cursor = dayIndex[current];
            while (true) {
                if (Object.keys(dayIndex).find(day => dayIndex[day] === cursor) === targetDay) return true;
                if (cursor === dayIndex[next]) break;
                cursor = (cursor + 1) % 7;
            }
            index += 1;
        } else if (current === targetDay) {
            return true;
        }
    }
    return false;
}

function timeToMinutes(value) {
    const match = /^(\d{1,2}):(\d{2})$/.exec((value || '').trim());
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 24 || minute > 59 || (hour === 24 && minute !== 0)) return null;
    return hour * 60 + minute;
}

function resetPlaceFilters() {
    document.getElementById('category-search').value = '';
    document.getElementById('place-text-filter').value = '';
    document.getElementById('distance-filter').value = 'any';
    document.getElementById('visit-date').value = AppState.selectedCity
        ? getDateKeyInTimeZone(new Date(), AppState.selectedCity.timeZone)
        : '';
    document.getElementById('visit-start').value = '';
    document.getElementById('visit-end').value = '';
    selectPlaceCategory('all');
}

function renderCityPlaceMarkers(places) {
    if (!AppState.cityPlaceMarkers) return;
    AppState.cityPlaceMarkers.clearLayers();
    places.forEach(place => {
        if (!Number.isFinite(Number(place.lat)) || !Number.isFinite(Number(place.lng))) return;
        const marker = L.circleMarker([Number(place.lat), Number(place.lng)], {
            radius: 8,
            color: '#ffffff',
            weight: 2,
            fillColor: '#c62828',
            fillOpacity: 0.95
        });
        const popup = `<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.categoryLabel || place.category || 'Place')}<br>${escapeHtml(place.address || 'Address unavailable')}<br>${place.openingHours ? `Hours: ${escapeHtml(place.openingHours)}` : 'Opening hours unknown'}`;
        marker.bindPopup(popup);
        AppState.cityPlaceMarkers.addLayer(marker);
    });
}

function selectPlace(place) {
    document.getElementById('search-input').value = place.name;
    const placeCity = getRelevantCity(place.lat, place.lng);
    const destination = {
        ...place,
        cityName: place.cityName || placeCity?.name,
        timeZone: place.timeZone || placeCity?.timeZone || 'Asia/Jakarta',
        zoneLabel: place.zoneLabel || placeCity?.zoneLabel || 'WIB'
    };
    AppState.selectedDestination = destination;
    showRouteModal(destination);
}

// Search Functions
async function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    const resultsPanel = document.getElementById('search-results-panel');
    if (!query || !resultsPanel) return;
    const requestId = (AppState.searchRequestId || 0) + 1;
    AppState.searchRequestId = requestId;
    resultsPanel.classList.remove('hidden');
    resultsPanel.textContent = 'Searching OpenStreetMap…';

    try {
        const results = await searchPlaces(query);
        if (requestId !== AppState.searchRequestId) return;
        showSearchResults(results);
    } catch (error) {
        if (requestId !== AppState.searchRequestId) return;
        console.error('Search error:', error);
        resultsPanel.textContent = 'Place search is unavailable right now. Check your connection and try again.';
    }
}

async function searchPlaces(query) {
    const params = new URLSearchParams({
        format: API_CONFIG.nominatim.format,
        q: query,
        limit: '5',
        countrycodes: 'id',
        addressdetails: '1'
    });
    const center = AppState.currentLocation || AppState.selectedCity;
    if (center) {
        const delta = 0.18;
        params.set('viewbox', `${center.lng - delta},${center.lat + delta},${center.lng + delta},${center.lat - delta}`);
    }
    const response = await fetch(`${API_CONFIG.nominatim.baseUrl}?${params}`);

    if (!response.ok) {
        throw new Error(`Search service returned ${response.status}`);
    }

    const data = await response.json();

    return data.map(item => ({
        id: `nominatim-${item.place_id}`,
        name: item.display_name.split(',')[0],
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.display_name,
        type: item.type,
        category: item.class,
        categoryLabel: item.type || item.class || 'Place',
        openingHours: '',
        hours: '',
        distance: center ? Number(distanceBetweenKm(center.lat, center.lng, parseFloat(item.lat), parseFloat(item.lon)).toFixed(1)) : null,
        dataSource: 'OpenStreetMap'
    }));
}

function showSearchResults(results) {
    const panel = document.getElementById('search-results-panel');
    if (!results.length) {
        panel.textContent = 'No places found in Indonesia. Try a nearby landmark or another spelling.';
        AppState.placeMarkers.clearLayers();
        return;
    }

    panel.replaceChildren();
    panel.setAttribute('role', 'listbox');
    AppState.placeMarkers.clearLayers();
    results.forEach(place => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'search-result';
        item.setAttribute('role', 'option');
        item.innerHTML = `<span><strong>${escapeHtml(place.name)}</strong><small>${escapeHtml(place.fullName)}</small></span><i class="fas fa-arrow-up-right-from-square"></i>`;
        item.onclick = () => selectSearchResult(place);
        panel.appendChild(item);

        const marker = L.marker([place.lat, place.lng], { icon: createLeadMarkerIcon() });
        marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.fullName)}`);
        AppState.placeMarkers.addLayer(marker);
    });
    if (AppState.map) {
        if (results.length === 1) {
            AppState.map.setView([results[0].lat, results[0].lng], 15);
        } else {
            const bounds = L.latLngBounds(results.map(place => [place.lat, place.lng]));
            AppState.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
    }
}

function selectSearchResult(place) {
    document.getElementById('search-input').value = place.name;
    const panel = document.getElementById('search-results-panel');
    panel.classList.add('hidden');
    if (AppState.map) AppState.map.setView([place.lat, place.lng], 15);
    showRouteModal(place);
}

function fallbackSearch(query) {
    const foundPlace = samplePlaces.find(place =>
        place.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundPlace) {
        showSearchResults([{
            ...foundPlace,
            fullName: foundPlace.address,
            dataSource: 'Curated example'
        }]);
    } else {
        const resultsPanel = document.getElementById('search-results-panel');
        resultsPanel.classList.remove('hidden');
        resultsPanel.textContent = 'No curated example matches. Connect to OpenStreetMap search for real place results.';
    }
}

// Route Functions
function getRouteOrigin() {
    if (AppState.currentLocation) {
        const city = getCityForCoordinates(AppState.currentLocation.lat, AppState.currentLocation.lng);
        return {
            lat: AppState.currentLocation.lat,
            lng: AppState.currentLocation.lng,
            label: 'Current location',
            timeZone: city?.timeZone || 'Asia/Jakarta',
            zoneLabel: city?.zoneLabel || 'WIB'
        };
    }
    if (AppState.selectedCity) {
        return {
            lat: AppState.selectedCity.lat,
            lng: AppState.selectedCity.lng,
            label: `${AppState.selectedCity.name} city center`,
            timeZone: AppState.selectedCity.timeZone,
            zoneLabel: AppState.selectedCity.zoneLabel
        };
    }
    return null;
}

async function showRouteModal(destination) {
    const modal = document.getElementById('nav-modal');
    const routeOptions = document.getElementById('route-options');
    const destinationCity = getRelevantCity(Number(destination.lat), Number(destination.lng));
    destination = {
        ...destination,
        cityName: destination.cityName || destinationCity?.name || '',
        timeZone: destination.timeZone || destinationCity?.timeZone || 'Asia/Jakarta',
        zoneLabel: destination.zoneLabel || destinationCity?.zoneLabel || 'WIB'
    };
    AppState.selectedDestination = destination;
    AppState.selectedRoute = null;
    AppState.routeWeather = null;
    AppState.routeWeatherRequestId = (AppState.routeWeatherRequestId || 0) + 1;
    AppState.isNavigating = false;
    AppState.routeTimeZone = destination.timeZone || AppState.selectedCity?.timeZone || getTimeZoneForCoordinates(destination.lat, destination.lng);
    document.getElementById('start-route-button').disabled = true;
    document.getElementById('rain-alert-card').classList.add('hidden');
    renderSharedListPicker();
    modal.classList.add('active');

    const origin = getRouteOrigin();
    if (!origin || !Number.isFinite(Number(destination.lat)) || !Number.isFinite(Number(destination.lng))) {
        routeOptions.innerHTML = '<div class="empty-state"><i class="fas fa-location-crosshairs"></i><p>Allow location access or select a city before planning a route.</p></div>';
        document.getElementById('route-weather-info').innerHTML = '<i class="fas fa-circle-info"></i><span>Set a starting location to check route weather.</span>';
        return;
    }
    AppState.routeOrigin = origin;

    routeOptions.innerHTML = '<p class="loading-note"><i class="fas fa-spinner fa-spin"></i> Requesting a road route…</p>';
    document.getElementById('route-weather-info').innerHTML = '<i class="fas fa-cloud-sun"></i><span>Checking forecast along the route…</span>';

    try {
        if (!AppState.useRealAPIs) throw new Error('Live routing is disabled.');
        const routes = await fetchRealRoutes(destination, origin);
        displayRouteOptions(routes, destination, origin);
    } catch (error) {
        console.error('Route request failed; showing a clearly labeled estimate:', error);
        displayRouteOptions(generateRouteOptions(destination, origin), destination, origin);
    }
}

async function fetchRealRoutes(destination, origin) {
    const url = `${API_CONFIG.osrm.baseUrl}/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Routing service returned ${response.status}`);
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) throw new Error('No road route was found.');
    const route = data.routes[0];

    return [{
        name: t('fastestRoute'),
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        distanceKm: route.distance / 1000,
        time: `${Math.max(1, Math.round(route.duration / 60))} min`,
        durationMinutes: Math.max(1, route.duration / 60),
        durationSeconds: route.duration,
        geometry: route.geometry,
        real: true
    }];
}

function displayRouteOptions(routes, destination, origin) {
    const routeOptions = document.getElementById('route-options');
    routeOptions.replaceChildren();
    document.getElementById('start-route-button').disabled = routes.length === 0;
    if (routes.length === 0) {
        routeOptions.innerHTML = '<p class="empty-state">No route options are available for this destination.</p>';
        AppState.selectedRoute = null;
        return;
    }

    routes.forEach((route, index) => {
        const routeOption = document.createElement('button');
        routeOption.type = 'button';
        routeOption.className = `route-option${index === 0 ? ' selected' : ''}`;
        routeOption.innerHTML = `
            <h4>${escapeHtml(route.name)} <span class="route-data-badge ${route.real ? 'real' : 'estimate'}">(${route.real ? 'Road route' : 'Estimate only'})</span></h4>
            <div class="meta">
                <span><i class="fas fa-road"></i> ${escapeHtml(route.distance)}</span>
                <span><i class="fas fa-clock"></i> ${escapeHtml(route.time)}</span>
            </div>
        `;
        routeOption.onclick = () => selectRoute(routeOption, route);
        routeOptions.appendChild(routeOption);
    });

    AppState.selectedRoute = routes[0];
    AppState.selectedDestination = destination;
    AppState.routeOrigin = origin;
    AppState.dismissedRainAlertKey = null;
    updateRouteWeather(routes[0], destination, origin);
}

function generateRouteOptions(destination, origin = getRouteOrigin()) {
    if (!origin) return [];
    const directDistance = distanceBetweenKm(origin.lat, origin.lng, destination.lat, destination.lng);
    const estimatedDistance = directDistance * 1.35;
    const speedByVehicle = { motorcycle: 25, car: 30, ev: 30, truck: 20, angkot: 22, bus: 25 };
    const speed = speedByVehicle[AppState.activeVehicle?.type] || 28;
    const durationMinutes = Math.max(1, Math.round((estimatedDistance / speed) * 60));
    return [{
        name: 'Estimated route',
        distance: `~${estimatedDistance.toFixed(1)} km`,
        distanceKm: estimatedDistance,
        time: `~${durationMinutes} min`,
        durationMinutes,
        geometry: { type: 'LineString', coordinates: [[origin.lng, origin.lat], [destination.lng, destination.lat]] },
        real: false
    }];
}

function selectRoute(element, route) {
    document.querySelectorAll('.route-option').forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
    AppState.selectedRoute = route;
    updateRouteWeather(route, AppState.selectedDestination, AppState.routeOrigin);
}

function getRouteSamplePoints(route, destination, origin) {
    let coordinates = route.geometry?.coordinates || [];
    if (coordinates.length < 2) {
        coordinates = [[origin.lng, origin.lat], [destination.lng, destination.lat]];
    }
    const points = coordinates.map(([lng, lat]) => ({ lat, lng }));
    const cumulative = [0];
    for (let index = 1; index < points.length; index += 1) {
        cumulative[index] = cumulative[index - 1] + distanceBetweenKm(
            points[index - 1].lat,
            points[index - 1].lng,
            points[index].lat,
            points[index].lng
        );
    }
    const totalDistance = cumulative[cumulative.length - 1];
    return [0.2, 0.5, 0.8].map(fraction => {
        const targetDistance = totalDistance * fraction;
        let segment = cumulative.findIndex(distance => distance >= targetDistance);
        if (segment < 1) segment = 1;
        if (segment >= points.length) segment = points.length - 1;
        const segmentStart = cumulative[segment - 1];
        const segmentLength = cumulative[segment] - segmentStart;
        const progress = segmentLength ? (targetDistance - segmentStart) / segmentLength : 0;
        return {
            lat: points[segment - 1].lat + (points[segment].lat - points[segment - 1].lat) * progress,
            lng: points[segment - 1].lng + (points[segment].lng - points[segment - 1].lng) * progress,
            distanceKm: targetDistance,
            etaMinutes: Math.round((route.durationMinutes || 0) * fraction)
        };
    });
}

async function fetchWeatherForecastAt(point, etaMinutes, signal) {
    const params = new URLSearchParams({
        latitude: String(point.lat),
        longitude: String(point.lng),
        hourly: 'precipitation_probability,precipitation,weather_code',
        forecast_days: '2',
        timezone: 'UTC'
    });
    const response = await fetch(`${API_CONFIG.weather.baseUrl}?${params}`, { signal });
    if (!response.ok) throw new Error(`Forecast service returned ${response.status}`);
    const data = await response.json();
    const times = data.hourly?.time || [];
    const targetTime = Date.now() + etaMinutes * 60 * 1000;
    let closestIndex = -1;
    let closestDifference = Infinity;
    times.forEach((time, index) => {
        const timestamp = new Date(`${time}:00Z`).getTime();
        const difference = Math.abs(timestamp - targetTime);
        if (difference < closestDifference) {
            closestDifference = difference;
            closestIndex = index;
        }
    });
    if (closestIndex < 0 || closestDifference > 2 * 60 * 60 * 1000) {
        throw new Error('No hourly forecast is available for the route arrival time.');
    }
    return {
        ...point,
        etaMinutes,
        forecastTime: times[closestIndex],
        forecastTimestamp: new Date(`${times[closestIndex]}:00Z`).toISOString(),
        precipitationProbability: Number(data.hourly.precipitation_probability?.[closestIndex]),
        precipitationMm: Number(data.hourly.precipitation?.[closestIndex]),
        weatherCode: Number(data.hourly.weather_code?.[closestIndex])
    };
}

async function updateRouteWeather(route, destination, origin) {
    if (!route || !destination || !origin) return;
    const requestId = (AppState.routeWeatherRequestId || 0) + 1;
    AppState.routeWeatherRequestId = requestId;
    const key = `${destination.lat},${destination.lng}:${route.distance}:${route.time}`;
    AppState.routeWeather = { status: 'loading', key, points: [] };
    updateRouteWeatherNote();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    try {
        const samplePoints = getRouteSamplePoints(route, destination, origin);
        const forecasts = await Promise.all(samplePoints.map(point =>
            fetchWeatherForecastAt(point, point.etaMinutes, controller.signal)
        ));
        if (requestId !== AppState.routeWeatherRequestId) return;
        const rainPoints = forecasts.filter(point =>
            point.precipitationProbability >= 40 ||
            point.precipitationMm >= 0.1 ||
            (point.weatherCode >= 51 && point.weatherCode <= 99)
        );
        AppState.routeWeather = {
            status: 'ready',
            key,
            route,
            destination,
            points: forecasts,
            rainPoints
        };
        updateRouteWeatherNote();
        showRainAlertIfNeeded();
    } catch (error) {
        if (requestId !== AppState.routeWeatherRequestId) return;
        console.error('Route weather check failed:', error);
        AppState.routeWeather = { status: 'unavailable', key, points: [], error: error.message };
        updateRouteWeatherNote();
        document.getElementById('rain-alert-card').classList.add('hidden');
    } finally {
        clearTimeout(timeoutId);
    }
}

function updateRouteWeatherNote() {
    const note = document.getElementById('route-weather-info');
    if (!note) return;
    const weather = AppState.routeWeather;
    let icon = 'fa-cloud-sun';
    let text = 'Checking weather at several points along this route…';
    if (weather?.status === 'ready') {
        if (weather.rainPoints.length) {
            icon = 'fa-cloud-showers-heavy';
            const point = weather.rainPoints[0];
            text = `Rain may be possible about ${point.distanceKm.toFixed(1)} km ahead. Forecasts are approximate.`;
        } else {
            text = 'No rain signal at sampled route points during the estimated trip. Forecasts can change.';
        }
    } else if (weather?.status === 'unavailable') {
        icon = 'fa-circle-exclamation';
        text = 'Live route weather is unavailable. No weather alert is being shown.';
    }
    const iconElement = document.createElement('i');
    iconElement.className = `fas ${icon}`;
    const textElement = document.createElement('span');
    textElement.textContent = text;
    note.replaceChildren(iconElement, textElement);
}

function showRainAlertIfNeeded() {
    const weather = AppState.routeWeather;
    const alertCard = document.getElementById('rain-alert-card');
    if (!AppState.isNavigating || weather?.status !== 'ready' || weather.rainPoints.length === 0) {
        alertCard.classList.add('hidden');
        return;
    }
    if (weather.key === AppState.dismissedRainAlertKey) return;
    const point = weather.rainPoints[0];
    const severe = point.weatherCode >= 95 || point.precipitationMm >= 2.5;
    const timeZone = AppState.selectedDestination?.timeZone || AppState.routeTimeZone || 'Asia/Jakarta';
    const city = getCityForCoordinates(AppState.selectedDestination?.lat, AppState.selectedDestination?.lng);
    const arrivalTime = formatTimeInTimeZone(new Date(Date.now() + point.etaMinutes * 60000), timeZone);
    document.getElementById('rain-alert-title').textContent = severe ? 'Severe weather ahead' : 'Rain possible along your route';
    document.getElementById('rain-alert-summary').textContent =
        `Rain may be possible about ${point.distanceKm.toFixed(1)} km ahead, in roughly ${point.etaMinutes} min (${arrivalTime} ${city?.zoneLabel || ''}).`;
    const probability = Number.isFinite(point.precipitationProbability)
        ? `${point.precipitationProbability}% chance`
        : 'precipitation forecast';
    const amount = Number.isFinite(point.precipitationMm) ? `${point.precipitationMm} mm/hour` : 'amount unavailable';
    const forecastTime = point.forecastTimestamp
        ? ` Forecast hour: ${formatTimeInTimeZone(new Date(point.forecastTimestamp), timeZone)} ${city?.zoneLabel || ''}.`
        : '';
    document.getElementById('rain-alert-details').textContent =
        `Open-Meteo hourly forecast · ${probability} · ${amount}.${forecastTime} Weather is a forecast, not a road-sensor observation.`;
    alertCard.classList.remove('hidden');
}

function toggleRainAlertDetails() {
    const details = document.getElementById('rain-alert-details');
    const button = document.getElementById('rain-alert-expand');
    const expanded = !details.classList.contains('hidden');
    details.classList.toggle('hidden', expanded);
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? 'Details' : 'Hide details';
}

function dismissRainAlert() {
    if (AppState.routeWeather?.key) AppState.dismissedRainAlertKey = AppState.routeWeather.key;
    document.getElementById('rain-alert-card').classList.add('hidden');
}

function closeNavModal() {
    document.getElementById('nav-modal').classList.remove('active');
}

function startNavigation() {
    closeNavModal();

    if (!AppState.selectedRoute || !AppState.selectedDestination) {
        return;
    }

    const origin = AppState.routeOrigin || getRouteOrigin();
    if (!origin) return;
    AppState.isNavigating = true;
    const createdAt = new Date().toISOString();
    AppState.journeyHistory.unshift({
        from: origin.label,
        to: AppState.selectedDestination.name,
        createdAt,
        timeZone: AppState.selectedDestination.timeZone || origin.timeZone || 'Asia/Jakarta',
        cityName: AppState.selectedDestination.cityName || AppState.selectedCity?.name || '',
        distance: AppState.selectedRoute.distance,
        time: AppState.selectedRoute.time
    });
    saveUserData();
    loadJourneyHistory();

    if (AppState.map) {
        if (AppState.routeLayer) {
            AppState.map.removeLayer(AppState.routeLayer);
        }

        const coordinates = AppState.selectedRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        AppState.routeLayer = L.polyline(coordinates, {
            color: '#c83f3b',
            weight: 5,
            opacity: 0.9,
            dashArray: AppState.selectedRoute.real ? null : '10, 10'
        }).addTo(AppState.map);

        if (AppState.destinationMarker) {
            AppState.map.removeLayer(AppState.destinationMarker);
        }
        AppState.destinationMarker = L.marker([AppState.selectedDestination.lat, AppState.selectedDestination.lng], { icon: createLeadMarkerIcon() })
            .addTo(AppState.map)
            .bindPopup(escapeHtml(AppState.selectedDestination.name))
            .openPopup();
        showScreen('home-screen');
        setTimeout(() => {
            AppState.map.invalidateSize();
            AppState.map.fitBounds(AppState.routeLayer.getBounds(), { padding: [50, 50] });
            showRainAlertIfNeeded();
        }, 150);
    }
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
        const isActive = AppState.activeVehicle && AppState.activeVehicle.id === vehicle.id;
        vehicleCard.className = 'vehicle-card' + (isActive ? ' active' : '');
        vehicleCard.innerHTML = `
            <div class="vehicle-icon">
                <i class="fas ${vehicleIcons[vehicle.type] || 'fa-car'}"></i>
            </div>
            <div class="vehicle-info">
                <h4>${escapeHtml(vehicle.brand || 'Vehicle ' + (index + 1))}</h4>
                <p>${escapeHtml(vehicle.plate || 'No plate')}</p>
                <span class="vehicle-type-label">${escapeHtml(getVehicleTypeName(vehicle.type))}</span>
                ${isActive ? '<span class="vehicle-active-label">Active vehicle</span>' : ''}
            </div>
            <div class="vehicle-actions">
                <button class="btn btn-icon" onclick="selectVehicle(${index})" title="Select vehicle" aria-label="Select vehicle">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-icon" onclick="editVehicle(${index})" title="Edit vehicle" aria-label="Edit vehicle">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon btn-danger" onclick="deleteVehicle(${index})" title="Delete vehicle" aria-label="Delete vehicle">
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
    if (!vehicle) return;
    document.getElementById('vehicle-form').reset();
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
    const vehicle = AppState.vehicles[index];
    if (!vehicle) return;
    const confirmed = confirm(`Delete ${vehicle.brand || 'this vehicle'}?`);
    if (confirmed) {
        const [deletedVehicle] = AppState.vehicles.splice(index, 1);
        if (AppState.activeVehicle?.id === deletedVehicle.id) {
            AppState.activeVehicle = AppState.vehicles[0] || null;
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
    document.getElementById('vehicle-modal-title').textContent =
        AppState.editingVehicleIndex === undefined ? 'Add a vehicle' : 'Edit vehicle';
    document.getElementById('vehicle-modal').classList.add('active');
}

function closeVehicleModal() {
    document.getElementById('vehicle-modal').classList.remove('active');
    document.getElementById('vehicle-form').reset();
    document.getElementById('ev-fields').classList.add('hidden');
    document.getElementById('truck-fields').classList.add('hidden');
    AppState.editingVehicleIndex = undefined;
    document.getElementById('vehicle-modal-title').textContent = 'Add a vehicle';
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
        id: AppState.editingVehicleIndex !== undefined
            ? AppState.vehicles[AppState.editingVehicleIndex]?.id
            : Date.now(),
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
        const previousVehicle = AppState.vehicles[AppState.editingVehicleIndex];
        if (!previousVehicle) {
            closeVehicleModal();
            return;
        }
        const wasActive = AppState.activeVehicle?.id === previousVehicle.id;
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
    if (!AppState.vehicles[index]) return;
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
        const timeZone = journey.timeZone || cities.find(city => city.name === journey.cityName)?.timeZone || 'Asia/Jakarta';
        journeyCard.innerHTML = `
            <h4>${escapeHtml(journey.from)} → ${escapeHtml(journey.to)}</h4>
            <div class="meta">
                <span><i class="fas fa-calendar"></i> ${escapeHtml(formatJourneyTimestamp(journey, timeZone))}</span>
                <span><i class="fas fa-road"></i> ${escapeHtml(journey.distance)}</span>
                <span><i class="fas fa-clock"></i> ${escapeHtml(journey.time)}</span>
            </div>
        `;
        historyList.appendChild(journeyCard);
    });
}

function formatJourneyTimestamp(journey, timeZone) {
    const timestamp = journey.createdAt || journey.timestamp;
    if (timestamp) return formatTimestampInTimeZone(timestamp, timeZone);
    if (!journey.date) return 'Time unavailable';
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(journey.date);
    if (!dateOnly) return `Date only · ${journey.date}`;
    const date = new Date(`${journey.date}T12:00:00Z`);
    const locale = currentLanguage === 'id' ? 'id-ID' : 'en-GB';
    return `Date only · ${new Intl.DateTimeFormat(locale, { timeZone, day: '2-digit', month: 'short', year: 'numeric' }).format(date)}`;
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

function requirePremiumForLists() {
    if (AppState.currentUser?.isPremium) return true;
    showScreen('premium-screen');
    alert('Shared lists are a Premium demo feature. Enable the Premium demo to try them.');
    return false;
}

function openSharedListModal() {
    if (!requirePremiumForLists()) return;
    document.getElementById('shared-list-error').textContent = '';
    document.getElementById('shared-list-form').reset();
    updateSharedListForm();
    document.getElementById('shared-list-modal').classList.add('active');
}

function closeSharedListModal() {
    document.getElementById('shared-list-modal').classList.remove('active');
}

function updateSharedListForm() {
    const type = document.getElementById('shared-list-type').value;
    const label = document.getElementById('shared-list-members-label');
    const help = document.getElementById('shared-list-form-help');
    const members = document.getElementById('shared-list-members');
    if (type === 'dates') {
        label.textContent = 'Partner name';
        members.placeholder = 'e.g. Aisha';
        help.textContent = 'A Dates list includes you and exactly one partner.';
    } else if (type === 'friends') {
        label.textContent = 'Friends to invite (comma-separated)';
        members.placeholder = 'e.g. Aisha, Budi';
        help.textContent = 'Add at least two other people so the list has a group of three or more.';
    } else {
        label.textContent = 'People to invite (comma-separated)';
        members.placeholder = 'e.g. Aisha, Budi';
        help.textContent = 'Add the people you want included. You can share an invite snapshot later.';
    }
}

function handleCreateSharedList(event) {
    event.preventDefault();
    if (!requirePremiumForLists()) return;

    const type = document.getElementById('shared-list-type').value;
    const name = document.getElementById('shared-list-name').value.trim();
    const city = cities.find(item => item.id === Number(document.getElementById('shared-list-city').value));
    const enteredMembers = document.getElementById('shared-list-members').value
        .split(',')
        .map(member => member.trim())
        .filter(Boolean);
    const owner = AppState.currentUser?.username || 'You';
    const members = [...new Set([owner, ...enteredMembers].filter(Boolean))];
    const error = document.getElementById('shared-list-error');
    error.textContent = '';

    if (!name || !city) {
        error.textContent = 'Add a list name and choose its home city.';
        return;
    }
    if (type === 'dates' && members.length !== 2) {
        error.textContent = 'A Dates list needs exactly two people: you and one partner.';
        return;
    }
    if (type === 'friends' && members.length < 3) {
        error.textContent = 'A Friends list needs at least two other people.';
        return;
    }
    if (type === 'custom' && members.length < 2) {
        error.textContent = 'Add at least one other person to this shared list.';
        return;
    }

    const list = {
        id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        type,
        cityName: city.name,
        cityId: city.id,
        timeZone: city.timeZone,
        zoneLabel: city.zoneLabel,
        members,
        places: [],
        visits: [],
        points: 0,
        createdAt: new Date().toISOString(),
        isSnapshot: false
    };
    AppState.sharedLists.unshift(list);
    AppState.activeSharedListId = list.id;
    saveUserData();
    closeSharedListModal();
    renderSharedLists();
    renderSharedListDetail(list);
}

function loadSharedLists() {
    renderSharedLists();
    const activeList = AppState.sharedLists.find(list => list.id === AppState.activeSharedListId);
    if (activeList) renderSharedListDetail(activeList);
}

function renderSharedLists() {
    const container = document.getElementById('shared-lists-list');
    if (!container) return;
    container.replaceChildren();

    if (AppState.sharedLists.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-people-group"></i><p>No shared lists yet.</p><p class="text-muted">Try Premium demo to create a Friends, Dates, or custom list.</p></div>';
        return;
    }

    AppState.sharedLists.forEach(list => {
        const stats = getListWeeklyStats(list);
        const card = document.createElement('article');
        card.className = 'shared-list-card';
        card.innerHTML = `
            <div class="shared-list-card-header">
              <div><span class="shared-list-kind">${escapeHtml(list.type)} list</span><h3>${escapeHtml(list.name)}</h3></div>
              <i class="fa-solid ${list.type === 'dates' ? 'fa-heart' : 'fa-people-group'}" aria-hidden="true"></i>
            </div>
            <p>${escapeHtml(list.cityName)} · ${escapeHtml(list.zoneLabel || 'local time')}</p>
            <p>${list.members.length} members · ${list.places.length} places</p>
            <p><strong>${stats.streak}</strong> week streak · <strong>${stats.points}</strong> points</p>
            <div class="shared-list-card-actions">
              <button type="button" class="btn btn-primary btn-small" data-action="open">Open list</button>
              <button type="button" class="btn btn-outline btn-small" data-action="share">Share snapshot</button>
            </div>
        `;
        card.querySelector('[data-action="open"]').addEventListener('click', () => openSharedList(list.id));
        card.querySelector('[data-action="share"]').addEventListener('click', () => shareSharedList(list.id));
        container.appendChild(card);
    });
}

function openSharedList(listId) {
    const list = AppState.sharedLists.find(item => item.id === listId);
    if (!list) return;
    AppState.activeSharedListId = list.id;
    renderSharedListDetail(list);
    document.getElementById('shared-list-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderSharedListDetail(list) {
    const detail = document.getElementById('shared-list-detail');
    if (!detail || !list) return;
    const stats = getListWeeklyStats(list);
    const progress = stats.completedThisWeek ? 100 : 0;
    const visitOptions = list.places.map(place =>
        `<option value="${escapeHtml(place.id)}">${escapeHtml(place.name)}</option>`
    ).join('');
    const placesMarkup = list.places.length
        ? list.places.map(place => `
            <div class="shared-list-place">
              <div><h4>${escapeHtml(place.name)}</h4><p>${escapeHtml(place.address || 'Address unavailable')}</p></div>
              <button type="button" class="btn btn-outline btn-small" data-remove-place="${escapeHtml(place.id)}" aria-label="Remove ${escapeHtml(place.name)}">Remove</button>
            </div>
        `).join('')
        : '<p class="text-muted">Explore a city and add places from the route panel.</p>';
    const visitsMarkup = (list.visits || []).slice().reverse().slice(0, 5).map(visit => `
        <p><i class="fa-solid fa-check"></i> ${escapeHtml(visit.placeName)} · ${escapeHtml(formatTimestampInTimeZone(visit.visitedAt, list.timeZone))}</p>
    `).join('') || '<p>No weekly visits logged yet.</p>';

    detail.innerHTML = `
        <div class="shared-list-detail-header">
          <div><span class="shared-list-kind">${escapeHtml(list.type)} list · ${escapeHtml(list.cityName)} (${escapeHtml(list.zoneLabel || 'local time')})</span><h2>${escapeHtml(list.name)}</h2><p>${list.isSnapshot ? 'Imported snapshot · edits are local to this browser' : 'Your saved places and weekly activity'}</p></div>
          <div class="shared-list-detail-actions">
            <button type="button" class="btn btn-outline btn-small" data-action="share"><i class="fa-solid fa-share-nodes"></i> Share snapshot</button>
            <button type="button" class="btn btn-outline btn-small" data-action="delete"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
        <div class="shared-list-stats">
          <div class="shared-list-stat"><strong>${stats.streak}</strong><span>week streak</span></div>
          <div class="shared-list-stat"><strong>${stats.points}</strong><span>points</span></div>
          <div class="shared-list-stat"><strong>${list.places.length}</strong><span>saved places</span></div>
        </div>
        <div class="weekly-progress"><span>This week</span><div class="weekly-progress-track"><span style="width:${progress}%"></span></div><strong>${stats.completedThisWeek ? 'Complete' : '1 visit needed'}</strong></div>
        <div class="weekly-activity">
          <label for="weekly-visit-place">Log a visit together
            <select id="weekly-visit-place" ${list.places.length ? '' : 'disabled'}>
              <option value="">Choose a place from this list</option>${visitOptions}
            </select>
          </label>
          <button type="button" class="btn btn-primary" data-action="check-in" ${stats.completedThisWeek || !list.places.length ? 'disabled' : ''}><i class="fa-solid fa-check"></i> Complete weekly visit</button>
        </div>
        <div class="shared-list-content">
          <div class="panel list-panel"><div class="panel-heading"><h3>Places in this list</h3></div>${placesMarkup}</div>
          <div>
            <div class="shared-list-members"><h3>Members</h3>${list.members.map(member => `<p><i class="fa-solid fa-user"></i> ${escapeHtml(member)}</p>`).join('')}</div>
            <div class="shared-list-visits" style="margin-top:10px"><h3>Recent weekly visits</h3>${visitsMarkup}</div>
          </div>
        </div>
        <p class="prototype-disclaimer"><i class="fa-solid fa-circle-info"></i> This is a self-reported demo check-in. A shared link imports a snapshot; it does not sync later edits.</p>
    `;
    detail.classList.remove('hidden');
    detail.querySelector('[data-action="share"]').addEventListener('click', () => shareSharedList(list.id));
    detail.querySelector('[data-action="delete"]').addEventListener('click', () => deleteSharedList(list.id));
    detail.querySelector('[data-action="check-in"]').addEventListener('click', () => completeWeeklyVisit(list.id));
    detail.querySelectorAll('[data-remove-place]').forEach(button => {
        button.addEventListener('click', () => removePlaceFromSharedList(list.id, button.dataset.removePlace));
    });
}

function renderSharedListPicker() {
    const picker = document.getElementById('shared-list-picker');
    if (!picker) return;
    picker.replaceChildren(new Option('Choose a list', ''));
    AppState.sharedLists.forEach(list => picker.add(new Option(`${list.name} · ${list.cityName}`, list.id)));
}

function addSelectedPlaceToSharedList() {
    if (!requirePremiumForLists()) return;
    const place = AppState.selectedDestination;
    const list = AppState.sharedLists.find(item => item.id === document.getElementById('shared-list-picker').value);
    if (!place || !list) {
        alert('Choose a shared list first.');
        return;
    }
    const duplicate = list.places.some(item =>
        item.id === place.id ||
        (Number(item.lat) === Number(place.lat) && Number(item.lng) === Number(place.lng))
    );
    if (duplicate) {
        alert('That place is already in this list.');
        return;
    }
    list.places.push({
        ...place,
        id: String(place.id || `place-${Date.now()}`),
        address: place.address || place.fullName || 'Address unavailable',
        timeZone: list.timeZone,
        zoneLabel: list.zoneLabel
    });
    saveUserData();
    renderSharedLists();
    if (AppState.activeSharedListId === list.id) renderSharedListDetail(list);
}

function removePlaceFromSharedList(listId, placeId) {
    const list = AppState.sharedLists.find(item => item.id === listId);
    if (!list) return;
    list.places = list.places.filter(place => String(place.id) !== String(placeId));
    saveUserData();
    renderSharedLists();
    renderSharedListDetail(list);
}

function completeWeeklyVisit(listId) {
    const list = AppState.sharedLists.find(item => item.id === listId);
    const placeId = document.getElementById('weekly-visit-place')?.value;
    const place = list?.places.find(item => String(item.id) === String(placeId));
    if (!list || !place) {
        alert('Choose a place in this list before logging a visit.');
        return;
    }
    if (!requirePremiumForLists()) return;

    const visitedAt = new Date();
    const weekKey = getWeekKeyInTimeZone(visitedAt, list.timeZone);
    if ((list.visits || []).some(visit => visit.weekKey === weekKey)) {
        alert('This list already has a visit logged for the current local week.');
        return;
    }
    const previousStreak = getListWeeklyStats(list, visitedAt).streak;
    const nextStreak = previousStreak + 1;
    const pointsBefore = list.points !== undefined && Number.isFinite(Number(list.points))
        ? Number(list.points)
        : getListWeeklyStats(list, visitedAt).points;
    list.visits = list.visits || [];
    list.visits.push({
        placeId: place.id,
        placeName: place.name,
        visitedAt: visitedAt.toISOString(),
        timeZone: list.timeZone,
        weekKey,
        loggedBy: AppState.currentUser?.username || 'You'
    });
    list.points = pointsBefore + 50 + (nextStreak % 4 === 0 ? 100 : 0);
    saveUserData();
    renderSharedLists();
    renderSharedListDetail(list);
}

function deleteSharedList(listId) {
    if (!confirm('Delete this list and its locally stored check-ins?')) return;
    AppState.sharedLists = AppState.sharedLists.filter(list => list.id !== listId);
    if (AppState.activeSharedListId === listId) {
        AppState.activeSharedListId = null;
        document.getElementById('shared-list-detail').classList.add('hidden');
    }
    saveUserData();
    renderSharedLists();
}

async function shareSharedList(listId) {
    if (!requirePremiumForLists()) return;
    const list = AppState.sharedLists.find(item => item.id === listId);
    if (!list) return;
    const snapshot = {
        version: 1,
        sharedList: {
            name: list.name,
            type: list.type,
            cityName: list.cityName,
            timeZone: list.timeZone,
            zoneLabel: list.zoneLabel,
            members: list.members,
            places: list.places,
            visits: list.visits || [],
            points: Number(list.points) || 0
        }
    };
    const inviteUrl = `${location.origin}${location.pathname}#shared-list=${encodeURIComponent(JSON.stringify(snapshot))}`;
    if (inviteUrl.length > 60000) {
        alert('This list is too large to share as a link. Remove some places and try again.');
        return;
    }
    try {
        await navigator.clipboard.writeText(inviteUrl);
        alert('Snapshot invite link copied. Anyone with the link can import this copy; future edits will not sync.');
    } catch (error) {
        console.error('Could not copy the shared-list link:', error);
        prompt('Copy this snapshot invite link. Future edits will not sync:', inviteUrl);
    }
}

function processSharedListInvite() {
    const encoded = new URLSearchParams(location.hash.slice(1)).get('shared-list');
    if (!encoded) return;
    if (encoded.length > 60000) {
        alert('This shared-list link is too large to import.');
        return;
    }

    let snapshot;
    try {
        snapshot = JSON.parse(encoded);
    } catch (error) {
        console.error('Could not parse shared-list link:', error);
        alert('This shared-list link is invalid.');
        return;
    }
    const shared = snapshot?.sharedList;
    if (snapshot?.version !== 1 || !shared || !Array.isArray(shared.places) || !Array.isArray(shared.members)) {
        alert('This shared-list link is not supported.');
        return;
    }
    if (!confirm(`Import "${String(shared.name || 'Shared list').slice(0, 60)}" as a separate local copy?`)) return;

    const city = cities.find(item => item.name === shared.cityName);
    const list = {
        id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: String(shared.name || 'Imported list').slice(0, 60),
        type: ['friends', 'dates', 'custom'].includes(shared.type) ? shared.type : 'custom',
        cityName: city?.name || 'Jakarta',
        cityId: city?.id || 1,
        timeZone: city?.timeZone || 'Asia/Jakarta',
        zoneLabel: city?.zoneLabel || 'WIB',
        members: shared.members.slice(0, 50).map(member => String(member).slice(0, 60)),
        places: shared.places.slice(0, 100),
        visits: Array.isArray(shared.visits) ? shared.visits.slice(-500) : [],
        points: Math.max(0, Number(shared.points) || 0),
        createdAt: new Date().toISOString(),
        isSnapshot: true
    };
    AppState.sharedLists.unshift(list);
    AppState.activeSharedListId = list.id;
    saveUserData();
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    loadSharedLists();
    navigateTo('lists');
    alert('Snapshot imported. It is a separate copy and will not sync with the sender.');
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
    const overlay = document.getElementById('voice-ai-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('voice-ai-text-input').focus();
}

function closeVoiceAIOverlay() {
    document.getElementById('voice-ai-overlay').classList.add('hidden');
    if (AppState.voiceRecognition) {
        AppState.voiceRecognition.stop();
        AppState.voiceRecognition = null;
    }
    AppState.isVoiceActive = false;
    document.getElementById('voice-ai-status').textContent = 'Type a travel question, or use voice if your browser supports it.';
}

function handleVoiceAIKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendVoiceAIMessage();
    }
}

async function sendVoiceAIMessage() {
    const input = document.getElementById('voice-ai-text-input');
    const message = input.value.trim();
    if (!message) return;

    addVoiceAIMessage(message, 'user');
    input.value = '';
    document.getElementById('voice-ai-status').textContent = 'Checking available route and place data…';
    const response = await processVoiceQuery(message);
    addVoiceAIMessage(response, 'ai');
    document.getElementById('voice-ai-status').textContent = 'Demo assistant · answers use available app data, not a live AI model.';
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

async function processVoiceQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('rain') || lowerQuery.includes('hujan') || lowerQuery.includes('weather') || lowerQuery.includes('cuaca')) {
        const weather = AppState.routeWeather;
        if (weather?.status === 'ready' && weather.rainPoints.length) {
            const point = weather.rainPoints[0];
            return `The Open-Meteo forecast shows possible rain about ${point.distanceKm.toFixed(1)} km along your planned route, in roughly ${point.etaMinutes} minutes. It is an estimate, not a road observation.`;
        }
        if (weather?.status === 'ready') {
            return 'No rain signal appeared at the three sampled points on your planned route during its estimated travel time. This is not a guarantee of clear weather.';
        }
        if (weather?.status === 'loading') return 'The route forecast is still loading. Please try again in a moment.';
        if (weather?.status === 'unavailable') return 'Live route weather is currently unavailable. Check a local forecast before travelling.';
        return 'Plan a route first and I can check the public hourly forecast at several points along it.';
    }

    if (lowerQuery.includes('missed') || lowerQuery.includes('lewat') || lowerQuery.includes('alternative route')) {
        return 'This demo cannot detect missed turns or reroute live. Use the route search to request a fresh road route, and follow local road signs.';
    }

    if (lowerQuery.includes('route') || lowerQuery.includes('direction') || lowerQuery.includes('arah') || lowerQuery.includes('navigate')) {
        if (AppState.selectedRoute && AppState.selectedDestination) {
            return `Your current ${AppState.selectedRoute.real ? 'road route' : 'estimated route'} is to ${AppState.selectedDestination.name}: ${AppState.selectedRoute.distance}, about ${AppState.selectedRoute.time}.`;
        }
        return 'Set a destination in the map search or choose a place from a city guide to preview a route.';
    }

    const keywordCategory = [
        { keys: ['restaurant', 'makan', 'warung', 'food', 'cafe', 'coffee'], id: 'restaurants' },
        { keys: ['hospital', 'clinic', 'pharmacy', 'apotek', 'doctor'], id: 'hospitals' },
        { keys: ['fuel', 'gas station', 'bensin', 'spbu'], id: 'fuel' },
        { keys: ['charging', 'charger', 'ev'], id: 'ev-charging' },
        { keys: ['station', 'stasiun', 'train'], id: 'train-stations' },
        { keys: ['bus'], id: 'bus-stations' },
        { keys: ['parking', 'parkir'], id: 'parking' },
        { keys: ['hotel', 'penginapan'], id: 'hotels' }
    ].find(item => item.keys.some(key => lowerQuery.includes(key)));

    if (keywordCategory) {
        const category = placeCategories.find(item => item.id === keywordCategory.id);
        const center = AppState.currentLocation || AppState.selectedCity;
        if (!center) return 'Allow location access or select a city so I can search nearby places.';
        try {
            const places = await fetchOpenStreetMapPlaces(category, center, 5000);
            if (!places.length) return `OpenStreetMap has no mapped ${category.label.toLowerCase()} within 5 km of your location.`;
            const closest = places.slice(0, 3).map(place => `${place.name} (${place.distance} km)`).join('; ');
            return `Closest mapped ${category.label.toLowerCase()}: ${closest}. Hours may be missing; verify before visiting.`;
        } catch (error) {
            console.error('Assistant place search failed:', error);
            return 'Nearby place search is unavailable right now. You can try again from the city guide.';
        }
    }

    if (lowerQuery.includes('emergency') || lowerQuery.includes('accident') || lowerQuery.includes('darurat')) {
        return 'This demo is not connected to emergency services or live incident reports. Contact local emergency services directly if you need urgent help.';
    }

    return 'I can answer about the route you selected, check its available weather forecast, or search nearby restaurants, hospitals, fuel, charging, stations, parking, and hotels.';
}

function toggleVoiceOverlay() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        AppState.voiceRecognition = recognition;
        recognition.lang = voiceLanguageCodes[currentVoiceLanguage] || 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => {
            AppState.isVoiceActive = true;
            document.getElementById('voice-ai-status').textContent = 'Listening…';
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('voice-ai-text-input').value = transcript;
            sendVoiceAIMessage();
        };
        recognition.onerror = (event) => {
            document.getElementById('voice-ai-status').textContent =
                event.error === 'not-allowed'
                    ? 'Microphone permission was denied. Type your question instead.'
                    : `Voice input unavailable (${event.error}). Type your question instead.`;
        };
        recognition.onend = () => {
            AppState.isVoiceActive = false;
            AppState.voiceRecognition = null;
            if (!document.getElementById('voice-ai-overlay').classList.contains('hidden') &&
                document.getElementById('voice-ai-status').textContent === 'Listening…') {
                document.getElementById('voice-ai-status').textContent = 'Voice input ended. You can type or try again.';
            }
        };
        try {
            recognition.start();
        } catch (error) {
            console.error('Voice recognition could not start:', error);
            document.getElementById('voice-ai-status').textContent = 'Voice input could not start. Type your question instead.';
        }
    } else {
        document.getElementById('voice-ai-status').textContent = 'Voice recognition is not supported in this browser. You can type your question.';
    }
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
            alert('Premium demo access is already active. No payment was taken.');
        } else {
            const confirmed = confirm('Enable the Premium demo features? No payment or subscription will be created.');
            if (confirmed) {
                AppState.currentUser.isPremium = true;
                saveUserData();
                updateUI();
                renderSharedLists();
                alert('Premium demo features are enabled in this browser.');
            }
        }
    }
}

// Update Location Status in Settings
function updateLocationStatus() {
    const status = AppState.currentLocation
        ? `Available · ±${Math.round(AppState.currentLocation.accuracy || 0)} m`
        : AppState.locationError || 'Waiting for permission';
    document.querySelectorAll('[data-location-status]').forEach(statusText => {
        statusText.textContent = status;
        statusText.style.color = AppState.currentLocation ? 'var(--success)' : 'var(--danger)';
    });
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