"use client";

import React from "react";
import Icon from "@/app/Icon";
import { Plus } from "lucide-react";
import { Block } from "@/lib/constants/blockTypes";
import { BlockToolbar, ToolbarDangerButton } from "@/app/upload/BlockToolbar";
import { handleImageFile } from "@/app/upload/uploadUtils";

export default function GridBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block;
    onRemoveAction: () => void;
    updateBlockDataAction: (updater: (data: any) => any) => void;
}) {
    const setGridAt = (index: number, src: string) =>
        updateBlockDataAction((d) => {
            const images: string[] = [...(d.images || [])];
            images[index] = src;
            return { ...d, images };
        });

    const onGridFile = (index: number, f?: File | null) =>
        f && handleImageFile(f, (src) => setGridAt(index, src));
    const images: string[] = block.data?.images || [];

    return (
        <div className="editable-block">
            <BlockToolbar>
                <ToolbarDangerButton onClick={() => onRemoveAction()}>Delete</ToolbarDangerButton>
            </BlockToolbar>
            <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 aspect-square flex items-center justify-center cursor-pointer hover:border-purple-600 overflow-hidden"
                        onClick={() =>
                            document
                                .getElementById(`grid-input-${block.id}-${i}`)
                                ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                        }
                    >
                        {images[i] ? (
                            <img
                                src={images[i]}
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                alt={`Grid ${i + 1}`}
                            />
                        ) : (
                            <div>
                                <Icon icon={Plus} size={20} className="w-5 h-5 text-gray-400 mx-auto mb-1" ariaLabel="Add image" />
                                <p className="text-xs text-gray-500">
                                    Image {i + 1}
                                    {i >= 2 ? " (optional)" : ""}
                                </p>
                            </div>
                        )}
                        <input
                            id={`grid-input-${block.id}-${i}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onGridFile(i, e.target.files?.[0])}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
