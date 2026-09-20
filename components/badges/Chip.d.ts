/** Chip de tema sobre Hielo o Perla, radio 6. */
export interface ChipProps {
  /** 'hielo' #DBE8F2 (defecto) | 'perla' #EFEEF3 */
  tone?: 'hielo' | 'perla';
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
