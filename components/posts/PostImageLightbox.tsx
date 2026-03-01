"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PostImageLightboxProps {
  src: string;
}

export default function PostImageLightbox({ src }: PostImageLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div
        className="mb-6 flex justify-center rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt="첨부 이미지"
          width={0}
          height={0}
          sizes="100vw"
          className="max-h-120 w-auto object-contain"
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="원본 이미지"
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
