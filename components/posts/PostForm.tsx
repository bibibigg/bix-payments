"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { BoardCategory, BoardRequest } from "@/types";
import { useCategoriesQuery } from "@/lib/queries/boards";

// 허용할 이미지 포맷의 파일 시그니처 (magic bytes)
const IMAGE_SIGNATURES: Array<{ bytes: number[]; offset?: number }> = [
  { bytes: [0xFF, 0xD8, 0xFF] },                      // JPEG
  { bytes: [0x89, 0x50, 0x4E, 0x47] },                // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38] },                // GIF
  { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },     // WebP
];

function checkMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      const valid = IMAGE_SIGNATURES.some(({ bytes, offset = 0 }) =>
        bytes.every((byte, i) => arr[offset + i] === byte)
      );
      resolve(valid);
    };
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    category: BoardCategory;
  };
  initialImageUrl?: string | null;
  onSubmit: (data: BoardRequest, file?: File) => Promise<void>;
  submitLabel: string;
}

export default function PostForm({
  initialData,
  initialImageUrl,
  onSubmit,
  submitLabel,
}: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categoryMap } = useCategoriesQuery();

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || ("NOTICE" as BoardCategory),
  });
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const existingImageSrc =
    initialImageUrl?.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_API_BASE}${initialImageUrl}`
      : null;
  const existingFilename = initialImageUrl?.split("/").pop() ?? "이미지";
  const showExistingPreview = !!existingImageSrc && !file;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }
    if (!form.content.trim()) {
      setError("내용을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(form, file);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">카테고리</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              category: e.target.value as BoardCategory,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        >
          {categoryMap
            ? (Object.entries(categoryMap) as [BoardCategory, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))
            : <option disabled>로딩 중...</option>
          }
        </select>
      </div>

      <Input
        label="제목"
        type="text"
        name="title"
        placeholder="제목을 입력하세요"
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-gray-700">내용</label>
        <textarea
          id="content"
          name="content"
          placeholder="내용을 입력하세요"
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-y"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-700">이미지 첨부 (선택)</span>

        {/* 상태 1: 기존 이미지 있음 (수정 모드, 새 파일 미선택) */}
        {showExistingPreview && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 p-3 bg-gray-50">
              <Image
                src={existingImageSrc!}
                alt="현재 이미지"
                width={64}
                height={64}
                className="h-16 w-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">현재 첨부 이미지</p>
                <p className="text-sm text-gray-700 truncate">{existingFilename}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-t border-gray-200 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              다른 이미지로 변경
            </button>
          </div>
        )}

        {/* 상태 2: 새 파일 선택됨 */}
        {file && previewUrl && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="선택된 이미지 미리보기"
              className="h-12 w-12 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-500 mb-0.5">선택된 파일</p>
              <p className="text-sm text-blue-700 font-medium truncate">{file.name}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(undefined);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer"
              aria-label="선택 취소"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* 상태 3: 파일 없음 — 드롭존 스타일 클릭 영역 */}
        {!showExistingPreview && !file && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group"
            aria-label="이미지 파일 선택"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
              클릭하여 이미지 선택
            </span>
            <span className="text-xs text-gray-400">JPEG, PNG, GIF, WebP 지원</span>
          </button>
        )}

        {/* 파일 input — 항상 숨김, ref로만 트리거 */}
        <input
          id="attachment"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              if (!selected.type.startsWith("image/")) {
                setError("이미지 파일만 첨부할 수 있습니다");
                e.target.value = "";
                setFile(undefined);
                return;
              }
              const valid = await checkMagicBytes(selected);
              if (!valid) {
                setError("올바른 이미지 파일이 아닙니다 (JPEG, PNG, GIF, WebP만 허용)");
                e.target.value = "";
                setFile(undefined);
                return;
              }
            }
            setError("");
            setFile(selected);
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
