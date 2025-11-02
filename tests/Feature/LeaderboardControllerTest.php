<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

// Use trait for clean database slate for each test run
uses(RefreshDatabase::class);

// --- Helper function to bypass Laravel's automatic timestamp updates for precise boundary testing ---
// This is essential for accurately testing 00:00:00 and 23:59:59 boundaries on 'updated_at'.
$setUpdatedAt = function (User $user, Carbon $timestamp) {
    // Temporarily disable auto-timestamps
    $user->timestamps = false;
    $user->updated_at = $timestamp;
    $user->save();
    // Re-enable for the next time the object might be used
    $user->timestamps = true;
};

// ----------------------------------------------------------------------
// TEST 1: No Filters (All-time Leaderboard)
// ----------------------------------------------------------------------

test('leaderboard returns all users when no date range is provided', function () {
    // Arrange: Create 3 standard users
    User::factory(3)->create();
    $loggedInUser = User::factory()->create();

    // Act: Access without filters
    $response = $this->actingAs($loggedInUser)
        ->get(route('leaderboard.index'));

    // Assert: Total users should be 4 (3 created + 1 logged in)
    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('rankedUsers.data', 4)
            ->where('filters.from', null)
            ->where('filters.to', null)
        );
});

// ----------------------------------------------------------------------
// TEST 2: Correct Boundary Filtering (Verification of UTC-safe updated_at logic)
// ----------------------------------------------------------------------
test('leaderboard correctly filters users within the explicit date range (UTC-safe) using updated_at', function () {

    // 1. frontend filters
    $from = '2025-11-01T00:00:00.000Z';
    $to = '2025-11-03T23:59:59.000Z';
    $userUpdatedAt = Carbon::parse('2025-11-02T00:00:49.000000Z')->toDateTimeString('microsecond');
    $userNotUpdatedAt = Carbon::parse('2025-11-04T00:00:49.000000Z')->toDateTimeString('microsecond');

    $userA = User::factory()->create(['updated_at' => $userUpdatedAt]);
    $userB = User::factory()->create(['updated_at' => $userUpdatedAt]);
    $userC = User::factory()->create(['updated_at' => $userNotUpdatedAt]);

    $response = $this->actingAs($userA)->get(route('leaderboard.index', ['from' => $from, 'to' => $to]));

    // Assert
    $response->assertOk();
    $page = $response->original->getData()['page'];
    $data = $page['props']['rankedUsers']['data'];
    $dataIds = collect($data)->pluck('id')->all();

    // Expected 3: User A, User B, and LoggedInUser
    $this->assertCount(2, $data, 'Expected 3 users (A, B, C) within the precise boundary range.');

    $this->assertContains($userA->id, $dataIds, 'User A (start boundary) was excluded.');
    $this->assertContains($userB->id, $dataIds, 'User B (end boundary) was excluded.');
    $this->assertNotContains($userC->id, $dataIds, 'User C (one microsecond after) was incorrectly included.');

});
// ----------------------------------------------------------------------
// TEST 3: Tie Breaking
// ----------------------------------------------------------------------

test('leaderboard correctly handles tie-breaking by user id', function () {
    // Arrange: (User creation remains the same)
    $tieScore = 500;
    $activeTime = Carbon::now()->setTimezone('UTC');

    // Lower ID, should rank higher in a tie
    $userLowestId = User::factory()->create(['id' => 10, 'total_points' => $tieScore, 'updated_at' => $activeTime]);

    // Higher ID, should rank lower in a tie
    $userHighestId = User::factory()->create(['id' => 20, 'total_points' => $tieScore, 'updated_at' => $activeTime]);

    // Top score to establish the starting rank
    $userTop = User::factory()->create(['total_points' => 600, 'updated_at' => $activeTime->subSecond()]);

    $loggedInUser = User::factory()->create(['total_points' => 0]);

    // Act: Access without filters
    $response = $this->actingAs($loggedInUser)
        ->get(route('leaderboard.index'));

    // --- FIX: Extract data correctly from Inertia response ---
    $response->assertOk();
    $page = $response->original->getData()['page'];

    // Data is located within the 'data' key of the 'rankedUsers' paginator prop
    $dataIds = collect($page['props']['rankedUsers']['data'])->pluck('id')->all();

    $expectedOrder = [
        $userTop->id,
        $userLowestId->id,  // ID 10 ranks higher than ID 20 due to 'id', 'asc'
        $userHighestId->id,
        $loggedInUser->id,
    ];

    $this->assertEquals($expectedOrder, $dataIds, 'Tie-breaking was not resolved correctly by user ID.');
});
