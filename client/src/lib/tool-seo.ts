// Single source of truth for tool SEO metadata.
// Read by both the per-tool React pages and the static prerender build step,
// so titles/descriptions/copy never drift between what users see and what
// crawlers get.

export const SITE_URL = "https://mobiletoolsbox.com";
export const SITE_NAME = "MobileToolsBox";

export interface ToolSeo {
  /** URL slug -> /tools/<slug> */
  slug: string;
  /** Maps to the tool id used by the live app at /app (?tool=<id>) */
  appToolId: string;
  /** <h1> and the core of the <title> */
  name: string;
  /** <title> tag (keep under ~60 chars) */
  title: string;
  /** meta description (keep ~150-160 chars) */
  description: string;
  /** comma-joined keywords for the meta keywords tag */
  keywords: string;
  /** short tagline shown under the H1 */
  tagline: string;
  /** 2-3 paragraphs of real indexable copy about the tool */
  body: string[];
  /** FAQ entries -> rendered visibly AND as FAQPage JSON-LD */
  faq: { q: string; a: string }[];
}

export const TOOL_SEO: ToolSeo[] = [
  {
    slug: "calculator",
    appToolId: "calculator",
    name: "Free Online Calculator",
    title: "Free Online Calculator — Fast & Simple | MobileToolsBox",
    description:
      "A free online calculator for everyday math. Works instantly in your browser on mobile and desktop — no download, no sign-up, no ads in the way.",
    keywords:
      "online calculator, free calculator, web calculator, mobile calculator, basic calculator, math calculator",
    tagline: "Quick, no-fuss calculations right in your browser.",
    body: [
      "MobileToolsBox includes a fast, free online calculator that runs entirely in your browser. There's nothing to install and no account to create — open the page and start calculating on your phone, tablet, or computer.",
      "It handles everyday arithmetic with a clean, touch-friendly layout that works well on small screens, so it's just as comfortable on a phone as it is on a desktop.",
      "Because the calculator runs locally in your browser, your inputs stay on your device. It's part of a larger free toolbox of productivity and utility tools you can use side by side.",
    ],
    faq: [
      {
        q: "Is the online calculator free?",
        a: "Yes. The calculator is completely free to use with no sign-up and no download required.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes. The layout is touch-friendly and responsive, so it works on phones, tablets, and desktops.",
      },
    ],
  },
  {
    slug: "password-generator",
    appToolId: "password-generator",
    name: "Free Password Generator",
    title: "Strong Random Password Generator (Free) | MobileToolsBox",
    description:
      "Generate strong, random, secure passwords for free. Customise length and character types. Runs in your browser — passwords are never sent anywhere.",
    keywords:
      "password generator, random password generator, strong password generator, secure password, free password tool",
    tagline: "Create strong, unique passwords that are hard to crack.",
    body: [
      "Weak, reused passwords are one of the easiest ways for accounts to get compromised. This free password generator creates strong, random passwords that are far harder to guess or brute-force.",
      "You can tune the length and which character types to include — uppercase, lowercase, numbers, and symbols — to match the requirements of whatever site or service you're signing up for.",
      "Everything runs locally in your browser. Generated passwords are not transmitted to any server, so what you create stays on your device.",
    ],
    faq: [
      {
        q: "Are the generated passwords stored anywhere?",
        a: "No. Passwords are generated locally in your browser and are never sent to or stored on a server.",
      },
      {
        q: "What makes a password strong?",
        a: "Length and randomness. Longer passwords that mix uppercase, lowercase, numbers, and symbols are significantly harder to crack.",
      },
    ],
  },
  {
    slug: "qr-scanner",
    appToolId: "qr-scanner",
    name: "QR Code Scanner & Generator",
    title: "Free QR Code Scanner & Generator | MobileToolsBox",
    description:
      "Scan QR codes with your camera and generate your own QR codes for free. Works in your browser on mobile and desktop — no app install required.",
    keywords:
      "qr code scanner, qr code generator, scan qr code online, free qr scanner, qr reader",
    tagline: "Scan any QR code or create your own in seconds.",
    body: [
      "This free QR code tool lets you both scan existing QR codes using your device camera and generate new QR codes for links, text, and more — all from your browser.",
      "There's no app to install. On mobile, it uses your camera to read codes directly; on desktop you can generate codes to share or print.",
      "It's part of the free MobileToolsBox utility suite, so you can jump between QR scanning and other tools without switching apps.",
    ],
    faq: [
      {
        q: "Do I need to install an app to scan QR codes?",
        a: "No. The scanner runs in your mobile browser using your camera — no separate app download is needed.",
      },
      {
        q: "Can I create my own QR codes?",
        a: "Yes. You can generate QR codes for links and text directly in the tool.",
      },
    ],
  },
  {
    slug: "unit-converter",
    appToolId: "unit-converter",
    name: "Free Unit Converter",
    title: "Free Online Unit Converter | MobileToolsBox",
    description:
      "Convert between units of length, weight, temperature, and more — free and instant. Works in your browser on any device, no sign-up needed.",
    keywords:
      "unit converter, online unit converter, measurement converter, convert units, metric converter",
    tagline: "Convert measurements instantly across common units.",
    body: [
      "Quickly convert between common units of measurement with this free online unit converter. It covers everyday categories so you can switch between metric and imperial without hunting for a formula.",
      "The interface is built for fast, repeated conversions and works smoothly on mobile and desktop alike.",
      "Like every tool here, it runs in your browser with no account required and no setup.",
    ],
    faq: [
      {
        q: "What units can I convert?",
        a: "Common everyday categories such as length, weight, and temperature, with metric and imperial units supported.",
      },
      {
        q: "Is it free?",
        a: "Yes, the unit converter is free with no sign-up required.",
      },
    ],
  },
  {
    slug: "world-clock",
    appToolId: "world-clock",
    name: "World Clock — Time Zones",
    title: "Free World Clock & Time Zone Tracker | MobileToolsBox",
    description:
      "Track the current time across multiple time zones with a free world clock. Perfect for remote teams and travel. Runs in your browser, no sign-up.",
    keywords:
      "world clock, time zone converter, current time zones, world time, time zone tracker",
    tagline: "See the current time anywhere in the world at a glance.",
    body: [
      "Keep track of what time it is across multiple cities and time zones with this free world clock. It's handy for coordinating with remote teammates, family abroad, or upcoming travel.",
      "Add the locations you care about and see them side by side, updated in real time, on any device.",
      "It's part of the free MobileToolsBox suite and needs no account to use.",
    ],
    faq: [
      {
        q: "Can I track more than one time zone?",
        a: "Yes. You can follow multiple cities and time zones at once and view them together.",
      },
      {
        q: "Is the time updated live?",
        a: "Yes, the clock updates in real time in your browser.",
      },
    ],
  },
  {
    slug: "pomodoro-timer",
    appToolId: "pomodoro",
    name: "Pomodoro Focus Timer",
    title: "Free Pomodoro Timer for Focus & Study | MobileToolsBox",
    description:
      "A free Pomodoro timer to help you focus using timed work and break intervals. Great for studying and deep work. Runs in your browser, no install.",
    keywords:
      "pomodoro timer, focus timer, study timer, productivity timer, pomodoro technique",
    tagline: "Work in focused intervals and take structured breaks.",
    body: [
      "The Pomodoro technique breaks work into focused intervals separated by short breaks, which many people find makes long tasks far more manageable. This free Pomodoro timer makes it easy to follow that rhythm.",
      "Use it for studying, writing, coding, or any deep-work session where staying focused matters. The timer guides you through work and break cycles so you don't have to watch the clock.",
      "It works in your browser on any device and is part of the free MobileToolsBox toolkit.",
    ],
    faq: [
      {
        q: "What is the Pomodoro technique?",
        a: "It's a time-management method that splits work into focused intervals (traditionally 25 minutes) separated by short breaks.",
      },
      {
        q: "Is the timer free?",
        a: "Yes, the Pomodoro timer is free to use in your browser.",
      },
    ],
  },
  {
    slug: "habit-tracker",
    appToolId: "habit-tracker",
    name: "Habit Tracker",
    title: "Free Habit Tracker with Streaks | MobileToolsBox",
    description:
      "Build better habits with a free habit tracker. Track daily habits, keep streaks, and stay consistent. Works in your browser on mobile and desktop.",
    keywords:
      "habit tracker, daily habit tracker, streak tracker, build habits, free habit app",
    tagline: "Build consistency with daily tracking and streaks.",
    body: [
      "Building a new habit is much easier when you can see your progress. This free habit tracker lets you log daily habits and keep streaks going so consistency becomes visible and motivating.",
      "Set up the habits you want to build, check them off each day, and watch your streaks grow over time.",
      "It runs in your browser and is part of the free MobileToolsBox suite of productivity tools.",
    ],
    faq: [
      {
        q: "Can I track multiple habits?",
        a: "Yes. You can add multiple habits and track each one independently with its own streak.",
      },
      {
        q: "Does it cost anything?",
        a: "No, the habit tracker is free to use.",
      },
    ],
  },
  {
    slug: "flashcards",
    appToolId: "flashcards",
    name: "Flashcards with Spaced Repetition",
    title: "Free Flashcards App (Spaced Repetition) | MobileToolsBox",
    description:
      "Study smarter with free flashcards and spaced repetition. Create decks and review on any device. Runs in your browser — no sign-up to get started.",
    keywords:
      "flashcards, spaced repetition, study flashcards, flashcard app, free flashcards online",
    tagline: "Create decks and remember more with spaced repetition.",
    body: [
      "Flashcards are one of the most effective ways to memorise information, and spaced repetition makes them even more powerful by showing you cards right before you'd forget them.",
      "Create your own decks, then review them on any device. The tool helps you focus your study time where it counts.",
      "It's part of the free MobileToolsBox toolkit and works in your browser.",
    ],
    faq: [
      {
        q: "What is spaced repetition?",
        a: "It's a study method that schedules reviews at increasing intervals so you revisit material right as you're about to forget it, improving long-term recall.",
      },
      {
        q: "Can I make my own decks?",
        a: "Yes. You can create custom flashcard decks and study them anytime.",
      },
    ],
  },
  {
    slug: "to-do-list",
    appToolId: "todo",
    name: "To-Do List & Task Manager",
    title: "Free To-Do List & Task Manager | MobileToolsBox",
    description:
      "Organise tasks with a free to-do list and task manager. Priorities, subtasks, and due dates included. Works in your browser on mobile and desktop.",
    keywords:
      "to-do list, task manager, online todo list, free task app, task organizer",
    tagline: "Capture tasks and stay on top of what matters.",
    body: [
      "Stay organised with a free, flexible to-do list and task manager. Capture everything you need to do, set priorities and due dates, and break larger tasks into subtasks.",
      "It's designed to be quick to use on mobile so you can add tasks the moment they come to mind, then manage them comfortably on desktop.",
      "Part of the free MobileToolsBox suite, with no account required to start.",
    ],
    faq: [
      {
        q: "Can I set priorities and due dates?",
        a: "Yes. Tasks support priorities, due dates, and subtasks so you can organise your workload.",
      },
      {
        q: "Is it free?",
        a: "Yes, the to-do list is free to use.",
      },
    ],
  },
  {
    slug: "notes",
    appToolId: "notes",
    name: "Online Notes App",
    title: "Free Online Notes App with Markdown | MobileToolsBox",
    description:
      "Take rich-text notes online for free, with markdown support and smart organisation. Works in your browser on any device — no install needed.",
    keywords:
      "online notes, notes app, markdown notes, free note taking, web notepad",
    tagline: "Capture ideas with rich text and markdown.",
    body: [
      "Jot down ideas, meeting notes, and to-dos with this free online notes app. It supports rich text and markdown, so you can format notes the way you like.",
      "Notes are easy to organise and search, and the editor works smoothly across mobile and desktop.",
      "It's part of the free MobileToolsBox toolkit and runs in your browser.",
    ],
    faq: [
      {
        q: "Does the notes app support markdown?",
        a: "Yes. You can write notes using markdown as well as rich-text formatting.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, note taking is free with no sign-up required to begin.",
      },
    ],
  },
  {
    slug: "voice-recorder",
    appToolId: "voice-recorder",
    name: "Online Voice Recorder",
    title: "Free Online Voice Recorder | MobileToolsBox",
    description:
      "Record voice memos online for free, with transcription and easy sharing. Works in your browser on mobile and desktop — no app to install.",
    keywords:
      "voice recorder, online voice recorder, audio recorder, voice memo, record audio online",
    tagline: "Record voice memos and get them transcribed.",
    body: [
      "Capture quick voice memos with this free online voice recorder. It's useful for ideas on the go, reminders, and notes you'd rather speak than type.",
      "Recordings can be transcribed and shared, and the tool works directly in your browser without a separate app.",
      "It's part of the free MobileToolsBox suite of productivity tools.",
    ],
    faq: [
      {
        q: "Do I need to install an app to record?",
        a: "No. The voice recorder runs in your browser and uses your device microphone.",
      },
      {
        q: "Can recordings be transcribed?",
        a: "Yes, the tool supports transcription of your voice recordings.",
      },
    ],
  },
  {
    slug: "project-timer",
    appToolId: "project-timer",
    name: "Project Time Tracker",
    title: "Free Project Time Tracker | MobileToolsBox",
    description:
      "Track time spent on projects and tasks for free. Simple time tracking with insights, in your browser on any device. No sign-up to get started.",
    keywords:
      "time tracker, project timer, time tracking, track work hours, free time tracking",
    tagline: "Track where your time goes across projects.",
    body: [
      "Understand where your hours actually go with this free project time tracker. Start and stop timers against projects and tasks to build a clear picture of your time.",
      "It's handy for freelancers, students, and anyone who wants to bill or budget their time more accurately.",
      "Part of the free MobileToolsBox toolkit, running in your browser.",
    ],
    faq: [
      {
        q: "Can I track time across multiple projects?",
        a: "Yes. You can track time separately for different projects and tasks.",
      },
      {
        q: "Is it free?",
        a: "Yes, the project time tracker is free to use.",
      },
    ],
  },
  {
    slug: "iq-test",
    appToolId: "iq-tester",
    name: "Online IQ Test",
    title: "Free Online IQ Test with Analytics | MobileToolsBox",
    description:
      "Take a free online IQ test and track your results over time with detailed analytics. Works in your browser on mobile and desktop — no sign-up to try.",
    keywords:
      "iq test, online iq test, free iq test, cognitive test, iq quiz",
    tagline: "Test your cognitive skills and track your progress.",
    body: [
      "Challenge yourself with this free online IQ test. It presents cognitive questions and gives you results with analytics so you can see how you did.",
      "You can track your performance over time to watch your progress across attempts.",
      "It's part of the free MobileToolsBox suite and runs in your browser.",
    ],
    faq: [
      {
        q: "Is the IQ test free?",
        a: "Yes, you can take the IQ test for free in your browser.",
      },
      {
        q: "Can I track my results over time?",
        a: "Yes. The tool records your attempts so you can follow your progress.",
      },
    ],
  },
  {
    slug: "file-converter",
    appToolId: "file-converter",
    name: "Free File Converter",
    title: "Free Online File Converter | MobileToolsBox",
    description:
      "Convert files between common formats for free, right in your browser. Fast and simple file conversion on mobile and desktop, with no install needed.",
    keywords:
      "file converter, online file converter, convert files, free file conversion, format converter",
    tagline: "Convert files between common formats in your browser.",
    body: [
      "Convert files between common formats with this free online file converter. It's built to be quick and straightforward for everyday conversion needs.",
      "Conversion happens in your browser, so you can use it on mobile or desktop without installing anything.",
      "It's part of the free MobileToolsBox toolkit.",
    ],
    faq: [
      {
        q: "Is the file converter free?",
        a: "Yes, the file converter is free to use with no sign-up required.",
      },
      {
        q: "Do I need to install software?",
        a: "No. Conversion runs in your browser, so there's nothing to install.",
      },
    ],
  },
];

export function getToolSeo(slug: string): ToolSeo | undefined {
  return TOOL_SEO.find((t) => t.slug === slug);
}
