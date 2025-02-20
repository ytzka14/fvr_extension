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

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "rephrase") {
    rephrasePage();
  } else if (message.action === "revert") {
    revertPage();
  }
});
