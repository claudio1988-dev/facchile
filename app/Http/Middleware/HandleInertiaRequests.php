<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'categories' => fn () => \App\Models\Category::whereNull('parent_id')
                ->with([
                    'children' => function($query) {
                        $query->with(['products', 'children']); // Eager load products and children for second level
                    }
                ]) 
                ->orderBy('name')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'image_url' => $category->image_url, 
                        'children' => $category->children->map(function ($child) {
                            // Logic to find an image if none exists
                            $fallbackImage = null;
                            if (!$child->image_url) {
                                // Try to get image from first product
                                $firstProduct = $child->products->first();
                                if ($firstProduct) {
                                    $fallbackImage = $firstProduct->main_image_url;
                                } else {
                                    // Try to get image from first grandchild
                                    $firstGrandChild = $child->children->first();
                                    // Assuming grandchild might have image or product... complexity grows.
                                    // For now, let's stick to direct products or grandchild products if eager loaded deep enough.
                                    // Given current eager load, only direct products of child are loaded.
                                }
                            }

                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'slug' => $child->slug,
                                'image_url' => $child->image_url ?: $fallbackImage,
                                'children' => $child->children->map(function ($grandChild) {
                                    return [
                                        'id' => $grandChild->id,
                                        'name' => $grandChild->name,
                                        'slug' => $grandChild->slug,
                                        'href' => "/catalogo?category={$grandChild->slug}",
                                    ];
                                }),
                                'products' => $child->products->take(4)->map(function ($product) {
                                    return [
                                        'name' => $product->name,
                                        'href' => "/producto/{$product->slug}",
                                        'image' => $product->main_image_url, 
                                    ];
                                }),
                            ];
                        }),
                    ];
                }),
        ];
    }
}
