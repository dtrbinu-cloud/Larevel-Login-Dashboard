<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\HTTP;

class SocialiteController extends Controller
{
    public function redirectToProvider($provider) {
        $redirectUrl = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
        return response()->json([
            'redirect_url' => $redirectUrl,
        ]);
    }

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = null;
            if ($provider === 'facebook') {
                $socialUser = Socialite::driver($provider)->fields(['name','email'])->stateless()->user();
            } else {
                $socialUser = Socialite::driver($provider)->stateless()->user();
            }

            $user = User::updateOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                    'provider_id' => $socialUser->getId(),
                    'provider_name' => $provider,
                    'password' => Hash::make(Str::random(24))
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            $frontendUrl = 'http://localhost:5173/auth/callback?token=' . $token;

            return redirect($frontendUrl);

        } catch (\Exception $e) {
            \Log::error('Socialite Callback Error for ' . $provider . ': ' . $e->getMessage());
            return redirect('http://localhost:5173?error=social_login_failed');
        }
    }
}