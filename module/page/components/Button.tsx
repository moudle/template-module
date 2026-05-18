import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return (
    <button 
      {...props}
      className={`bg-zinc-300 ${props.className || ''}`} />
  );
}
