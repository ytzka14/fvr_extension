import "./App.css";

function App() {
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
      </div>
    </div>
  );
}

export default App;
