/**
 * WordPress Import Types
 * 
 * Types for the WordPress import API that receives posts
 * from a WordPress plugin and imports them into EdaShow.
 */

// ============================================================================
// Request Types (from WordPress Plugin)
// ============================================================================

export interface WordPressImportPayload {
    /** URL of the source WordPress site */
    site_url: string;

    /** Action to perform: create, update, or delete */
    action?: 'create' | 'update' | 'delete';

    /** Post data */
    post: WordPressPostData;
}

export interface WordPressPostData {
    /** WordPress post ID */
    wp_id: number;

    /** Post title */
    title: string;

    /** Post slug/permalink */
    slug: string;

    /** HTML content of the post */
    content: string;

    /** Post excerpt/summary */
    excerpt?: string;

    /** Post status */
    status?: 'published' | 'draft';

    /** Publication date (ISO 8601) */
    published_at?: string;

    /** Author information */
    author?: WordPressAuthor;

    /** Category names */
    categories?: string[];

    /** Tag names */
    tags?: string[];

    /** Featured image data */
    featured_image?: WordPressMedia;

    /** Inline images in content */
    inline_images?: WordPressInlineImage[];

    /** SEO metadata */
    meta?: WordPressSEOMeta;
}

export interface WordPressAuthor {
    name: string;
    email?: string;
}

export interface WordPressMedia {
    /** Full URL to the image */
    url: string;

    /** Alt text */
    alt?: string;

    /** Image caption */
    caption?: string;

    /** Image dimensions */
    width?: number;
    height?: number;
}

export interface WordPressInlineImage {
    /** Original URL in WordPress */
    original_url: string;

    /** Alt text */
    alt?: string;
}

export interface WordPressSEOMeta {
    seo_title?: string;
    seo_description?: string;
    canonical_url?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ImportSuccessResponse {
    success: true;
    message: string;
    data: {
        /** UUID of the created/updated post */
        post_id: string;

        /** Slug of the post */
        slug: string;

        /** Full URL to the post */
        url: string;

        /** Number of images processed */
        images_processed: number;

        /** Category ID assigned */
        category_id?: string;

        /** Whether this was an update */
        was_update: boolean;
    };
}

export interface ImportErrorResponse {
    success: false;
    error: {
        code: ImportErrorCode;
        message: string;
        details?: Record<string, any>;
    };
}

export type ImportResponse = ImportSuccessResponse | ImportErrorResponse;

export type ImportErrorCode =
    | 'UNAUTHORIZED'
    | 'VALIDATION_ERROR'
    | 'DUPLICATE_POST'
    | 'IMAGE_DOWNLOAD_FAILED'
    | 'CATEGORY_NOT_FOUND'
    | 'RATE_LIMIT_EXCEEDED'
    | 'INTERNAL_ERROR';

// ============================================================================
// Status Endpoint Types
// ============================================================================

export interface StatusResponse {
    success: true;
    api_version: string;
    site_name: string;
    categories: CategoryInfo[];
    features: {
        image_processing: boolean;
        auto_categories: boolean;
        seo_meta: boolean;
    };
}

export interface CategoryInfo {
    id: string;
    name: string;
    slug: string;
}

// ============================================================================
// Internal Types (for tracking imports)
// ============================================================================

export interface WordPressImportRecord {
    id: string;
    wp_post_id: number;
    wp_site_url: string;
    local_post_id: string;
    imported_at: string;
    status: 'success' | 'error';
    error_message?: string;
}

export interface ProcessedImage {
    original_url: string;
    new_url: string;
    storage_path: string;
}
