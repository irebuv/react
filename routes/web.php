<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AnimeController;
use App\Http\Controllers\BusinessController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/anime', [AnimeController::class, 'index'])->name('anime');
Route::get('/anime/{slug}', [AnimeController::class, 'show'])->name('show.anime');

Route::resource('/business', BusinessController::class);
Route::post('business/request', [BusinessController::class, 'request'])->name('business.request');
Route::post('/requests/mark-as-read', [BusinessController::class, 'markAsRead'])->name('business.markAsRead');

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('', function () {
        return Inertia::render('dashboard');
    })->name('admin')->middleware('permission:access-admin-module');

    Route::resource('products', ProductController::class)->middleware('permission:access-products-module');
    Route::resource('anime-handles', \App\Http\Controllers\Admin\AnimeController::class)->middleware('permission:access-products-module');
    Route::resource('categories', CategoryController::class)->middleware('permission:access-categories-module');
    Route::resource('permissions', PermissionController::class)->middleware('permission:access-permissions-module');
    Route::resource('roles', RoleController::class)->middleware(['permission:access-roles-module', 'role:admin|super-admin|moderator']);
    Route::resource('users', UserController::class)->middleware('permission:access-users-module');
});Route::get('/test-log', function () {
    \Illuminate\Support\Facades\Log::info('Тестовое сообщение из логов!');
    return 'Лог записан';
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

