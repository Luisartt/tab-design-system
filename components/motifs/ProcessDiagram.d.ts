/** Diagrama circular de proceso de 6 segmentos (conic desde -30 grados, azules de paleta) con puntos naranja numerados en las fronteras y centro blanco con anillo naranja. */
export interface ProcessDiagramProps {
  /** Defecto: ciclo StratPro (Align, Vision, Diagnose, Plan, Execute, Optimize) */
  steps?: { name: string; detail?: string }[];
  size?: number;
  /** Contenido del circulo central (logo/icono) */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ProcessDiagram(props: ProcessDiagramProps): JSX.Element;
