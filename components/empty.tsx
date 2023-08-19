import Image from "next/image"

interface EmptyProps {
    label: string;
}

export const Empty = ({
    label
}: EmptyProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-20">
            <div className="relative h-72 w-72">
                <Image alt="Empty" fill src="/empty.png" />
            </div>
            <p className="text-muted-foreground text-sm text-center">
                {label}
            </p>
        </div>
    );
}