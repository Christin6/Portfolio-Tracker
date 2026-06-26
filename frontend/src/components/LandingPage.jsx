import { Link } from "react-router-dom";
import "./LandingPage.css";

const TICKER_ITEMS = [
    { symbol: "AAPL", change: 1.24 },
    { symbol: "NVDA", change: -0.87 },
    { symbol: "MSFT", change: 0.56 },
    { symbol: "GOOGL", change: 2.11 },
    { symbol: "TSLA", change: -1.43 },
    { symbol: "AMZN", change: 0.92 },
    { symbol: "META", change: 1.67 },
    { symbol: "AMD", change: -0.34 },
];

const FEATURES = [
    {
        label: "Unified Currency",
        title: "One view. One currency.",
        description:
            "Consolidate holdings across markets into a single denominated summary — no manual conversion.",
    },
    {
        label: "Holdings & Allocation",
        title: "Position-level clarity.",
        description:
            "Track every holding with live allocation breakdowns and sector weight at a glance.",
    },
    {
        label: "Performance",
        title: "Measure what matters.",
        description:
            "Day change, total return, and portfolio-level metrics updated as markets move.",
    },
];

const formatChange = (change) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
};

const TickerRow = () => (
    <div className="landing-ticker__track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={`${item.symbol}-${i}`} className="landing-ticker__item">
                <span className="landing-ticker__symbol">{item.symbol}</span>
                <span
                    className={
                        item.change >= 0
                            ? "landing-ticker__change profit"
                            : "landing-ticker__change loss"
                    }
                >
                    {formatChange(item.change)}
                </span>
            </span>
        ))}
    </div>
);

const LandingPage = () => {
    return (
        <div className="landing">
            <nav className="landing-nav">
                <div className="landing-nav__inner">
                    <span className="landing-nav__brand">
                        Portfolio{" "}
                        <span className="landing-nav__accent">Tracker</span>
                    </span>
                    <div className="landing-nav__actions">
                        <Link to="/login" className="landing-nav__link">
                            Login
                        </Link>
                        <Link to="/signup" className="landing-nav__cta">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="landing-hero">
                <div className="landing-hero__content landing-animate landing-animate--1">
                    <h1 className="landing-hero__headline">
                        Take control of your
                        <br />
                        portfolio.
                    </h1>
                    <p className="landing-hero__sub">
                        A stock portfolio tracker with unified summary in one
                        currency.
                    </p>
                    <div className="landing-hero__actions">
                        <Link
                            to="/signup"
                            className="landing-btn landing-btn--primary"
                        >
                            Get started
                        </Link>
                        <Link
                            to="/login"
                            className="landing-btn landing-btn--ghost"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>

                <div className="landing-hero__panel landing-animate landing-animate--2">
                    <p className="landing-label">Live Snapshot</p>
                    <div className="landing-metrics">
                        <div className="landing-metrics__row">
                            <span className="landing-metrics__label">
                                Total Value
                            </span>
                            <span className="landing-metrics__value">
                                $284,391.50
                            </span>
                        </div>
                        <div className="landing-metrics__row">
                            <span className="landing-metrics__label">
                                Day Change
                            </span>
                            <span className="landing-metrics__value profit">
                                +$3,847.22
                            </span>
                        </div>
                        <div className="landing-metrics__row">
                            <span className="landing-metrics__label">
                                Holdings
                            </span>
                            <span className="landing-metrics__value">
                                14 positions
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="landing-ticker" aria-hidden="true">
                <TickerRow />
            </div>

            <section className="landing-features">
                <p className="landing-label landing-features__label landing-animate landing-animate--3">
                    Capabilities
                </p>
                <div className="landing-features__grid">
                    {FEATURES.map((feature, i) => (
                        <article
                            key={feature.label}
                            className={`landing-feature landing-animate landing-animate--${i + 4}`}
                        >
                            <p className="landing-label">{feature.label}</p>
                            <h2 className="landing-feature__title">
                                {feature.title}
                            </h2>
                            <p className="landing-feature__desc">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-cta landing-animate landing-animate--7">
                <div className="landing-cta__inner">
                    <div>
                        <p className="landing-label">Ready</p>
                        <h2 className="landing-cta__headline">
                            Deploy your portfolio view.
                        </h2>
                    </div>
                    <Link
                        to="/signup"
                        className="landing-btn landing-btn--primary"
                    >
                        Get started
                    </Link>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} Portfolio Tracker</p>
            </footer>
        </div>
    );
};

export default LandingPage;
