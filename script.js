const recognition = new window.webkitSpeechRecognition();
let isRecording = false;
let speech = new SpeechSynthesisUtterance();
let isSpeaking = false;

const langSelect = document.getElementById("langSelect");
let langCode = langSelect.value;

// Mettre à jour la variable langCode à chaque changement de l'option sélectionnée
langSelect.addEventListener("change", () => {
  langCode = langSelect.value;
});

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = () => {
  console.log("Enregistrement en cours...");
  document.getElementById("message").innerText = "Enregistrement en cours...";
  isRecording = true;
};

recognition.onresult = (event) => {
  let interimTranscript = "";
  let finalTranscript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
  }

  document.getElementById("resultat").innerHTML =
    finalTranscript + interimTranscript;

  // Appel de l'API Deepl Translate
  const apiKey = "811ca348-1d0c-598e-0347-e9903ceaeea9:fx";
  const endpoint = "https://api-free.deepl.com/v2/translate";
  const url = `${endpoint}?auth_key=${apiKey}&text=${finalTranscript}&target_lang=${langCode}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("resultatTraduit").innerHTML =
        data.translations[0].text;
      if (!isSpeaking) {
        speech.text = data.translations[0].text;
        speech.lang = langCode;
        window.speechSynthesis.speak(speech);
        isSpeaking = true;
        speech.onend = () => {
          isSpeaking = false;
        };
      }
    })
    .catch((error) => console.log(error));
};

recognition.onend = () => {
  console.log("Enregistrement terminé.");
  document.getElementById("message").innerText = "";
  isRecording = false;
};

const startRecording = () => {
  recognition.start();
};

const stopRecording = () => {
  recognition.stop();
};

document.getElementById("onoff").addEventListener("change", () => {
  const on = document.getElementById("onoff").checked;

  if (on) {
    startRecording();
  } else {
    if (isRecording) {
      stopRecording();
    }
  }
});

document.getElementById("language").addEventListener("change", () => {
  langCode = document.getElementById("language").value.toUpperCase();
});
