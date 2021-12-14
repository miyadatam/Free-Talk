<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;
use Auth;

class FavoriteFriendsComposer {

  public function compose(View $view){
    $view->with('favorite_friends', Auth::user()->favoriteFriends);
  }
}
