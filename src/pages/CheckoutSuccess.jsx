import '../App.css'

function CheckoutSuccess() {
  return (
    <div className="page">
      <section className="section">
        <header className="section-heading">
          <p className="eyebrow">Payment</p>
          <div>
            <h2>Order received 🎉</h2>
            <p className="muted">
              Thanks for your order. Your payment was submitted through Square hosted checkout.
            </p>
          </div>
        </header>
        <article className="card">
          <p className="muted">Next steps:</p>
          <ul>
            <li>We’re preparing your order now.</li>
            <li>You’ll receive follow-up updates via your selected contact details.</li>
            <li>If you have questions, call (555) 012-1199.</li>
          </ul>
          <div className="actions">
            <a className="solid" href="/">
              Back to menu
            </a>
          </div>
        </article>
      </section>
    </div>
  )
}

export default CheckoutSuccess
