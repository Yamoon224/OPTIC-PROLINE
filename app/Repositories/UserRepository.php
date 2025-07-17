<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function createB2BUser(array $data): User
    {
        return User::create([
            'company_name' => $data['company_name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone' => $data['phone'],
            'billing_address' => $data['billing_address'],
            'shipping_address' => $data['shipping_address'],
        ]);
    }
}
