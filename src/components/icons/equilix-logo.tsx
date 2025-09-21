import { SVGProps } from 'react';

export function EquilixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="90"
        fontWeight="bold"
        fill="currentColor"
      >
        E
      </text>
    </svg>
  );
}
