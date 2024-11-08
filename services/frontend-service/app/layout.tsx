"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ApolloProvider } from "@apollo/client";
import client from "@/apollo/client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={client}>
          <Provider store={store}>{children}</Provider>
        </ApolloProvider>
        {/* Example of running tracking service */}
        <script
          src="http://localhost:3000/tracking.js?tracking_id=UNIQUE_TRACKING_ID"
          defer
        ></script>
      </body>
    </html>
  );
}
