<?php

namespace Database\Seeders;

use App\Models\Point;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Ensure at least 10 users exist for realistic point distribution
        User::factory(10)->create(); 

        // 2. Seed 100 Point records
        Point::factory(100)->create(); // <-- Creates 100 point entries
        
        // 3. Update all users' total_points columns
        $this->updateUserTotalPoints();
    }

    /**
     * Recalculates and updates the total_points for all users.
     */
    protected function updateUserTotalPoints(): void
    {
        // Iterate through all users
        User::all()->each(function (User $user) {
            // Sum all the points associated with this user
            $totalPoints = $user->points()->sum('points');
            
            // Update the user's total_points column
            $user->update(['total_points' => $totalPoints]);
        });
    }
}
