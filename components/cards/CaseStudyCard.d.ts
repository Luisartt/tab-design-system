/** Tarjeta de case study: foto en duotono azul (multiply #0F75BC), pill de categoria, titulo Open Sans 800 19 y enlace terciario. */
export interface CaseStudyCardProps {
  /** URL de foto real; se renderiza en duotono azul */
  image?: string;
  title: string;
  /** Texto del pill (defecto "TAB Case Study") */
  tag?: string;
  href?: string;
  /** Defecto "Leer la historia" */
  linkLabel?: string;
  style?: React.CSSProperties;
}
export declare function CaseStudyCard(props: CaseStudyCardProps): JSX.Element;
