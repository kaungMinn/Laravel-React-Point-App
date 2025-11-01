<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    /**
     * Display a ranking of users.
     */
    public function index(Request $request)
    {
        $perPage = 25;

        // Get the ISO 8601 string from the frontend (e.g., "2025-11-28T17:30:00.000Z")
        $filterDateString = $request->input('search');
        $query = User::orderByDesc('total_points')
            ->orderBy('id', 'asc');

        if ($filterDateString) {

            try {
                // 1. Parse the incoming UTC string into a Carbon instance
                $date = Carbon::parse($filterDateString);

                // 2. Determine the start and end boundaries for that *Calendar Day*
                //    in the server's local timezone (or UTC, depending on your DB setup).

                // We'll use startOfDay() and endOfDay() to define the 24-hour window
                // for the day '2025-11-28'.
                $startOfDay = $date->copy()->startOfDay(); // 2025-11-28 00:00:00 (in the current timezone)
                $endOfDay = $date->copy()->endOfDay();     // 2025-11-28 23:59:59 (in the current timezone)

                // 3. Apply the WHERE clause using the precise time boundaries
                $query->whereBetween('updated_at', [$startOfDay, $endOfDay]);

            } catch (\Exception $e) {
                // Log error or ignore filter if the date format is invalid
            }
        }

        // ... rest of pagination and Inertia rendering
        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('leaderboard/index', [
            'rankedUsers' => $users,
            'activeDate' => $filterDateString, // Pass the original string back for re-initialization
        ]);
    }
}
