<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    /**
     * Display a ranking of users with date range filtering based on explicit 'from' and 'to' parameters.
     */
    public function index(Request $request)
    {
        $perPage = 15;

        // 1. Get and standardize filters
        $filters = $request->only(['from', 'to']);
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        // Pass back the received string filters for the frontend/testing assertion
        $filters = ['from' => $from, 'to' => $to];

        $query = User::orderByDesc('total_points')
            ->orderBy('id', 'asc');

        $startDate = null;
        $endDate = null;

        // Check if an explicit date range was provided
        if ($from && $to) {
            try {
                // The incoming strings (e.g., '2025-11-01T12:00:00.000Z') are ISO 8601 and implicitly UTC.

                // Parse 'from', set to the start of that day (00:00:00 UTC)
                // This correctly sets the lower bound for the database query.
                $startDate = Carbon::parse($from)->startOfDay()->toDateTimeString('microsecond'); // Use high precision
                // Parse 'to', set to the end of that day (23:59:59 UTC)
                // This correctly sets the upper bound for the database query.
                $endDate = Carbon::parse($to)->endOfDay()->toDateTimeString('microsecond'); // Use high precision
            } catch (\Exception $e) {
                // Log or handle the exception if desired. For now, we skip date filtering.
            }
        }

        // 2. Apply the WHERE clause only if a valid date range was successfully determined
        if ($startDate && $endDate) {
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        }

        // 3. Paginate the results and append the query string
        $users = $query->paginate($perPage)->withQueryString();

        // 4. Pass back the filtered data and active filter parameters
        return Inertia::render('leaderboard/index', [
            'rankedUsers' => $users,
            'filters' => $filters, // Pass back the 'from' and 'to' strings
        ]);
    }
}
