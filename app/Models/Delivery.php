<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Delivery
 * 
 * @property int $id
 * @property string $address
 * @property string $status
 * @property Carbon|null $delivery_date
 * @property int $order_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Order $order
 *
 * @package App\Models
 */
class Delivery extends Model
{
	use SoftDeletes;

	protected $casts = [
		'delivery_date' => 'datetime',
		'order_id' => 'int'
	];

	protected $guarded = [];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}
}
