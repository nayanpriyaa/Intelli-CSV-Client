import { useEffect, useState } from "react";

const TypingText = ({
  texts,
  typingSpeed = 90,
  deletingSpeed = 50,
  pause = 1400,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink((v) => !v);
    }, 500);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    if (index >= texts.length) return;

    if (!deleting && subIndex === texts[index].length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, texts, typingSpeed, deletingSpeed, pause]);

  return (
    <span className="relative font-semibold tracking-tight text-cyan-400">
      {texts[index].substring(0, subIndex)}
      <span
        className={`inline-block w-[1ch] ${
          blink ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        |
      </span>
    </span>
  );
};

export default TypingText;
