"use client";

import Link from "next/link";
import React from "react";

export default function UploadHeaderActions() {
  const onSave = () => {
    window.dispatchEvent(new CustomEvent("upload:saveDraft"));
  };
  const onPublish = () => {
    window.dispatchEvent(new CustomEvent("upload:publish"));
  };

  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
        Cancel
      </Link>
      <button
        type="button"
        onClick={onSave}
        className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 font-medium"
      >
        Save draft
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium"
      >
        Publish
      </button>
    </div>
  );
}
