import './App.css'


function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Loan Tracker</h1>
        <p>Simple loan tracking for your dashboard, records, and notes.</p>
      </header>

      <main className="app-main">
        <section className="hero-card">
          <h2>Welcome to your loan index page</h2>
          <p>
            This is your app entry point. From here you can add loan records,
            review history, and manage your workflow.
          </p>
        </section>

        <section className="features-grid">
          <article className="feature-card">
            <h3>Loan records</h3>
            <p>View and edit loan details such as comments and location.</p>
          </article>

          <article className="feature-card">
            <h3>History tracking</h3>
            <p>Keep a complete audit trail of loan changes over time.</p>
          </article>

          <article className="feature-card">
            <h3>Quick links</h3>
            <p>Start adding loans, checking status, or opening admin pages.</p>
          </article>
        </section>
      </main>


      <footer className="app-footer">
        <p>Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
