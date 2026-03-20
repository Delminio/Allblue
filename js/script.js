
const pages = window.storyPages || [];
let currentPage = 0;

const pageTitle = document.getElementById('pageTitle');
const pageKicker = document.getElementById('pageKicker');
const pageText = document.getElementById('pageText');
const imgLeft = document.getElementById('imgLeft');
const imgRight = document.getElementById('imgRight');
const spotifyFrame = document.getElementById('spotifyFrame');
const spotifyOpen = document.getElementById('spotifyOpen');
const pageCounter = document.getElementById('pageCounter');
const storyCard = document.querySelector('.story-card');

function renderPage(index){
  const p = pages[index];
  if(!p) return;

  storyCard.classList.remove('fade-in');
  storyCard.classList.add('fade-out');

  setTimeout(() => {
    pageTitle.textContent = p.title;
    pageKicker.textContent = p.subtitle;
    pageText.textContent = p.text;
    imgLeft.src = p.images[0] || '';
    imgRight.src = p.images[1] || '';
    spotifyFrame.src = p.spotify;
    spotifyOpen.href = p.spotify.replace('/embed', '').split('?')[0];
    pageCounter.textContent = `página ${index + 1} de ${pages.length}`;

    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('prevBtn').style.opacity = index === 0 ? '.5' : '1';
    document.getElementById('nextBtn').textContent = index === pages.length - 1 ? 'Recomeçar' : 'Próximo';

    storyCard.classList.remove('fade-out');
    storyCard.classList.add('fade-in');
    window.scrollTo({top:0, behavior:'smooth'});
  }, 180);
}

document.getElementById('nextBtn').addEventListener('click', () => {
  currentPage = currentPage === pages.length - 1 ? 0 : currentPage + 1;
  renderPage(currentPage);
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if(currentPage > 0){
    currentPage--;
    renderPage(currentPage);
  }
});

function createHeart(){
  const el = document.createElement('div');
  el.className = 'heart';
  el.textContent = Math.random() > 0.5 ? '❤' : '♡';
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (16 + Math.random() * 18) + 'px';
  el.style.animationDuration = (5 + Math.random() * 5) + 's';
  el.style.opacity = 0.65 + Math.random() * 0.3;
  document.getElementById('hearts').appendChild(el);
  setTimeout(() => el.remove(), 11000);
}

setInterval(createHeart, 520);
for(let i = 0; i < 14; i++) setTimeout(createHeart, i * 180);

renderPage(currentPage);
