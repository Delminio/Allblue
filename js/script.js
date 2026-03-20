const heroScreen = document.getElementById('hero-screen');
const storyScreen = document.getElementById('story-screen');
const startStoryBtn = document.getElementById('start-story');
const goHomeBtn = document.getElementById('go-home');
const pageIndicator = document.getElementById('page-indicator');
const pageKicker = document.getElementById('page-kicker');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const mainImage = document.getElementById('main-image');
const memeImage = document.getElementById('meme-image');
const pageText = document.getElementById('page-text');
const spotifyFrame = document.getElementById('spotify-frame');
const spotifyLink = document.getElementById('spotify-link');
const dotsRoot = document.getElementById('page-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

function textToParagraphs(text){
  return text
    .split(/\n{2,}/)
    .map(chunk => `<p>${chunk.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function spotifyEmbed(trackId){
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

function spotifyTrack(trackId){
  return `https://open.spotify.com/intl-pt/track/${trackId}`;
}

function renderDots(){
  dotsRoot.innerHTML = '';
  storyPages.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para a página ${index + 1}`);
    dot.classList.toggle('active', index === currentIndex);
    dot.addEventListener('click', () => showPage(index));
    dotsRoot.appendChild(dot);
  });
}

function showPage(index){
  currentIndex = Math.max(0, Math.min(index, storyPages.length - 1));
  const page = storyPages[currentIndex];

  heroScreen.hidden = true;
  storyScreen.hidden = false;

  pageIndicator.textContent = `página ${currentIndex + 1} de ${storyPages.length}`;
  pageKicker.textContent = `PÁGINA ${currentIndex + 1} • ${page.slug.toUpperCase()}`;
  pageTitle.textContent = page.title;
  pageSubtitle.textContent = page.subtitle;
  mainImage.src = page.mainImage;
  mainImage.alt = page.title;
  memeImage.src = page.memeImage;
  memeImage.alt = `Imagem complementar de ${page.title}`;
  pageText.innerHTML = textToParagraphs(page.text);
  spotifyFrame.src = spotifyEmbed(page.spotify);
  spotifyLink.href = spotifyTrack(page.spotify);

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === storyPages.length - 1;
  prevBtn.style.opacity = currentIndex === 0 ? '.55' : '1';
  nextBtn.style.opacity = currentIndex === storyPages.length - 1 ? '.55' : '1';
  nextBtn.textContent = currentIndex === storyPages.length - 1 ? 'fim 💖' : 'próxima →';

  renderDots();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome(){
  storyScreen.hidden = true;
  heroScreen.hidden = false;
  pageIndicator.textContent = `página 1 de ${storyPages.length}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function spawnHeart(){
  const layer = document.getElementById('floating-hearts');
  const heart = document.createElement('span');
  heart.className = 'heart';
  const size = Math.random() * 14 + 10;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animation = `floatUp ${Math.random() * 5 + 8}s linear forwards`;
  heart.style.opacity = `${Math.random() * .45 + .18}`;
  layer.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}

function setupHearts(){
  setInterval(spawnHeart, 900);
}

startStoryBtn.addEventListener('click', () => showPage(0));
goHomeBtn.addEventListener('click', showHome);
prevBtn.addEventListener('click', () => showPage(currentIndex - 1));
nextBtn.addEventListener('click', () => {
  if(currentIndex < storyPages.length - 1) showPage(currentIndex + 1);
});

document.addEventListener('keydown', (event) => {
  if(event.key === 'ArrowRight' && !storyScreen.hidden && currentIndex < storyPages.length - 1){
    showPage(currentIndex + 1);
  }
  if(event.key === 'ArrowLeft' && !storyScreen.hidden && currentIndex > 0){
    showPage(currentIndex - 1);
  }
  if(event.key === 'Escape'){
    showHome();
  }
});

renderDots();
setupHearts();
