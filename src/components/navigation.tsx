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
    <a href={href} className={clsx({ "underline underline-offset-4 font-semibold": active })}>
      {title}
    </a>
  );
}

export default function Navigation({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((open) => !open), [setOpen]);

  return (
    <nav className="">
      <div className="container flex flex-col max-w-screen-lg px-4 py-5 mx-auto sm:flex-row">
        <div className="flex flex-row items-center justify-between">
          <a
            href="/"
            className="text-xl font-black leading-4 text-center uppercase"
          >
            Omran
            <br />
            Jamal
          </a>
          <button onClick={toggle} className="p-3 sm:hidden">
            <Menu className="w-6" />
          </button>
        </div>
        <div
          className={clsx(
            open ? "flex" : "hidden",
            "flex flex-col font-light space-y-2 sm:space-y-0 pt-4 sm:pt-0 sm:flex sm:flex-row ml-4 sm:ml-6 sm:space-x-4 sm:items-center"
          )}
        >
          <NavigationLink
            href="/"
            title="About Me"
            initiallyActive={path === "/"}
          />
          <NavigationLink
            href="/blog"
            title="Blog"
            initiallyActive={path.indexOf("/blog") >= 0}
          />

          <a target={'_blank'} href="mailto:omran@bonton.app" className="pl-5 space-x-2">
            <strong className="font-semibold">omran</strong>@bonton.app
            <ArrowRight className="inline w-4" />
            <Mail className="inline w-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
