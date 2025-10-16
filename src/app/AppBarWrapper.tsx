"use client";

import Link from "next/link";
import { useState } from "react";
import {
    AppBar,
    Spacer,
    Button,
    SvgIcon,
    Navigation,
    List,
    ListItem,
    Display,
    AppBarProps,
    NavigationProps,
    useOnOutsideClick,
} from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import LogoIcon from "@/assets/svg/LogoIcon";

interface NavListItem {
    href: string;
    name: string;
}
const navListItems: NavListItem[] = [
    {
        href: "/quran",
        name: "Quran",
    },
    {
        href: "https://blog.natiq.net",
        name: "Blog",
    },
];

export default function AppBarWrapper({ ...restProps }: AppBarProps) {
    const [navOpen, setNavOpen] = useState<boolean>(false);

    const navRef = useOnOutsideClick<HTMLDivElement>(() => setNavOpen(false));

    return (
        <>
            <AppBar {...restProps}>
                <Display maxWidth="md">
                    <Button
                        icon={<Symbol icon="menu" />}
                        onClick={() => setNavOpen(true)}
                    />
                </Display>
                <SvgIcon size={5}>
                    <LogoIcon />
                </SvgIcon>
                <h1
                    style={{
                        fontFamily: "arial",
                        fontSize: "2.4rem",
                        fontWeight: "normal",
                        letterSpacing: "0.1rem",
                    }}
                >
                    Natiq
                </h1>
                <Display minWidth="md">
                    <List>
                        {navListItems.map((item, index) => (
                            <ListItem key={index}>
                                <Link href={item.href} target="_blank">
                                    <Button
                                        variant="link"
                                        style={{ width: "100%" }}
                                    >
                                        {item.name}
                                    </Button>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Display>
                <Spacer />
                <Link href="/discover/search">
                    <Button variant="outlined" icon={<Symbol icon="search" />}>
                        <Display minWidth="xs">Search</Display>
                    </Button>
                </Link>
            </AppBar>
            <div ref={navRef}>
                <NavigationWrapper anchor="top" open={navOpen} />
            </div>
        </>
    );
}

function NavigationWrapper({ ...restProps }: NavigationProps) {
    return (
        <Navigation {...restProps}>
            <List direction="column" style={{ padding: "0 2rem" }}>
                {navListItems.map((item, index) => (
                    <ListItem key={index}>
                        <Link href={item.href} target="_blank">
                            <Button
                                variant="link"
                                style={{ width: "100%" }}
                                borderStyle="semi"
                                iconPosition="end"
                            >
                                {item.name}
                            </Button>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Navigation>
    );
}
