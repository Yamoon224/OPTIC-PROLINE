<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Payment
 * 
 * @property int $id
 * @property string $method
 * @property string $status
 * @property string $transaction_ref
 * @property float $amount
 * @property int $order_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Order $order
 *
 * @package App\Models
 */
class Payment extends Model
{
	use SoftDeletes;

	protected $casts = [
		'amount' => 'float',
		'order_id' => 'int'
	];

	protected $guarded = [];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}
}
