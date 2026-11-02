"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  color: string;
  type: "tee" | "hoodie" | "jacket" | "sweater";
  isNew?: boolean;
};

type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

const products: Product[] = [
  { id: 1, name: "Essential Jacket", price: 199, color: "#17253d", type: "jacket", isNew: false },
  { id: 2, name: "Cloud Hoodie", price: 129, color: "#c7c8c5", type: "hoodie", isNew: true },
  { id: 3, name: "Shadow Hoodie", price: 159, color: "#292929", type: "hoodie", isNew: false },
  { id: 4, name: "Essential Sweatshirt", price: 119, color: "#e5d9c5", type: "sweater", isNew: true },
  { id: 5, name: "Forest Hoodie", price: 149, color: "#15583b", type: "hoodie", isNew: false },
  { id: 6, name: "Classic T-Shirt", price: 99, color: "#292929", type: "tee", isNew: true },
  { id: 7, name: "Urban Jacket", price: 189, color: "#b9bec1", type: "jacket", isNew: false },
  { id: 8, name: "Midnight Hoodie", price: 139, color: "#14243c", type: "hoodie", isNew: true },
  { id: 9, name: "Cream Sweatshirt", price: 119, color: "#e8dfc9", type: "sweater", isNew: false },
  { id: 10, name: "Green Essential", price: 149, color: "#176443", type: "hoodie", isNew: true },
];

function Garment({
  product,
  back = false,
}: {
  product: Product;
  back?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 180 220"
      className="garment-art"
      role="img"
      aria-label={`${product.name} ${back ? "back" : "front"}`}
    >
      {product.type === "tee" && (
        <path
          d="M55 24 L25 42 L8 83 L37 98 L48 78 L48 202 L132 202 L132 78 L143 98 L172 83 L155 42 L125 24 Q90 38 55 24Z"
          fill={product.color}
        />
      )}

      {product.type === "hoodie" && (
        <>
          <path
            d="M58 25 Q90 -5 122 25 L155 43 L176 88 L146 105 L133 79 L138 205 L42 205 L47 79 L34 105 L4 88 L25 43Z"
            fill={product.color}
          />
          <path
            d="M58 25 Q90 75 122 25 Q110 0 90 8 Q70 0 58 25Z"
            fill={product.color}
            stroke="rgba(0,0,0,.15)"
            strokeWidth="2"
          />
          <path
            d="M84 70 L84 125 M96 70 L96 125"
            stroke="rgba(255,255,255,.35)"
            strokeWidth="2"
          />
        </>
      )}

      {product.type === "jacket" && (
        <>
          <path
            d="M57 22 L25 42 L7 90 L38 105 L49 78 L43 205 L137 205 L131 78 L142 105 L173 90 L155 42 L123 22 L90 48Z"
            fill={product.color}
          />
          <path
            d="M90 48 L90 205 M57 22 L78 72 L90 48 L102 72 L123 22"
            stroke="rgba(255,255,255,.35)"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}

      {product.type === "sweater" && (
        <path
          d="M55 27 L25 43 L7 89 L37 105 L48 78 L44 205 L136 205 L132 78 L143 105 L173 89 L155 43 L125 27 Q90 42 55 27Z"
          fill={product.color}
        />
      )}

      {back ? (
        <path
          d="M65 60 Q90 85 115 60"
          stroke="rgba(255,255,255,.25)"
          strokeWidth="2"
          fill="none"
        />
      ) : (
        <text
          x="90"
          y="115"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(255,255,255,.75)"
        >
          MAXNICK
        </text>
      )}
    </svg>
  );
}

export default function CollectionPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("M");
  const [view, setView] = useState<"front" | "back">("front");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "new" && product.isNew) ||
      (activeCategory === "streetwear" &&
        ["tee", "hoodie", "jacket", "sweater"].includes(product.type)) ||
      (activeCategory === product.type);

    return matchesSearch && matchesCategory;
  });

  function addToCart() {
    if (!selected) return;

    const productToAdd = selected;
    const selectedSize = size;

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.product.id === productToAdd.id && item.size === selectedSize,
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item.product.id === productToAdd.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...previousCart,
        {
          product: productToAdd,
          size: selectedSize,
          quantity: 1,
        },
      ];
    });

    setMessage(`${productToAdd.name} added to your cart.`);
    setSelected(null);
    setCartOpen(true);
  }

  function updateQuantity(productId: number, itemSize: string, change: number) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.product.id === productId && item.size === itemSize
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: number, itemSize: string) {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => !(item.product.id === productId && item.size === itemSize),
      ),
    );
  }

  return (
    <main className="collection-page">
      <header className="collection-header">
        <Link href="/" className="brand-mark" aria-label="Maxnick Couture home">
          <span>LF</span>
          <small>LOUISO COUTURE</small>
        </Link>

        <nav className="collection-nav">
          <Link href="/">Home</Link>

          <button type="button" onClick={() => setActiveCategory("new")}>
            New Drop
          </button>

          <button type="button" onClick={() => setActiveCategory("streetwear")}>
            Streetwear
          </button>

          <button type="button" onClick={() => setActiveCategory("all")}>
            Collections
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            aria-label={`Shopping cart, ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 4h2l2.5 12h11L21 8H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span>{cartCount}</span>
          </button>

          <button type="button" aria-label="Account">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>
      </header>

      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping cart"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-heading">
              <div>
                <p>YOUR SELECTION</p>
                <h2>Shopping Cart ({cartCount})</h2>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your shopping cart is empty.</p>
                <button type="button" onClick={() => setCartOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={`${item.product.id}-${item.size}`}
                    >
                      <div className="cart-product-art" style={{ backgroundColor: "#f3f1ec" }}>
                        <Garment product={item.product} />
                      </div>

                      <div className="cart-item-details">
                        <h3>{item.product.name}</h3>
                        <p>Size: {item.size}</p>
                        <p>${item.product.price.toFixed(2)}</p>

                        <div className="cart-quantity">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="remove-cart-item"
                          onClick={() => removeFromCart(item.product.id, item.size)}
                        >
                          Remove
                        </button>
                      </div>

                      <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>${cartSubtotal.toFixed(2)}</strong>
                  </div>

                  <p>Shipping and taxes are calculated at checkout.</p>

                  <button type="button" disabled>
                    Checkout — Coming Soon
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {searchOpen && (
        <div className="collection-search">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            autoFocus
          />

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSearchOpen(false);
            }}
          >
            Close
          </button>
        </div>
      )}

      <section className="collection-hero" id="collection">
        <p>
          NEW COLLECTION <span>|</span> PREMIUM STREETWEAR
        </p>

        <div className="collection-filter">
          <button type="button" onClick={() => setActiveCategory("all")}>
            All
          </button>

          <button type="button" onClick={() => setActiveCategory("tee")}>
            T-Shirts
          </button>

          <button type="button" onClick={() => setActiveCategory("hoodie")}>
            Hoodies
          </button>

          <button type="button" onClick={() => setActiveCategory("jacket")}>
            Jackets
          </button>

          <button type="button" onClick={() => setActiveCategory("sweater")}>
            Sweatshirts
          </button>
        </div>

        <p className="product-count">{filteredProducts.length} products</p>

        <div className="rail-scene">
          <div className="clothing-rail" />

          {filteredProducts.map((product) => (
            <button
              type="button"
              className="hanging-product"
              key={product.id}
              onClick={() => {
                setSelected(product);
                setView("front");
                setMessage("");
              }}
              aria-label={`View ${product.name}`}
            >
              <span className="hanger">
                <i />
              </span>
              <span className="price-tag">${product.price}</span>
              <Garment product={product} />
              <span className="hanging-name">{product.name}</span>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-products">No products found.</p>
        )}

        <div className="collection-intro">
          <h1>LOUISO COUTURE</h1>
          <p>
            Premium streetwear designed for the modern lifestyle. Crafted in
            heavyweight fabrics, cut oversized, and made to last.
          </p>
        </div>

        <div className="collection-bottom">
          <p>Crafted in heavyweight fabrics. Cut oversized. Made to last.</p>
          <a href="#collection" className="shop-button">
            Shop the Collection
          </a>
        </div>
      </section>

      {message && <div className="cart-message" role="status">{message}</div>}

      {selected && (
        <div className="quick-view-backdrop" onClick={() => setSelected(null)}>
          <section
            className="quick-view"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} product details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-view"
              onClick={() => setSelected(null)}
              aria-label="Close product view"
            >
              ×
            </button>

            <div className="quick-image">
              <Garment product={selected} back={view === "back"} />
            </div>

            <div className="quick-details">
              <p className="product-category">LOUISO COUTURE / NEW DROP</p>
              <h2>{selected.name}</h2>
              <p className="quick-price">${selected.price.toFixed(2)}</p>

              <div className="view-switch">
                <button
                  type="button"
                  className={view === "front" ? "active" : ""}
                  onClick={() => setView("front")}
                >
                  Front
                </button>
                <button
                  type="button"
                  className={view === "back" ? "active" : ""}
                  onClick={() => setView("back")}
                >
                  Back
                </button>
              </div>

              <p className="size-label">SELECT SIZE</p>
              <div className="size-options">
                {["S", "M", "L", "XL", "XXL"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={size === item ? "selected" : ""}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button type="button" className="add-cart" onClick={addToCart}>
                Add to Cart
              </button>

              <div className="product-extra">
                <span>Details</span>
                <span>View product page →</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
