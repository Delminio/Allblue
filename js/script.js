
const storyRoot = document.getElementById('story-root');
const dotsRoot = document.getElementById('page-dots');
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');
const jumpButton = document.getElementById('jump-story');

function textToParagraphs(text){
  return text
    .split(/\n{2,}/)
    .map(chunk => `<p>${chunk.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function spotifyEmbed(trackId){
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

function buildPage(page, index, total){
  const section = document.createElement('section');
  section.className = `story-page reveal theme-${page.theme}`;
  section.id = page.slug;
  section.dataset.index = String(index + 1);

  section.innerHTML = `
    <div class="story-grid">
      <article class="panel visual-panel">
        <div class="main-photo">
          <img src="${page.mainImage}" alt="${page.title}">
          <div class="photo-badge">capítulo ${String(index + 1).padStart(2, '0')}</div>
        </div>

        <div class="meme-card">
          <div class="thumb">
            <img src="${page.memeImage}" alt="Momento fofo e engraçado">
          </div>
          <p>Todo grande romance tem seus momentos sérios… e seus momentos 100% “a nossa cara”.</p>
        </div>
      </article>

      <article class="panel content-panel">
        <div class="page-meta">
          <span class="page-pill">Nossa história</span>
          <span class="page-count">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        </div>

        <div>
          <h2>${page.title}</h2>
          <p class="subtitle">${page.subtitle}</p>
        </div>

        <div class="story-text">${textToParagraphs(page.text)}</div>

        <div class="spotify-card">
          <p class="label">Trilha sonora deste capítulo</p>
          <iframe
            loading="lazy"
            src="${spotifyEmbed(page.spotify)}"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
          </iframe>
        </div>

        <div class="nav-footer">
          <div class="nav-buttons">
            <button class="btn btn-secondary" data-action="prev">← Voltar</button>
            <button class="btn btn-primary" data-action="next">Próximo capítulo →</button>
          </div>
        </div>
      </article>
    </div>
  `;

  const prevBtn = section.querySelector('[data-action="prev"]');
  const nextBtn = section.querySelector('[data-action="next"]');

  prevBtn.addEventListener('click', () => goToIndex(Math.max(index - 1, 0)));
  nextBtn.addEventListener('click', () => goToIndex(Math.min(index + 1, storyPages.length - 1)));

  return section;
}

function renderStory(){
  storyPages.forEach((page, index) => {
    const section = buildPage(page, index, storyPages.length);
    storyRoot.appendChild(section);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para capítulo ${index + 1}`);
    dot.addEventListener('click', () => goToIndex(index));
    dotsRoot.appendChild(dot);
  });
  updateProgress(0);
}

function goToIndex(index){
  const target = document.getElementById(storyPages[index].slug);
  if(target){
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateProgress(index);
  }
}

function updateProgress(index){
  const percent = ((index + 1) / storyPages.length) * 100;
  progressBar.style.width = `${percent}%`;
  progressLabel.textContent = `${index + 1}/${storyPages.length}`;

  [...dotsRoot.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function setupObserver(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        const idx = Number(entry.target.dataset.index) - 1;
        if(Number.isFinite(idx) && idx >= 0){
          updateProgress(idx);
        }
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function spawnHeart(){
  const layer = document.getElementById('floating-hearts');
  const heart = document.createElement('span');
  heart.className = 'heart';
  const size = Math.random() * 14 + 10;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${Math.random() * 5 + 8}s`;
  heart.style.opacity = `${Math.random() * .45 + .18}`;
  layer.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}

function setupHearts(){
  setInterval(spawnHeart, 900);
}

function setupShortcuts(){
  document.addEventListener('keydown', (event) => {
    const sections = [...document.querySelectorAll('.story-page')];
    const visibleIndex = sections.findIndex(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35;
    });

    if(event.key === 'ArrowRight' || event.key.toLowerCase() === 'd'){
      goToIndex(Math.min((visibleIndex >= 0 ? visibleIndex : 0) + 1, storyPages.length - 1));
    }

    if(event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a'){
      goToIndex(Math.max((visibleIndex >= 0 ? visibleIndex : 0) - 1, 0));
    }
  });
}

jumpButton.addEventListener('click', () => goToIndex(0));

renderStory();
setupObserver();
setupHearts();
setupShortcuts();
