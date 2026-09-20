/** Radio 18px con accent-color Azul TAB. */
export interface RadioProps {
  label?: React.ReactNode;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
