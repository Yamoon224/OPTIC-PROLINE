<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidPaymentMethod implements Rule
{
    protected $methods = ['card', 'mobile_money', 'bank_transfer'];

    public function passes($attribute, $value): bool
    {
        return in_array($value, $this->methods);
    }

    public function message(): string
    {
        return 'The selected payment method is invalid.';
    }
}
