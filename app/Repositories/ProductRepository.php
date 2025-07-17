<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function getAllWithFilters(array $filters = [])
    {
        $query = Product::query();

        if (!empty($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        if (!empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        return $query->paginate(20);
    }
}
