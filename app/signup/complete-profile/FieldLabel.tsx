function Label({ children }: { children: React.ReactNode }) {
    return <label className="text-sm font-bold text-gray-900 block">{children}</label>;
}

function SubLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-xs text-gray-500 mt-1">{children}</p>;
}

export function FieldLabel({ label, sublabel }: { label: string; sublabel?: string }) {
    return (
        <div>
            <Label>{label}</Label>
            {sublabel && <SubLabel>{sublabel}</SubLabel>}
        </div>
    );
}
