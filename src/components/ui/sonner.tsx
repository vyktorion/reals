"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      offset={16}
      expand={false}
      richColors={false}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'white',
          color: '#020508',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px 20px',
          maxWidth: '380px',
          lineHeight: '1.4',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
