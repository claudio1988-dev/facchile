<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = [
        'code',
        'name',
        'is_extreme_zone',
    ];

    protected $casts = [
        'is_extreme_zone' => 'boolean',
    ];

    public function communes()
    {
        return $this->hasMany(Commune::class);
    }
}
