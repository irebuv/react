<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("admin/categories/index", [
            "categories" => Category::paginate(10)->withQueryString(),
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
    public function store(CategoryRequest $request)
    {
        try {
            $categoryImagePath = null;

            if ($request->hasFile("image")) {
                $categoryImagePath = $request->file("image")->store("categories", "public");
            }

            $category = Category::create([
                "name" => $request->name,
                "slug" => Str::slug($request->name),
                "description" => $request->description,
                "image" => $categoryImagePath,
            ]);

            if ($category) {
                return redirect()->route("categories.index")->with("success", "Category created successfully!");
            }
            return redirect()->back()->with("error", 'Filed to create category');
        } catch (\Exception $e) {
            return redirect()->back()->with("error", 'Filed to create category');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        if ($category) {
            if ($request->hasFile("image")) {
                $categoryImagePath = $request->file("image")->store("categories", "public");
                $category->image = $categoryImagePath;
            }

            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
            $category->description = $request->description;


            $category->save();

            return redirect()->route("categories.index")->with("success", "Category updated successfully!");
        } else {
            return redirect()->back()->with("error", 'Filed to update category1');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {

        if ($category) {
            $category->delete();
            return redirect()->back()->with('success', 'Category was deleted!');
        }
        return redirect()->back()->with('error', 'Unable to delete category!');
    }
}
