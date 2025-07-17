<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'material' => $this->material,
            'gender' => $this->gender,
            'shape' => $this->shape,
            'color' => $this->color,
            'unit_price' => $this->unit_price,
            'lot_price' => $this->lot_price,
            'stock_status' => $this->stock_status,
            'photos' => $this->photos,
            'description' => $this->description,
        ];
    }
}
