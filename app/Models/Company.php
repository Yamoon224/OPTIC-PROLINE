<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Company
 * 
 * @property int $id
 * @property string $name
 * @property string $manager_name
 * @property string $email
 * @property string|null $phone
 * @property string|null $billing_address
 * @property string|null $shipping_address
 * @property string|null $registration_number
 * @property int $is_verified
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|Order[] $orders
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Company extends Model
{
	use SoftDeletes;

	protected $casts = [
		'is_verified' => 'int'
	];

	protected $guarded = [];

	public function orders()
	{
		return $this->hasMany(Order::class);
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
