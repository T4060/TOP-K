"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cmdline-progress";
const DEFAULT_XP = 10;

export type DuoProgress = {
  completed: string[];
  xp: number;
  streak: number;
  lastVisitDate: string | null;
};

const EMPTY_PROGRESS: DuoProgress = {
  completed: [],
  xp: 0,
  streak: 0,
  lastVisitDate: null,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function readRaw(): DuoProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeRaw(progress: DuoProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode, quota) — progress just won't persist.
  }
}

/** Bumps the daily streak at most once per calendar day, on first load. */
function withDailyStreak(progress: DuoProgress): DuoProgress {
  const today = todayKey();
  if (progress.lastVisitDate === today) return progress;
  const isConsecutive = progress.lastVisitDate === yesterdayKey();
  return {
    ...progress,
    streak: isConsecutive ? progress.streak + 1 : 1,
    lastVisitDate: today,
  };
}

export function useDuoProgress() {
  const [progress, setProgress] = useState<DuoProgress>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const withStreak = withDailyStreak(readRaw());
    writeRaw(withStreak);
    setProgress(withStreak);
    setHydrated(true);
  }, []);

  const markComplete = useCallback((id: string, xpAward: number = DEFAULT_XP) => {
    setProgress((prev) => {
      if (prev.completed.includes(id)) return prev;
      const next = {
        ...prev,
        completed: [...prev.completed, id],
        xp: prev.xp + xpAward,
      };
      writeRaw(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (id: string) => progress.completed.includes(id),
    [progress.completed]
  );

  return { progress, hydrated, markComplete, isComplete };
}
