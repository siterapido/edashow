/**
 * YouTube API Integration
 * Helpers for fetching data from the YouTube Data API v3
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeChannel {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    subscriberCount: string
    videoCount: string
    customUrl?: string
}

export interface YouTubeVideo {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    publishedAt: string
    viewCount: string
    likeCount: string
    duration: string
    channelTitle: string
}

/**
 * Extract channel ID from various YouTube URL formats
 * Supports: /channel/ID, /c/name, /@handle, /user/name
 */
export async function extractChannelId(url: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not configured')
        return null
    }

    // Clean the URL
    const cleanUrl = url.trim()

    // Direct channel ID pattern: /channel/UCxxxxxxxxxx
    const channelMatch = cleanUrl.match(/youtube\.com\/channel\/(UC[\w-]+)/)
    if (channelMatch) {
        return channelMatch[1]
    }

    // Handle pattern: /@handle
    const handleMatch = cleanUrl.match(/youtube\.com\/@([\w-]+)/)
    if (handleMatch) {
        const handle = handleMatch[1]
        // Use search to find channel by handle
        const response = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=@${handle}&key=${apiKey}`
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
            return data.items[0].snippet.channelId
        }
    }

    // Custom URL pattern: /c/name
    const customMatch = cleanUrl.match(/youtube\.com\/c\/([\w-]+)/)
    if (customMatch) {
        const customName = customMatch[1]
        const response = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${customName}&key=${apiKey}`
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
            return data.items[0].snippet.channelId
        }
    }

    // User pattern: /user/name
    const userMatch = cleanUrl.match(/youtube\.com\/user\/([\w-]+)/)
    if (userMatch) {
        const username = userMatch[1]
        const response = await fetch(
            `${YOUTUBE_API_BASE}/channels?part=id&forUsername=${username}&key=${apiKey}`
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
            return data.items[0].id
        }
    }

    // If it's just a channel ID
    if (cleanUrl.match(/^UC[\w-]+$/)) {
        return cleanUrl
    }

    return null
}

/**
 * Get channel information by ID
 */
export async function getChannelInfo(channelId: string): Promise<YouTubeChannel | null> {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not configured')
        return null
    }

    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
        )
        const data = await response.json()

        if (!data.items || data.items.length === 0) {
            return null
        }

        const channel = data.items[0]
        return {
            id: channel.id,
            title: channel.snippet.title,
            description: channel.snippet.description,
            thumbnailUrl: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
            subscriberCount: formatCount(channel.statistics.subscriberCount),
            videoCount: formatCount(channel.statistics.videoCount),
            customUrl: channel.snippet.customUrl
        }
    } catch (error) {
        console.error('Error fetching channel info:', error)
        return null
    }
}

/**
 * Get latest videos from a channel
 */
export async function getLatestVideos(channelId: string, limit: number = 12): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not configured')
        return []
    }

    try {
        // First, get video IDs from search
        const searchResponse = await fetch(
            `${YOUTUBE_API_BASE}/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${limit}&key=${apiKey}`
        )
        const searchData = await searchResponse.json()

        if (!searchData.items || searchData.items.length === 0) {
            return []
        }

        // Get video IDs
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')

        // Get full video details
        const videosResponse = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
        )
        const videosData = await videosResponse.json()

        if (!videosData.items) {
            return []
        }

        return videosData.items.map((video: any) => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
            publishedAt: video.snippet.publishedAt,
            viewCount: formatCount(video.statistics.viewCount),
            likeCount: formatCount(video.statistics.likeCount),
            duration: formatDuration(video.contentDetails.duration),
            channelTitle: video.snippet.channelTitle
        }))
    } catch (error) {
        console.error('Error fetching latest videos:', error)
        return []
    }
}

/**
 * Get details for a specific video
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not configured')
        return null
    }

    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
        )
        const data = await response.json()

        if (!data.items || data.items.length === 0) {
            return null
        }

        const video = data.items[0]
        return {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
            publishedAt: video.snippet.publishedAt,
            viewCount: formatCount(video.statistics.viewCount),
            likeCount: formatCount(video.statistics.likeCount),
            duration: formatDuration(video.contentDetails.duration),
            channelTitle: video.snippet.channelTitle
        }
    } catch (error) {
        console.error('Error fetching video details:', error)
        return null
    }
}

/**
 * Format large numbers (e.g., 1500000 -> "1.5M")
 */
function formatCount(count: string | number): string {
    const num = typeof count === 'string' ? parseInt(count, 10) : count
    if (isNaN(num)) return '0'

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
}

/**
 * Format ISO 8601 duration (e.g., PT1H2M30S -> "1:02:30")
 */
function formatDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return '0:00'

    const hours = parseInt(match[1] || '0', 10)
    const minutes = parseInt(match[2] || '0', 10)
    const seconds = parseInt(match[3] || '0', 10)

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
