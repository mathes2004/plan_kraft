const $ = (id) => document.getElementById(id);
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
let protectedState = true;
let rainRunning = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let layers = false;
function setProtection(value) {
  protectedState = value;
  $('roof-scene').classList.toggle('is-before', !value);
  $('before-button').classList.toggle('active', !value);
  $('after-button').classList.toggle('active', value);
  $('before-button').setAttribute('aria-pressed', String(!value));
  $('after-button').setAttribute('aria-pressed', String(value));
  $('protection-tag').classList.toggle('is-before', !value);
  $('protection-label').textContent = value ? 'Protected by Plan Kraft' : 'Unprotected roof';
  $('roof-label').textContent = value
    ? 'A seamless protective layer'
    : 'Cracks let water find a way in';
  $('demo-caption').textContent = value
    ? 'Rain meets protection. Your home stays dry.'
    : 'Rain enters through cracks. Water reaches the inside.';
  emit('roof:state', { protected: value });
}
function setRainButton() {
  $('pause-rain').setAttribute('aria-label', rainRunning ? 'Pause rain' : 'Resume rain');
  $('pause-rain').setAttribute('aria-pressed', String(!rainRunning));
  $('pause-rain').innerHTML =
    '<svg><use href="#i-' + (rainRunning ? 'pause' : 'play') + '"/></svg>';
}
$('before-button').addEventListener('click', () => setProtection(false));
$('after-button').addEventListener('click', () => setProtection(true));
$('pause-rain').addEventListener('click', () => {
  rainRunning = !rainRunning;
  setRainButton();
  emit('roof:rain', { running: rainRunning });
});
$('rain-intensity').addEventListener('input', (e) => {
  emit('roof:intensity', { value: Number(e.target.value) });
  $('roof-scene').style.setProperty('--rain-opacity', Number(e.target.value) / 100);
});
$('reset-scene').addEventListener('click', () => emit('roof:reset', {}));
$('layers-button').addEventListener('click', () => {
  layers = !layers;
  $('layers-button').setAttribute('aria-pressed', String(layers));
  $('layers-button').querySelector('span').textContent = layers ? 'Close layers' : 'Explore layers';
  emit('roof:view', { view: layers ? 'layers' : 'roof' });
});
window.addEventListener('roof:ready', () => {
  emit('roof:state', { protected: protectedState });
  emit('roof:rain', { running: rainRunning });
  emit('roof:intensity', { value: Number($('rain-intensity').value) });
});
window.addEventListener('roof:error', () => {
  $('layers-button').hidden = true;
  $('rain-intensity').disabled = true;
  $('pause-rain').hidden = true;
  document.querySelector('.rain-controls > span').hidden = true;
  $('reset-scene').hidden = true;
  document.querySelector('.scene-help').textContent = 'Roof protection illustration';
});
setRainButton();
