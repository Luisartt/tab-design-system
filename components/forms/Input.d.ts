/** Campo de texto TAB: borde 1.5px #B9C4D8, radio 6, foco azul con anillo, error #B4530A sobre #FFF7F0. */
export interface InputProps {
  label?: string;
  /** Texto de ayuda 12px #4A5578 */
  helper?: string;
  /** Mensaje de error; activa el estado de error */
  error?: string;
  disabled?: boolean;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
