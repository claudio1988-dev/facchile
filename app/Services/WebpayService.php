<?php

namespace App\Services;

use Transbank\Webpay\WebpayPlus;
use Transbank\Webpay\WebpayPlus\Transaction;

class WebpayService
{
    public function __construct()
    {
        if (app()->environment('production')) {
            WebpayPlus::configureForProduction(
                config('services.transbank.webpay_plus_cc'),
                config('services.transbank.webpay_plus_api_key')
            );
        } else {
            WebpayPlus::configureForIntegration(
                WebpayPlus::DEFAULT_COMMERCE_CODE,
                WebpayPlus::DEFAULT_API_KEY
            );
        }
    }

    public function initTransaction($amount, $buyOrder, $sessionId, $returnUrl)
    {
        $transaction = new Transaction();
        $response = $transaction->create($buyOrder, $sessionId, $amount, $returnUrl);
        return [
            'url' => $response->getUrl(),
            'token' => $response->getToken(),
        ];
    }

    public function commitTransaction($token)
    {
        $transaction = new Transaction();
        return $transaction->commit($token);
    }
}
