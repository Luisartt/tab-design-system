/**
 * Tarjeta de testimonio TAB: comilla naranja, cita IBM Plex italica, filete y avatar con iniciales.
 * @startingPoint section="Componentes" subtitle="Testimonios clara y marina con cita editorial" viewport="700x340"
 */
export interface TestimonialCardProps {
  /** 'light' fondo blanco (defecto) | 'navy' fondo Marino Fondo con triangulo naranja */
  variant?: 'light' | 'navy';
  quote: string;
  name: string;
  company?: string;
  /** Derivadas del nombre si se omite */
  initials?: string;
  style?: React.CSSProperties;
}
export declare function TestimonialCard(props: TestimonialCardProps): JSX.Element;
