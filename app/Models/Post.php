<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Favorite;

class Post extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'user_id',
    'post',
  ];

  protected $dates = ['created_at'];

  public function user(){
    return $this->belongsTo(User::class);
  }

  public function favorites(){
    return $this->hasMany(Favorite::class);
  }

  public function createdAt(){
    $now = Carbon::now();
    $created_at = new Carbon($this->created_at);

    // 1分未満
    if($now->copy()->diffInMinutes($created_at) < 1){
      return $now->copy()->diffInSeconds($created_at) . '秒前';
    // 1時間未満
    }elseif($now->copy()->diffInHours($created_at) < 1){
      return $now->copy()->diffInMinutes($created_at) . '分';
    // 1日未満
    }elseif($now->copy()->diffInDays($created_at) < 1){
      return $now->copy()->diffInHours($created_at) . '時間';
    // 1週間未満
    }elseif($now->copy()->diffInDays($created_at) < 7){
      return $now->copy()->diffInDays($created_at) . '日';
    // 1年未満
    }elseif($now->copy()->diffInYears($created_at) < 1){
      return $created_at->format('n月j日');
    // 1年以上
    }else{
      return $created_at->format('Y年n月j日');
    }
  }
}
