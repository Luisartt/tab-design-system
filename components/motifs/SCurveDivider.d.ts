/** Curva "S" divisoria de secciones — siempre asciende de izquierda a derecha; maximo una por pieza. */
export interface SCurveDividerProps {
  /** Color de la seccion inferior (rellena bajo la curva). Defecto Marino Fondo. */
  fill?: string;
  /** Filete #1A60AD sobre el borde (defecto true) */
  stroke?: boolean;
  /** 4-6 px */
  strokeWidth?: number;
  height?: number;
  style?: React.CSSProperties;
}
export declare function SCurveDivider(props: SCurveDividerProps): JSX.Element;
