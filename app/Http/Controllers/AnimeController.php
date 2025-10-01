<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->all();
        $filter = $request->input('filters', []);
        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'desc');

        $rows = DB::table('filters')
            ->join('filter_groups', 'filters.filter_group_id', '=', 'filter_groups.id')
            ->select(
                'filters.id as filter_id',
                'filters.title as filter_title',
                'filter_groups.title as group_title'
            )
            ->orderBy('filter_groups.title')
            ->orderBy('filters.title')
            ->get();

        $filters = $rows->groupBy('group_title')->map(function ($items) {
            return $items->map(fn ($row) => [
                'id' => $row->filter_id,
                'title' => $row->filter_title,
            ])->values();
        });

        $animeQuery = Product::query();
        if (!empty($filter)) {
            foreach ($filter as $filterId) {
                $animeQuery->whereHas('filters', fn($q) => $q->where('filters.id', $filterId));
            }
        }
        if ($request->sort === 'random') {
            $animeQuery->inRandomOrder();
        } else {
            $animeQuery->orderBy($sort, $direction);
        }
        $anime = $animeQuery->latest()->paginate(24)->withQueryString();
        $anime->getCollection()->transform(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'rating' => $product->rating,
            'files' => json_decode($product->files),
            'featured_image' => $product->featured_image,
            'featured_image_original_name' => $product->featured_image_original_name,
            'created_at' => $product->created_at->format('d M Y'),
        ]);

        $totalCount = $anime->count();
        $filteredCount = $anime->count();

        return Inertia::render('app/anime/categories', [
            'anime' => $anime,
            'sort' => $sort,
            'direction' => $direction,
            'totalCount' => $totalCount,
            'filteredCount' => $filteredCount,
            'filters' => $filters,
            'query' => $query,
        ]);
    }

    public function show(string $slug)
    {
        $anime = Product::where('slug', $slug)->firstOrFail();
        return Inertia::render('app/anime/anime-current', [
            'anime' => $anime,
        ]);
    }
}
