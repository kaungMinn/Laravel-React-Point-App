<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 15; // Define pagination size
        $filters = $request->only('search');

        // Start building the query
        $usersQuery = User::latest();

        // Apply Search Filter
        if ($search = $filters['search'] ?? null) {
            // Apply a group of WHERE conditions using a closure
            $usersQuery->where(function ($query) use ($search) {
                // 1. Search by name (case-insensitive partial match)
                $query->where('name', 'like', "%{$search}%")

                      // 2. OR search by email (case-insensitive partial match)
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Paginate the results and append the query string (for filter preservation)
        $users = $usersQuery->paginate($perPage)->withQueryString();

        // **CORRECT RETURN FOR INERTIA**
        return Inertia::render('users/index', [
            // Pass the data as props to your React component
            'users' => $users,

            // Pass the active filters back to the frontend for persistence
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            // 'unique:users' ensures the email doesn't already exist
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            // Rules\Password::defaults() enforces complexity requirements
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $this->authorize('create', User::class);
        // 2. Create the User Record
        // We use the validated data, but manually hash the password
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'total_points' => 0,
            // CRITICAL: Always hash passwords before storing them
            'password' => Hash::make($validated['password']),
        ]);

        // 3. Redirect
        // Redirect back to the user index page with a success message
        return Redirect::route('users.index')->with('success', 'User created successfully: '.$user->name);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function showHistory(User $user)
    {
        // 1. Fetch the user's points history without pagination
        $pointHistory = $user->points() // Assuming User model has a points() relationship
            ->orderByDesc('created_at')
            ->get(); // ⬅️ Changed from paginate(15) to get()

        // 2. Render the dedicated PointHistory component
        return Inertia::render('users/point-history', [
            'targetUser' => $user->only(['id', 'name', 'total_points']),
            'pointHistory' => ['data' => $pointHistory], // This will now be a Collection, not a Paginator instance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user) // ⬅️ Using Route Model Binding
    {
        // We ensure the user object only contains the necessary, safe attributes
        // to send to the frontend.
        $userForForm = $user->only(['id', 'name', 'email']);
        // dd($userForForm);

        // Render the UserForm component, passing the user data
        return Inertia::render('users/edit', [
            // Assuming you have a separate Edit page that wraps the UserForm
            'user' => $userForForm,
            // If you have roles/permissions, you'd pass them here:
            // 'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user) // ⬅️ Use Route Model Binding
    {

        // 1. Validation
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            // 'email' must be unique EXCEPT for the current user's email
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            // Password is NOT required for update, but must be confirmed if provided
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ];

        $this->authorize('update', $user);

        $validated = $request->validate($rules);

        // 2. Update Basic Fields
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // 3. Handle Password Update (Conditional)
        if ($request->filled('password')) {
            // Only hash and update if a new password was provided
            $user->password = Hash::make($validated['password']);
        }

        // 4. Save Changes
        $user->save();

        // 5. Redirect
        // Redirect back to the user list with a success message
        return Redirect::route('users.index')->with('success', 'User updated successfully: '.$user->name);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) // ⬅️ Using Route Model Binding
    {
        // 1. (Recommended) Authorization Check
        // Ensure only authorized users (e.g., admins) can delete users.
        // Uncomment the line below if you have a policy defined (e.g., UserPolicy)
        // Gate::authorize('delete', $user);
        $this->authorize('delete', $user);
        // CRITICAL: Prevent admins from deleting their own account while logged in
        if (auth()->id() === $user->id) {
            return Redirect::back()->withErrors('You cannot delete your own account.');
        }

        // 2. Delete the User Record
        $user->delete();

        // 3. Redirect
        // Redirect back to the user index page with a success message
        return Redirect::route('users.index')->with('success', 'User '.$user->name.' has been successfully deleted.');
    }
}
