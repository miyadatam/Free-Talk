<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use DB;

use App\Models\User;

class RegisterController extends Controller
{

  public function __construct(){
    $this->middleware('regenerate.token');
  }

  // 登録フォーム
  public function form(){
    return view('auth.register', ['this_year' => date('Y')]);
  }

  // 確認フォーム
  public function confrim(UserRequest $request){
    return view('auth.confirm', ['data' => $request->all()]);
  }

  // 登録処理
  public function register(Request $request){
    // 戻るボタンを押していた時
    if($request->has('back')){
      return redirect()->route('register.form')->withInput();
    }

    DB::beginTransaction();
    try{
      $data = $request->input();
      $password = $data['password'];
      $data['password'] = bcrypt('apple' . $password . 'apple');

      User::create($data);

      DB::commit();

      return redirect()->route('login.form')
      ->with('email', $data['email'])->with('password', $password)
      ->with('flash_message', '登録完了');

    }catch(\Excepton $e){

      DB::rollback();
      return back()->with('flash_message_error', '予期せぬエラーが発生しました');
    }
  }
}
