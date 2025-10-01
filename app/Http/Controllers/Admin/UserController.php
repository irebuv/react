<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authUser = Auth::user();
        $authUserRole = $authUser->roles?->first()?->name;
        $userQuery = User::with('roles')->latest();

        if (!in_array($authUserRole, ['super-admin','admin', 'moderator'])) {
            abort(403, 'Unauthorized Access Prevent');
        }


        if ($authUserRole === 'admin'){
            $userQuery->whereDoesntHave('roles', function($q){
                $q->where('name','super-admin');
            });
        } else if ($authUserRole === 'moderator') {
             $userQuery->whereHas('roles', function($q){
                $q->whereIn('name',['moderator', 'user']);
            });
        }

       $users = $userQuery->paginate(10);

        $rolesQuery = Role::query();
        if ($authUserRole === 'super-admin') {
            $rolesQuery->whereIn('name',['super-admin','admin','moderator']);
        } else if ($authUserRole === 'admin') {
            $rolesQuery->whereIn('name',['admin','moderator']);
        }else if ($authUserRole === 'moderator') {
            $rolesQuery->whereIn('name',['moderator']);
        }

        $roles = $rolesQuery->get();

        return Inertia::render("admin/users/users", [
            "users"=> $users,
            "roles"=> $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = User::create([
            "name"=> $request->name,
            "email"=> $request->email,
            'password'=> Hash::make($request->password),
        ]);

        if ($user) {
            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success','User was created successfully!');
        }
        return redirect()->back()->with('error','Something went wrong!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        if ($user){
            $user->name = $request->name;
            $user->email = $request->email;

            $user->save();
            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success','User was updated successfully!');
        }
        return redirect()->back()->with('error','Something went wrong!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user){
            $user->delete();

            return redirect()->route('users.index')->with('success','User was deleted successfully!');
        }
        return redirect()->back()->with('error','Something went wrong!');
    }
}
