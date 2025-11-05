"use client";

export function handleImageFile(file: File, cb: (src: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => cb(String((e.target as FileReader).result || ""));
    reader.readAsDataURL(file);
}
