<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class ErrorsController extends Controller
{
  public function __invoke(){
    return redirect()->route('user.show', Auth::id())
    ->with('flash_message_error', '予期せぬエラーが発生しました');
  }
}
