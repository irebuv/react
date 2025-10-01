<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filter extends Model
{

    protected $table = 'filters';

    protected $fillable = ['title', 'filter_group_id'];
    public function animes()
    {
        return $this->belongsToMany(Product::class, 'filter_anime', 'filter_id', 'product_id');
    }
}
