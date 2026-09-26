import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { SITE_URL } from "@/lib/site";

// Only facts that are visible on the page, per Google's structured data policy.
const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: SITE_URL,
  mainEntity: {
    "@type": "Person",
    name: "Hosea Felix Sanjaya",
    url: SITE_URL,
    image: `${SITE_URL}/foto-profil.jpg`,
    description: "Informatics Engineering student at ITS Surabaya working on data analysis and databases.",
    affiliation: { "@type": "CollegeOrUniversity", name: "Institut Teknologi Sepuluh Nopember" },
    address: { "@type": "PostalAddress", addressLocality: "Surabaya", addressCountry: "ID" },
    sameAs: ["https://github.com/Pascalllllll", "https://www.linkedin.com/in/hoseafs-3a9a0931b/"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
