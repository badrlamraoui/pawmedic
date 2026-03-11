"use client";
import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const article = document.getElementById("article-body");
      if (!article) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        return;
      }
      const { top, height } = article.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalScrollable = height - viewportH;
      const scrolled = Math.max(0, -top);
      setProgress(Math.min(100, totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 0));
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#0d9488] transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
