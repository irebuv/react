<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authUser = Auth::user();
        $authUserRole = $authUser->roles?->first()?->name;
        $rolesQuery = Role::with('permissions');

        if ($authUserRole === 'super-admin') {
            $rolesQuery->whereIn('name',['super-admin','admin','moderator']);
        } else if ($authUserRole === 'admin') {
            $rolesQuery->whereIn('name',['admin','moderator']);
        }else if ($authUserRole === 'moderator') {
            $rolesQuery->whereIn('name',['moderator']);
        }

        $roles = $rolesQuery->paginate();

        $permissions = Permission::get()->groupBy("module");

        return Inertia::render("admin/roles/roles", [
            "roles"=> $roles,
            "permissions"=> $permissions,
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
    public function store(RoleRequest $request)
    {
        $role = Role::create([
            'label' => $request->label,
            'name' => Str::slug($request->label),
            'description' => $request->description,
        ]);

        if ($role) {
            $role->syncPermissions($request->permissions);

            return redirect()->route('roles.index')->with('success','Role created successfully!');
        }
        return redirect()->back()->with('error','Unable to create Role!');
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
    public function update(RoleRequest $request, Role $role)
    {
        if ($role){
            $role->label = $request->label;
            $role->name = Str::slug($request->label);
            $role->description = $request->description;

            $role->save();

            $role->syncPermissions($request->permissions);

            return redirect()->route('roles.index')->with('success','Role updated successfully!');
        }
        return redirect()->back()->with('error','Unable to updated Role!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role){
            $role->delete();

            return redirect()->route('roles.index')->with('success','Role deleted successfully!');
        }
        return redirect()->back()->with('error','Unable to delete Role!');
    }
}
