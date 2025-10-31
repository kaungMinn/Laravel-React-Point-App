<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    /**
     * Display a ranking of users.
     */
    public function index(Request $request)
    {
        $perPage = 25;

        $users = User::orderByDesc('total_points')
            ->paginate($perPage)
            ->withQueryString();
            sleep(2);

        return Inertia::render('leaderboard/index', [
            // The frontend receives 'current_page' and 'per_page' inside $users
            'rankedUsers' => $users,
        ]);
    }
}
