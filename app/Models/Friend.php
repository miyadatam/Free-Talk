<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friend extends Model
{

  protected $fillable = [
    'my_id',
    'your_id',
    'is_favorite',
    'favorite_at',
  ];
}
