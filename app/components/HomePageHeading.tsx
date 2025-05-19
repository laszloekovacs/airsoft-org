import React from 'react';

interface Link {
    label: string;
    href: string;
}

interface HomePageHeadingProps {
    title: string;
    links: Link[];
    SessionComponent: React.ReactNode;
}

const HomePageHeading: React.FC<HomePageHeadingProps> = ({ title, links, SessionComponent }) => (
    <header className="flex flex-row items-center justify-between py-4">
        <h1 className="m-0 text-2xl font-bold">{title}</h1>
        <nav>
            <ul className="flex flex-row list-none m-0 p-0 gap-4">
                {links.map((link) => (
                    <li key={link.href}>
                        <a href={link.href} className="text-blue-600 hover:underline">
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <div>
            {SessionComponent}
        </div>
    </header>
);

export default HomePageHeading;
