<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function submit(OrderStoreRequest $request)
    {
        if(!isset($_COOKIE['cart_id'])) setcookie('cart_id', uniqid());
        $cart_id = $_COOKIE['cart_id'];
        $cart = \Cart::session($cart_id);
        $data = $cart->getContent();
        if($cart->getTotal() !=0) {
            $validated = $request->validated();
            $id_orders = DB::table('orders')->insertGetId($validated);

            foreach ($data as $item) {
                DB::table('product_lists')->insert([
                    'order_id' => $id_orders,
                    'product_id' => $item->id,
                ]);
            }
            $cart->clear();
            return json_encode(Order::find($id_orders));
        }
        return false;
    }
}
