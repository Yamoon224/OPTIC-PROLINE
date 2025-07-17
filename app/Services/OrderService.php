<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'user_id' => $data['user_id'],
                'status' => 'pending',
                'delivery_address_id' => $data['delivery_address_id'],
                'total_amount' => 0,
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $quantity = $item['quantity'];
                $lineTotal = $product->unit_price * $quantity;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->unit_price,
                ]);

                $total += $lineTotal;
            }

            $order->update(['total_amount' => $total]);

            return $order;
        });
    }
}
