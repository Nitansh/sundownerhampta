import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Accommodation } from './components/Accommodation';
import { Experiences } from './components/Experiences';
import { Packages } from './components/Packages';
import { Dining } from './components/Dining';
import { LocalAttractions } from './components/LocalAttractions';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { BookingEngine } from './components/BookingEngine';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsappWidget } from './components/WhatsappWidget';
import type { Package } from './data';

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // SEO: Update document titles & metadata dynamically + Inject JSON-LD Schema
  useEffect(() => {
    // 1. Set Page Title & Meta Tags
    document.title = "Sundowner Hampta | Luxury Boutique Mountain Homestay & Trekking Stay in Himachal";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content', 
      'Experience rustic luxury wood cabins, organic farm-to-table dining, stargazing, and guided treks at Sundowner Hampta. Best mountain homestay near Hampta Pass, Himachal Pradesh.'
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'Homestay in Hampta, Best Homestay near Hampta Pass, Hampta Valley Stay, Trekking Stay in Himachal, Adventure Homestay Manali, Mountain Homestay Himachal, Farm Stay Himachal Pradesh'
    );

    // 2. Inject JSON-LD Structured Data Schema Markup
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Hotel",
          "@id": "https://sundownerhampta.com/#hotel",
          "name": "Sundowner Hampta",
          "description": "Boutique luxury mountain homestay located at 9,200 ft in Hampta Valley, Himachal Pradesh, India.",
          "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
          "telephone": "+919876543210",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Hampta Valley, Sethan Ridge",
            "addressLocality": "Manali, Hampta",
            "addressRegion": "Himachal Pradesh",
            "postalCode": "175143",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 32.2285,
            "longitude": 77.2662
          },
          "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Mountain View Balcony", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Starlink High Speed WiFi", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Organic Dining & Himachali Kitchen", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Guided Hiking Trails", "value": true }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://sundownerhampta.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do guests reach Sundowner Hampta?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sundowner Hampta is situated in Hampta Valley, approximately 12 km from Manali. We facilitate guided private SUV transport from Manali town or Bhuntar (Kullu) airport directly to our homestay ridge."
              }
            },
            {
              "@type": "Question",
              "name": "Do you provide reliable internet for digital nomads?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we have high-speed Starlink satellite internet access and local power backups available, making it suitable for remote work."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best season to explore Hampta Valley?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "June to October is best for high-altitude trekking such as the Hampta Pass, while January to March is popular for snowboarding, snowscapes, and igloo stays at Sethan village."
              }
            }
          ]
        }
      ]
    };

    const scriptId = 'sundowner-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.text = JSON.stringify(schemaData);

    return () => {
      // Cleanup dynamically added schema tags on unmount if necessary
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedPackage(null); // Clear package if selecting specific room
  };

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedRoomId(''); // Clear room selection if selecting package
  };

  const handleClearSelection = () => {
    setSelectedRoomId('');
    setSelectedPackage(null);
  };

  return (
    <>
      <Navbar />
      <main>
        <h1 className="sr-only">Sundowner Hampta Luxury Mountain Homestay</h1>
        <Hero />
        <About />
        <Accommodation onSelectRoom={handleSelectRoom} />
        <Experiences />
        <Dining />
        <Packages onSelectPackage={handleSelectPackage} />
        <LocalAttractions />
        <Gallery />
        <Reviews />
        <BookingEngine 
          selectedRoomId={selectedRoomId} 
          selectedPackage={selectedPackage}
          onSelectPackage={handleSelectPackage}
          clearSelection={handleClearSelection}
        />
        <Contact />
      </main>
      <Footer />
      <WhatsappWidget />
    </>
  );
}

export default App;
