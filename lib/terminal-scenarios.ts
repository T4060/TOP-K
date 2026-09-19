export type TerminalStep = {
  /** What this step accomplishes, in plain language. */
  explain: string;
  /** The exact command to run, if this step has one. */
  command?: string;
  /** Optional aside — a warning, a platform note, what to expect next. */
  note?: string;
};

export type ScenarioLevel = "beginner" | "intermediate" | "advanced";

export type TerminalScenario = {
  id: string;
  /** Shown as the suggestion chip and the scripted prompt echo. */
  label: string;
  /** Keywords matched against free-text input (lowercased, substring match). */
  keywords: string[];
  /** One-line framing before the steps start. */
  summary: string;
  /** Drives the level pill on the lesson card and the path's tier grouping. */
  level: ScenarioLevel;
  steps: TerminalStep[];
};

/**
 * Ordered as the actual learning path: beginner fundamentals first,
 * intermediate building in the middle, advanced — ending in the capstone
 * that ties every earlier lesson together — last. Step count and the
 * depth of each `explain`/`note` grow with the level on purpose: a
 * beginner step says what to type, an advanced step says what to type
 * and why it matters and what happens if you skip it.
 */
export const TERMINAL_SCENARIOS: TerminalScenario[] = [
  {
    id: "shell-basics",
    label: "Navigate the shell",
    keywords: ["pwd", "ls", "cd", "navigate", "filesystem", "folders", "directories"],
    summary:
      "Before Git or npm mean anything, you need to move around your filesystem confidently from the terminal.",
    level: "beginner",
    steps: [
      {
        explain: "See exactly where you are right now — the first command to run any time you're lost.",
        command: "pwd",
      },
      {
        explain: "List what's inside the current folder.",
        command: "ls -la",
        note: "The -a flag shows hidden files too — anything starting with a dot, like .git or .env.",
      },
      {
        explain: "Move into a folder.",
        command: "cd Documents",
        note: "Use `cd ..` to go up one level, and `cd ~` to jump straight home.",
      },
      {
        explain: "Create a new folder without leaving the terminal.",
        command: "mkdir my-project",
      },
      {
        explain: "Rename or move a file.",
        command: "mv old-name.txt new-name.txt",
      },
      {
        explain: "Delete a file — there's no trash can here, so double-check the path first.",
        command: "rm unwanted-file.txt",
        note: "Never run `rm -rf` on a path you haven't triple-checked. There's no undo.",
      },
    ],
  },
  {
    id: "install-node",
    label: "Install Node.js & npm",
    keywords: ["node", "npm", "nvm", "javascript runtime"],
    summary:
      "Get a JavaScript runtime on your machine so you can run and build anything from here.",
    level: "beginner",
    steps: [
      {
        explain: "Install nvm, a version manager, instead of Node directly — it lets you switch Node versions per project.",
        command:
          "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash",
        note: "On Windows, use nvm-windows instead — the install script above is macOS/Linux only.",
      },
      {
        explain: "Reload your shell so the nvm command is available.",
        command: "source ~/.bashrc",
        note: "Using zsh? Run `source ~/.zshrc` instead.",
      },
      {
        explain: "Install the current LTS (long-term support) release of Node.",
        command: "nvm install --lts",
      },
      {
        explain: "Confirm it worked — this should print version numbers, not an error.",
        command: "node -v && npm -v",
      },
    ],
  },
  {
    id: "git-github",
    label: "Push a project to GitHub",
    keywords: ["git", "github", "push", "repo", "repository", "version control"],
    summary:
      "Turn a local folder into a Git repository and publish it to GitHub for the first time.",
    level: "beginner",
    steps: [
      {
        explain: "From inside your project folder, start tracking it with Git.",
        command: "git init",
      },
      {
        explain: "Tell Git who you are — GitHub uses this to attribute commits.",
        command:
          'git config --global user.name "Your Name" && git config --global user.email "you@example.com"',
      },
      {
        explain: "Stage every file in the folder for the first commit.",
        command: "git add .",
      },
      {
        explain: "Save a snapshot with a message describing what's in it.",
        command: 'git commit -m "Initial commit"',
      },
      {
        explain: "Create an empty repository on github.com, then point your local repo at it.",
        command: "git remote add origin https://github.com/your-username/your-repo.git",
        note: "Swap in the URL GitHub shows you right after creating the repo.",
      },
      {
        explain: "Push your commit up and set the branch to track origin.",
        command: "git push -u origin main",
        note: "If your default branch is called `master` instead, use that name here.",
      },
    ],
  },
  {
    id: "command-not-found",
    label: "Fix \"command not found\"",
    keywords: ["command not found", "not recognized", "path", "not found"],
    summary:
      "This almost always means your shell's PATH doesn't know where the program lives — here's how to diagnose it.",
    level: "beginner",
    steps: [
      {
        explain: "Check whether the tool is installed at all and where.",
        command: "which node",
        note: "Swap `node` for whatever command is failing.",
      },
      {
        explain: "If that returns nothing, the tool likely isn't installed — install it first, then retry.",
      },
      {
        explain: "If it IS installed but still not found, print your current PATH to see what folders your shell searches.",
        command: "echo $PATH",
      },
      {
        explain: "Add the missing folder to your PATH — append this to your shell config file (~/.bashrc or ~/.zshrc).",
        command: 'export PATH="$PATH:/the/missing/folder"',
      },
      {
        explain: "Reload your shell config so the change takes effect.",
        command: "source ~/.zshrc",
      },
    ],
  },
  {
    id: "python-venv",
    label: "Set up a Python virtual environment",
    keywords: ["python", "venv", "virtualenv", "pip"],
    summary:
      "Isolate a Python project's dependencies so they don't clash with other projects on your machine.",
    level: "beginner",
    steps: [
      {
        explain: "Create a virtual environment in a folder called .venv.",
        command: "python3 -m venv .venv",
      },
      {
        explain: "Activate it — your prompt should now show (.venv) at the start.",
        command: "source .venv/bin/activate",
        note: "On Windows (cmd.exe): `.venv\\Scripts\\activate.bat`",
      },
      {
        explain: "Upgrade pip inside the environment before installing anything.",
        command: "pip install --upgrade pip",
      },
      {
        explain: "Install your project's dependencies from a requirements file, if you have one.",
        command: "pip install -r requirements.txt",
      },
      {
        explain: "When you're done working, leave the environment.",
        command: "deactivate",
      },
    ],
  },
  {
    id: "react-app",
    label: "Start a new React / Next.js app",
    keywords: ["react", "next", "next.js", "frontend", "new app", "vite"],
    summary: "Scaffold a fresh frontend project and get the dev server running.",
    level: "intermediate",
    steps: [
      {
        explain: "Scaffold a new Next.js project — this walks you through a few setup prompts.",
        command: "npx create-next-app@latest my-app",
      },
      {
        explain: "Move into the new project folder.",
        command: "cd my-app",
      },
      {
        explain: "Start the local dev server with hot reload.",
        command: "npm run dev",
      },
      {
        explain: "Open the site in your browser.",
        note: "Visit http://localhost:3000 — it should already be running.",
      },
    ],
  },
  {
    id: "env-vars-secrets",
    label: "Environment variables & secrets",
    keywords: ["env", "environment variable", "secrets", "api key", ".env", "dotenv"],
    summary: "API keys and passwords don't belong in your code. Here's how real projects keep them out.",
    level: "intermediate",
    steps: [
      {
        explain: "Create a .env file in your project root to hold secrets.",
        command: "touch .env",
      },
      {
        explain: "Add a key inside it — no spaces around the equals sign.",
        command: 'echo "API_KEY=your-secret-here" >> .env',
      },
      {
        explain: "Make sure Git will never commit it.",
        command: "echo .env >> .gitignore",
        note: "If .env was already committed before you added this line, it's already in your Git history — rotate the key, don't just delete the file.",
      },
      {
        explain: "In Node, read it at runtime instead of hardcoding it.",
        command: "node -e \"require('dotenv').config(); console.log(process.env.API_KEY)\"",
        note: "Requires the dotenv package: npm install dotenv",
      },
      {
        explain: "When you deploy, set the same variable in your hosting platform's dashboard or CLI.",
        command: "vercel env add API_KEY",
        note: ".env never leaves your machine — production needs its own copy of every variable.",
      },
    ],
  },
  {
    id: "fetch-api",
    label: "Call a real API",
    keywords: ["api", "fetch", "curl", "json", "rest"],
    summary:
      "Every real app eventually talks to a server. Here's how to make that call from the terminal and read what comes back.",
    level: "intermediate",
    steps: [
      {
        explain: "Hit a public API directly with curl to see the raw response.",
        command: "curl https://api.github.com/users/octocat",
      },
      {
        explain: "That's unformatted JSON — pipe it through jq to make it readable.",
        command: "curl https://api.github.com/users/octocat | jq",
        note: "Don't have jq? Install it: brew install jq (macOS) or apt install jq (Linux).",
      },
      {
        explain: "Pull out just one field instead of the whole payload.",
        command: "curl https://api.github.com/users/octocat | jq '.name'",
      },
      {
        explain: "Do the same fetch from Node instead of curl — this is what your actual app code will look like.",
        command: "node -e \"fetch('https://api.github.com/users/octocat').then(r => r.json()).then(console.log)\"",
      },
      {
        explain: "Check the response status before trusting the body.",
        note: "A 404 still returns JSON — just not the JSON you wanted. Always check res.ok or res.status before parsing.",
      },
    ],
  },
  {
    id: "testing-basics",
    label: "Run a test suite",
    keywords: ["test", "testing", "jest", "vitest", "unit test"],
    summary: "Tests catch what you'd otherwise find in production. Here's how to run and read them.",
    level: "intermediate",
    steps: [
      {
        explain: "Install a test runner.",
        command: "npm install --save-dev vitest",
      },
      {
        explain: "Write a minimal test file.",
        command:
          "echo \"import { test, expect } from 'vitest'; test('adds', () => expect(1+1).toBe(2));\" > sum.test.js",
      },
      {
        explain: "Run the suite.",
        command: "npx vitest run",
      },
      {
        explain: "Read the output.",
        note: "Green means the assertion held. Red means expected vs. received didn't match — the diff tells you exactly which. A red test isn't a crash, it's doing its job; fix the code, not the test, unless the test itself is wrong.",
      },
      {
        explain: "Run it automatically on every save while you work.",
        command: "npx vitest",
      },
    ],
  },
  {
    id: "ai-assisted-coding",
    label: "Code with an AI assistant",
    keywords: ["ai", "copilot", "claude code", "ai assistant", "chatgpt code"],
    summary:
      "AI coding tools are fast, not infallible. Here's how to drive one from the terminal without trusting it blindly.",
    level: "advanced",
    steps: [
      {
        explain: "Install a terminal-based AI coding tool.",
        command: "npm install -g @anthropic-ai/claude-code",
        note: "Any AI coding CLI works the same way conceptually — this is just one example.",
      },
      {
        explain: "Run it inside your project folder so it has real context, not a blank slate.",
        command: "claude",
      },
      {
        explain: "Ask for something specific and scoped.",
        note: "Not \"build me an app\" — that gets a vague, sprawling diff. \"Add form validation to the signup component\" gets a reviewable one.",
      },
      {
        explain: "Before accepting anything, read the diff it proposes like you'd review a coworker's pull request.",
        note: "If you can't explain what a line does, don't merge it — ask the assistant to explain it first.",
      },
      {
        explain: "Run your own tests after it edits code.",
        command: "npm test",
        note: "An AI tool's own explanation of its change isn't the same as your test suite actually passing.",
      },
      {
        explain: "Commit in small chunks so a bad suggestion is one revert away, not a tangled mess.",
        command: "git add -p",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy a site to production",
    keywords: ["deploy", "vercel", "netlify", "host", "hosting", "production", "ship"],
    summary: "Get your project live on the internet with a real URL, in minutes.",
    level: "advanced",
    steps: [
      {
        explain: "Install the Vercel CLI globally.",
        command: "npm install -g vercel",
      },
      {
        explain: "From your project folder, log in — this opens a browser to authenticate.",
        command: "vercel login",
      },
      {
        explain: "Deploy a preview build and get a shareable URL.",
        command: "vercel",
      },
      {
        explain: "Happy with it? Ship it to your production URL.",
        command: "vercel --prod",
      },
    ],
  },
  {
    id: "build-a-website-with-ai",
    label: "Build a website with AI",
    keywords: ["build a website", "ai website", "build website with ai", "capstone"],
    summary:
      "The capstone: scaffold, customize, and ship a real website — with an AI assistant doing the typing and you doing the judgment.",
    level: "advanced",
    steps: [
      {
        explain: "Scaffold a real project instead of a blank folder — give the AI tool actual structure to work within.",
        command: "npx create-next-app@latest my-site",
      },
      {
        explain: "Open the project and its AI assistant together.",
        command: "cd my-site && claude",
      },
      {
        explain: "Describe the one page you want first, in plain language, with specifics.",
        note: "\"Build me a site\" gets a generic template. \"Add a hero section with my name, a tagline, and a contact link\" gets something real.",
      },
      {
        explain: "Preview what it built before writing a single line yourself.",
        command: "npm run dev",
      },
      {
        explain: "Iterate — ask for one change at a time and re-check the preview after each.",
        note: "This loop — ask, review the diff, preview, repeat — is the actual skill. The AI writes fast; your job is judging each step before moving to the next.",
      },
      {
        explain: "Once it looks right, commit your own work the way you learned earlier in this path.",
        command: 'git add . && git commit -m "Build homepage"',
      },
      {
        explain: "Push it and deploy — the same commands from Shipping it.",
        command: "git push && vercel --prod",
      },
      {
        explain: "You just shipped a real, live website — built with AI, reviewed and directed by you.",
        note: "That loop — direct, review, verify — is the whole job, whether or not AI writes the first draft.",
      },
    ],
  },
];

export const DEFAULT_SCENARIO: TerminalScenario = {
  id: "default",
  label: "Not sure where to start",
  keywords: [],
  summary:
    "No exact match for that yet — here's the general checklist for getting any new project off the ground.",
  level: "beginner",
  steps: [
    {
      explain: "Open a terminal. On macOS, that's Terminal.app or iTerm; on Windows, Windows Terminal or PowerShell; on Linux, whatever your distro ships.",
    },
    {
      explain: "Check what you already have installed before installing anything new.",
      command: "node -v; python3 --version; git --version",
    },
    {
      explain: "Make (or move into) a folder for the project.",
      command: "mkdir my-project && cd my-project",
    },
    {
      explain: "Try one of the suggestions above for a specific setup — installing a runtime, Git, or deploying — and this panel will walk you through it the same way.",
    },
  ],
};

export function matchScenario(query: string): TerminalScenario {
  const q = query.trim().toLowerCase();
  if (!q) return DEFAULT_SCENARIO;
  const match = TERMINAL_SCENARIOS.find((scenario) =>
    scenario.keywords.some((keyword) => q.includes(keyword))
  );
  return match ?? DEFAULT_SCENARIO;
}
