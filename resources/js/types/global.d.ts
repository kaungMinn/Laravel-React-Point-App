// resources/js/types/ziggy.d.ts

declare function route(name: string, params?: any, absolute?: boolean): string;
// You can also expand the declaration if you want perfect type safety:
// declare const route: import("ziggy-js").RouteFunction;

declare global {
    var route: Router; // Declares the global route function

    // If you need the helper functions (like the one you used for dashboard())
    // Note: You must check your specific ziggy output for the exact function names
    const dashboard: (options?: RouteParams) => string;
    const users_index: (options?: RouteParams) => string;
    const points_index: (options?: RouteParams) => string;
    const leaderboard_index: (options?: RouteParams) => string;
}