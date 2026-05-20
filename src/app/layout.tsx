import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "SiPengajar",
  description: "Platform pembelajaran bertenaga AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "8px",
              border: "0.5px solid",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
