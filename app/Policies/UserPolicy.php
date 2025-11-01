<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function create(User $user): Response
    {
        return $user->id === 1
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }

    public function update(User $user, $model): Response
    {
        return $user->id === 1
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }

    public function delete(User $user, $model): Response
    {
        return $user->id === 1
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }
}
