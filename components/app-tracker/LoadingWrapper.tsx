import { ReactNode } from "react";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}

export default function LoadingWrapper({
  isLoading,
  children,
  className = "h-full",
}: LoadingWrapperProps) {
  return (
    <div
      className={`${className} ${
        isLoading ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      {children}
    </div>
  );
}
