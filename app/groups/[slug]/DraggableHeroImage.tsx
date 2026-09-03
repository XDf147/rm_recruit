"use client";

import { PointerEvent, useRef, useState } from "react";
import Image from "next/image";

type Position = { x: number; y: number };

export function DraggableHeroImage({ src }: { src: string }) {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const dragStart = useRef<{ pointerX: number; pointerY: number; position: Position } | null>(null);

  function startDrag(event: PointerEvent<HTMLImageElement>) {
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, position };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLImageElement>) {
    if (!dragStart.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const deltaX = (event.clientX - dragStart.current.pointerX) / bounds.width * 100;
    const deltaY = (event.clientY - dragStart.current.pointerY) / bounds.height * 100;
    setPosition({
      x: Math.max(0, Math.min(100, dragStart.current.position.x - deltaX)),
      y: Math.max(0, Math.min(100, dragStart.current.position.y - deltaY)),
    });
  }

  function stopDrag() {
    dragStart.current = null;
  }

  return (
    <Image
      className="unit-hero-draggable-image"
      src={src}
      alt=""
      fill
      sizes="(max-width: 760px) 100vw, 55vw"
      draggable={false}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      style={{ objectPosition: `${position.x}% ${position.y}%` }}
    />
  );
}
