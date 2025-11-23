/* ==================================================
   1. LÓGICA DO PLAYER (SIMULAÇÃO)
   ================================================== */
   const playBtn = document.querySelector('.play-pause-btn');
   const playIcon = document.querySelector('.play-pause-btn i');
   const progressBar = document.getElementById('progress-bar');
   const progressFill = document.getElementById('progress-fill');
   const currentTimeEl = document.getElementById('current-time');
   const totalTimeEl = document.getElementById('total-time');
   
   const totalDuration = 287; // 4:47 em segundos
   let currentSeconds = 0;
   let isPlaying = false;
   let intervalId = null; 
   
   // Define valores iniciais
   totalTimeEl.textContent = "4:47";
   currentTimeEl.textContent = "0:00"; 
   
   // Atualiza a barra e o tempo na tela
   function updateUI() {
       const percent = (currentSeconds / totalDuration) * 100;
       progressFill.style.width = `${percent}%`;
       currentTimeEl.textContent = formatTime(currentSeconds);
   }
   
   // Alterna entre Tocar e Pausar
   function togglePlay() {
       if (isPlaying) {
           // Pausar
           clearInterval(intervalId); 
           playIcon.classList.remove('fa-circle-pause');
           playIcon.classList.add('fa-circle-play');
       } else {
           // Tocar
           playIcon.classList.remove('fa-circle-play');
           playIcon.classList.add('fa-circle-pause');
           
           intervalId = setInterval(() => {
               if (currentSeconds < totalDuration) {
                   currentSeconds++;
                   updateUI();
               } else {
                   // Música acabou
                   clearInterval(intervalId);
                   isPlaying = false;
                   playIcon.classList.replace('fa-circle-pause', 'fa-circle-play');
                   currentSeconds = 0;
                   updateUI();
               }
           }, 1000);
       }
       isPlaying = !isPlaying;
   }
   
   playBtn.addEventListener('click', togglePlay);
   
   // Clicar na barra de progresso
   progressBar.addEventListener('click', (e) => {
       const width = progressBar.clientWidth;
       const clickX = e.offsetX;
       const clickPercent = clickX / width;
       
       currentSeconds = Math.floor(clickPercent * totalDuration);
       updateUI();
   });
   
   // Formata segundos em MM:SS
   function formatTime(seconds) {
       const min = Math.floor(seconds / 60);
       const sec = Math.floor(seconds % 60);
       return `${min}:${sec < 10 ? '0' : ''}${sec}`;
   }
   
   /* ==================================================
      2. NAVEGAÇÃO ENTRE TELAS (HOME <-> LIKED)
      ================================================== */
   const linkHome = document.getElementById('link-home');
   const linkLiked = document.getElementById('link-liked');
   const viewHome = document.getElementById('view-home');
   const viewLiked = document.getElementById('view-liked');
   
   // Ir para Página Inicial
   linkHome.addEventListener('click', (e) => {
       e.preventDefault();
       linkHome.classList.add('active');
       linkLiked.classList.remove('active');
       viewHome.classList.remove('hidden');
       viewLiked.classList.add('hidden');
   });
   
   // Ir para Músicas Curtidas
   linkLiked.addEventListener('click', (e) => {
       e.preventDefault();
       linkLiked.classList.add('active');
       linkHome.classList.remove('active');
       viewLiked.classList.remove('hidden');
       viewHome.classList.add('hidden');
   });
   
   /* ==================================================
      3. MENU DE USUÁRIO & LOGOUT
      ================================================== */
   const profileBtn = document.getElementById('user-profile-btn');
   const profileDropdown = document.getElementById('profile-dropdown');
   const logoutBtn = document.getElementById('logout-btn');
   
   // Abrir/Fechar Menu
   profileBtn.addEventListener('click', (e) => {
       e.stopPropagation(); // Impede fechar imediatamente
       profileDropdown.classList.toggle('hidden');
   });
   
   // Fechar ao clicar fora
   document.addEventListener('click', () => {
       if (!profileDropdown.classList.contains('hidden')) {
           profileDropdown.classList.add('hidden');
       }
   });
   
   // Botão Sair
   logoutBtn.addEventListener('click', (e) => {
       e.preventDefault();
       window.location.href = 'login.html';
   });
   
   /* ==================================================
      4. TOCAR MÚSICA AO CLICAR NA LISTA
      ================================================== */
   const tableRows = document.querySelectorAll('.table-row');
   const playerImg = document.getElementById('player-img');
   const playerTitle = document.getElementById('player-title');
   const playerArtist = document.getElementById('player-artist');
   
   tableRows.forEach(row => {
       row.addEventListener('click', (e) => {
           // Se clicar no botão de letra ou coração, não troca a música
           if (e.target.closest('.lyrics-btn') || e.target.closest('.fa-heart')) return;
   
           const title = row.getAttribute('data-title');
           const artist = row.getAttribute('data-artist');
           const image = row.getAttribute('data-image');
   
           if(!title) return; // Ignora cabeçalho
   
           // 1. Limpar estilos das outras linhas
           tableRows.forEach(r => {
               r.classList.remove('active-row');
               const spanTitle = r.querySelector('.col-title span');
               if(spanTitle) spanTitle.classList.remove('orange-text');
               const existingIcon = r.querySelector('.col-title .orange-icon');
               if(existingIcon) existingIcon.remove();
           });
   
           // 2. Aplicar estilo na linha clicada
           row.classList.add('active-row');
           const newTitleSpan = row.querySelector('.col-title span');
           if(newTitleSpan) newTitleSpan.classList.add('orange-text');
   
           // Adiciona ícone visual de "tocando"
           const icon = document.createElement('i');
           icon.className = 'fa-solid fa-chart-simple orange-icon';
           const heartIcon = row.querySelector('.col-title .fa-heart');
           
           // Insere o ícone antes do coração ou no início
           if(heartIcon) {
               row.querySelector('.col-title').insertBefore(icon, heartIcon);
           } else {
               row.querySelector('.col-title').prepend(icon);
           }
   
           // 3. Atualizar Player
           playerTitle.textContent = title;
           playerArtist.textContent = artist;
           playerImg.src = image;
   
           // 4. Reiniciar e Tocar
           currentSeconds = 0;
           updateUI();
           if (!isPlaying) {
               togglePlay();
           }
       });
   });
   
   /* ==================================================
      5. POPUP DE LETRAS
      ================================================== */
   const lyricsBtns = document.querySelectorAll('.lyrics-btn');
   const lyricsOverlay = document.getElementById('lyrics-overlay');
   const closeLyricsBtn = document.getElementById('close-lyrics');
   const lyricsTitleModal = document.getElementById('lyrics-title-modal');
   const lyricsArtistModal = document.getElementById('lyrics-artist-modal');
   const lyricsBody = document.getElementById('lyrics-body');
   
   lyricsBtns.forEach(btn => {
       btn.addEventListener('click', (e) => {
           e.stopPropagation(); // Impede tocar a música ao abrir modal
           
           const row = btn.closest('.table-row');
           const lyrics = row.getAttribute('data-lyrics');
           const title = row.getAttribute('data-title');
           const artist = row.getAttribute('data-artist');
   
           // Preenche modal
           lyricsTitleModal.textContent = title;
           lyricsArtistModal.textContent = artist;
           lyricsBody.innerHTML = lyrics || "Letra não disponível.";
   
           // Mostra modal
           lyricsOverlay.classList.remove('hidden');
       });
   });
   
   // Fechar modal (Botão X)
   closeLyricsBtn.addEventListener('click', () => {
       lyricsOverlay.classList.add('hidden');
   });
   
   // Fechar modal (Clicar fora)
   lyricsOverlay.addEventListener('click', (e) => {
       if (e.target === lyricsOverlay) {
           lyricsOverlay.classList.add('hidden');
       }
   });
   
   /* ==================================================
      6. OUTRAS INTERAÇÕES (LIKES E CONTROLES)
      ================================================== */
   document.querySelectorAll('.fa-heart').forEach(h => h.addEventListener('click', (e) => {
       e.stopPropagation(); // Impede tocar a música ao curtir
       if (h.classList.contains('fa-solid')) {
           h.classList.replace('fa-solid', 'fa-regular');
           h.classList.remove('liked');
       } else {
           h.classList.replace('fa-regular', 'fa-solid');
           h.classList.add('liked');
       }
   }));
   
   const shuffleIcon = document.querySelector('.fa-shuffle');
   const repeatIcon = document.querySelector('.fa-repeat');
   
   function toggleControl(icon) {
       icon.classList.toggle('active-control');
   }
   
   shuffleIcon.addEventListener('click', () => toggleControl(shuffleIcon));
   repeatIcon.addEventListener('click', () => toggleControl(repeatIcon));