import { SVGProps } from 'react';

export function EquilixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 10v4" />
      <path d="M12 18v-2" />
      <path d="M12 8V7" />
      <path d="M7 15a5 5 0 0 1 10 0" />
      <path d="M5 18a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
      <path d="M5 11.8A7.9 7.9 0 0 1 12 4a7.9 7.9 0 0 1 7 7.8" />
      <path d="M2.5 12.5a9.8 9.8 0 0 1 19 0" />
    </svg>
  );
}
