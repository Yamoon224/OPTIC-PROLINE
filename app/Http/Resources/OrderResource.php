<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'items' => $this->items,
            'delivery_address' => $this->deliveryAddress,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
