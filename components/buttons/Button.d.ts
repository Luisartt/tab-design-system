/**
 * Boton TAB — Open Sans 700, radio 10px, altura tactil >= 44px.
 * @startingPoint section="Componentes" subtitle="Primario, secundario, CTA naranja, sobre marino y enlace" viewport="700x300"
 */
export interface ButtonProps {
  /** 'primary' #0F75BC | 'secondary' borde 2px | 'cta' naranja texto marino | 'white' y 'ghost' sobre marino | 'link' terciario con flecha */
  variant?: 'primary' | 'secondary' | 'cta' | 'white' | 'ghost' | 'link';
  disabled?: boolean;
  /** Si se da, renderiza <a> */
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
