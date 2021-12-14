<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\User;
use Faker\Generator as Faker;

$factory->define(User::class, function (Faker $faker) {
  $hiragana = ["ぁ","あ","ぃ","い","ぅ","う","ぇ","え","ぉ","お",
            "か","が","き","ぎ","く","ぐ","け","げ","こ","ご",
            "さ","ざ","し","じ","す","ず","せ","ぜ","そ","ぞ",
            "た","だ","ち","ぢ","っ","つ","づ","て","で","と","ど",
            "な","に","ぬ","ね","の","は","ば","ぱ",
            "ひ","び","ぴ","ふ","ぶ","ぷ","へ","べ","ぺ","ほ","ぼ","ぽ",
            "ま","み","む","め","も","ゃ","や","ゅ","ゆ","ょ","よ",
            "ら","り","る","れ","ろ","ゎ","わ","ゐ","ゑ","を","ん"];
  $hurigana = '';
  foreach(range(0, 6) as $num){
    $hurigana .= $hiragana[array_rand($hiragana, 1)];
  }
    return [
      'username' => $faker->name,
  		'username_kana' => $hurigana,
  		'email' => $faker->unique()->email,
  		'password' => $faker->password,
  		'bio' => $faker->realText(160, 2),
      'created_at' => now(),
      'updated_at' => now(),
    ];
});
