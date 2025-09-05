export const metadata = {
  title: "Health Dashboard",
  description: "Coalition Tech Skills Test"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
