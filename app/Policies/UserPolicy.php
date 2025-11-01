<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function create(User $user): Response
    {
        $super_admin = env('SUPER_ADMIN', 'test@gmail.com');

        return $user->email === $super_admin
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }

    public function update(User $user, $model): Response
    {
        $super_admin = env('SUPER_ADMIN', 'test@gmail.com');

        return $user->email === $super_admin
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }

    public function delete(User $user, $model): Response
    {
        $super_admin = env('SUPER_ADMIN', 'test@gmail.com');

        return $user->email === $super_admin
            ? Response::allow()
            : Response::deny('Please login as super admin !');
    }
}
