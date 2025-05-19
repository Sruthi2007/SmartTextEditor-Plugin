
function initSmartTextEditor(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error("SmartText Editor: Container not found");
    return;
  }

  const toolbarHTML = `
    <div class="smart-toolbar">
      <button onclick="document.execCommand('bold')"><b>B</b></button>
      <button onclick="document.execCommand('italic')"><i>I</i></button>
      <button onclick="document.execCommand('underline')"><u>U</u></button>
      <button onclick="document.execCommand('strikeThrough')"><s>S</s></button>
      <select onchange="document.execCommand('fontName', false, this.value)">
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Courier New">Courier</option>
      </select>
      <select onchange="document.execCommand('fontSize', false, this.value)">
        <option value="3">Normal</option>
        <option value="1">Small</option>
        <option value="5">Large</option>
        <option value="6">X-Large</option>
      </select>
      <input type="color" onchange="document.execCommand('foreColor', false, this.value)">
      <input type="color" onchange="document.execCommand('hiliteColor', false, this.value)">
      <button onclick="document.execCommand('justifyLeft')">Left</button>
      <button onclick="document.execCommand('justifyCenter')">Center</button>
      <button onclick="document.execCommand('justifyRight')">Right</button>
      <button onclick="document.execCommand('justifyFull')">Justify</button>
      <button onclick="document.execCommand('insertUnorderedList')">• List</button>
      <button onclick="document.execCommand('insertOrderedList')">1. List</button>
      <button id="smartClear">Clear</button>
      <button id="smartMic">🎤 Speak</button>
    </div>
  `;

  const editorHTML = `
    <div id="smartEditor" contenteditable="true" class="smart-editor">
      Start typing or click 🎤 to speak...
    </div>
  `;

  container.innerHTML = toolbarHTML + editorHTML;

  const editor = document.getElementById("smartEditor");
  const micBtn = document.getElementById("smartMic");
  const clearBtn = document.getElementById("smartClear");

  clearBtn.onclick = () => {
    editor.innerHTML = "Start typing or click 🎤 to speak...";
  };

  let recognition;
  let isListening = false;
  micBtn.addEventListener("click", () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech Recognition not supported");
      return;
    }

    if (!recognition) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = function (event) {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript.trim() !== "") {
          editor.innerHTML += finalTranscript;
        }
      };

      recognition.onerror = function (event) {
        console.error("Speech error:", event.error);
      };

      recognition.onend = function () {
        micBtn.textContent = "🎤 Speak";
        isListening = false;
      };
    }

    if (!isListening) {
      recognition.start();
      micBtn.textContent = "🛑 Stop";
      isListening = true;
    } else {
      recognition.stop();
      micBtn.textContent = "🎤 Speak";
      isListening = false;
    }
  });
}
