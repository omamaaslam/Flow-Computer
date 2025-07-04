// src/custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'md-elevated-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-filled-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-outlined-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    // Add more components as needed
  }
}
