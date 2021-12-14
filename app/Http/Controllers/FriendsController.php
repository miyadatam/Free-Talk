<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Auth;

use App\Models\User;

class FriendsController extends Controller
{
  // 友達一覧
  public function index(User $user){
    return view('users.friend', compact('user'));
  }
  // お友達登録・解除
  public function toggleFriend(Request $request, User $you){
    DB::beginTransaction();
    try{
      Auth::user()->friendToggle($you->id);
      $you->friendToggle(Auth::id());

      DB::commit();
      return back();
    }catch(\Exception $e){

      DB::rollback();
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
  // お気に入り登録・解除
  public function toggleFriendFavorite(User $friend){
    try{
      $is_favorite = Auth::user()->friends()->where('your_id', $friend->id)->firstOrFail()->pivot->is_favorite;

      Auth::user()->friends()->updateExistingPivot($friend->id, ['is_favorite' => !$is_favorite, 'favorite_at' => now()]);

      return back();
    }catch(\Excepton $e){
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
}
