<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function welcome() 
    {
        return view('welcome');
    }

    public function switchLocale($locale)
    {
        if (auth()->check()) {
            $connected = auth()->user();
            $connected->update(compact('locale'));
        }
        session(compact('locale'));
    
        app()->setLocale(session('locale'));
        return back()->with(['message'=>'']);
    }
}
