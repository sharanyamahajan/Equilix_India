import { SVGProps } from 'react';

export function EquilixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2C9.25 2 7 4.25 7 7C7 8.85 8.05 10.45 9.65 11.25C8.8 12.1 8.25 13.2 8.25 14.5C8.25 16.95 10.3 19 12.75 19C13.2 19 13.65 18.9 14.05 18.75C14.4 20.55 15.95 22 18 22C20.2 22 22 20.2 22 18C22 16.1 20.65 14.55 18.85 14.15C19.55 13.3 20 12.2 20 11C20 8.25 17.75 6 15 6C13.5 6 12.2 6.8 11.35 8C10.5 6.45 8.9 5.25 7 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7C7 4.25 4.75 2 2 2C4.75 2 7 4.25 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 14C11 12.9 11.45 11.9 12.2 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
