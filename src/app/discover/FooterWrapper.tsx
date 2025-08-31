"use client";

import Link from "next/link";
import { Button, Footer, FooterProps } from "@yakad/ui";
import { IconCode, Symbol } from "@yakad/symbols";
import { usePathname } from "next/navigation";

interface FooterLink {
    title: string;
    url: string;
    icon: IconCode;
}
const footerLinks: FooterLink[] = [
    { title: "Home", url: "home", icon: "home" },
    { title: "Search", url: "search", icon: "search" },
    { title: "Library", url: "library", icon: "library_books" },
    { title: "Settings", url: "settings", icon: "settings" },
];

export default function FooterWrapper({
    style,
    ...restProps
}: Omit<FooterProps, "children">) {
    const pathname = usePathname();
    const currentPage = pathname.split("/")[2]; // 'search', 'home', or 'library'

    return (
        <Footer
            position="sticky"
            size="md"
            style={{ justifyContent: "space-around" }}
        >
            {footerLinks.map((footerLink) => (
                <Link
                    key={footerLink.url}
                    href={`/discover/${footerLink.url}`}
                    passHref
                >
                    <Button
                        title={footerLink.title}
                        icon={<Symbol type="outlined" icon={footerLink.icon} />}
                        disabled={currentPage === footerLink.url}
                    />
                </Link>
            ))}
        </Footer>
    );
}
