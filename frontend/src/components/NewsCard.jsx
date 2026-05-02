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
            <div className="news-card__body">
                <div className="news-card__meta">
                    <span className="news-card__source">{source}</span>
                    <span className="news-card__dot">·</span>
                    <span className="news-card__date">{formatDate(datetime)}</span>
                </div>
                <p className="news-card__headline">{headline}</p>
                {summary && (
                    <p className="news-card__summary">
                        {summary.length > 120 ? summary.slice(0, 120) + "…" : summary}
                    </p>
                )}
            </div>
        </a>

    )
}

export default NewsCard