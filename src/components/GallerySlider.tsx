"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type Props = {
  images: string[];
  projectName: string;
};

const AUTO_PLAY_SPEED = 40; // px per second

function isVideo(src: string): boolean {
  const lower = src.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm");
}

type DragState = {
  isDragging: boolean;
  startX: number;
  startPosition: number;
  moved: boolean;
};

export default function GallerySlider({ images, projectName }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dragRef = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startPosition: 0,
    moved: false,
  });

  // Duplicate images to simulate an infinite ribbon
  const hasMultipleImages = images.length > 1;
  const renderedImages = hasMultipleImages
    ? [...images, ...images, ...images]
    : images;

  // Measure one \"segment\" width (the width of one full images set)
  useEffect(() => {
    if (!hasMultipleImages) return;

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const totalWidth = el.scrollWidth;
      const segment = totalWidth / 3; // we rendered 3 copies
      setSegmentWidth(segment);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [hasMultipleImages, images.length]);

  // Auto-play loop using requestAnimationFrame for smooth motion
  useEffect(() => {
    if (!hasMultipleImages) return;

    let frameId: number;
    let lastTimestamp: number | null = null;

    const loop = (timestamp: number) => {
      if (lastTimestamp == null) {
        lastTimestamp = timestamp;
      }
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPaused && !isDragging && segmentWidth > 0) {
        setPosition((prev) => {
          let next = prev - AUTO_PLAY_SPEED * delta;

          // Wrap when we've moved a full segment in either direction
          if (next <= -segmentWidth) {
            next += segmentWidth;
          } else if (next >= segmentWidth) {
            next -= segmentWidth;
          }

          return next;
        });
      }

      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [hasMultipleImages, isPaused, isDragging, segmentWidth]);

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>
  ): void {
    if (!hasMultipleImages && event.button !== 0) return;

    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      startPosition: position,
      moved: false,
    };

    setIsDragging(true);
    setIsPaused(true);
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>
  ): void {
    if (!dragRef.current.isDragging) return;

    const deltaX = event.clientX - dragRef.current.startX;

    if (Math.abs(deltaX) > 8) {
      dragRef.current.moved = true;
    }

    setPosition(dragRef.current.startPosition + deltaX);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>): void {
    if (!dragRef.current.isDragging) return;

    dragRef.current.isDragging = false;
    dragRef.current.moved = false;
    setIsDragging(false);
    setIsPaused(false);
  }

  function handleImageClick(index: number) {
    // If user dragged, don't treat release as a click
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }

    const normalizedIndex = images.length
      ? index % images.length
      : index;

    setIsPaused(true);
    setActiveIndex(normalizedIndex);
  }

  function closeModal() {
    setActiveIndex(null);
    setIsPaused(false);
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="gallery-scroll-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!isDragging && activeIndex === null) setIsPaused(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (dragRef.current.isDragging) {
            endDrag(event);
          }
        }}
      >
        <div
          ref={trackRef}
          className="gallery-scroll"
          style={{
            transform: `translateX(${position}px)`,
          }}
        >
          {renderedImages.map((src, index) => {
            const originalIndex = images.length
              ? index % images.length
              : index;

            return (
              <button
                key={`${src}-${index}`}
                type="button"
                className="gallery-slide"
                onClick={() => handleImageClick(originalIndex)}
              >
                {isVideo(src) ? (
                  <video
                    src={src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="gallery-image"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`${projectName} – Gallery ${originalIndex + 1}`}
                    className="gallery-image"
                    loading={index > images.length ? "lazy" : "eager"}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex !== null && (
        <div className="gallery-modal" onClick={closeModal}>
          <div
            className="gallery-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-modal-close"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="gallery-modal-media">
              {isVideo(images[activeIndex]) ? (
                <video
                  src={images[activeIndex]}
                  controls
                  autoPlay
                  playsInline
                  className="gallery-modal-image"
                />
              ) : (
                <img
                  src={images[activeIndex]}
                  alt={`${projectName} – Gallery ${activeIndex + 1}`}
                  className="gallery-modal-image"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
