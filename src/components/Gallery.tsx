const galleryItems = [
  {
    title: "The Classic Suit",
    category: "SUITS",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "African Heritage",
    category: "NATIVE WEAR",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Modern Senator",
    category: "SENATOR",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Contemporary Elegance",
    category: "ENGLISH WEAR",
    image:
      "https://images.unsplash.com/photo-1618354691373-d990e3f5e9b1?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Little Gentlemen",
    category: "CHILDREN'S WEAR",
    image:
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Personal Style",
    category: "WARDROBE CONSULTING",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section">
      <p className="eyebrow">THE SIGNATURE COLLECTION</p>

      <h2>Elegance in Every Detail.</h2>

      <p className="gallery-intro">
        Discover styles inspired by individuality, craftsmanship,
        and timeless fashion.
      </p>

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <article className="gallery-card" key={item.category}>
            <div className="gallery-card-image">
              <img src={item.image} alt={item.title} loading="lazy" />

              <span className="gallery-category">
                {item.category}
              </span>
            </div>

            <div className="gallery-card-info">
              <h3>{item.title}</h3>
              <a href="#contact" aria-label={`Enquire about ${item.title}`}>
                Enquire about this style ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}