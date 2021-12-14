<?php

namespace App\Http\ViewComposers;

use Illuminate\Contracts\View\View;
use Auth;

class FriendsComposer {

  public function compose(View $view){
    $view->with('friends', Auth::user()->friends);
  }
}
