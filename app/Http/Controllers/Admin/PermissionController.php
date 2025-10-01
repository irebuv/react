<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::latest()->paginate(30);
        return Inertia::render("admin/permissions/permissions", [
            'permissions' => $permissions,
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
    public function store(PermissionRequest $request)
    {
        $permission = Permission::create([
            'name' => Str::slug($request->label),
            'label' => $request->label,
            'description' => $request->description,
            'module' => $request->module,
        ]);

        if ($permission) {
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully!');
        }
        return redirect()->back()->with('error', 'Unable to create permission');
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
    public function update(PermissionRequest $request, Permission $permission)
    {
        if ($permission) {
            $permission->name = Str::slug($request->label);
            $permission->label = $request->label;
            $permission->description = $request->description;
            $permission->module = $request->module;

            $permission->save();
            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully!');
        }

        return redirect()->back()->with('error', 'Unable to update permission');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        if ($permission) {
            $permission->delete();
            return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully!');
        }
        return redirect()->back()->with('error', 'Unable to delete permission');
    }
}
