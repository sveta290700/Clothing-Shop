<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{

    public function addParsing($categories_parser){
        if (Category::all()->count() == 0)
        foreach ($categories_parser as $category_parser){
            $category = new Category();
            $category["name"] = $category_parser["text"];
            $category->save();
        }
        else{
            foreach(Category::all() as $category)
                $category->delete();
            foreach ($categories_parser as $category_parser){
                $category = new Category();
                $category["name"] = $category_parser["text"];
                $category->save();
            }
        }
    }

    public function index()
    {
        return CategoryResource::collection(Category::all());
    }
}
