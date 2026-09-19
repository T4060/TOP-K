export type TerminalStep = {
  /** What this step accomplishes, in plain language. */
  explain: string;
  /** The exact command to run, if this step has one. */
  command?: string;
  /** Optional aside — a warning, a platform note, what to expect next. */
  note?: string;
};

export type TerminalScenario = {
  id: string;
  /** Shown as the suggestion chip and the scripted prompt echo. */
  label: string;
  /** Keywords matched against free-text input (lowercased, substring match). */
  keywords: string[];
  /** One-line framing before the steps start. */
  summary: string;
  steps: TerminalStep[];
};

export const TERMINAL_SCENARIOS: TerminalScenario[] = [
  {
    id: "install-node",
    label: "Install Node.js & npm",
    keywords: ["node", "npm", "nvm", "javascript runtime"],
    summary:
      "Get a JavaScript runtime on your machine so you can run and build anything from here.",
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
    id: "python-venv",
    label: "Set up a Python virtual environment",
    keywords: ["python", "venv", "virtualenv", "pip"],
    summary:
      "Isolate a Python project's dependencies so they don't clash with other projects on your machine.",
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
    id: "command-not-found",
    label: "Fix \"command not found\"",
    keywords: ["command not found", "not recognized", "path", "not found"],
    summary:
      "This almost always means your shell's PATH doesn't know where the program lives — here's how to diagnose it.",
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
    id: "react-app",
    label: "Start a new React / Next.js app",
    keywords: ["react", "next", "next.js", "frontend", "new app", "vite"],
    summary: "Scaffold a fresh frontend project and get the dev server running.",
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
    id: "deploy",
    label: "Deploy a site to production",
    keywords: ["deploy", "vercel", "netlify", "host", "hosting", "production", "ship"],
    summary: "Get your project live on the internet with a real URL, in minutes.",
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
];

export const DEFAULT_SCENARIO: TerminalScenario = {
  id: "default",
  label: "Not sure where to start",
  keywords: [],
  summary:
    "No exact match for that yet — here's the general checklist for getting any new project off the ground.",
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
