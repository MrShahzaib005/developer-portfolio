import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseTime = 1800,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        if (currentText === currentWord) {
          // Pause at full word before deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="typewriter-container font-mono">
      <span className="typewriter-text">{currentText}</span>
      <span className="typewriter-cursor" aria-hidden="true">|</span>
      <style>{`
        .typewriter-container {
          display: inline-flex;
          align-items: center;
          color: var(--accent-orange);
          font-weight: 600;
        }
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--accent-orange);
          animation: blinkCursor 0.85s infinite;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
