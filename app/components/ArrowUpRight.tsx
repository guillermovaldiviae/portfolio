// Small "opens elsewhere" arrow. Sized to the surrounding text and uses its color.
export default function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={"inline-block w-[0.85em] h-[0.85em] align-[-0.05em] ml-[0.3em] shrink-0 transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] " + className}
    >
      <path d="M5 11L11 5" />
      <path d="M6 5h5v5" />
    </svg>
  );
}
