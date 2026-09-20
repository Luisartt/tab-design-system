/** Badge pill de categoria (CASE STUDY / WHITE PAPER): Open Sans 800 blanco sobre marino o Azul Accion. */
export interface PillProps {
  /** 'navy' #181C4D (defecto) | 'blue' #0063B0 */
  variant?: 'navy' | 'blue';
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Pill(props: PillProps): JSX.Element;
