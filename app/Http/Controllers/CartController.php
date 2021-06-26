<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{


    public function index()
    {
        if(!isset($_COOKIE["cart_id"])) setcookie("cart_id", uniqid());
        $cart_id = $_COOKIE["cart_id"];
        $cart = \Cart::session($cart_id);

        $all = $cart->getContent()->toArray();

        $all['total_quantity'] = $cart->getTotalQuantity();
        $all['total_amount'] = $cart->getTotal();
        return json_encode($all);
    }


    public function add(Request $request)
    {
        $product = Product::where('id', $request->id)->first();

        if(!isset($_COOKIE['cart_id'])) setcookie('cart_id', uniqid());
        $cart_id = $_COOKIE['cart_id'];
        $cart = \Cart::session($cart_id);

        $cart->add([
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'quantity' =>  $request->qty,
            'attributes' => [
                'category_id' => $product->category_id,
                'vendor_code' => $product->vendor_code,
                'image' => $product->image
            ]
        ]);

        return $cart->getContent()->toJson();
    }

    public function update(Request $request){

        if(!isset($_COOKIE['cart_id'])) setcookie('cart_id', uniqid());
        $cart_id = $_COOKIE['cart_id'];
        $cart = \Cart::session($cart_id);

        if($cart->get($request->id)) {
            //на какое количество изменить
            $cart->update($request->id, ['quantity' => $request->qty]);
        }

        return $cart->getContent()->toJson();
    }

    public function delete(Request $request){

        if(!isset($_COOKIE['cart_id'])) setcookie('cart_id', uniqid());
        $cart_id = $_COOKIE['cart_id'];
        $cart = \Cart::session($cart_id);

        if($cart->get($request->id)){
            $cart->remove($request->id);
        }
        return $cart->getContent()->toJson();
    }
}
