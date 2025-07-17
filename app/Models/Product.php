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
 * Class Product
 * 
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $brand
 * @property string|null $material
 * @property string|null $gender
 * @property string|null $shape
 * @property string|null $color
 * @property float $unit_price
 * @property float|null $bulk_price
 * @property int|null $stock
 * @property int $is_custom
 * @property int $is_active
 * @property int $category_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property string|null $deleted_at
 * 
 * @property Category $category
 * @property Collection|OrderItem[] $order_items
 *
 * @package App\Models
 */
class Product extends Model
{
	use SoftDeletes;

	protected $casts = [
		'unit_price' => 'float',
		'bulk_price' => 'float',
		'stock' => 'int',
		'is_custom' => 'int',
		'is_active' => 'int',
		'category_id' => 'int'
	];

	protected $guarded = [];

	public function category()
	{
		return $this->belongsTo(Category::class);
	}

	public function order_items()
	{
		return $this->hasMany(OrderItem::class);
	}
}
