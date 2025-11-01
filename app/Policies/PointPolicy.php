<?php

namespace App\Policies;

use App\Models\Point;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PointPolicy
{
    public function update(User $user, Point $point): Response
    {
        // Simple ownership check: Does the authenticated user's ID match the point's user_id?

        return $user->id === 1
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }

    public function delete(User $user, Point $point): Response
    {
        // Checks the user's ID against 1
        return $user->id === 1
            ? Response::allow() // If true (ID is 1)
            : Response::deny('Please login as super admin!'); // If false (ID is not 1)
    }
}
