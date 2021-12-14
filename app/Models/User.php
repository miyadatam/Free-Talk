<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use Auth;

// Model
use App\Models\Post;
use App\Models\Favorite;
use App\Models\Friend;

class User extends Authenticatable
{
	use SoftDeletes;

	protected $fillable = [
		'username',
		'username_kana',
		'email',
		'password',
		'image',
		'bio',
	];

	protected $hidden = [
		'password', 'remember_token',
	];

	public function image(){
		if($this->image){
			return 'storage/' . $this->image;
		}else{
			return 'image/person-black.svg';
		}
	}
	// ランダムに50人ユーザーを取得
	public static function randomUser($search_username, $num, $exists_usr_ids = []){
		$offset = $num * 10;
		$limit = $offset + 10;

		return self::whereNotIn('id', function($q){
			$q->from('friends')->select('your_id')->where('my_id', Auth::id());
		})
		->where('id', '<>', Auth::id())
		->where('username', 'like', $search_username)
		->whereNotIn('id', $exists_usr_ids)
		->inRandomOrder()
		->offset($offset)
		->limit($limit)
		->get();
	}

	// post関連
	public function posts(){
		return $this->hasMany(Post::class)->latest('created_at')
		->with('user')->withCount('favorites');
	}
	public function homePosts(){
		return $this->posts()->with('user')->withCount('favorites')
		->whereIn('user_id', function($q){
			$q->from('friends')->select('your_id')->where('my_id', Auth::id());
		})
		->orWhere('user_id', Auth::id());
	}
	public function favoritePosts(){
		return $this->belongsToMany(Post::class, 'favorites', 'user_id', 'post_id')
		->latest('created_at')
		->with('user')->withCount('favorites');
	}
	public function favoriteIds(){
		return $this->hasMany(Favorite::class)->pluck('post_id')->toArray();
	}

	// お友達関連
	public function friends(){
		return $this->belongsToMany(self::class, 'friends', 'my_id', 'your_id')->withPivot('is_favorite');
	}
	public function favoriteFriends(){
		return $this->friends()->where('is_favorite', true)->latest('favorite_at');
	}
	public function favoriteFriendIds(){
		return $this->friends()->where('is_favorite', true)->pluck('users.id')->toArray();
	}
	public function friendsUserIds(){
		return $this->friends()->pluck('users.id')->toArray();
	}
	public function isFriend($you_id){
		return $this->friends()->where('your_id', $you_id)->exists();
	}
	public function friendToggle($user_id){
		$this->friends()->toggle($user_id);
	}
}
