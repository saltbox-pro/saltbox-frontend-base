import { Splitter } from "antd";
import { type PropsWithChildren, type ReactNode, useRef, useState } from "react";

import { cn } from "../../lib/cn";
import { useElementWidth } from "../../lib/use-element-width";

import styles from "./pinned-drawer-splitter.module.css";
import { useClampOnShrink } from "./use-clamp-on-shrink";
import { usePinToggleAnimation } from "./use-pin-toggle-animation";

interface PinnedDrawerSplitterProps extends PropsWithChildren {
  pinnedWidth: number | null;
  minWidth: number;
  maxWidthRatio: number;
  onPinnedWidthChange: (width: number) => void;
  renderDrawer: (pinnedWidth: number | null) => ReactNode;
  className?: string;
}

export function PinnedDrawerSplitter({
  pinnedWidth,
  minWidth,
  maxWidthRatio,
  onPinnedWidthChange,
  renderDrawer,
  className,
  children,
}: PinnedDrawerSplitterProps) {
  const [rootRef, rootWidth] = useElementWidth<HTMLDivElement>();
  const [draggedWidth, setDraggedWidth] = useState<number | null>(null);
  const lastDraggedWidthRef = useRef<number | null>(null);
  const isPinned = pinnedWidth !== null;
  const isMeasured = rootWidth > 0;
  const maxWidth = rootWidth * maxWidthRatio;

  const {
    isAnimating: isSpacerAnimating,
    stopAnimation: stopSpacerAnimation,
    handleTransitionEnd,
  } = usePinToggleAnimation(isPinned, styles.spacer);

  useClampOnShrink({
    containerWidth: rootWidth,
    width: pinnedWidth,
    minWidth,
    maxWidth,
    onClamp: onPinnedWidthChange,
  });

  const currentWidth = isPinned ? (draggedWidth ?? pinnedWidth) : null;
  const spacerWidth = currentWidth ?? 0;
  const contentWidth = isMeasured ? Math.max(rootWidth - spacerWidth, 0) : undefined;

  const handleResize = ([width]: number[]) => {
    lastDraggedWidthRef.current = width;
    setDraggedWidth(width);
  };

  const handleResizeEnd = () => {
    const width = lastDraggedWidthRef.current;
    lastDraggedWidthRef.current = null;
    setDraggedWidth(null);
    if (width !== null) onPinnedWidthChange(width);
  };

  return (
    <>
      {renderDrawer(currentWidth)}

      <div
        ref={rootRef}
        className={cn(styles.root, className)}
        onTransitionEnd={handleTransitionEnd}
      >
        <Splitter
          className={cn(styles.splitter, isPinned && styles.resizable)}
          onResizeStart={stopSpacerAnimation}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
        >
          <Splitter.Panel
            className={cn(styles.spacer, isSpacerAnimating && styles.spacerAnimated)}
            size={spacerWidth}
            min={isPinned ? minWidth : undefined}
            max={isMeasured ? maxWidth : undefined}
            resizable={isPinned}
          />

          <Splitter.Panel className={styles.content} size={contentWidth}>
            {children}
          </Splitter.Panel>
        </Splitter>
      </div>
    </>
  );
}
