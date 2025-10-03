export default function Box({ children }: { children: React.ReactNode }) {
    return <div className={'bg-white p-6 rounded-lg shadow-sm'}>{children}</div>;
}
