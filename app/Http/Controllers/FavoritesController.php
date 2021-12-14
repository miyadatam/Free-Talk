<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

use App\Models\Post;

class FavoritesController extends Controller
{
  public function togglePostFavorite(Request $request, Post $post){
    $result = Auth::user()->favoritePosts()->toggle($post->id);
    return response()->json(['favorite_count' => $post->favorites->count(), 'is_favorite' => !empty($result['attached'])]);
    try{
    }catch(\Exception $e){
      return response()->json(['error' => true]);
    }
  }
}
