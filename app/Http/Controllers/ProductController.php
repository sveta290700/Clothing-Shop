<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        if ($request->has('category')){
            $products = Product::where('category_id', $request->category)->get();
        }
        else{
            $products = Product::all();
        }

        return ProductResource::collection($products);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return ProductResource
     */
    public function show($id)
    {
        return new ProductResource(Product::find($id));
    }

    public function addParsing($products_parser) {
        if (Product::all()->count() == 0)
            foreach ($products_parser as $product_parser) {
                $product = new Product();
                $product["name"] = $product_parser["name"];
                $product["description"] = $product_parser["description"];
                $product["price"] = $product_parser["price"];
                $product["image"] = $product_parser["image"];
                if (is_numeric($product_parser["vendor_code"]))
                {$product["vendor_code"] = $product_parser["vendor_code"];}
                else{ $product["vendor_code"] = rand(100000, 999999);}
                $product["characteristics"] = $product_parser["characteristics"];
                $category = Category::firstWhere('name', $product_parser["category"]);
                $product["category_id"] = $category->id;
                $product->save();
            }
        else {
            foreach(Product::all() as $product)
                $product->delete();
            foreach ($products_parser as $product_parser) {
                $product = new Product();
                $product["name"] = $product_parser["name"];
                $product["description"] = $product_parser["description"];
                $product["price"] = $product_parser["price"];
                $product["image"] = $product_parser["image"];
                if (is_numeric($product_parser["vendor_code"]))
                {$product["vendor_code"] = $product_parser["vendor_code"];}
                else{ $product["vendor_code"] = rand(100000, 999999);}
                $product["characteristics"] = $product_parser["characteristics"];
                $category = Category::firstWhere('name', $product_parser["category"]);
                $product["category_id"] = $category->id;
                $product->save();
            }
        }
    }
}
