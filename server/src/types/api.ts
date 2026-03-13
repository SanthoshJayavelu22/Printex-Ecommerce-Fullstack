export interface PaginationInfo {
    next?: {
        page: number;
        limit: number;
    };
    prev?: {
        page: number;
        limit: number;
    };
}

export interface AdvancedResultsResponse<T> {
    success: boolean;
    count: number;
    total: number;
    pagination: PaginationInfo;
    data: T[];
}
