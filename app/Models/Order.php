<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['fio', 'phone_number', 'email', 'address', 'cost', 'comments'];

    //получаем все продукты данного заказа (массив)
    public function products(){
        return $this->belongsToMany(Product::class, ProductList::class);
    }
}
