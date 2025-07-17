<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Invoice
 * 
 * @property int $id
 * @property string $invoice_number
 * @property string|null $file_path
 * @property int $order_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Order $order
 *
 * @package App\Models
 */
class Invoice extends Model
{
	use SoftDeletes;

	protected $casts = [
		'order_id' => 'int'
	];

	protected $guarded = [];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}
}
