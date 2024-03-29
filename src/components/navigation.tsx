import { useCallback, useState } from "react";
import { Menu, ArrowRight, Mail } from "react-feather";
import clsx from "clsx";

export function NavigationLink({
  title,
  href,
  initiallyActive,
}: {
  title: string;
  href: string;
  initiallyActive?: boolean;
}) {
  const active = initiallyActive;

  return (
    <a
      href={href}
      className={clsx(
        { "underline underline-offset-4 font-semibold": active },
        "hover:text-pink-600 transition-colors"
      )}
    >
      {title}
    </a>
  );
}

export default function Navigation({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen]);

  return (
    <nav className="">
      <div className="container flex flex-col max-w-screen-lg px-4 py-5 mx-auto md:flex-row">
        <div className="flex flex-row items-center justify-between">
          <a
            href="/"
            className="text-xl font-black leading-4 text-center uppercase"
          >
            Omran
            <br />
            Jamal
          </a>
          <button onClick={toggle} className="p-3 md:hidden">
            <Menu className="w-6" />
          </button>
        </div>
        <div
          className={clsx(
            open ? "flex" : "hidden",
            "flex flex-col font-semibold space-y-2 md:space-y-0 pt-4 font-jetbrains-mono md:pt-0 md:flex md:flex-row ml-4 md:ml-6 md:space-x-4 md:items-center"
          )}
        >
          <NavigationLink
            href="/"
            title="About Me"
            initiallyActive={path === "/"}
          />

          {/* <NavigationLink
            href="/work"
            title="Work"
            initiallyActive={path.indexOf("/work") >= 0}
          /> */}

          <NavigationLink
            href="/blog"
            title="Blog"
            initiallyActive={path.indexOf("/blog") >= 0}
          />

          <NavigationLink
            href="https://omranjamal.notion.site/Omran-Jamal-586b879ed9204928a41ca1ccd321b920"
            title="Résumé"
          />

          <a
            target={"_blank"}
            href="mailto:omran@omranjamal.me"
            className="pl-5 space-x-2 transition-colors hover:text-pink-600"
          >
            <strong className="font-semibold">omran</strong>@omranjamal.me
            <ArrowRight className="inline w-4" />
            <Mail className="inline w-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
