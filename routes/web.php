<?php

use App\Http\Controllers\PointController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);

    Route::resource('points', controller: PointController::class);

});

Route::get('error-page', function () {
    return Inertia::render('error-page');
})->name('error-page');

require __DIR__.'/settings.php';
