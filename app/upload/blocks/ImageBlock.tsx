'use client';

import { useRef } from 'react';
import Icon from '@/app/Icon';
import { Image as ImageIcon } from 'lucide-react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar } from '@/app/upload/BlockToolbar';
import { handleImageFile } from '@/app/upload/uploadUtils';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';
import EditableBlock from '@/app/upload/EditableBlock';
import { validateImageFileClient } from '@/lib/fileValidation';

export default function ImageBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: BlockComponentProps<'image'>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { tryReplaceBytes, totalBytes, addFileToBlock } = useUploadActions() as any;

    const onFile = async (f?: File | null) => {
        if (!f) return;
        const err = await validateImageFileClient(f, totalBytes);
        if (err) {
            alert(err.message);
            return;
        }
        const prev = Number(block.data?.imageBytes || 0);
        if (!tryReplaceBytes(prev, f.size)) return;

        // Store original for server publish
        addFileToBlock(block.id, f);

        handleImageFile(f, (src) =>
            updateBlockDataAction((d) => ({ ...d, image: src, imageBytes: f.size }))
        );
    };

    return (
        <EditableBlock>
            <BlockToolbar className="flex gap-2">
                {block.data.image ? (
                    <BlockToolbar.ToolbarChangeButton
                        onClickAction={() => {
                            fileInputRef.current?.click();
                        }}
                    />
                ) : null}
                <BlockToolbar.ToolbarRemoveButton onClickAction={onRemoveAction} />
            </BlockToolbar>
            {!block.data.image ? (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center bg-gray-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Icon
                        icon={ImageIcon}
                        size={48}
                        className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        ariaLabel="Upload image"
                    />
                    <p className="text-gray-600">Click to upload image</p>
                </div>
            ) : (
                <>
                    <div>
                        <img src={block.data.image} alt="Image" className="w-full rounded-lg" />
                        <input
                            type="text"
                            placeholder="Add caption (optional)..."
                            value={block.data.caption || ''}
                            onChange={(e) =>
                                updateBlockDataAction((d) => ({ ...d, caption: e.target.value }))
                            }
                            className="w-full mt-3 text-sm text-gray-600 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent text-center"
                        />
                    </div>
                </>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept={ShotUploadPolicy.ACCEPT_IMAGE_TYPES}
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
            />
        </EditableBlock>
    );
}
