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

        // 1. Get filters, prioritizing the explicit 'from' and 'to' date strings
        $filters = $request->only(['from', 'to']);
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        $query = User::orderByDesc('total_points')
            ->orderBy('id', 'asc');

        $startDate = null;
        $endDate = null;

        // Check if an explicit date range was provided
        if ($from && $to) {
            try {
                // Parse the 'from' date and set it to the start of the day in UTC.
                // This ensures the query includes the entire start day regardless of the server timezone.
                $startDate = Carbon::parse($from)->setTimezone('UTC')->startOfDay();

                // Parse the 'to' date and set it to the end of the day in UTC.
                // This ensures the query includes the entire end day.
                $endDate = Carbon::parse($to)->setTimezone('UTC')->endOfDay();

            } catch (\Exception $e) {
                // Ignore invalid dates for now, letting the query return all results
            }
        }

        // 2. Apply the WHERE clause if a valid date range was successfully determined
        // If $from and $to were null, this block is skipped, and all users are returned.
        if ($startDate && $endDate) {
            $query->whereBetween('updated_at', [$startDate, $endDate]);
        }

        // 3. Paginate the results and append the query string
        $users = $query->paginate($perPage)->withQueryString();

        // 4. Pass back the active filter parameters
        return Inertia::render('leaderboard/index', [
            'rankedUsers' => $users,
            'filters' => $filters, // Pass back the 'from' and 'to' strings
        ]);
    }
}
