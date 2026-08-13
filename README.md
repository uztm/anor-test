# JS/React Boilerplate

Этот проект содержит базовую структуру, принципы по написанию кода и взаимодействию с внешними источниками данных на основе выбранного стека технологий. Подробно стек описан в соответствующем разделе в Confluence:
https://confluence.anorbank.uz/confluence/pages/viewpage.action?pageId=59315319

### Инструкция по запуску

#### Docker:
`
docker-compose up -d
`

Проект будет доступен по адресу: **http://localhost:8080**

#### Вручную:
1) Установить Node.JS 20 версии
2) В папке проекта запустить команду `npm install`
3) После установки зависимостей запустить команду `npm run dev`

Проект будет доступен по адресу: **http://localhost:5173**

#### Переменные окружения

* **.env** - По умолчанию окружение для тестовой среды.
* **.env.production** - По умолчанию окружение для боевой среды
* **.env.local** - По умолчанию окружение для локальной разработки

---

# Online exam module

A self-contained, locked-down exam runs at `/exam`. It has **no backend**: questions are
bundled JSON, and the whole attempt lives in `sessionStorage` until the participant exits.

| Route | Screen |
|---|---|
| `/exam` | Welcome — language (UZ/RU), participant name, fullscreen request |
| `/exam/run` | The exam itself, one question per screen |
| `/exam/result` | Score, breakdown and per-question review |

These routes sit outside `MainLayout` and outside the auth loader, so no login is required.

### Where the questions live

```
src/entities/exam/model/
  uz/exam.json    ← Uzbek version of the exam
  ru/exam.json    ← Russian version of the exam
```

Each file is a **complete, self-contained exam** in one language. They are merged at load
time by `src/entities/exam/lib/load-exam.ts` and validated by `validate-exam.ts`, which
fails loudly with a readable list of problems rather than scoring against broken data.

### Schema

```jsonc
{
  "id": "demo-exam-2026",      // must be identical in both files
  "version": 1,                // must be identical in both files
  "config": {                  // must be identical in both files
    "durationMinutes": 45,     // countdown length
    "totalQuestions": 35,      // must equal questions.length
    "passPercentage": 60,      // passScore = ceil(totalPoints * passPercentage / 100)
    "maxViolations": 3,        // auto-submit after this many violations
    "shuffleQuestions": false,
    "shuffleOptions": false
  },
  "questions": [
    {
      "id": "q-001",           // must be identical in both files
      "order": 1,              // 1..30 → single_choice, 31..35 → open_text
      "type": "single_choice",
      "points": 1,             // must be identical in both files
      "correctOptionId": "b",  // must be identical in both files
      "prompt": "…",           // translated
      "options": [             // ids are always exactly a, b, c, d
        { "id": "a", "text": "…" },
        { "id": "b", "text": "…" },
        { "id": "c", "text": "…" },
        { "id": "d", "text": "…" }
      ]
    },
    {
      "id": "q-031",
      "order": 31,
      "type": "open_text",
      "points": 2,
      "prompt": "…",                 // translated
      "acceptedAnswers": ["…", "…"]  // translated — wording differs per language
    }
  ]
}
```

**Answer keys**: `correctOptionId` is language-independent, so option `b` must mean the
same thing in both files. `acceptedAnswers` *is* language-specific — but an open answer is
graded against the accepted answers of **both** languages, so switching language mid-exam
can never cost a participant points.

### Swapping in real questions

1. Replace `src/entities/exam/model/uz/exam.json` and `.../ru/exam.json`, keeping the
   shared fields (`id`, `version`, `config`, and each question's `id`, `order`, `type`,
   `points`, `correctOptionId`) identical between the two files.
2. Bump `version` — an attempt in `sessionStorage` from an older version is discarded
   instead of being scored against the new questions.
3. Run `npm run test` — `validate-exam.test.ts` validates the bundled files, so a broken
   swap fails in CI rather than in front of a participant.

The validator checks: question count vs `totalQuestions`, `order` matching `type`,
presence of all four option ids, `correctOptionId` pointing at a real option, non-empty
prompts and accepted answers, and full agreement between the two locale files.

### Scoring

Closed questions are an exact match on `correctOptionId`. Open answers go through
`normalizeAnswer()` (`src/entities/exam/lib/normalize-answer.ts`), which NFKC-normalises,
lowercases, folds every apostrophe variant (`ʻ ʼ ‘ ’ ` ´`) to `'`, turns other punctuation
into spaces and collapses whitespace — so `Virtual-DOM!` matches `virtual dom`.
Unanswered questions score zero; the total is never negative.
`scoring.ts` and `normalize-answer.ts` are covered by Vitest.

### Lockdown: what it can and cannot do

A web page **cannot** close other browser windows, block Alt+Tab or Cmd+Tab, prevent `Esc`
from leaving fullscreen, or stop a participant from using a second device. Anything
claiming otherwise in a browser tab is theatre. This module therefore **detects and warns**
rather than pretending to prevent:

| Event | Handling |
|---|---|
| Left fullscreen | Violation logged, blocking modal shown |
| Tab hidden | Violation logged, modal shown on return |
| Window blur | Violation logged (debounced against `visibilitychange`) |
| Reload while an attempt is live | Violation logged — a reload always drops fullscreen |
| `beforeunload` | Native browser confirmation dialog |
| Context menu, copy/cut/paste, drag, text selection | Prevented on the exam screen |
| `Ctrl/Cmd + C/V/X/P/S/U`, `F12`, `Ctrl/Cmd+Shift+I/J/C` | Prevented (best-effort) |

The warning modal offers *Return to test* (re-requests fullscreen — it needs a fresh user
gesture, which is why it is a button) and *Leave and finish* (submits immediately with the
points collected so far). The timer keeps running while the modal is open. After
`config.maxViolations` violations the attempt is submitted automatically.

**For real kiosk enforcement** — blocking Alt+Tab, the OS taskbar, other applications, or a
second monitor — the exam must run in **Electron** or in **Chrome launched with `--kiosk`**
(ideally `--kiosk --disable-extensions` on a locked-down machine). That is out of scope for
a web app and is deliberately not attempted here.

### Timer and refresh safety

The attempt stores an absolute `endsAt` timestamp, never a remaining-seconds counter, so a
refresh cannot extend the exam. The question order, option order, answers, violations and
current position are mirrored into `sessionStorage` on every change; refreshing resumes the
attempt exactly where it was (and records the reload as a violation). Closing the tab ends
the session, which is what clears the attempt.

### UI strings

All chrome text is in `src/shared/lib/i18n/{uz,ru,en}/exam.json` under the `exam`
namespace. No exam text is hardcoded in components — question content comes from
`exam.json`, everything else from the locale files.
