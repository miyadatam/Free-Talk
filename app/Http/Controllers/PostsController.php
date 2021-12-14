<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

use App\Models\Post;

class PostsController extends Controller
{
  public function store(Request $request){
    try{
      Post::create([
        'user_id' => Auth::id(),
        'post' => $request->post
      ]);

      return back();
    }catch(\Exception $e){
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
  public function destroy(Request $request, Post $post){
    try{
      if($post->user_id != Auth::id()){
        return response()->json(['error' => true]);
      }

      $post->delete();

    }catch(\Exception $e){
      return response()->json(['error' => true]);
    }
  }
}
