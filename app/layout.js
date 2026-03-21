export const metadata = {
  metadataBase: new URL("https://billdecoder.au"),
  title: {
    default: "BillDecoder.au — Your electricity bill, decoded",
    template: "%s | BillDecoder.au"
  },
  description: "Upload your Australian electricity bill and get a plain-English verdict in 60 seconds. Free, independent analysis — no affiliate commissions.",
  keywords: [
    "electricity bill analysis",
    "Australian electricity bill",
    "energy bill decoder",
    "electricity bill comparison Australia",
    "energy bill checker",
    "power bill analysis",
    "compare electricity plans Australia",
    "am I being overcharged electricity",
    "electricity bill too high",
    "energy savings Australia"
  ],
  authors: [{ name: "BillDecoder.au" }],
  creator: "BillDecoder.au",
  publisher: "BillDecoder.au",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://billdecoder.au",
    siteName: "BillDecoder.au",
    title: "BillDecoder.au — Your electricity bill, decoded in 60 seconds",
    description: "Upload your Australian electricity bill and get a plain-English verdict. Free. Independent. No affiliate commissions."
  },
  twitter: {
    card: "summary_large_image",
    title: "BillDecoder.au — Your electricity bill, decoded",
    description: "Upload your Australian electricity bill and get a plain-English verdict in 60 seconds."
  },
  alternates: {
    canonical: "https://billdecoder.au"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};

var SITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BillDecoder.au",
  "url": "https://billdecoder.au",
  "description": "Free, independent Australian electricity bill analysis tool.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://billdecoder.au",
    "query-input": undefined
  }
};

var ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BillDecoder.au",
  "url": "https://billdecoder.au",
  "description": "Independent Australian electricity bill analysis. No affiliate commissions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body style={{margin:0}}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(SITE_JSONLD)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ORG_JSONLD)}} />
      </body>
    </html>
  );
}
