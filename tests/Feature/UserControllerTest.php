<?php

// -------------------
// Index and filtering
// -------------------

// simple guard

use App\Models\User;

test('guest users are redirected from the users index page', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('an authorized user can view the users index page and see data', function () {
    $admin = superAdmin();
    $users = User::factory(5)->create();

    // Act: Access the route as the Super Admin
    $response = $this->actingAs($admin)
        ->get(route(name: 'users.index'));

    // Assert: Check the response and data structure
    $response->assertOk() // Assert HTTP 200
        ->assertInertia(fn ($page) => $page
            ->component('users/index') // Ensure the correct component is loaded
            // Check that the 'users' data paginator contains 5 items
            ->has('users.data', 6)
            // Check that the filters array is present and empty
            ->where('filters', [])
        );

});

test('users index correctly filters by email and user name', function () {
    $admin = superAdmin();

    // 1. User that matches by name
    User::factory()->create(['name' => 'Award', 'email' => 'z@gmail.com']);

    // 2. Not match
    User::factory()->create(['name' => 'Tester', 'email' => 'k@gmail.com']);

    // 3. User that matches by email
    User::factory()->create(['name' => 'Tester', 'email' => 'Award@gmail.com']);

    // Act: Search for the term "Award"
    $searchTerm = 'Award';
    $response = $this->actingAs($admin)->get(route('users.index', ['search' => $searchTerm]));

    // Assert: Check the response and filtered data
    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('users/index')
            ->has('users.data', 2) // require two to be correct
            ->where('filters.search', $searchTerm)
        );

});

// -----------------
// Create
// -----------------

test('guest users are redirected from the users create page', function () {
    $this->get(route('users.create'))->assertRedirect((route('login')));
});

test('regular users are forbidden from storing new user records', function () {
    // Arrange 1: Get an unauthorized user (assuming 'user()' helper returns a regular user)
    $unauthorizedUser = user();

    // Arrange 2: Prepare the data that would normally be submitted
    $userData = [
        'name' => 'Attempted User',
        'email' => 'unauthorized@example.com',
        'password' => 'secret_password',
        'password_confirmation' => 'secret_password',
        'total_points' => 0,
    ];

    // Act: Send a POST request without a route parameter
    $response = $this->actingAs($unauthorizedUser)
        ->post(route('users.store'), $userData);

    // Assert 1: Check Authorization
    $response->assertForbidden(); // Correctly asserts HTTP 403

    // Assert 2: Database Integrity Check (Crucial for destructive actions)
    // Ensure the forbidden attempt did not create the user record
    $this->assertDatabaseMissing('users', ['email' => 'unauthorized@example.com']);
});

// -------------------
// Update
// -------------------

test('regular users are forbitten from updating users', function () {
    $unauthorizedUser = user();
    $userData = [
        'name' => 'Attempted User',
        'email' => 'unauthorized@example.com',
        'password' => 'secret_password',
        'password_confirmation' => 'secret_password',
        'total_points' => 0,
    ];

    // Act: Send put request
    $response = $this->actingAs($unauthorizedUser)->put(route('users.update', $unauthorizedUser), $userData);

    // Assert 1 : Check Authorization
    $response->assertForbidden();
});

test('superadmin can successfully update a user record', function () {
    // Arrange 1: Setup authorized user (Super Admin)
    $super_admin = superAdmin();

    // Arrange 2: Create the user to be updated (initial state)
    // 🚨 FIX: ONLY include actual database columns here 🚨
    $userToUpdate = User::factory()->create([
        'name' => 'Initial Name',
        'email' => 'initial@example.com',
        'password' => 'initial_secret_hash',
    ]);

    // Define the data submitted in the PUT request (must satisfy validation)
    $updatedDataPayload = [
        'name' => 'Attempted User',
        'email' => 'updated.email@example.com',
        'password' => 'new_secret_password', // Include confirmation for validation
        'password_confirmation' => 'new_secret_password',

    ];

    // Act: Send put request
    $response = $this->actingAs($super_admin)
        ->put(route('users.update', $userToUpdate), $updatedDataPayload);

    // 1. Assert Response and Redirect
    $response->assertSessionHas('success')
        ->assertRedirect(route('users.index'));

    // 2. Assert Database Update (Remove validation-only fields)
    $dbCheckData = [
        'id' => $userToUpdate->id,
        'name' => 'Attempted User',
        'email' => 'updated.email@example.com',

    ];

    $this->assertDatabaseHas('users', $dbCheckData);
});

// -----------------------
// Delete
// -----------------------
test('regular users are forbitten from deleting users', function () {
    $unauthorizedUser = user();
    $newUser = User::factory()->create();

    // Act: Send put request
    $response = $this->actingAs($unauthorizedUser)->delete(route('users.destroy', $newUser));

    // Assert 1 : Check Authorization
    $response->assertForbidden();
});

test('super admin can delete users', function () {
    $superAdmin = superAdmin();
    $newUser = User::factory()->create();

    // Act: Send put request
    $response = $this->actingAs($superAdmin)->delete(route('users.destroy', $newUser));

    // Assert 1: HTTP Response and Redirect
    $response->assertSessionHas('success')
        ->assertRedirect(route('users.index'));

});

test('super admin cannot delete their own account', function () {
    // Arrange: Get the Super Admin
    $superAdmin = superAdmin();

    // Act: Send DELETE request attempting to delete the Super Admin's own account
    $response = $this->actingAs($superAdmin)
        ->delete(route('users.destroy', $superAdmin));

    // The super admin account should still exist.
    $this->assertDatabaseHas('users', ['id' => $superAdmin->id]);
});
