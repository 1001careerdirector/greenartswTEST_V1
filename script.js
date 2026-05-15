const steps = [
  {
    id: "story",
    title: "이야기를 보고 장면을 떠올려요",
    pill: "1단계",
    line: "달님이 창가에 앉아 작은 책을 펼쳤어요.",
    sound: "반짝",
    render() {
      return `
        <div class="big-word" aria-label="오늘의 낱말">달</div>
        <div class="option-grid">
          <button class="choice-card" type="button" data-answer="moon">
            <strong>달님</strong>
            <span>밤하늘에서 환하게 비춰요.</span>
          </button>
          <button class="choice-card" type="button" data-answer="book">
            <strong>책</strong>
            <span>그림과 이야기가 들어 있어요.</span>
          </button>
        </div>
      `;
    },
  },
  {
    id: "listen",
    title: "문장을 듣고 같은 소리를 찾아요",
    pill: "2단계",
    line: "숲속 친구들이 조용히 귀를 기울였어요.",
    sound: "소곤",
    render() {
      return `
        <div class="audio-card">
          <p>달님이 말했어요. “다 같이 책을 읽자.”</p>
          <div class="wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="option-grid">
          <button class="choice-card" type="button" data-answer="correct">
            <strong>읽자</strong>
            <span>들은 말과 같아요.</span>
          </button>
          <button class="choice-card" type="button" data-answer="wrong">
            <strong>뛰자</strong>
            <span>소리가 조금 달라요.</span>
          </button>
        </div>
      `;
    },
  },
  {
    id: "letters",
    title: "첫소리 ㄷ이 들어간 낱말을 골라요",
    pill: "3단계",
    line: "달님, 다람쥐, 도토리가 책 속에서 만났어요.",
    sound: "도란",
    render() {
      return `
        <div class="letter-bank" aria-label="글자 카드">
          <button class="letter-tile correct" type="button" data-answer="correct">달</button>
          <button class="letter-tile" type="button" data-answer="wrong">밤</button>
          <button class="letter-tile correct" type="button" data-answer="correct">도</button>
          <button class="letter-tile" type="button" data-answer="wrong">별</button>
        </div>
        <div class="option-grid">
          <button class="choice-card" type="button" data-answer="correct">
            <strong>달, 도토리</strong>
            <span>둘 다 ㄷ으로 시작해요.</span>
          </button>
          <button class="choice-card" type="button" data-answer="wrong">
            <strong>밤, 별</strong>
            <span>둘 다 ㅂ으로 시작해요.</span>
          </button>
        </div>
      `;
    },
  },
  {
    id: "speak",
    title: "따라 말하고 리듬을 느껴요",
    pill: "4단계",
    line: "“달달 달님, 도란도란 책 읽자.”",
    sound: "달달",
    render() {
      return `
        <div class="record-card">
          <strong>달달 달님, 도란도란 책 읽자</strong>
          <span>천천히 한 번, 신나게 한 번 말해요.</span>
          <div class="record-meter" aria-label="말하기 녹음 진행률"><span></span></div>
        </div>
        <div class="option-grid">
          <button class="choice-card" type="button" data-answer="correct">
            <strong>또박또박</strong>
            <span>소리를 나누어 말했어요.</span>
          </button>
          <button class="choice-card" type="button" data-answer="correct">
            <strong>리듬 있게</strong>
            <span>반복되는 소리를 느꼈어요.</span>
          </button>
        </div>
      `;
    },
  },
  {
    id: "worksheet",
    title: "오늘 배운 내용을 학습지로 정리해요",
    pill: "5단계",
    line: "아이의 선택과 말하기 기록이 학습지에 모였어요.",
    sound: "완성",
    render() {
      return `
        <div class="worksheet-list">
          <label class="worksheet-row">
            <input type="checkbox" checked />
            <span>
              <strong>오늘의 낱말</strong>
              <span>달, 책, 도토리</span>
            </span>
            <span class="badge">저장됨</span>
          </label>
          <label class="worksheet-row">
            <input type="checkbox" checked />
            <span>
              <strong>소리 찾기</strong>
              <span>ㄷ 첫소리 구분</span>
            </span>
            <span class="badge">성공</span>
          </label>
          <label class="worksheet-row">
            <input type="checkbox" />
            <span>
              <strong>가정 연계</strong>
              <span>잠자리 전 같은 낱말 찾기</span>
            </span>
            <span class="badge">추천</span>
          </label>
        </div>
      `;
    },
  },
];

let currentStep = 0;
let stickerCount = 0;
let muted = false;

const navItems = document.querySelectorAll(".nav-item");
const activityBody = document.querySelector("#activityBody");
const activityTitle = document.querySelector("#activityTitle");
const stepPill = document.querySelector("#stepPill");
const storyLine = document.querySelector("#storyLine");
const soundChip = document.querySelector(".sound-chip");
const feedback = document.querySelector("#feedback");
const progressText = document.querySelector("#progressText");
const progressRing = document.querySelector(".progress-ring");
const stickersMetric = document.querySelector("#stickersMetric");
const wordsMetric = document.querySelector("#wordsMetric");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const playStory = document.querySelector("#playStory");
const restartButton = document.querySelector("#restartButton");
const muteButton = document.querySelector("#muteButton");

function speak(text) {
  if (muted || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.82;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function setStep(index, announce = false) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[currentStep];

  activityTitle.textContent = step.title;
  stepPill.textContent = step.pill;
  storyLine.textContent = step.line;
  soundChip.textContent = step.sound;
  activityBody.innerHTML = step.render();
  feedback.textContent = "";

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.step === step.id);
  });

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  progressText.textContent = `${progress}%`;
  progressRing.style.setProperty("--progress", `${progress}%`);
  wordsMetric.textContent = currentStep >= 2 ? "7" : "3";
  prevButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === steps.length - 1 ? "완료" : "다음";

  if (currentStep !== steps.length - 1) {
    nextButton.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>');
  }

  if (announce) {
    speak(`${step.title}. ${step.line}`);
  }
}

function selectAnswer(target) {
  const card = target.closest("[data-answer]");
  if (!card) {
    return;
  }

  activityBody.querySelectorAll("[data-answer]").forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");

  if (card.dataset.answer === "correct" || card.dataset.answer === "moon") {
    stickerCount += 1;
    stickersMetric.textContent = String(stickerCount);
    feedback.textContent = "잘했어요. 스티커가 하나 붙었어요.";
    speak("잘했어요. 스티커가 하나 붙었어요.");
  } else {
    feedback.textContent = "괜찮아요. 소리를 다시 듣고 골라볼까요?";
    speak("괜찮아요. 다시 해볼까요?");
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const index = steps.findIndex((step) => step.id === item.dataset.step);
    setStep(index, true);
  });
});

activityBody.addEventListener("click", (event) => {
  selectAnswer(event.target);
});

prevButton.addEventListener("click", () => {
  setStep(currentStep - 1, true);
});

nextButton.addEventListener("click", () => {
  if (currentStep === steps.length - 1) {
    feedback.textContent = "오늘 학습지가 완성됐어요.";
    speak("오늘 학습지가 완성됐어요.");
    return;
  }

  setStep(currentStep + 1, true);
});

playStory.addEventListener("click", () => {
  const step = steps[currentStep];
  speak(`${step.sound}. ${step.line}`);
});

restartButton.addEventListener("click", () => {
  stickerCount = 0;
  stickersMetric.textContent = "0";
  setStep(0, true);
});

muteButton.addEventListener("click", () => {
  muted = !muted;
  muteButton.classList.toggle("muted", muted);
  muteButton.setAttribute("aria-label", muted ? "소리 켜기" : "소리 끄기");
  if (muted && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

setStep(0);
