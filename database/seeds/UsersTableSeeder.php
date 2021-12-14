<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{

  public function run()
  {
    factory(User::class, 500)->create();
    User::create([
      'username' => '宮田大夢',
  		'username_kana' => 'みやだたむ',
  		'email' => 'a@a.a',
  		'password' => bcrypt('appleaaaaaaaaapple'),
    ]);
  }
}
