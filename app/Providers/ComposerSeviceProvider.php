<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\ViewComposers\FriendsComposer;
use App\Http\ViewComposers\FavoriteFriendsComposer;
use App\Http\ViewComposers\GroupsComposer;
use App\Http\ViewComposers\ThreadsComposer;
use View;

class ComposerSeviceProvider extends ServiceProvider
{
  /**
  * Register services.
  *
  * @return void
  */
  public function register()
  {

  }

  /**
  * Bootstrap services.
  *
  * @return void
  */
  public function boot()
  {
    View::composers([
      FriendsComposer::class => 'layouts.sub_contents',
      FavoriteFriendsComposer::class => 'layouts.sub_contents',
    ]);
  }
}
