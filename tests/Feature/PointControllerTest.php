<?php

use App\Models\Point;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Fake admin XD
function superAdmin()
{
    $super_admin = env('SUPER_ADMIN', 'test@gmail.com');

    return User::factory()->create(attributes: ['email' => $super_admin]);
}

function user()
{
    return User::factory()->create();
}

// --------------------
// Index and filtering
// -------------------

// simple guard:
test('guest users are redirected from the points index page', function () {
    $this->get(route('points.index'))
        ->assertRedirect(route('login'));
});

test('an authorized user can view the points index page and see data', function () {
    // Arrange: Create Super Admin and some data
    $admin = superAdmin();
    $points = Point::factory(5)->create(); // Create 5 point records

    // Act: Access the route as the Super Admin
    $response = $this->actingAs($admin)
        ->get(route(name: 'points.index'));

    // Assert: Check the response and data structure
    $response->assertOk() // Assert HTTP 200
        ->assertInertia(fn ($page) => $page
            ->component('points/index') // Ensure the correct component is loaded
            // Check that the 'points' data paginator contains 5 items
            ->has('points.data', 5)
            // Check that the filters array is present and empty
            ->where('filters', [])
        );
});

test('points index correctly filters by action type and user name', function () {
    // Arrange: Setup data
    $admin = superAdmin();

    // 1. Target User: Name should match the search term "Adam"
    $targetUser = User::factory()->create(['name' => 'Award Smith']);

    // 2. Point that matches by action_type
    Point::factory()->create(['action_type' => 'Manual Award Bonus', 'user_id' => $admin->id]);

    // 3. Point that matches by user name (Target User)
    Point::factory()->create(['action_type' => 'System Log', 'user_id' => $targetUser->id]);

    // 4. Point that should NOT match
    Point::factory()->create(['action_type' => 'Auto Refund Debit', 'user_id' => $admin->id]);

    // Act: Search for the term "Award"
    $searchTerm = 'Award';
    $response = $this->actingAs($admin)
        ->get(route('points.index', ['search' => $searchTerm]));

    // Assert: Check the response and filtered data
    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('points/index')
            ->has('points.data', 2) // require two to be correct
            ->where('filters.search', $searchTerm)
        );
});

// -------------------
// Create
// -------------------

test('guest users are redirected from the creation page', function () {
    $this->get(route('points.create'))
        ->assertRedirect(route('login'));
});

test('loginned users can successfully store a new point record', function () {
    $admin = superAdmin();
    $targetUser = User::factory()->create(['total_points' => 100]);
    $initialPoints = $targetUser->total_points;
    $awardedPoints = 50;

    $pointData = [
        'user_id' => $targetUser->id,
        'points' => $awardedPoints,
        'action_type' => 'Test Award',
    ];

    $response = $this->actingAs($admin)
        ->post(route(name: 'points.store'), $pointData);

    // 1. Assert HTTP Response
    $response->assertSessionHas('success')
        ->assertRedirect(route(name: 'points.index'));

    // 2. Assert Database Creation
    $this->assertDatabaseHas('points', $pointData);
    $this->assertDatabaseCount('points', 1);

    // 3. Assert Database Update (User's total points)
    // Refresh the user model instance from the database
    $targetUser->refresh();
    $expectedTotal = $initialPoints + $awardedPoints;

    // Check if the total_points column was updated correctly
    expect($targetUser->total_points)->toBe($expectedTotal);
});

// -------------
// Update
// ---------------

test('users can update a point record and correctly adjust user totals', function () {
    $admin = superAdmin();
    $oldUser = User::factory()->create(['total_points' => 100]); // Starts with 100
    $newUser = User::factory()->create(['total_points' => 50]);  // Starts with 50

    // The initial point record to be updated
    $point = Point::factory()->create([
        'user_id' => $oldUser->id,
        'points' => 20, // Initial points
        'action_type' => 'Old Award',
    ]);
    $oldUser->increment('total_points', 20);

    // AFTER CREATION, the old user's total is 120 (100 + 20)
    $oldUser->refresh();
    expect($oldUser->total_points)->toBe(120);

    // --- Data for the UPDATE request ---
    $updateData = [
        'user_id' => $newUser->id, // Switch user to the new user
        'points' => 30,           // New points amount
        'action_type' => 'Revised Award',
    ];

    $response = $this->actingAs($admin)
        ->put(route('points.update', $point), $updateData);

    // 1. Assert Response and Redirect
    $response->assertSessionHas('success')
        ->assertRedirect(route('points.index'));

    // 2. Assert Point Record Update
    $this->assertDatabaseHas('points', array_merge(['id' => $point->id], $updateData));

    // 3. Assert User Total Points (The Transaction Logic)

    // Old User: Should be decremented by 20 (original amount)
    $oldUser->refresh();
    // Expected: 120 (initial total) - 20 (old points) = 100
    expect($oldUser->total_points)->toBe(100);

    // New User: Should be incremented by 30 (new amount)
    $newUser->refresh();
    // Expected: 50 (initial total) + 30 (new points) = 80
    expect($newUser->total_points)->toBe(80);
});

// -----------------------
// Delete
// -----------------------

test('users can delete a point record and correctly adjust user totals', function () {
    $admin = superAdmin();
    $newUser = User::factory()->create(['total_points' => 100]);

    // The initial point record to be updated
    $point = Point::factory()->create([
        'user_id' => $newUser->id,
        'points' => 20, // Initial points
        'action_type' => 'Old Award',
    ]);

    $newUser->increment('total_points', 20);

    // After creation, the user's total updates -> 100 to 120
    $newUser->refresh();
    expect($newUser->total_points)->toBe(120);

    $response = $this->actingAs($admin)->delete(route('points.destroy', $point));

    // Assert 1: HTTP Response and Redirect
    $response->assertSessionHas('success')
        ->assertRedirect(route('points.index'));

    // New news total 120 -> 100
    $newUser->refresh();
    expect(value: $newUser->total_points)->toBe(100);
});
