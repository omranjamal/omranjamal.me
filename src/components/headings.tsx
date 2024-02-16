import type { PropsWithChildren } from "react";

function Tag({
  children,
  element,
  ...props
}: PropsWithChildren<
  HTMLHeadElement & {
    element: "h2" | "h3" | "h4" | "h5" | "h6";
  }
>) {
  const Element: any = element;
  const id = props.id;

  return (
    <Element {...props} className="group relative">
      <a
        href={`#` + id}
        className="copy-hash-link-button transition-all hidden md:inline absolute top-0 left-0 before:content-['#'] w-12 text-pink-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-10"
      />
      <a
        href={`#` + id}
        className="copy-hash-link-button group-hover:before:content-['#_'] text-pink-500 md:hidden"
      />
      {children}
    </Element>
  );
}

export function H2Tag(props: any) {
  return <Tag element="h2" {...props} />;
}

export function H3Tag(props: any) {
  return <Tag element="h3" {...props} />;
}

export function H4Tag(props: any) {
  return <Tag element="h4" {...props} />;
}

export function H5Tag(props: any) {
  return <Tag element="h5" {...props} />;
}

export function H6Tag(props: any) {
  return <Tag element="h6" {...props} />;
}
