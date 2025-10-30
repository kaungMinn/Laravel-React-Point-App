<?php

namespace App\Http\Controllers;

use App\Models\Point;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Redirect;

class PointController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pointsQuery = Point::with(relations: 'user')->latest();
        $filters = $request->only('search');
        // Apply Search Filter
        if ($search = $filters['search'] ?? null) {
            $pointsQuery->where(column: function ($query) use ($search) {
                // Search by action type
                $query->where('action_type', 'like', "%{$search}%")
                    // Search by related user name
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return Inertia::render('points/index', [
            'points' => $pointsQuery->paginate(15)->withQueryString(),
            // 🛑 Important: Pass the active filters back to the frontend
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch users to populate a dropdown list
        $users = User::select('id', 'name')->get();

        // Render the React component that contains the form
        return Inertia::render('points/create', [
            'users' => $users,
            'defaultActionType' => 'Manual Award',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'action_type' => 'required|string|max:255',
        ]);

        // B. Creation
        $point = Point::create(attributes: $validated);

        // C. Update User's Total Points
        // Note: You should generally use a Model Observer or database trigger
        // to handle this automatically, but doing it here works for now.
        $user = User::find($validated['user_id']);

        if ($user) {
            $user->increment('total_points', $validated['points']);
        } else {
            return Redirect::route(route: 'error-page')->with('status', 404);
        }

        // D. Redirect back to the list view
        return Redirect::route('points.index')->with('success', 'Points recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        // 1. Fetch the specific Point record, including the associated user

        $point = Point::with('user')->findOrFail($id);

        // 2. Fetch all users to populate the user dropdown (same as in create)

        $users = User::select('id', 'name')->get();

        // 3. Render the React component for editing

        return Inertia::render('points/edit', [

            'point' => $point, // The data to pre-fill the form

            'users' => $users,

            'defaultActionType' => 'Manual Award', // Can be kept or removed

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // A. Find the existing Point record
        $point = Point::findOrFail($id);
        $oldPoints = $point->points;
        $oldUserId = $point->user_id; // User who received the old points

        // B. Validation
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'action_type' => 'required|string|max:255',
        ]);

        // C. Use a Database Transaction for Atomicity
        DB::transaction(function () use ($point, $validated, $oldPoints, $oldUserId) {

            // 1. REVERSE the old points from the original user
            // We use `decrement` to subtract.
            User::where('id', $oldUserId)->decrement('total_points', $oldPoints);

            // 2. UPDATE the Point record itself
            $point->update($validated);

            // 3. APPLY the new points to the potentially new user
            // We use `increment` to add the new amount.
            User::where('id', $validated['user_id'])->increment('total_points', $validated['points']);
        }); // The transaction commits here if no errors occur

        // D. Redirect back to the index with a success message
        return Redirect::route('points.index')->with('success', 'Point record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Point $point) // ⬅️ Laravel automatically finds the Point by ID
    {
        $userId = $point->user_id;
        $pointsToReverse = $point->points;

        // Use a Database Transaction for Atomicity
        DB::transaction(function () use ($point, $userId, $pointsToReverse) {

            // 1. REVERSE the points from the associated user's total
            // We use decrement to subtract the points that were originally awarded.
            User::where('id', $userId)->decrement('total_points', $pointsToReverse);

            // 2. DELETE the Point record
            $point->delete();

        }); // The transaction commits here if no errors occur

        // Redirect back to the index with a success message
        return Redirect::route('points.index')->with('success', 'Point record deleted successfully and user totals updated.');
    }
}
