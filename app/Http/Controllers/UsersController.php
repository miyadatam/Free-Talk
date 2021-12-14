<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;

use Auth;

use App\Models\User;

class UsersController extends Controller
{
  // ユーザー一覧
  public function index(Request $request){
    try{
      $search_username = $request->search ?? '';

      $random_users = User::randomUser('%' . $search_username . '%', 0);

      return view('users.index', compact('random_users', 'search_username'));

    }catch(\Exceotion $e){
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
  public function getUsers(Request $request){
    $search_username = $request->search ?? '';
    
    $exist_ids = json_decode($request->exist_ids, true);

    $random_users = User::randomUser('%' . $search_username . '%', $request->num, $exist_ids);

    return response()->json(compact('random_users'));
  }
  // ユーザー詳細
  public function show($user_id, $is_favorite = false){
    try{
      $user = $user_id ? User::findOrFail($user_id) : Auth::user();

      $posts = $is_favorite ? $user->favoritePosts : $user->posts;

      return view('users.show', compact('user', 'posts', 'is_favorite'));

    }catch(\Exceotion $e){
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
  // ユーザー編集
  public function edit(){
    $user = Auth::user();
    return view('users.edit', compact('user'));
  }
  // 更新処理
  public function update(UserRequest $request){
    try{
      $data = $request->input();
      if ($request->file('image')) {
        $data['image'] = $request->file('image')->store(Auth::id(), 'public');
      }

      if($request->has('password')){
        $data['password'] = bcrypt('apple' . $data['password'] . 'apple');
      }
      Auth::user()->fill($data)->save();

      return back()->with('flash_message', '更新完了しました');

    }catch(\Exceotion $e){
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
  // 削除処理
  // public function destroy(Request $request){
  //
  // }
}
