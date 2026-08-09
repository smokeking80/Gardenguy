// Shared nav + menu overlay for all pages
// Include: <script src="nav.js"></script> before </body>

(function(){

// Load Phosphor Icons if not already loaded
if(!document.querySelector('script[src*="phosphor-icons"]')){
  var ph=document.createElement('script');
  ph.src='https://unpkg.com/@phosphor-icons/web@2.1.1';
  document.head.appendChild(ph);
}

// Inject nav CSS
const style = document.createElement('style');
style.textContent = `
nav#main-nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(20px,5vw,80px);height:72px;
  background:rgba(8,24,12,0.95);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border-bottom:1px solid rgba(255,255,255,.07);
  transition:background .3s;
}
.mnav-logo{
  display:flex;align-items:center;gap:10px;
  text-decoration:none;
}
@media(min-width:601px){
  .mnav-logo{margin-left:50px}
}
.mnav-logo img{height:130px;width:auto;border-radius:3px}
.mnav-logo-text{
  font-family:'Playfair Display',Georgia,serif;
  font-size:1.15rem;font-weight:700;
  color:#fff;letter-spacing:-.01em;
}
.mnav-logo-text span{color:#9ACD5A}
.mnav-right{display:flex;align-items:center;gap:16px}
.mnav-phone{
  font-size:.82rem;font-weight:600;
  color:rgba(255,255,255,.65);text-decoration:none;
  transition:color .2s;
  display:flex;align-items:center;gap:6px;
}
.mnav-phone:hover{color:#fff}
.mnav-mail{
  font-size:.78rem;font-weight:500;letter-spacing:.04em;
  color:rgba(255,255,255,.45);text-decoration:none;
  transition:color .2s;
}
.mnav-mail:hover{color:#fff}
.mnav-kontakt{
  font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(255,255,255,.5);text-decoration:none;
  transition:color .2s;
}
.mnav-kontakt:hover{color:#fff}
.mnav-btn{
  display:flex;align-items:center;gap:8px;
  background:none;border:1.5px solid rgba(255,255,255,.18);
  color:#fff;padding:8px 18px;border-radius:2px;
  font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  cursor:pointer;transition:all .2s;font-family:inherit;
}
.mnav-btn:hover{border-color:#9ACD5A;color:#9ACD5A}
.mnav-btn-lines{display:flex;flex-direction:column;gap:3px}
.mnav-btn-lines span{display:block;width:13px;height:1.5px;background:currentColor;border-radius:1px;transition:all .2s}

/* MENU OVERLAY */
.moverlay{
  position:fixed;inset:0;z-index:300;
  background:rgba(6,20,10,0.98);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  display:none;flex-direction:column;
  overflow-y:auto;
  opacity:0;transition:opacity .25s;
}
.moverlay.open{display:flex;opacity:1}
.moverlay-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(20px,5vw,80px);height:72px;
  border-bottom:1px solid rgba(255,255,255,.07);
  flex-shrink:0;
}
.moverlay-logo{
  font-family:'Playfair Display',Georgia,serif;
  font-size:1.15rem;font-weight:700;color:#fff;
  text-decoration:none;
}
.moverlay-logo span{color:#9ACD5A}
.moverlay-close{
  display:flex;align-items:center;gap:8px;
  background:none;border:1.5px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.6);padding:8px 18px;border-radius:2px;
  font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  cursor:pointer;transition:all .2s;font-family:inherit;
}
.moverlay-close:hover{border-color:#fff;color:#fff}
.moverlay-items{
  display:flex;flex-direction:column;
  padding:0 clamp(20px,5vw,80px);
  flex:1;
}
.moverlay-item{
  display:flex;align-items:center;gap:18px;
  padding:18px 0;
  border-bottom:1px solid rgba(255,255,255,.06);
  text-decoration:none;
  transition:all .2s;
}
.moverlay-item:first-child{border-top:1px solid rgba(255,255,255,.06)}
.moverlay-item:hover .mov-sub{color:#9ACD5A}
.moverlay-item:hover .mov-arrow{color:#9ACD5A;transform:translateX(5px)}
.mov-icon i{font-size:1.3rem;color:rgba(255,255,255,.7)}
.mov-icon{
  width:44px;height:44px;border-radius:3px;
  background:rgba(255,255,255,.05);
  display:flex;align-items:center;justify-content:center;
  font-size:1.15rem;flex-shrink:0;
  transition:background .2s;
}
.moverlay-item:hover .mov-icon i{font-size:1.3rem;color:rgba(255,255,255,.7)}
.mov-icon{background:rgba(154,205,90,.12)}
.mov-text{flex:1;min-width:0}
.mov-label{
  font-size:.6rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
  color:rgba(255,255,255,.28);margin-bottom:3px;
}
.mov-sub{
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(.95rem,2vw,1.35rem);
  font-weight:700;color:#fff;line-height:1.1;
  transition:color .2s;
}
.mov-arrow{
  color:rgba(255,255,255,.13);font-size:1rem;
  flex-shrink:0;transition:all .22s;
}
.moverlay-bottom{
  padding:24px clamp(20px,5vw,80px) 36px;
  border-top:1px solid rgba(255,255,255,.07);
  display:flex;gap:24px;flex-wrap:wrap;align-items:center;
  flex-shrink:0;
}
.moverlay-bottom a{
  font-size:.75rem;color:rgba(255,255,255,.32);
  text-decoration:none;transition:color .2s;
}
.moverlay-bottom a:hover{color:#fff}
@media(max-width:600px){
  .mnav-phone{font-size:.75rem}
  .mnav-mail,.mnav-kontakt{display:none}
}
@media(max-width:400px){
  .mnav-phone{display:none}
}
`;
document.head.appendChild(style);

// NAV HTML
const navHTML = `
<nav id="main-nav">
  <a class="mnav-logo" href="index.html">
    <img src="images/logo.png" alt="POKOSEK.CZ" onerror="this.style.display='none'"/>
  </a>
  <div class="mnav-right">
    <a class="mnav-mail" href="mailto:info@pokosek.cz">✉ MAIL</a>
    <a class="mnav-phone" href="tel:+420735649011">📞 735 649 011</a>
    <a class="mnav-kontakt" href="kontakt.html">KONTAKT</a>
    <button class="mnav-btn" id="mnavBtn" aria-label="Otevřít menu">
      <div class="mnav-btn-lines"><span></span><span></span><span></span></div>
      MENU
    </button>
  </div>
</nav>`;

// OVERLAY HTML
const overlayHTML = `
<div class="moverlay" id="moverlay" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="moverlay-head">
    <a class="moverlay-logo" href="index.html">POKOSEK<span>.CZ</span></a>
    <button class="moverlay-close" id="moverlayClose">ZAVŘÍT ✕</button>
  </div>
  <div class="moverlay-items">
    <a href="seceni.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-tree"></i></div>
      <div class="mov-text">
        <div class="mov-label">Roste mi tráva</div>
        <div class="mov-sub">Sečení trávy</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="zavlazovani.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-drop"></i></div>
      <div class="mov-text">
        <div class="mov-label">Jsem na suchu</div>
        <div class="mov-sub">Zavlažování na míru</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="navrhy.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-ruler"></i></div>
      <div class="mov-text">
        <div class="mov-label">Chci to vidět na papíře</div>
        <div class="mov-sub">Návrhy zahrad</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="upravy.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-scissors"></i></div>
      <div class="mov-text">
        <div class="mov-label">Chci mít pořádek</div>
        <div class="mov-sub">Úprava okrajů</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="arealy.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-buildings"></i></div>
      <div class="mov-text">
        <div class="mov-label">Mám areál a přerůstá mi přes hlavu</div>
        <div class="mov-sub">Údržba areálů</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="odvoz.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-truck"></i></div>
      <div class="mov-text">
        <div class="mov-label">Potřebuji se zbavit biomasy</div>
        <div class="mov-sub">Odvoz biomasy</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="cenik.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-currency-dollar"></i></div>
      <div class="mov-text">
        <div class="mov-label">Kolik to stojí</div>
        <div class="mov-sub">Ceník služeb</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
    <a href="kontakt.html" class="moverlay-item">
      <div class="mov-icon"><i class="ph ph-phone"></i></div>
      <div class="mov-text">
        <div class="mov-label">Kam mám zavolat</div>
        <div class="mov-sub">Kontakt a poptávka</div>
      </div>
      <div class="mov-arrow">→</div>
    </a>
  </div>
  <div class="moverlay-bottom">
    <a href="tel:+420735649011">+420 735 649 011</a>
    <a href="mailto:info@pokosek.cz">info@pokosek.cz</a>
    <a href="kontakt.html">Poptávka zdarma →</a>
  </div>
</div>`;

// Inject into page
document.body.insertAdjacentHTML('afterbegin', navHTML + overlayHTML);

// Logic
const mnavBtn = document.getElementById('mnavBtn');
const moverlay = document.getElementById('moverlay');
const moverlayClose = document.getElementById('moverlayClose');

function openMenu(){
  moverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu(){
  moverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mnavBtn.addEventListener('click', openMenu);
moverlayClose.addEventListener('click', closeMenu);
moverlay.addEventListener('click', e => { if(e.target === moverlay) closeMenu(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

// Nav scroll
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  mainNav.style.background = scrollY > 40
    ? 'rgba(6,18,8,0.98)'
    : 'rgba(8,24,12,0.95)';
}, { passive: true });

// Body padding for fixed nav
document.body.style.paddingTop = '0';

})();
