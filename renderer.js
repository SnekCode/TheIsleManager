const configLegacy = document.getElementById('config-legacy');
const configEvrima = document.getElementById('config-evrima');

const startLegacy = document.getElementById('start-legacy');
const startEvrima = document.getElementById('start-evrima');

const initHintText = document.getElementById('init-hint');
const initSetup = document.getElementById('init-setup');

// look for app state from a file
// if exists, show start game buttons
// if not, show config buttons
// if not, show init hint
// if not, show init setup



configLegacy.addEventListener('click', () => {
  console.log('checkout legacy');
    window.api.configGame('legacy');
});

configEvrima.addEventListener('click', () => {
    window.api.configGame('evrima');
});

startLegacy.addEventListener('click', () => {
    window.api.startGame('legacy');
});

startEvrima.addEventListener('click', () => {
    window.api.startGame('evrima');
});

// init button listener
initSetup.addEventListener('click', () => {
  window.init.setupLegacy();
});