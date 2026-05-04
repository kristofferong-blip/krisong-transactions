import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'KO Transaction Tracker', description: 'Personal real estate transaction tracker' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}