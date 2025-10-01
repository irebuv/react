<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use Sluggable;
    protected $fillable = [
        'name',
        'description',
        'rating',
        'featured_image',
        'featured_image_original_name',
        'files',
    ];

    public function filters()
    {
        return $this->belongsToMany(Filter::class, 'filter_anime', 'product_id', 'filter_id');
    }

    public function sluggable(): array {
        return [
            'slug' => [
                'source' => 'name',
                'maxLength' => '20',
            ]
        ];
    }
}
