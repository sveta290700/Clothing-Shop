<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $category = Category::find($this->category_id);
        $category = $category->name;
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'category_id' => $this->category_id,
            'category_name' => $category,
            'image' => $this->image,
            'vendor_code' => $this->vendor_code,
            'characteristics' => $this->characteristics,
            'created_at' => $this->created_at
        ];
    }
}
