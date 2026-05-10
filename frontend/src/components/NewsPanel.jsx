import { useGeneralNews } from "../hooks/useNews"
import NewsCard from "./NewsCard"

const LoadingSkeleton = () => {
    return (
        <div className="news-skeleton">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="news-skeleton-card">
                    <div className="news-skeleton-line news-skeleton-line--short" />
                    <div className="news-skeleton-line news-skeleton-line--long" />
                    <div className="news-skeleton-line news-skeleton-line--medium" />
                </div>
            ))}
        </div>

    )
}

const GeneralNewsPanel = () => {
    const { data: articles, isLoading, isError, error } = useGeneralNews()

    return (
        <div className="news-panel">
            <h3 className="card-title">News | General</h3>

            {isLoading && <LoadingSkeleton />}

            {isError && (
                <p className="news-panel-error">
                    Failed to load news: {error?.message ?? "Unknown error"}
                </p>
            )}

            {!isLoading && !isError && articles?.length === 0 && (
                <p className="news-panel-empty">No recent news.</p>
            )}

            {!isLoading && !isError && articles?.length > 0 && (
                <div className="news-list">
                    {articles.map((article, i) => (
                        <>
                            <NewsCard key={article.id ?? `${article.datetime}-${i}`} article={article} />
                            <br />
                        </>
                    ))}
                </div>
            )}
        </div>

    )
}

export default GeneralNewsPanel
