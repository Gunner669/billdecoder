export const metadata = {
  title: "BillDecoder.au — Your electricity bill, decoded",
  description: "Upload your Australian electricity bill and get a plain-English verdict in 60 seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
