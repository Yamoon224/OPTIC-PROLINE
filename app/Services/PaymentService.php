<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function processPayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $payment = Payment::create([
                'order_id' => $data['order_id'],
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],
                'transaction_id' => $data['transaction_id'],
                'status' => 'completed',
            ]);

            $order = Order::find($data['order_id']);
            $order->update(['status' => 'paid']);

            return $payment;
        });
    }
}
