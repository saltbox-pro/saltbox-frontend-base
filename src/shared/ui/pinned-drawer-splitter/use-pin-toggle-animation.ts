import { type TransitionEvent, useState } from "react";

export const usePinToggleAnimation = (isPinned: boolean, animatedClassName: string) => {
  const [wasPinned, setWasPinned] = useState(isPinned);
  const [isAnimating, setIsAnimating] = useState(false);

  if (wasPinned !== isPinned) {
    setWasPinned(isPinned);
    setIsAnimating(true);
  }

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    const isAnimatedElementTransition =
      event.propertyName === "flex-basis" &&
      event.target instanceof HTMLElement &&
      event.target.classList.contains(animatedClassName);

    if (isAnimatedElementTransition) stopAnimation();
  };

  return { isAnimating, stopAnimation, handleTransitionEnd };
};
