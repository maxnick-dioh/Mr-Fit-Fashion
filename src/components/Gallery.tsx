import Image from "next/image";

const galleryItems = [
  {
    title: "The Classic Suit",
    category: "SUITS",
    image:"./images/image12.jpg",
  },
  {
    title: "African Heritage",
    category: "NATIVE WEAR",
    image:"./images/image8.jpg",
  },
  {
    title: "Modern Senator",
    category: "SENATOR",
    image:"./images/image11.jpg"
  },
  {
    title: "Contemporary Elegance",
    category: "ENGLISH WEAR",
    image:"./images/image9.jpg",
  },
  {
    title: "Little Gentlemen",
    category: "CHILDREN'S WEAR",
    image:"./images/image10.jpg",
  },
  {
    title: "Personal Style",
    category: "WARDROBE CONSULTING",
    image:"./images/image13.jpg",
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
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={1000}
                loading="lazy"
                unoptimized
              />

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