import { useGeneralNews, useIndonesiaGeneralNews } from "../hooks/useNews"
import NewsCard from "./NewsCard"
import { useState } from "react"

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
    const { data: indonesiaArticles, isLoading: isIndonesiaLoading, isError: isIndonesiaError, error: indonesiaError } = useIndonesiaGeneralNews()
    const [feed, setFeed] = useState("international") // "international" | "indonesia"

    const activeArticles = feed === "international" ? articles : indonesiaArticles
    const activeLoading = feed === "international" ? isLoading : isIndonesiaLoading
    const activeError = feed === "international" ? isError : isIndonesiaError
    const activeErrMsg = feed === "international" ? error : indonesiaError

    return (
        <div className="news-panel">
            <div className="news-panel-header">
                <div className="news-panel-tabs">
                    <button
                        className={`news-tab ${feed === "international" ? "news-tab--active" : ""}`}
                        onClick={() => setFeed("international")}
                    >
                        International
                    </button>
                    <button
                        className={`news-tab ${feed === "indonesia" ? "news-tab--active" : ""}`}
                        onClick={() => setFeed("indonesia")}
                    >
                        Indonesia
                    </button>
                </div>
            </div>

            {activeLoading && <LoadingSkeleton />}

            {activeError && (
                <p className="news-panel-error">
                    Failed to load news: {activeErrMsg?.message ?? "Unknown error"}
                </p>
            )}

            {!activeLoading && !activeError && activeArticles?.length === 0 && (
                <p className="news-panel-empty">No recent news.</p>
            )}

            {!activeLoading && !activeError && activeArticles?.length > 0 && (
                <div className="news-list">
                    {activeArticles.map((article, i) => (
                        <NewsCard key={article.id ?? `${article.datetime}-${i}`} article={article} />
                    ))}
                </div>
            )}
        </div>

    )
}

export default GeneralNewsPanel
