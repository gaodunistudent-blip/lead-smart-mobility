import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';

window.L = L;

function loadClassicScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Unable to load ${src}`));
        document.body.appendChild(script);
    });
}

async function startApp() {
    await loadClassicScript('/i18n-global.js');
    await loadClassicScript('/lead-app.js');
    window.initializeApp();
}

startApp().catch((error) => {
    console.error('LEAD failed to start:', error);
    const status = document.getElementById('app-startup-error');
    if (status) {
        status.hidden = false;
        status.textContent = `The app could not start: ${error.message}`;
    }
});
