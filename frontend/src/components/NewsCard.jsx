import { formatDate } from "../helpers/formatDate"

const NewsCard = ({ article }) => {
    const { headline, source, datetime, url, summary } = article

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card"
        >
            <div className="news-card-body">
                <div className="news-card-meta">
                    <span className="news-card-source">{source}</span>
                    <span className="news-card-dot">·</span>
                    <span className="news-card-date">{formatDate(datetime)}</span>
                </div>
                <p className="news-card-headline">{headline}</p>
                {summary && (
                    <p className="news-card-summary">
                        {summary.length > 120 ? summary.slice(0, 120) + "…" : summary}
                    </p>
                )}
            </div>
        </a>

    )
}

export default NewsCard