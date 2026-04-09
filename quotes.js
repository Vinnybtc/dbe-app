// ============================================
// DBE Community App — Bitcoin Quotes
// Spreuken van Bitcoin OG's + DBE bestuursleden
// ============================================

const Quotes = (() => {

  const ALL_QUOTES = [
    // === Satoshi Nakamoto ===
    { text: "If you don't believe it or don't get it, I don't have the time to try to convince you, sorry.", author: "Satoshi Nakamoto", role: "Bitcoin Creator" },
    { text: "It might make sense just to get some in case it catches on.", author: "Satoshi Nakamoto", role: "Bitcoin Creator" },
    { text: "The root problem with conventional currency is all the trust that's required to make it work.", author: "Satoshi Nakamoto", role: "Bitcoin Creator" },
    { text: "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.", author: "Satoshi Nakamoto", role: "Bitcoin Creator" },
    { text: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.", author: "Satoshi Nakamoto", role: "Genesis Block" },
    { text: "Lost coins only make everyone else's coins worth slightly more.", author: "Satoshi Nakamoto", role: "Bitcoin Creator" },

    // === Michael Saylor ===
    { text: "Bitcoin is a swarm of cyber hornets serving the goddess of wisdom, feeding on the fire of truth.", author: "Michael Saylor", role: "MicroStrategy" },
    { text: "Bitcoin is the most efficient system in the history of mankind for channeling energy through time and space.", author: "Michael Saylor", role: "MicroStrategy" },
    { text: "Bitcoin is digital gold — it's better at being gold than gold.", author: "Michael Saylor", role: "MicroStrategy" },
    { text: "If you're going to invest for the next decade, buy bitcoin. If you're going to invest for the next century, buy bitcoin.", author: "Michael Saylor", role: "MicroStrategy" },
    { text: "Bitcoin is the first digital monetary network capable of storing all the money in the world.", author: "Michael Saylor", role: "MicroStrategy" },
    { text: "Every company needs a Bitcoin strategy.", author: "Michael Saylor", role: "MicroStrategy" },

    // === Jeff Booth ===
    { text: "Technology is deflationary. Money printing fights it. Bitcoin aligns money with the natural order.", author: "Jeff Booth", role: "The Price of Tomorrow" },
    { text: "The choice is simple: a world of abundance through deflation, or continued inflation that benefits the few.", author: "Jeff Booth", role: "Author & Entrepreneur" },
    { text: "You can't fix the money without Bitcoin. Period.", author: "Jeff Booth", role: "Author & Entrepreneur" },
    { text: "Bitcoin removes the ability of governments to steal from their citizens through inflation.", author: "Jeff Booth", role: "The Price of Tomorrow" },

    // === Other Bitcoin OG's ===
    { text: "Bitcoin is the internet of money.", author: "Andreas Antonopoulos", role: "Bitcoin Educator" },
    { text: "Not your keys, not your coins.", author: "Andreas Antonopoulos", role: "Bitcoin Educator" },
    { text: "We have elected to put our money and faith in a mathematical framework that is free of politics.", author: "Tyler Winklevoss", role: "Gemini" },
    { text: "Bitcoin is a demographic mega-trend as powerful as the internet.", author: "Cathie Wood", role: "ARK Invest" },
    { text: "Stay humble, stack sats.", author: "Matt Odell", role: "Bitcoin Advocate" },
    { text: "Bitcoin is hope.", author: "Jack Mallers", role: "Strike CEO" },
    { text: "There has never been a more important time to understand money. Bitcoin fixes this.", author: "Lyn Alden", role: "Investment Strategist" },
    { text: "Fix the money, fix the world.", author: "Bitcoin Community", role: "" },
    { text: "Bitcoin is the exit.", author: "Balaji Srinivasan", role: "Entrepreneur" },
    { text: "Run a node. Verify, don't trust.", author: "Bitcoin Community", role: "" },
    { text: "The Bitcoin network is the most powerful computing network in the world.", author: "Jack Dorsey", role: "Block, Inc." },
    { text: "I think Bitcoin is the first encrypted money that has the potential to do something like change the world.", author: "Peter Thiel", role: "PayPal Co-founder" },
    { text: "Bitcoin is a remarkable cryptographic achievement and the ability to create something that is not duplicable in the digital world has enormous value.", author: "Eric Schmidt", role: "Ex-Google CEO" },
    { text: "If the cryptocurrency market overall grows, Bitcoin benefits.", author: "Larry Fink", role: "BlackRock CEO" },

    // === DBE Bestuursleden ===
    { text: "Bitcoin verbindt mensen. De Dutch Bitcoin Embassy is daar het bewijs van.", author: "Pieter Voogt", role: "DBE Voorzitter" },
    { text: "Echte rijkdom zit niet in je wallet, maar in de connecties die je maakt.", author: "Marc van Versendaal", role: "DBE Bitcoin Advocate" },
    { text: "De kracht van een community zit in de bereidheid om kennis te delen.", author: "Bram Kanstein", role: "DBE Events & Content" },
    { text: "AI en Bitcoin zijn de twee grootste technologische revoluties van onze tijd. Combineer ze.", author: "Vincent de Wit", role: "DBE AI & Vastgoed" },
    { text: "Actie is de brug tussen kennis en resultaat.", author: "Dirk Taat", role: "DBE Organisatie" },

    // === Nederlandse Bitcoin community ===
    { text: "Begin klein, denk groot, stack consistent.", author: "Dutch Bitcoin Embassy", role: "Community Wijsheid" },
    { text: "Elke sat telt. Elke connectie telt. Elke meetup telt.", author: "Dutch Bitcoin Embassy", role: "Community Wijsheid" },
    { text: "Explore Bitcoin. Connect Now.", author: "Dutch Bitcoin Embassy", role: "Motto" },
  ];

  function getRandomQuote() {
    return ALL_QUOTES[Math.floor(Math.random() * ALL_QUOTES.length)];
  }

  function getDailyQuote() {
    // Same quote for the entire day
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return ALL_QUOTES[dayIndex % ALL_QUOTES.length];
  }

  function renderQuoteWidget() {
    const q = getDailyQuote();
    return `
      <div class="quote-widget">
        <div class="quote-mark">"</div>
        <div class="quote-text">${q.text}</div>
        <div class="quote-author">
          <span class="quote-name">${q.author}</span>
          ${q.role ? `<span class="quote-role">${q.role}</span>` : ''}
        </div>
      </div>`;
  }

  function renderQuoteCard() {
    const q = getRandomQuote();
    return `
      <div class="quote-card">
        <div class="quote-text-sm">"${q.text}"</div>
        <div class="quote-author-sm">— ${q.author}</div>
      </div>`;
  }

  // Inject daily quote into dashboard
  function injectIntoDashboard() {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;

    // Add quote widget after greeting
    const greeting = dashboard.querySelector('.dashboard-greeting');
    if (greeting && !dashboard.querySelector('.quote-widget')) {
      greeting.insertAdjacentHTML('afterend', renderQuoteWidget());
    }
  }

  // Observe dashboard loads
  const observer = new MutationObserver(() => {
    if (document.getElementById('dashboard-content')?.children.length > 0) {
      setTimeout(injectIntoDashboard, 50);
    }
  });

  function init() {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return { getRandomQuote, getDailyQuote, renderQuoteWidget, renderQuoteCard, ALL_QUOTES, init };
})();

document.addEventListener('DOMContentLoaded', Quotes.init);
