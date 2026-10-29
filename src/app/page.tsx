import Gallery from "@/components/Gallery";
import BookingForm from "@/components/BookingForm";
import RemoteTailoringForm from "@/components/RemoteTailoringForm";
import Link from "next/link";


const services = [
  {
    number: "01",
    title: "Bespoke Suits",
    description: "Sharp tailoring for business, weddings and special occasions.",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85",
  },
  {
    number: "02",
    title: "Native Wear",
    description: "African heritage reimagined with contemporary elegance.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
  },
  {
    number: "03",
    title: "Senator Styles",
    description: "Refined traditional outfits with a distinctive presence.",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=700&q=85",
  },
  {
    number: "04",
    title: "English Wear",
    description: "Modern, versatile clothing designed around your style.",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85",
  },
  {
    number: "05",
    title: "Children's Wear",
    description: "Comfortable, stylish outfits for life's special moments.",
    image:
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=700&q=85",
  },
  {
    number: "06",
    title: "Wardrobe Consulting",
    description: "Personal styling to build a wardrobe that works for you.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",
  },
];

export default function Home() {
  return (
    <main>
      <header className="navbar">
        <a href="#" className="brand">
          <span className="brand-mark">M</span>
          <span className="brand-name">MAXNICK COUTURE</span>
          <span className="brand-tagline">STYLE · CLASS · YOU</span>
        </a>

        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#contact" className="button button-gold nav-cta">
          Book a Consultation
        </a>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">PREMIUM FASHION DESIGNER</p>

          <h1>
            Custom Looks.
            <br />
            <span>Timeless Elegance.</span>
          </h1>

          <p className="hero-description">
            Bespoke fashion for every occasion. From tailored suits to
            traditional wear, we create styles that reflect your personality.
          </p>

          
          <div className="hero-actions">
            <a href="#services" className="button button-gold">
              Explore Our Services ↗
            </a>
            <Link
              href="/remote-tailoring"
              className="button button-outline">
              <span>Remote Tailoring & Delivery ↗</span>
            </Link>
          </div>

          <div className="hero-note">
            <span className="gold-line" />
            MADE FOR YOU. CRAFTED TO LAST.
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1100&q=90"
            alt="Elegant menswear styling"
          />
          <div className="image-caption">
            <span>THE ART OF</span>
            <strong>PERSONAL STYLE</strong>
          </div>
        </div>
      </section>

      <section id="services" className="services section-light">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR EXPERTISE</p>
            <h2>Designed Around You.</h2>
          </div>
          <p className="section-description">
            From timeless tailoring to modern African elegance, discover
            fashion created to make every occasion memorable.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-image">
                <img src={service.image} alt={service.title} />
                <span className="service-number">{service.number}</span>
              </div>

              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contact" className="service-link">
                  DISCOVER MORE <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85"
            alt="Elegant tailored clothing"
          />
        </div>

        <div className="about-content">
          <p className="eyebrow">THE MAXNICK COUTURE DIFFERENCE</p>
          <h2>More Than Fashion. A Statement of Identity.</h2>
          <p>
            We believe what you wear should express who you are. Our approach
            combines thoughtful design, attention to detail and a personal
            touch to create a style that feels uniquely yours.
          </p>

          <a href="#contact" className="button button-gold">
            Discover Our Story ↗
          </a>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <p className="eyebrow">OUR SIGNATURE</p>
        <h2>Elegance in Every Detail.</h2>
        <p>
          Explore our world of refined tailoring and individual expression.
        </p>
        <a href="/collection" className="button button-outline">
          Explore the Collections ↗
        </a>
      </section>

      <section id="contact" className="contact-section">
        <p className="eyebrow">YOUR STYLE JOURNEY STARTS HERE</p>
        <h2>Let's Create Something Exceptional.</h2>
        <p>
          Have an event, a special outfit in mind, or need help refining your
          wardrobe? Let's talk about your vision.
        </p>
        <a href="https://wa.me/676111007" className="button button-gold">
          Contact Us on WhatsApp ↗
        </a>
        <p className="contact-note">
          Replace the WhatsApp link with your business number before launch.
        </p>
      </section>
      <Gallery />
      <BookingForm />
      <footer className="footer">
        <a href="#" className="brand">
          <span className="brand-mark">M</span>
          <span className="brand-name">MAXNICK COUTURE</span>
          <span className="brand-tagline">STYLE · CLASS · YOU</span>
        </a>

        <p>Personal style. Exceptional craftsmanship.</p>
        <p>© 2025 Maxnick Couture. All rights reserved.</p>
      </footer>
    </main>
  );
}