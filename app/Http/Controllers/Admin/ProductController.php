<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductFormRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $products = Product::latest()->paginate(1)->map(fn($product) => [
        //     'id' => $product->id,
        //     'name' => $product->name,
        //     'description' => $product->description,
        //     'price' => $product->price,
        //     'featured_image' => $product->featured_image,
        //     'featured_image_original_name' => $product->featured_image_original_name,
        //     'created_at' => $product->created_at->format('d M Y'),
        // ]);

        $productsQuery = Product::query();

        $totalCount = $productsQuery->count();

        if ($request->filled("search")) {
            $search = $request->search;

            $productsQuery->where(
                fn($query) => $query->where('name', 'like', "%{$search}%")
                    ->orWhere("description", "like", "%{$search}%")
                    ->orWhere("price", "like", "%{$search}%")
            );
        }

        $filteredCount = $productsQuery->count();

        $perPage = (int)($request->perPage ?? 10);

        if ($perPage === -1) {
            $allProducts = $productsQuery->latest()->get()->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'featured_image' => $product->featured_image,
                'files' => $product->files,
                'featured_image_original_name' => $product->featured_image_original_name,
                'created_at' => $product->created_at->format('d M Y'),
            ]);

            $products = [
                'data' => $allProducts,
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $products = $productsQuery->latest()->paginate($perPage)->withQueryString();
            $products->getCollection()->transform(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'files' => json_decode($product->files),
                'featured_image' => $product->featured_image,
                'featured_image_original_name' => $product->featured_image_original_name,
                'created_at' => $product->created_at->format('d M Y'),
            ]);
        }


        return Inertia::render('admin/products/products', [
            'products' => $products,
            'filters' => $request->only(['search', 'perPage']),
            'totalCount' => $totalCount,
            'filteredCount' => $filteredCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/products/product-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductFormRequest $request)
    {
        try {
            $featuredImage = null;
            $featuredImageOriginalName = null;
            $gallery = null;
            $galleryFiles = null;

            $folders = date('Y') . '/' . date('m') . '/' . date('d');
            if ($request->file('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store("images/{$folders}", 'public');
            }

            if ($files = $request->file('files')) {
                foreach ($files as $file) {
                    $gallery[] = $file->store("images/{$folders}", 'public');
                }
                $galleryFiles = json_encode($gallery);
            }

            $product = Product::create([
                'name' => $request->name,
                //'slug' => Str::slug($request->name),
                'description' => $request->description,
                'price' => $request->price,
                'featured_image' => $featuredImage,
                'featured_image_original_name' => $featuredImageOriginalName,
                'files' => $galleryFiles,
            ]);

            if ($product) {
                return redirect()->route('products.index')->with('success', 'Product created successfully');
            }
            return redirect()->back()->with('error', 'Unable to create product');
        } catch (\Exception $e) {
            Log::error('Product creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to create product');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('admin/products/product-form', [
            'product' => $product,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {

        return Inertia::render('admin/products/product-form', [
            'product' => $product,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            //'rating' => 'required|numeric|min:0',
            //'featured_image' => 'nullable|mimes:png,jpg,gif,jpeg,JPEG,PNG,JPG,webp',
            //'files' => 'nullable|array',
            //'files.*' => 'nullable|mimes:png,jpg,gif,jpeg,JPEG,PNG,JPG',
        ]);
        if ($product) {
            try {
                $product->name = $request->name;
                $product->description = $request->description;
                $product->rating = $request->rating;
                //$slug = Str::slug($request->name);
                //$slug = Str::limit($slug, 20, '');
                //$product->slug = $slug;

                $folders = date('Y') . '/' . date('m') . '/' . date('d');

                if ($request->file('featured_image')) {
                    if ($product->featured_image) {
                        Storage::disk('public')->delete($product->featured_image);
                    }
                    $featuredImage = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $featuredImage = $featuredImage->store("images/{$folders}", 'public');

                    $product->featured_image = $featuredImage;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }

                if ($files = $request->file('files')) {
                    if ($product->files) {
                        $oldFiles = json_decode($product->files);
                        Storage::disk('public')->delete($oldFiles);
                    }
                    foreach ($files as $file) {
                        $gallery[] = $file->store("images/{$folders}", 'public');
                    }
                    $product->files = json_encode($gallery);
                }

                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully!');
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
        return redirect()->back()->with('error', 'Unable to update product!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product) {
            $product->delete();
            return redirect()->back()->with('success', 'Product was deleted!');
        }
        return redirect()->back()->with('error', 'Unable to delete product!');
    }
}
