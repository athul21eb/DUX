"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../ui/ThemeProvider";
import { ViewTransitions } from "next-view-transitions";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "../ui/sidebar";


function AllProviders({ children }: { children: React.ReactNode }) {


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={true}>
        <SessionProvider>
          <ViewTransitions>{children}</ViewTransitions>
        </SessionProvider>
      </SidebarProvider>

      {/* Toaster should be outside of ViewTransitions to persist */}
      
      <Toaster
  position="bottom-right"
  toastOptions={{
    style: {
      background: "black",
      color: "white",
      border: "1px solid #333",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
  }}
/>

    </ThemeProvider>
  );
}

export default AllProviders;
