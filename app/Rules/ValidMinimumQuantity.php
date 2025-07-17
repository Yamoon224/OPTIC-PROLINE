<?php

namespace App\Rules;

use Illuminate\Validation\Rule;

class ValidMinimumQuantity implements Rule
{
    public function passes($attribute, $value): bool
    {
        return $value >= 5; // Minimum de 5 unités par produit
    }

    public function message(): string
    {
        return 'The quantity must be at least 5 units per product.';
    }
}
