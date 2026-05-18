import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return (
    <button 
      {...props}
      className={`bg-blue-500 text-white p-3 px-5 rounded-md cursor-pointer hover:bg-blue-500/90 ${props.className || ''}`} />
  );
}
