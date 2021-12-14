<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Auth;

class UserRequest extends FormRequest
{

  protected function prepareForValidation(){
    // スペース削除処理
    $this->merge(['username' => preg_replace("/( |　)/", "", $this->username)]);
    $this->merge(['username_kana' => preg_replace("/( |　)/", "", $this->username_kana)]);
  }
  /**
  * Determine if the user is authorized to make this request.
  *
  * @return bool
  */
  public function authorize()
  {
    return true;
  }

  /**
  * Get the validation rules that apply to the request.
  *
  * @return array
  */
  public function rules()
  {
    $email_rule = $this->path() == 'user/update' ? 'unique:users,email,' . Auth::id() . ',id' : 'unique:users';
    $password_rule = $this->path() == 'user/update' ? 'nullable' : 'required';
    
    return [
      'username' => 'required|max:60',
      'username_kana' => 'required|regex:/^[ぁ-ゞ]+$/u|max:30',
      'email' => 'required|email|max:100|' . $email_rule,
      'password' => $password_rule . '|min:8|max:30|confirmed',
      'bio' => 'nullable|max:160'
    ];
  }

  public function messages()
  {
    return [
      'required' => '入力必須',
      'regex' => 'ひらがなのみ',
      'email' => 'メールアドレスの形式で入力',
      'unique' => '既に登録されたメールアドレスです',
      'min' => ':min文字以上で入力',
      'max' => ':max文字以下で入力',
      'confirmed' => 'パスワードが一致しません',
    ];
  }
}
