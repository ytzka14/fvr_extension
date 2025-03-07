const rephrase = (text: string) => {
  return "Test " + text.length;
};

const rephrasePage = () => {
  const articles: HTMLParagraphElement[] = [];
  document.querySelectorAll("p").forEach((element) => {
    if (element.innerText.trim().split(/ +/).length > 5) {
      articles.push(element);
    }
  });
  console.log("Tags", articles.length);

  // Rephrase
  articles.forEach((element) => {
    const rephrasedText = rephrase(element.innerText);
    element.setAttribute("fvr-data-original-content", element.innerHTML);
    element.innerText = rephrasedText;
  });
};

const revertPage = () => {
  const articles = document.querySelectorAll("[fvr-data-original-content]");
  console.log("Tags", articles.length);

  // Revert
  articles.forEach((element) => {
    const originalText = element.getAttribute("fvr-data-original-content");
    if (originalText) {
      element.innerHTML = originalText;
    }
  });
};

let loggingActive = false;
let startTime: number,
  maxScrollDepth: number,
  totalScrollAmount: number,
  upScrollAmount: number,
  scrollReversals: number,
  lastScrollY: number,
  lastScrollTime: number,
  nonScrollTime: number,
  scrollIntervals: {time: number, pixels: number}[],
  currentInterval: number,
  lastDirection: number;

const startLog = () => {
  loggingActive = true;
  startTime = Date.now();
  maxScrollDepth = 0;
  totalScrollAmount = 0;
  upScrollAmount = 0;
  scrollReversals = 0;
  lastScrollY = window.scrollY;
  lastScrollTime = Date.now();
  nonScrollTime = 0;
  scrollIntervals = [];
  currentInterval = 0;
  lastDirection = 0;

  const trackScrolling = () => {
    if (!loggingActive) return;
    const now = Date.now();
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;

    if (delta !== 0) {
      totalScrollAmount += Math.abs(delta);

      if (delta > 0) {
        if (lastDirection === -1) scrollReversals++;
        lastDirection = 1;
      } else {
        upScrollAmount += Math.abs(delta);
        if (lastDirection === 1) scrollReversals++;
        lastDirection = -1;
      }

      maxScrollDepth = Math.max(maxScrollDepth, scrollY);
      lastScrollY = scrollY;
      lastScrollTime = now;
    } else {
      nonScrollTime += now - lastScrollTime;
    }
  };

  setInterval(() => {
    if (!loggingActive) return;
    const scrollY = window.scrollY;
    const distance = Math.abs(scrollY - lastScrollY);
    scrollIntervals.push({ time: (currentInterval * 0.5), pixels: distance });
    currentInterval++;
  }, 500);

  setInterval(trackScrolling, 100);
};

const endLog = () => {
  loggingActive = false;
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  const logData = {
    url: document.location.href,
    title: document.title,
    timeSpent: timeSpent,
    maxScrollDepth: maxScrollDepth,
    totalScrollAmount: totalScrollAmount,
    nonScrollTime: Math.round(nonScrollTime / 1000),
    upScrollAmount: upScrollAmount,
    scrollReversals: scrollReversals,
    scrollIntervals: scrollIntervals
  };
  console.log("Logging Data:", logData);
  chrome.storage.local.set({ logData });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "rephrase") {
    rephrasePage();
  } else if (message.action === "revert") {
    revertPage();
  } else if (message.action === "startLog") {
    startLog();
  } else if (message.action === "endLog") {
    endLog();
  }
});
