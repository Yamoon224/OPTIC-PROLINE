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
 * Class Order
 * 
 * @property int $id
 * @property string $status
 * @property float $total
 * @property float|null $discount
 * @property int $user_id
 * @property int $company_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Company $company
 * @property User $user
 * @property Collection|Delivery[] $deliveries
 * @property Collection|Invoice[] $invoices
 * @property Collection|OrderItem[] $order_items
 * @property Collection|Payment[] $payments
 *
 * @package App\Models
 */
class Order extends Model
{
	use SoftDeletes;

	protected $casts = [
		'total' => 'float',
		'discount' => 'float',
		'user_id' => 'int',
		'company_id' => 'int'
	];

	protected $guarded = [];

	public function company()
	{
		return $this->belongsTo(Company::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function deliveries()
	{
		return $this->hasMany(Delivery::class);
	}

	public function invoices()
	{
		return $this->hasMany(Invoice::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}

	public function payments()
	{
		return $this->hasMany(Payment::class);
	}
}
