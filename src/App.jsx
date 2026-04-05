import { useEffect, useMemo, useState } from 'react'
import heroImg from './assets/hero-pizza.png'
import interiorImg from './assets/interior.png'
import margheritaImg from './assets/menu-margherita.png'
import diavolaImg from './assets/menu-diavola.png'
import funghiImg from './assets/menu-funghi.png'
import pepperoniImg from './assets/pep-pizza-fold.png'
import gardenImg from './assets/garden-bianca.png'
import bbqImg from './assets/smokehouse-bbq.png'
import meatloversImg from './assets/menu-meatlovers.png'
import boneInImg from './assets/menu-bonein-wings.png'
import bonelessImg from './assets/menu-boneless-wings.png'
import tendersImg from './assets/menu-tenders.png'
import caesarImg from './assets/menu-ChoppedCaesar.png'
import marketImg from './assets/menu-MarketGreens.png'
import chickenSaladImg from './assets/menu-chickensalad.png'
import chickenParmImg from './assets/menu-chickenparm.png'
import italianGrinderImg from './assets/menu-italianGrinder.png'
import veggiePressImg from './assets/menu-veggiePress.png'
import garlicKnotsImg from './assets/menu-garlicKnots.png'
import meatballsImg from './assets/menu-bakedMeatballs.png'
import mozzTrianglesImg from './assets/menu-mozzarellaTriangles.png'
import lemonadeImg from './assets/menu-lemonade.png'
import shrubImg from './assets/menu-sparklingShrub.png'
import craftSodaImg from './assets/menu-craftSoda.png'
import coldBrewImg from './assets/menu-coldBrew.png'
import logoImg from './assets/pizza-logo.png'
import { normalizeCart } from '../shared/cartSchema.js'
import { calculateTotals, centsToDollars } from '../shared/calculateTotals.js'
import './App.css'

const specials = [
  {
    title: 'Wood-Fired Margherita',
    desc: 'San Marzano, fresh mozzarella, basil, finishing olive oil.',
    price: '$16',
    image: margheritaImg,
  },
  {
    title: 'Spicy Diavola',
    desc: 'Calabrian chili, soppressata, roasted garlic, hot honey drizzle.',
    price: '$18',
    image: diavolaImg,
  },
  {
    title: 'Truffle Funghi',
    desc: 'Cremini + oyster mushrooms, taleggio cream, arugula, truffle salt.',
    price: '$19',
    image: funghiImg,
  },
]

const classics = [
  {
    title: 'Pepperoni Fold',
    desc: 'Shingle-cut pepperoni, aged provolone, oregano.',
    price: '$15',
    image: pepperoniImg,
    fit: 'contain',
  },
  {
    title: 'Garden Bianca',
    desc: 'Ricotta base, zucchini ribbons, lemon zest, chive oil.',
    price: '$17',
    image: gardenImg,
  },
  {
    title: 'Smokehouse BBQ',
    desc: 'Charred chicken, pickled onion, BBQ glaze, scallion.',
    price: '$18',
    image: bbqImg,
  },
  {
    title: 'Meat Lovers',
    desc: 'Sausage, pepperoni, pancetta, double mozzarella, oregano.',
    price: '$19',
    image: meatloversImg,
  },
]

const wings = [
  {
    title: 'Bone-In Wings',
    desc: 'Oven-finished, crispy skin, choice of sauce.',
    price: '$12',
    image: boneInImg,
    flavors: ['Buffalo', 'BBQ', 'Garlic Parm', 'Lemon Pepper', 'Hot Honey'],
    sauces: ['None', 'Ranch', 'Blue cheese'],
  },
  {
    title: 'Boneless Wings',
    desc: 'Crispy chicken bites, tossed to order.',
    price: '$11',
    image: bonelessImg,
    flavors: ['Buffalo', 'BBQ', 'Garlic Parm', 'Lemon Pepper', 'Hot Honey'],
    sauces: ['None', 'Ranch', 'Blue cheese'],
  },
  {
    title: 'Chicken Tenders',
    desc: 'Buttermilk brined, crispy herbs, sauce on the side.',
    price: '$11',
    image: tendersImg,
    flavors: ['Buffalo', 'BBQ', 'Garlic Parm', 'Lemon Pepper', 'Hot Honey'],
    sauces: ['None', 'Ranch', 'Blue cheese'],
  },
]

const salads = [
  {
    title: 'Chopped Caesar',
    desc: 'Romaine, shaved Parm, toasted crumbs, lemony dressing.',
    price: '$11',
    image: caesarImg,
  },
  {
    title: 'Market Greens',
    desc: 'Seasonal greens, pickled shallot, sunflower crunch, vinaigrette.',
    price: '$10',
    image: marketImg,
  },
  {
    title: 'Chicken Salad',
    desc: 'Mixed greens, tomato, cucumber, house dressing, choice of chicken.',
    price: '$13',
    image: chickenSaladImg,
    styles: ['Grilled', 'Fried'],
  },
]

const sandwiches = [
  {
    title: 'Chicken Parm Sandwich',
    desc: 'Crispy cutlet, house red sauce, mozzarella, soft roll.',
    price: '$14',
    image: chickenParmImg,
  },
  {
    title: 'Italian Grinder',
    desc: 'Soppressata, ham, provolone, pickled veg, herbed mayo.',
    price: '$14',
    image: italianGrinderImg,
  },
  {
    title: 'Veggie Press',
    desc: 'Marinated zucchini, roasted peppers, arugula, pesto aioli.',
    price: '$13',
    image: veggiePressImg,
  },
]

const appetizers = [
  {
    title: 'Wood-Fired Garlic Knots',
    desc: 'Herb butter, pecorino, side of red sauce.',
    price: '$8',
    image: garlicKnotsImg,
  },
  {
    title: 'Baked Meatballs',
    desc: 'Beef/pork blend, pomodoro, ricotta dollop, basil.',
    price: '$11',
    image: meatballsImg,
  },
  {
    title: 'Mozzarella Triangles',
    desc: 'Hand-breaded, herb crumbs, marinara dip.',
    price: '$9',
    image: mozzTrianglesImg,
  },
]

const drinks = [
  {
    title: 'House Lemonade',
    desc: 'Fresh lemon, honey, mint.',
    price: '$5',
    image: lemonadeImg,
  },
  {
    title: 'Sparkling Shrub',
    desc: 'Seasonal fruit shrub, bubbles, herb sprig.',
    price: '$6',
    image: shrubImg,
  },
  {
    title: 'Craft Soda',
    desc: 'Rotating small-batch flavors.',
    price: '$4',
    image: craftSodaImg,
    flavors: ['Coke', 'Pepsi', 'Sprite', 'Root Beer', 'Birch Beer', 'Orange Soda'],
    quantityEnabled: true,
  },
  {
    title: 'Cold Brew',
    desc: '12-hour brew, toasted sugar syrup optional.',
    price: '$5',
    image: coldBrewImg,
  },
]

const steps = [
  'Choose your crust: thin, sourdough, or gluten-friendly.',
  'Pick a base: red, white, pesto, or chili crisp oil.',
  'Layer toppings: fresh veg, cured meats, artisan cheeses.',
  'Finish: herb dust, hot honey, balsamic, or chili crunch.',
]

const reviews = [
  {
    quote: 'Fast delivery, crisp crust, generous toppings. New weekly ritual.',
    name: 'Taylor P.',
    tag: 'Neighborhood Regular',
  },
  {
    quote: 'Low-fi look, high-fi flavor. The diavola slap of heat is perfect.',
    name: 'Jordan K.',
    tag: 'Spice Seeker',
  },
  {
    quote: 'Craveable lunch combos, ready in 12 minutes. Zero sog.',
    name: 'Alex R.',
    tag: 'Office Pickup',
  },
]

const navLinks = [
  { href: '#menu', label: 'Menu' },
  { href: '#build', label: 'Build' },
  { href: '#deals', label: 'Combos' },
  { href: '#wings', label: 'Wings' },
  { href: '#salads', label: 'Salads' },
  { href: '#sandwiches', label: 'Sandwiches' },
  { href: '#appetizers', label: 'Starters' },
  { href: '#drinks', label: 'Drinks' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#visit', label: 'Visit' },
]

function SectionHeading({ eyebrow, title, body }) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div>
        <h2>{title}</h2>
        {body && <p className="muted">{body}</p>}
      </div>
    </header>
  )
}

function MenuGrid({ items, onAdd }) {
  const [selectedFlavor, setSelectedFlavor] = useState(() =>
    Object.fromEntries(items.map((item) => [item.title, item.flavors?.[0] || ''])),
  )
  const [selectedSauce, setSelectedSauce] = useState(() =>
    Object.fromEntries(items.map((item) => [item.title, item.sauces?.[0] || ''])),
  )
  const [selectedStyle, setSelectedStyle] = useState(() =>
    Object.fromEntries(items.map((item) => [item.title, item.styles?.[0] || ''])),
  )
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(items.map((item) => [item.title, 1])),
  )

  useEffect(() => {
    setSelectedFlavor((prev) => {
      const next = { ...prev }
      items.forEach((item) => {
        if (item.flavors) {
          next[item.title] = item.flavors[0]
        }
      })
      return next
    })
    setSelectedSauce((prev) => {
      const next = { ...prev }
      items.forEach((item) => {
        if (item.sauces) {
          next[item.title] = item.sauces[0]
        }
      })
      return next
    })
    setSelectedStyle((prev) => {
      const next = { ...prev }
      items.forEach((item) => {
        if (item.styles) {
          next[item.title] = item.styles[0]
        }
      })
      return next
    })
    setQuantities((prev) => {
      const next = { ...prev }
      items.forEach((item) => {
        next[item.title] = prev[item.title] || 1
      })
      return next
    })
  }, [items])

  const handleFlavorChange = (title, value) => {
    setSelectedFlavor((prev) => ({ ...prev, [title]: value }))
  }

  const handleSauceChange = (title, value) => {
    setSelectedSauce((prev) => ({ ...prev, [title]: value }))
  }

  const handleStyleChange = (title, value) => {
    setSelectedStyle((prev) => ({ ...prev, [title]: value }))
  }

  const handleQuantityChange = (title, value) => {
    const parsed = Math.max(1, Number(value) || 1)
    setQuantities((prev) => ({ ...prev, [title]: parsed }))
  }

  const nudgeQuantity = (title, delta) => {
    setQuantities((prev) => {
      const current = prev[title] || 1
      const next = Math.max(1, current + delta)
      return { ...prev, [title]: next }
    })
  }

  return (
    <div className="grid menu-grid">
      {items.map((item) => (
        <article key={item.title} className="card menu-card">
          {item.image ? (
            <figure
              className={`menu-img ${item.fit === 'contain' ? 'contain' : ''}`}
              aria-hidden="true"
            >
              <img src={item.image} alt="" loading="lazy" />
            </figure>
          ) : (
            <div className="menu-img placeholder" aria-hidden="true">
              <span>{item.title}</span>
            </div>
          )}
          <div className="card-topper" aria-hidden="true" />
          <div className="card-body">
            <div className="row">
              <h3>{item.title}</h3>
              <span className="pill">{item.price}</span>
            </div>
            <p className="muted">{item.desc}</p>
            {item.flavors && (
              <div className="flavor-row">
                <label className="label" htmlFor={`${item.title}-flavor`}>
                  Choose flavor
                </label>
                <select
                  id={`${item.title}-flavor`}
                  value={selectedFlavor[item.title] || item.flavors[0]}
                  onChange={(e) => handleFlavorChange(item.title, e.target.value)}
                >
                  {item.flavors.map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {item.styles && (
              <div className="style-row">
                <label className="label" htmlFor={`${item.title}-style`}>
                  Choose style
                </label>
                <select
                  id={`${item.title}-style`}
                  value={selectedStyle[item.title] || item.styles[0]}
                  onChange={(e) => handleStyleChange(item.title, e.target.value)}
                >
                  {item.styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {item.sauces && (
              <div className="sauce-row">
                <label className="label" htmlFor={`${item.title}-sauce`}>
                  Sauce
                </label>
                <select
                  id={`${item.title}-sauce`}
                  value={selectedSauce[item.title] || item.sauces[0]}
                  onChange={(e) => handleSauceChange(item.title, e.target.value)}
                >
                  {item.sauces.map((sauce) => (
                    <option key={sauce} value={sauce}>
                      {sauce}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {item.quantityEnabled && (
              <div className="quantity-row">
                <label className="label" htmlFor={`${item.title}-quantity`}>
                  Quantity
                </label>
                <div className="qty-controls">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.title} quantity`}
                    onClick={() => nudgeQuantity(item.title, -1)}
                  >
                    –
                  </button>
                  <input
                    id={`${item.title}-quantity`}
                    type="number"
                    min="1"
                    value={quantities[item.title] || 1}
                    onChange={(e) => handleQuantityChange(item.title, e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${item.title} quantity`}
                    onClick={() => nudgeQuantity(item.title, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className={`ghost ${item.flavors || item.quantityEnabled ? 'centered' : ''}`}
            onClick={() =>
              onAdd({
                title: item.title,
                price: item.price,
                flavor: item.flavors ? selectedFlavor[item.title] : undefined,
                sauce: item.sauces ? selectedSauce[item.title] : undefined,
                style: item.styles ? selectedStyle[item.title] : undefined,
                quantity: item.quantityEnabled ? quantities[item.title] || 1 : 1,
              })
            }
          >
            {item.quantityEnabled
              ? 'Add drinks'
              : item.flavors
              ? 'Add with flavor'
              : 'Add to order'}
          </button>
        </article>
      ))}
    </div>
  )
}

function ReviewGrid() {
  return (
    <div className="grid review-grid">
      {reviews.map((review) => (
        <article key={review.name} className="card">
          <p className="quote">“{review.quote}”</p>
          <div className="row">
            <div>
              <p className="label">{review.name}</p>
              <p className="muted">{review.tag}</p>
            </div>
            <span className="dot" aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  )
}

function App() {
  const CART_TIMEOUT = 60
  const ORDER_TIMEOUT = 60
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [serviceMode, setServiceMode] = useState('delivery')
  const [timeLeft, setTimeLeft] = useState(CART_TIMEOUT)
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderTimeLeft, setOrderTimeLeft] = useState(ORDER_TIMEOUT)
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    address: '',
    note: '',
  })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const normalizedCart = useMemo(() => normalizeCart(cartItems), [cartItems])
  const deliveryFeeCents = serviceMode === 'delivery' ? 400 : 0
  const totals = useMemo(
    () =>
      calculateTotals({
        items: normalizedCart,
        taxRate: 0,
        deliveryFeeCents,
      }),
    [normalizedCart, deliveryFeeCents],
  )

  const cartCount = totals.itemCount

  const handleAdd = (item) => {
    setCartItems((prev) => [...prev, item])
    setTimeLeft(CART_TIMEOUT)
    setCheckoutError('')
  }

  const handleClear = () => {
    setCartItems([])
    setTimeLeft(CART_TIMEOUT)
    setCheckoutError('')
  }

  const handleCheckout = async () => {
    if (normalizedCart.length === 0) {
      setCheckoutError('Your cart is empty. Add at least one item before checkout.')
      return
    }

    setCheckoutLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          fulfillmentType: serviceMode === 'to-go' ? 'pickup' : serviceMode,
          customer: {
            name: orderForm.name,
            email: orderForm.email,
            address: orderForm.address,
          },
          customerNote: orderForm.note || '',
          siteUrl: import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result?.checkoutUrl) {
        throw new Error(result?.error || 'Unable to start checkout right now.')
      }

      window.location.href = result.checkoutUrl
    } catch (error) {
      setCheckoutError(error.message || 'Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const openOrderForm = () => {
    setOrderOpen(true)
    setOrderTimeLeft(ORDER_TIMEOUT)
  }

  const closeOrderForm = () => {
    setOrderOpen(false)
    setOrderTimeLeft(ORDER_TIMEOUT)
    setOrderForm({ name: '', email: '', address: '', note: '' })
  }

  const handleOrderInput = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    closeOrderForm()
  }

  useEffect(() => {
    if (cartItems.length === 0) {
      setTimeLeft(CART_TIMEOUT)
      return undefined
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCartItems([])
          setCartOpen(false)
          return CART_TIMEOUT
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [cartItems.length])

  useEffect(() => {
    if (!orderOpen) return undefined

    const timerId = setInterval(() => {
      setOrderTimeLeft((prev) => {
        if (prev <= 1) {
          closeOrderForm()
          return ORDER_TIMEOUT
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [orderOpen])

  return (
    <div className="page">
      <div className="banner">
        <p className="label">New</p>
        <p className="muted">
          Demo mode: Square sandbox checkout only. No real card charges.
        </p>
        <a href="#deals" className="inline-link">
          View combos
        </a>
      </div>

      <header className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            <img src={logoImg} alt="Pizza logo" />
          </div>
          <div>
            <p className="label">Fictional Pizza Shop</p>
            <p className="muted">Hand-tossed | Wood-fired | Delivered hot</p>
          </div>
        </div>
        <div className="actions">
          <button className="ghost">Log in</button>
          <button className="solid" onClick={openOrderForm}>
            Order now
          </button>
          <button
            className="cart-pill"
            aria-label={`Cart items: ${cartCount}`}
            onClick={() => setCartOpen(true)}
          >
            <span>Cart</span>
            <span className="pill tiny">{cartCount}</span>
          </button>
        </div>
      </header>

      <nav className="menu-nav" aria-label="Section navigation">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Wood-fired in 12 minutes</p>
          <h1>Pizza built to your pace—dine in, take out, deliver.</h1>
          <p className="muted large">
            Crafted dough, bright sauces, and toppings that stay crisp. Choose a
            chef-built pie or design your own. We keep the low-fi vibe; you get
            high-fi flavor.
          </p>
          <div className="mode-toggle">
            {['delivery', 'dine-in', 'to-go'].map((mode) => (
              <button
                key={mode}
                className={`chip ${serviceMode === mode ? 'active' : ''}`}
                onClick={() => setServiceMode(mode)}
              >
                {mode === 'delivery' && 'Delivery'}
                {mode === 'dine-in' && 'Dine in'}
                {mode === 'to-go' && 'To go'}
              </button>
            ))}
          </div>
          <div className="badges">
            <div>
              <p className="label"><strong>12 min</strong> avg. fire time</p>
              <p className="muted">Lunch rush ready</p>
            </div>
            <div>
              <p className="label"><strong>22</strong> toppings rotated</p>
              <p className="muted">Seasonal swaps weekly</p>
            </div>
            <div>
              <p className="label"><strong>4.8</strong> community score</p>
              <p className="muted">2,300+ reviews</p>
            </div>
          </div>
        </div>
        <div className="hero-frame" aria-hidden="true">
          <div className="frame-image">
            <img src={heroImg} alt="Wood-fired pizza with basil" />
          </div>
          <div className="frame-body">
            <div className="frame-block" />
            <div className="frame-block" />
            <div className="frame-block" />
          </div>
        </div>
      </section>

      <section id="menu" className="section">
        <SectionHeading
          eyebrow="Chef picks"
          title="Signature wood-fired pizzas"
          body="Balanced pies with crisp edges, bright sauce, and enough cheese to stretch—not drown."
        />
        <MenuGrid items={specials} onAdd={handleAdd} />
      </section>

      <section className="section alt" id="build">
        <SectionHeading
          eyebrow="Build your own"
          title="Start from the crust up"
          body="A simple 4-step flow that mirrors the in-store line."
        />
        <div className="grid steps">
          {steps.map((step, idx) => (
            <article key={step} className="card step">
              <span className="badge">{idx + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
        <div className="bar">
          <div>
            <p className="label">Pickup in 15</p>
            <p className="muted">Queued and staged by order ID</p>
          </div>
          <button className="solid" onClick={openOrderForm}>
            Start a custom pie
          </button>
        </div>
      </section>

      <section className="section" id="deals">
        <SectionHeading
          eyebrow="Combos & lunch"
          title="Quick hits for busy days"
          body="Bundles designed to travel—salad, slice, drink."
        />
        <MenuGrid items={classics} onAdd={handleAdd} />
      </section>

      <section className="section" id="wings">
        <SectionHeading
          eyebrow="Shareables"
          title="Wings & tenders"
          body="Fire-roasted and sauced to order."
        />
        <MenuGrid items={wings} onAdd={handleAdd} />
      </section>

      <section className="section alt" id="salads">
        <SectionHeading
          eyebrow="Greens"
          title="Salads & sides"
          body="Bright, crunchy, and built to balance the pies."
        />
        <MenuGrid items={salads} onAdd={handleAdd} />
      </section>

      <section className="section" id="sandwiches">
        <SectionHeading
          eyebrow="Handhelds"
          title="Sandwiches"
          body="Baked, pressed, and ready to travel."
        />
        <MenuGrid items={sandwiches} onAdd={handleAdd} />
      </section>

      <section className="section alt" id="appetizers">
        <SectionHeading
          eyebrow="Starters"
          title="Appetizers"
          body="Table-friendly bites while the pies bake."
        />
        <MenuGrid items={appetizers} onAdd={handleAdd} />
      </section>

      <section className="section" id="drinks">
        <SectionHeading
          eyebrow="Sip"
          title="Drinks"
          body="House-made refreshers and coffee."
        />
        <MenuGrid items={drinks} onAdd={handleAdd} />
      </section>

      <section className="section alt" id="reviews">
        <SectionHeading
          eyebrow="Voices"
          title="Loved by the neighborhood"
          body="Low-fi room, high-fi flavor."
        />
        <ReviewGrid />
      </section>

      <section className="section" id="visit">
        <SectionHeading
          eyebrow="Visit"
          title="Two ways to pizza"
          body="Order ahead or slide into a booth."
        />
        <div className="grid visit-grid">
          <article className="card">
            <div className="ph ph-wide">
              <img src={interiorImg} alt="Dining room" />
            </div>
            <div className="visit-info">
              <div className="row">
                <div>
                  <p className="label">Dine-in</p>
                  <p className="muted">11a–10p · bar till 11p</p>
                </div>
                <span className="pill">Main St.</span>
              </div>
              <p className="muted">
                125 Main Street, Suite B · Wood oven, long tables, power outlets,
                Wi‑Fi.
              </p>
              <button className="ghost">Book a table</button>
            </div>
          </article>
          <article className="card">
            <div className="map ph ph-wide">
              <iframe
                title="Fictional Pizza Shop map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.966%2C40.708%2C-73.94%2C40.724&layer=mapnik&marker=40.716%2C-73.953"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="row">
              <div>
                <p className="label">Pickup & delivery</p>
                <p className="muted">7 days · last call 9:45p</p>
              </div>
              <span className="pill">Zone A–D</span>
            </div>
            <p className="muted">
              Text updates, curbside lane, insulated carriers. Partnered with
              local riders.
            </p>
            <button className="solid">Order now</button>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            <img src={logoImg} alt="Pizza logo" />
          </div>
          <div>
            <p className="label">Fictional Pizza Shop</p>
            <p className="muted">Hand-tossed daily since 2014</p>
          </div>
        </div>
        <div className="footer-grid">
          <div>
            <p className="label">Hours</p>
            <p className="muted">Sun–Thu 11a–10p · Fri–Sat 11a–11p</p>
          </div>
          <div>
            <p className="label">Contact</p>
            <p className="muted">(555) 012-1199 · hello@fictionalpizza.shop</p>
          </div>
          <div>
            <p className="label">Delivery partners</p>
            <p className="muted">Local riders · No ghost kitchens</p>
          </div>
        </div>
        <p className="muted fine">Low-fi wireframe style, high-fi flavor promise.</p>
      </footer>

      <div className="dock">
        <div>
          <p className="label">Order in progress</p>
          <p className="muted">{cartCount || 'No'} items staged · tap add to fill</p>
        </div>
        <div className="actions">
          <button className="ghost" onClick={handleClear}>
            Clear
          </button>
          <button className="solid" onClick={() => setCartOpen(true)}>
            View cart
          </button>
        </div>
      </div>

      {cartOpen && (
        <aside className="cart-drawer">
          <div className="cart-header">
            <div>
              <h3>Cart</h3>
              <p className="muted cart-timer">
                Clears in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </p>
            </div>
            <button className="ghost" onClick={() => setCartOpen(false)}>
              Close
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p className="muted">Cart is empty (auto-clears every 60s).</p>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item, idx) => (
                <li key={`${item.title}-${idx}`} className="cart-line">
                  <div>
                    <p className="label">
                      {item.title}
                      {item.quantity && item.quantity > 1 ? ` x${item.quantity}` : ''}
                    </p>
                    <p className="muted">
                      {item.flavor ? `${item.flavor}` : 'Standard'}
                      {item.sauce ? ` · ${item.sauce}` : ''}
                      {item.style ? ` · ${item.style}` : ''}
                    </p>
                  </div>
                  <span className="pill tiny">
                    ${centsToDollars(
                      (normalizedCart[idx]?.priceCents || 0) * (normalizedCart[idx]?.quantity || 1),
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-footer">
            <div className="cart-total">
              <span className="label">Items</span>
              <span className="pill">${centsToDollars(totals.subtotalCents)}</span>
            </div>
            {totals.deliveryFeeCents > 0 && (
              <div className="cart-total">
                <span className="label">Delivery</span>
                <span className="pill">${centsToDollars(totals.deliveryFeeCents)}</span>
              </div>
            )}
            {totals.taxCents > 0 && (
              <div className="cart-total">
                <span className="label">Tax</span>
                <span className="pill">${centsToDollars(totals.taxCents)}</span>
              </div>
            )}
            <div className="cart-total strong">
              <span className="label">Total</span>
              <span className="pill">${centsToDollars(totals.totalCents)}</span>
            </div>
            {checkoutError && <p className="checkout-error">{checkoutError}</p>}
            <div className="actions">
              <button className="ghost" onClick={handleClear}>
                Clear cart
              </button>
              <button className="solid" onClick={handleCheckout} disabled={checkoutLoading}>
                {checkoutLoading ? 'Starting checkout...' : 'Checkout'}
              </button>
            </div>
          </div>
        </aside>
      )}

      {orderOpen && (
        <aside className="order-drawer" role="dialog" aria-modal="true">
          <div className="order-header">
            <div>
              <h3>Start your order</h3>
              <p className="muted cart-timer">
                Expires in {Math.floor(orderTimeLeft / 60)}:{String(orderTimeLeft % 60).padStart(2, '0')}
              </p>
            </div>
            <button className="ghost" onClick={closeOrderForm}>
              Close
            </button>
          </div>
          <form className="order-body" onSubmit={handleOrderSubmit}>
            <label className="label" htmlFor="order-name">
              Name
            </label>
            <input
              id="order-name"
              type="text"
              value={orderForm.name}
              onChange={(e) => handleOrderInput('name', e.target.value)}
              required
            />
            <label className="label" htmlFor="order-email">
              Email
            </label>
            <input
              id="order-email"
              type="email"
              value={orderForm.email}
              onChange={(e) => handleOrderInput('email', e.target.value)}
              required
            />
            <label className="label" htmlFor="order-address">
              Address
            </label>
            <textarea
              id="order-address"
              rows="3"
              value={orderForm.address}
              onChange={(e) => handleOrderInput('address', e.target.value)}
              required
            />
            <label className="label" htmlFor="order-note">
              Note (optional)
            </label>
            <textarea
              id="order-note"
              rows="2"
              value={orderForm.note}
              onChange={(e) => handleOrderInput('note', e.target.value)}
              placeholder="Gate code, allergies, extra napkins..."
            />
            <div className="order-actions">
              <button type="button" className="ghost" onClick={closeOrderForm}>
                Cancel
              </button>
              <button type="submit" className="solid">
                Submit
              </button>
            </div>
          </form>
        </aside>
      )}
    </div>
  )
}

export default App
