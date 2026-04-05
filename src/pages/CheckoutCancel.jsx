import '../App.css'

function CheckoutCancel() {
  return (
    <div className="page">
      <section className="section">
        <header className="section-heading">
          <p className="eyebrow">Checkout</p>
          <div>
            <h2>Checkout canceled</h2>
            <p className="muted">
              No payment was completed. You can return to the menu and try checkout again anytime.
            </p>
          </div>
        </header>
        <article className="card">
          <div className="actions">
            <a className="solid" href="/">
              Return to cart
            </a>
          </div>
        </article>
      </section>
    </div>
  )
}

export default CheckoutCancel
