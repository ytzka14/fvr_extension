import { useState } from "react";
import "./App.css";

function App() {
  const [vocabulary, setVocabulary] = useState<string[]>([]);


  const rephrasePage = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, { action: "rephrase" });
  };

  const revertPage = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, { action: "revert" });
  };

  const startLog = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, { action: "startLog" });
  }

  const endLog = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, { action: "endLog" });
  }

  const viewVocabulary = async () => {
    // chrome.runtime.sendMessage를 직접 사용하거나,
    // content.ts의 getUserDifficultWords 함수를 호출할 수 있습니다.
    chrome.runtime.sendMessage({ action: "getUserDifficultWords" }, (response) => {
      if (response) {
        console.log("Retrieved vocabulary:", response);
        setVocabulary(response);
      } else {
        console.error("Failed to retrieve vocabulary");
      }
    });
  };

  return (
    <div className="App">
      <div className="flex flex-col w-32 text-md gap-6 text-slate-900">
        <button
          className="bg-slate-100 rounded-lg p-1 cursor-pointer hover:bg-slate-200 transition-all shadow-lg focus:inset-shadow-lg"
          onClick={rephrasePage}
        >
          Rephrasing
        </button>
        <button
          className="bg-slate-100 rounded-lg p-1 cursor-pointer hover:bg-slate-200 transition-all shadow-lg focus:inset-shadow-lg"
          onClick={revertPage}
        >
          Revert
        </button>
        <button
          className="bg-slate-100 rounded-lg p-1 cursor-pointer hover:bg-slate-200 transition-all shadow-lg focus:inset-shadow-lg"
          onClick={startLog}
        >
          Start Logging
        </button>
        <button
          className="bg-slate-100 rounded-lg p-1 cursor-pointer hover:bg-slate-200 transition-all shadow-lg focus:inset-shadow-lg"
          onClick={endLog}
        >
          End Logging
        </button>
        {/* View Vocabulary 버튼 */}
        <button
          className="bg-green-100 rounded-lg p-1 cursor-pointer hover:bg-green-200 transition-all shadow-lg focus:inset-shadow-lg"
          onClick={viewVocabulary}
        >
          View Vocabulary
        </button>
        </div>
        {/* 저장된 단어장을 보여주는 UI */}
        {vocabulary.length > 0 && (
          <div className="mt-4 p-4 border rounded bg-slate-50">
           <h3 className="text-lg font-bold mb-2">Saved Vocabulary</h3>
           <ul className="list-disc list-inside">
            {vocabulary.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
      </div>
      )}
    </div>
  );
}

export default App;