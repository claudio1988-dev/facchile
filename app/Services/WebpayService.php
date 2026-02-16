<?php

namespace App\Services;

use Transbank\Webpay\WebpayPlus;
use Transbank\Webpay\WebpayPlus\Transaction;

class WebpayService
{
    public function initTransaction($amount, $buyOrder, $sessionId, $returnUrl)
    {
        $transaction = $this->createTransactionInstance();
        $response = $transaction->create($buyOrder, $sessionId, $amount, $returnUrl);
        
        return [
            'url' => $response->getUrl(),
            'token' => $response->getToken(),
        ];
    }

    public function commitTransaction($token)
    {
        $transaction = $this->createTransactionInstance();
        return $transaction->commit($token);
    }

    private function createTransactionInstance(): Transaction
    {
        if (app()->environment('production')) {
            return Transaction::buildForProduction(
                config('services.transbank.webpay_plus_api_key'),
                config('services.transbank.webpay_plus_cc')
            );
        } else {
            return Transaction::buildForIntegration(
                WebpayPlus::INTEGRATION_API_KEY,
                WebpayPlus::INTEGRATION_COMMERCE_CODE
            );
        }
    }
}
