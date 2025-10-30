<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Point>
 */
class PointFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id, 
            
            // Generate a random number of points
            'points' => $this->faker->numberBetween(1, 50), 
            
            // Generate a fake action type
            'action_type' => $this->faker->randomElement([
                'Login Streak', 'Post Created', 'Comment Liked', 
                'Profile Update', 'Daily Bonus', 'Quiz Complete'
            ]),
            
            // Ensure points have a creation timestamp
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
