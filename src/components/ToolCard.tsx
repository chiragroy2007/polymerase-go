import Link from 'next/link';

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon?: string;
}

export default function ToolCard({ title, description, href, icon }: ToolCardProps) {
    return (
        <Link href={href} className="block group">
            <div className="card h-full flex flex-col hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    {icon && <span className="text-2xl">{icon}</span>}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}
