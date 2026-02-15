<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])
            ->where('is_active', true);

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $categoryIds = [];
        $currentCategory = null;

        // Filter by Category (Recursive)
        if ($request->filled('category')) {
            $slugs = explode(',', $request->category);
             $categories = Category::whereIn('slug', $slugs)->get();
             
             if ($categories->isNotEmpty()) {
                $categoryIds = $categories->pluck('id')->toArray();
                
                // Add children and grandchildren recursively for filtering
                foreach ($categories as $cat) {
                    $childIds = $cat->children()->pluck('id')->toArray();
                    $categoryIds = array_merge($categoryIds, $childIds);
                    
                    foreach($cat->children as $child) {
                         $grandChildIds = $child->children()->pluck('id')->toArray();
                         $categoryIds = array_merge($categoryIds, $grandChildIds);
                    }
                }
                $query->whereIn('category_id', array_unique($categoryIds));
                
                if (count($slugs) === 1) {
                    $currentCategory = $categories->first();
                }
             }
        }

        // Filter by Brand
        if ($request->filled('brand')) {
            $brands = explode(',', $request->brand);
            $query->whereHas('brand', function ($q) use ($brands) {
                $q->whereIn('name', $brands);
            });
        }

        // Filter restricted
        if ($request->boolean('restricted')) {
            $query->where('is_restricted', true);
        }
        
        // Handle "Offers" page logic
        $onlyOffers = $request->routeIs('offers') || $request->boolean('onlyOffers');
        // if($onlyOffers) { ... }

        // Sorting
        $sort = $request->input('sort', 'popular');
        switch ($sort) {
            case 'newest':
                $query->latest();
                break;
            case 'price-asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('base_price', 'desc');
                break;
            default:
                $query->inRandomOrder();
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        // Optimized Tree for Sidebar
        // Recursive function to calculate total products
        $addTotals = function ($categories) use (&$addTotals) {
            foreach ($categories as $cat) {
                // If it has children, sum their totals (plus its own direct products)
                if ($cat->children && $cat->children->isNotEmpty()) {
                    $addTotals($cat->children);
                    // Eloquent collections Sum helper used recursively
                    $cat->total_products_count = $cat->products_count + $cat->children->sum('total_products_count');
                } else {
                    $cat->total_products_count = $cat->products_count;
                }
            }
        };

        // Optimized Tree for Sidebar with Recursive Counts
        $categoriesTree = Category::whereNull('parent_id')
            ->orderBy('name')
            ->with(['children' => function($q) {
                $q->orderBy('name');
                $q->withCount('products');
                $q->with(['children' => function($qq) {
                    $qq->orderBy('name');
                    $qq->withCount('products');
                }]);
            }])
            ->withCount('products')
            ->get();
            
        // Calculate totals recursively in memory
        $addTotals($categoriesTree);

        // Filter Brands: Only those with products and valid names
        $brands = Brand::withCount('products')
            ->having('products_count', '>', 0)
            ->whereNotIn('name', ['ATTRIBUTE', 'Marca', 'FIXED', 'nan', 'Genérico', 'No aplica'])
            ->orderBy('name')
            ->get();

        return Inertia::render('catalog/index', [
            'paginatedProducts' => $products,
            'categories' => $categoriesTree,
            'brands' => Brand::withCount('products')->get(),
            'filters' => $request->all(['search', 'category', 'brand', 'restricted', 'sort']),
            'currentCategory' => $currentCategory,
            'onlyOffers' => $onlyOffers
        ]);
    }

    public function category($slug)
    {
        request()->merge(['category' => $slug]);
        return $this->index(request());
    }
}
