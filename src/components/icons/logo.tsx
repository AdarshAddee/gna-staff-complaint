import type { SVGProps } from 'react';

export function ComplaintCentralLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-primary" // Default size and color
      {...props}
    >
      <path d="M12 22V12" />
      <path d="M4.7 17L2 14.3" />
      <path d="m20 8-3-3" />
      <path d="M5 8H2" />
      <path d="M22 8h-3" />
      <path d="m19.3 17 2.7-2.7" />
      <path d="M12 12v-2a4 4 0 0 0-4-4H4" />
      <path d="M12 12h4a4 4 0 0 0 4-4V2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
