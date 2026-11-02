import { useLayoutEffect, useRef } from "react";

import { clamp } from "../../lib/clamp";

interface UseClampOnShrinkParams {
  containerWidth: number;
  width: number | null;
  minWidth: number;
  maxWidth: number;
  onClamp: (width: number) => void;
}

export const useClampOnShrink = ({
  containerWidth,
  width,
  minWidth,
  maxWidth,
  onClamp,
}: UseClampOnShrinkParams) => {
  const previousContainerWidthRef = useRef(containerWidth);

  useLayoutEffect(() => {
    const hasShrunk = containerWidth < previousContainerWidthRef.current;
    previousContainerWidthRef.current = containerWidth;
    if (width === null || containerWidth === 0 || !hasShrunk) return;

    const clampedWidth = clamp(width, minWidth, maxWidth);
    if (clampedWidth !== width) onClamp(clampedWidth);
  }, [containerWidth, width, minWidth, maxWidth, onClamp]);
};
